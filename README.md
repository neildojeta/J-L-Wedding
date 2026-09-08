# J & L — Wedding Invitation & RSVP

A single-page painterly wedding invitation. Guests land on the sealed
envelope, open the letter, and the invitation fades in: details, venue,
dress code, photo and video highlights, and an RSVP form that writes
straight to Supabase.

- **Frontend** — React + Vite + Tailwind, deployed to **Render** as a static site.
- **Database & storage** — **Supabase** (RSVP replies, gallery media).
- No backend server to run: the browser talks to Supabase directly, and
  row-level security decides what it is allowed to do.

---

## 1. Fill in your details

Everything guests read lives in one file: **`src/content/weddingContent.ts`**.
Names, date, times, venue, dress code, RSVP deadline, contacts. Anything
marked `// TODO` is a placeholder.

The countdown reads `date`, so keep it as a real ISO timestamp:

```ts
date: "2027-02-14T14:00:00+08:00",   // +08:00 = Philippine time
```

Colours live in **`src/index.css`** under `@theme`. The palette is deep red
and gold; change a hex and the whole site follows. Two golds are defined on
purpose: `--color-gold` for borders and for lettering on the red panels, and
`--color-gold-deep` for gold lettering on the cream paper, where the lighter
gold falls to about 2:1 and stops being readable.

### The venue and its map

The `venue` block holds the name, address, coordinates and three Google
links. None of them needs an API key:

| Field | What it does |
| --- | --- |
| `mapsUrl` | Drops a pin on the coordinates |
| `directionsUrl` | Opens turn-by-turn from wherever the guest is |
| `embedUrl` | The map shown on the page, in an `<iframe>` |

`embedUrl` is pinned at `z=17` deliberately — that is the zoom at which
Google draws its own **Viridis Countryside Garden** label, so the venue
names itself at the centre of the map. Zoom out and the label disappears.
If you move the wedding, change the coordinates in all three links.

---

## 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com) (the free tier is plenty).
2. Open **SQL Editor → New query**, paste all of **`supabase/schema.sql`**, and run it.
   That creates the `rsvps` and `media` tables, the security policies, and the
   public `wedding-media` storage bucket.
3. Open **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key

The anon key is meant to be public — it is safe in the browser. The policies
in `schema.sql` allow anonymous visitors to *insert* an RSVP and *read* the
gallery, and nothing else. Guests cannot read, edit or delete replies.

---

## 3. Run it locally

```bash
cp .env.example .env      # then paste your two Supabase values in
npm install
npm run dev
```

Open the address it prints. Without a `.env` the site still runs — the
galleries show an empty state and the RSVP form says it isn't connected yet.

Useful: add `?open=1` to the URL to skip the envelope and jump straight to
the invitation while you are editing.

---

## 4. Deploy to Render

1. Push this folder to a GitHub repository.
2. In Render: **New + → Blueprint**, pick the repo. Render reads
   `render.yaml` and configures the static site itself.
3. When prompted, set the two environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. Later pushes to the branch redeploy automatically.

> These values are baked in at build time, so after changing one in Render,
> trigger **Manual Deploy → Clear build cache & deploy**.

Prefer clicking through instead of the blueprint? Create a **Static Site**
with build command `npm ci && npm run build`, publish directory `dist`, and
add a rewrite rule from `/*` to `/index.html`.

---

## 5. Adding photos and videos

Four highlight photos and the venue photo ship with the site (see the table
further down). Everything you add **after** that goes through Supabase — no
redeploy needed, and the site picks it up on the next page load. Uploaded
photos appear after the four that ship, in the same gallery.

**Step 1 — upload the file.**
Supabase → **Storage** → `wedding-media` bucket. Create a folder
(`highlights`, `venue` or `dress-code`) and drag your files in.

**Step 2 — list it on the site.**
Supabase → **Table Editor** → `media` → **Insert row**:

| Column | What to put |
| --- | --- |
| `category` | `highlight`, `venue`, or `dress_code` |
| `media_type` | `image` or `video` |
| `url` | the path inside the bucket, e.g. `highlights/beach-01.jpg` |
| `caption` | optional, shown when hovering and in the viewer |
| `sort_order` | lower numbers appear first |

Leave `id` and `created_at` alone — they fill themselves in.

A full URL works in the `url` column too, if you'd rather host a file
elsewhere.

**Before uploading:** phone photos are often 4–8 MB. Resize them to about
1600px wide first, or the gallery will be slow on mobile data. Videos are
best kept short and under ~20 MB.

### Replacing the photos that ship with the site

These are part of the design rather than content, so they live in
`public/theme/`. Swap a file, keep the name, and redeploy. The originals you
sent are kept untouched in `assets-source/`.

| File | Where it appears |
| --- | --- |
| `main_picture.webp` | The framed photograph on the invitation |
| `venue.webp` | The wide photo in the venue section |
| `highlight1.webp` … `highlight4.webp` | The Highlights gallery |
| `grose1.webp` … `grose5.webp` | Gold rose artwork, used as corners and dividers |

The highlight captions live with the rest of the wording, under
`assets.highlights` in `src/content/weddingContent.ts`. Each caption doubles
as the photo's alt text, so keep it descriptive as well as fond.

`main_picture.webp` is a crop of the original, not the whole frame: the
full photograph gives about half its height to out-of-focus grass, and the
invitation wants the couple large. The crop box is in the note at the top
of the hero photograph in `src/components/Hero.tsx`.

The five roses are referenced by *shape*, not by number —
`src/components/decor/FloralAccents.tsx` names them `ROSE_SPRAY`,
`ROSE_HEART`, `ROSE_COLUMN`, `ROSE_STEM` and `ROSE_SWAG`, and the sections
pick the shape that suits them. If you swap the artwork, keep the shapes
roughly alike or re-point the names.

There are two cuts of the envelope, and the browser picks one at runtime —
only the chosen file is downloaded:

| File | Used by |
| --- | --- |
| `envelope_spin_transparent.webm` | Chrome, Edge, Firefox, Android |
| `envelope_spin_cream.mp4` | Safari (iPhone, iPad, Mac) |

Safari plays WebM but ignores its alpha channel, which would put the
envelope on a black block, so it gets the cream-background cut instead —
blended into the paper with a mask so the join doesn't show. Keep both
files. If you ever replace one, replace both.

---

## 6. Reading your RSVPs

Supabase → **Table Editor** → `rsvps`. Newest replies are at the top, and
the **Export CSV** button gives you a spreadsheet for the caterer.

For a quick head count, run this in the SQL Editor:

```sql
select coalesce(sum(party_size), 0) as total_guests
from public.rsvps where attending;
```

More ready-made queries are at the bottom of `supabase/schema.sql`.

---

## Project layout

```
src/
  content/weddingContent.ts   ← all wording, dates and details
  index.css                   ← palette, fonts, painterly styles
  components/
    IntroGate.tsx             ← envelope screen + "Open the Letter"
    Hero.tsx                  ← names, framed main photo, countdown
    EventDetails.tsx          ← ceremony and reception cards
    Venue.tsx                 ← venue photos, address, embedded map
    DressCode.tsx / Highlights.tsx
    decor/FloralAccents.tsx   ← the gold roses, named by shape
    MediaGrid.tsx             ← Supabase-backed gallery + lightbox
    RsvpForm.tsx              ← the RSVP form
  lib/supabase.ts             ← client, types, storage URL helper
supabase/schema.sql           ← run once in the SQL editor
render.yaml                   ← Render deployment blueprint
public/theme/                 ← envelope video, photos, gold rose artwork
assets-source/                ← your original full-size files (not deployed)
```

## Notes

- Images ship as WebP and are trimmed to their artwork first, so the gold
  roses cost 37–83 KB each and the main photo 68 KB.
- The embedded map is a plain `<iframe>` — no Google API key, no billing.
- Animations respect the visitor's "reduce motion" setting.
- The envelope video is muted and `playsInline`, which is what lets it
  autoplay on iOS and Android.
