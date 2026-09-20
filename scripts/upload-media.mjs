/**
 * Upload the gallery to Supabase and list it on the site, in one pass.
 *
 *   npm run upload-media -- --dry-run     see what would happen, change nothing
 *   npm run upload-media                  do it
 *
 * Drop files into media-upload/<category>/ and run it. Every file is uploaded
 * to the wedding-media bucket under the same path, and a matching row is
 * written to the `media` table — uploading alone shows nothing on the site.
 *
 * Safe to re-run. Files are replaced rather than duplicated, and a row whose
 * `url` already exists is updated instead of added again, so you can fix a
 * caption and run it a second time.
 *
 * This needs the SERVICE ROLE key, not the anon key: the anon key is
 * deliberately unable to write to `media` (see supabase/schema.sql), which is
 * what stops a guest editing your gallery.
 */

import { readFileSync, readdirSync, statSync, existsSync, mkdirSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SOURCE_DIR = join(ROOT, "media-upload");
const BUCKET = "wedding-media";

// Must match the CHECK constraint on public.media.category.
const CATEGORIES = ["highlight", "venue", "dress_code"];

// Extension -> [media_type, content type]. Anything not listed is skipped:
// the browser plays these directly from a <video src> or <img src>, so an
// unrecognised container would upload fine and then silently fail to render.
const TYPES = {
  ".jpg": ["image", "image/jpeg"],
  ".jpeg": ["image", "image/jpeg"],
  ".png": ["image", "image/png"],
  ".webp": ["image", "image/webp"],
  ".gif": ["image", "image/gif"],
  ".avif": ["image", "image/avif"],
  ".mp4": ["video", "video/mp4"],
  ".m4v": ["video", "video/x-m4v"],
  ".webm": ["video", "video/webm"],
  ".mov": ["video", "video/quicktime"],
};

const WARN_IMAGE_BYTES = 2_000_000;
const WARN_VIDEO_BYTES = 25_000_000;

const dryRun = process.argv.includes("--dry-run");

/* ---------------- credentials ---------------- */

function readEnvFile() {
  const path = join(ROOT, ".env");
  // A missing .env is not fatal here. This runs before the dry-run check,
  // and a dry run never reaches Supabase — failing now would deny you the
  // filename preview precisely when you have not set up keys yet. A real
  // run still stops, with a better message, in connect().
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return out;
}

function jwtRole(key) {
  try {
    const payload = key.split(".")[1];
    return JSON.parse(Buffer.from(payload, "base64").toString()).role ?? null;
  } catch {
    return null;
  }
}

function fail(message) {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

const env = readEnvFile();

// Vite exposes every VITE_-prefixed variable to the browser. A service role
// key under that prefix would be baked into the public bundle and hand any
// visitor full read/write on the database, RLS bypassed. Refuse outright.
for (const name of Object.keys(env)) {
  if (name.startsWith("VITE_") && /SERVICE|SECRET/i.test(name)) {
    fail(
      `${name} is prefixed VITE_, which publishes it to the browser.\n` +
        `  Rename it to SUPABASE_SERVICE_ROLE_KEY (no VITE_) and rotate the key\n` +
        `  in the Supabase dashboard, because it may already be in a built bundle.`,
    );
  }
}
if (jwtRole(env.VITE_SUPABASE_ANON_KEY ?? "") === "service_role") {
  fail(
    "VITE_SUPABASE_ANON_KEY holds a SERVICE ROLE key. That is published to the\n" +
      "  browser. Replace it with the anon/public key and rotate the service key.",
  );
}

const url = (env.VITE_SUPABASE_URL ?? "").replace(/\/+$/, "");
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// A dry run reads local files and prints what it would do. It never reaches
// Supabase, so it must not demand credentials — that is exactly when you
// want to check your filenames, before hunting down a secret key.
function connect() {
  if (!url) fail("VITE_SUPABASE_URL is missing from .env");
  if (!serviceKey) {
    fail(
      "SUPABASE_SERVICE_ROLE_KEY is missing from .env\n\n" +
        "  Supabase Dashboard -> Project Settings -> API -> service_role (secret).\n" +
        "  Add it as:  SUPABASE_SERVICE_ROLE_KEY=eyJ...\n" +
        "  NOT prefixed VITE_ — that would publish it to the browser.\n" +
        "  .env is gitignored, so it stays out of the repo.\n\n" +
        "  Re-run with --dry-run to preview without any key.",
    );
  }
  const role = jwtRole(serviceKey);
  if (role && role !== "service_role") {
    fail(
      `SUPABASE_SERVICE_ROLE_KEY looks like a "${role}" key, not a service_role key.\n` +
        "  Writing to the media table would be blocked by row-level security.",
    );
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/* ---------------- gather the files ---------------- */

function collect() {
  // Create the drop folders rather than complaining about them. They are
  // gitignored, so a fresh clone never has them.
  for (const category of CATEGORIES) {
    mkdirSync(join(SOURCE_DIR, category), { recursive: true });
  }

  // Optional: media-upload/captions.json, mapping "highlight/a.jpg" -> caption.
  let captions = {};
  const captionsPath = join(SOURCE_DIR, "captions.json");
  if (existsSync(captionsPath)) {
    try {
      captions = JSON.parse(readFileSync(captionsPath, "utf8"));
    } catch (error) {
      fail(`captions.json is not valid JSON: ${error.message}`);
    }
  }

  const items = [];
  const skipped = [];

  for (const category of CATEGORIES) {
    const dir = join(SOURCE_DIR, category);
    if (!existsSync(dir)) continue;

    const names = readdirSync(dir)
      .filter((n) => !n.startsWith("."))
      .filter((n) => statSync(join(dir, n)).isFile())
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    names.forEach((name, index) => {
      const ext = extname(name).toLowerCase();
      const type = TYPES[ext];
      if (!type) {
        skipped.push(`${category}/${name} (unsupported ${ext || "file"})`);
        return;
      }
      const [mediaType, contentType] = type;
      const path = `${category}/${name}`;
      const size = statSync(join(dir, name)).size;

      // "03 - first dance.jpg" sorts and numbers itself; otherwise fall back
      // to the position in the folder.
      const numbered = name.match(/^(\d+)/);
      items.push({
        category,
        mediaType,
        contentType,
        path,
        localPath: join(dir, name),
        size,
        sortOrder: numbered ? Number(numbered[1]) : index + 1,
        caption: captions[path] ?? captionFromName(name),
      });
    });
  }

  return { items, skipped };
}

/** "03 - a-kiss_among the flowers.jpg" -> "A kiss among the flowers" */
function captionFromName(name) {
  const stem = basename(name, extname(name))
    .replace(/^\d+\s*[-_.]?\s*/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!stem) return null;
  return stem.charAt(0).toUpperCase() + stem.slice(1);
}

const mb = (bytes) => `${(bytes / 1_000_000).toFixed(1)} MB`;

/* ---------------- run ---------------- */

const { items, skipped } = collect();

if (skipped.length) {
  console.log("\nSkipped:");
  for (const s of skipped) console.log(`  - ${s}`);
}

if (!items.length) {
  console.log(
    `\nNothing to upload. Put files in:\n` +
      CATEGORIES.map((c) => `  media-upload/${c}/`).join("\n") +
      "\n",
  );
  process.exit(0);
}

console.log(`\n${dryRun ? "Would upload" : "Uploading"} ${items.length} file(s):\n`);
const warnings = [];
let oversized = 0;
let total = 0;

for (const item of items) {
  total += item.size;
  const limit = item.mediaType === "image" ? WARN_IMAGE_BYTES : WARN_VIDEO_BYTES;
  const big = item.size > limit;
  if (big) {
    oversized += 1;
    warnings.push(`${item.path} is ${mb(item.size)}`);
  }
  if (item.path.toLowerCase().endsWith(".mov")) {
    warnings.push(`${item.path} is .mov — convert to .mp4 so every browser can play it`);
  }
  console.log(
    `  ${item.path.padEnd(42)} ${item.mediaType.padEnd(5)} ` +
      `${mb(item.size).padStart(8)}${big ? "  <- large" : ""}`,
  );
  console.log(`     caption: ${item.caption ?? "(none)"}   sort_order: ${item.sortOrder}`);
}

console.log(`\n  total ${mb(total)}`);
if (warnings.length) {
  console.log("\nWarnings:");
  for (const w of warnings) console.log(`  ! ${w}`);
  if (oversized) {
    console.log(
      "  Large files make the gallery slow on mobile data. Resizing photos to\n" +
        "  about 1600px wide usually takes them under 500 KB.",
    );
  }
}

if (dryRun) {
  console.log("\nDry run — nothing was uploaded or written.\n");
  process.exit(0);
}

const db = connect();

console.log("");
let uploaded = 0;
let inserted = 0;
let updated = 0;

for (const item of items) {
  const body = readFileSync(item.localPath);

  const { error: uploadError } = await db.storage.from(BUCKET).upload(item.path, body, {
    contentType: item.contentType,
    upsert: true,
    cacheControl: "3600",
  });
  if (uploadError) {
    console.error(`  FAILED upload ${item.path}: ${uploadError.message}`);
    continue;
  }
  uploaded += 1;

  const row = {
    category: item.category,
    media_type: item.mediaType,
    url: item.path,
    caption: item.caption,
    sort_order: item.sortOrder,
  };

  // `url` has no unique constraint, so match on it by hand rather than
  // relying on upsert — otherwise a re-run duplicates every row.
  const { data: existing, error: findError } = await db
    .from("media")
    .select("id")
    .eq("url", item.path)
    .limit(1);
  if (findError) {
    console.error(`  FAILED lookup ${item.path}: ${findError.message}`);
    continue;
  }

  if (existing?.length) {
    const { error } = await db.from("media").update(row).eq("id", existing[0].id);
    if (error) console.error(`  FAILED update ${item.path}: ${error.message}`);
    else {
      updated += 1;
      console.log(`  updated  ${item.path}`);
    }
  } else {
    const { error } = await db.from("media").insert(row);
    if (error) console.error(`  FAILED insert ${item.path}: ${error.message}`);
    else {
      inserted += 1;
      console.log(`  added    ${item.path}`);
    }
  }
}

console.log(
  `\nDone. ${uploaded} file(s) uploaded, ${inserted} row(s) added, ${updated} updated.`,
);
console.log("Reload the site to see them.\n");
