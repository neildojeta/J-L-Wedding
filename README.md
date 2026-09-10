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
   public `wedding-media` storage bucket. It is safe to run more than once.

   Check the **Messages/Notices** panel afterwards. If it says the storage step
   was skipped, that project will not let the SQL editor touch `storage.objects`
   — nothing else is affected, and the fix is one click: **Storage → New
   bucket**, name it `wedding-media`, and tick **Public**.
3. Open **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key

The anon key is meant to be public — it is safe in the browser. The policies
in `schema.sql` allow anonymous visitors to *insert* an RSVP and *read* the
gallery, and nothing else. Guests cannot read, edit or delete replies.

Two things in `schema.sql` are quietly load-bearing, if you ever edit it:

- **`rsvps` has no SELECT policy, on purpose** — that is what stops one guest
  reading another's reply. It works only because the form submits with
  `.insert(payload)` and nothing chained after it. Adding `.select()` to that
  call would make every RSVP fail.
- **The length limits in the RLS policy are mirrored in the form**, as
  `RSVP_LIMITS` in `src/lib/supabase.ts`. The database rejecting an over-long
  message reaches the guest only as a generic failure that retrying cannot
  clear, so the form caps the fields first. Change the two together.

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

### The quick way — one command

Drop your files into `media-upload/<category>/` and run:

```bash
npm run upload-media -- --dry-run   # shows exactly what it would do
npm run upload-media                # uploads and lists them
```

It uploads each file to the bucket **and** writes the matching `media` row,
which is the step that actually puts it on the site. Safe to re-run: files
are replaced rather than duplicated, and an existing row is updated, so you
can fix a caption and run it again.

Name files with a leading number to control both order and caption —
`01 - a kiss among the flowers.jpg` becomes sort order 1 with the caption
*"A kiss among the flowers"*. For captions you'd rather write by hand, add
`media-upload/captions.json`:

```json
{ "highlight/01 - first look.jpg": "The first look" }
```

The script needs your **service_role** key in `.env` as
`SUPABASE_SERVICE_ROLE_KEY` — see `.env.example`. That key bypasses RLS,
which is exactly why the anon key can't write to `media` and a guest can't
edit your gallery. **Never** give it a `VITE_` prefix: Vite publishes every
`VITE_` variable to the browser. The script refuses to run if you do, and
`--dry-run` needs no key at all.

`media-upload/` is gitignored — it is a staging folder, not deployed.

### The manual way

**Step 1 — upload the file.**
Supabase → **Storage** → `wedding-media` bucket. Create a folder
(`highlight`, `venue` or `dress_code` — matching the category values keeps
things straight) and drag your files in.

**Step 2 — list it on the site.**
Supabase → **Table Editor** → `media` → **Insert row**:

| Column | What to put |
| --- | --- |
| `category` | `highlight`, `venue`, or `dress_code` |
| `media_type` | `image` or `video` |
| `url` | the path inside the bucket, e.g. `highlight/beach-01.jpg` — no leading slash |
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
| `grose6.webp` … `grose8.webp` | Red-and-gold roses, on the cream sections |
| `rpetals1.webp` … `rpetals3.webp` | Fallen rose petals, along section edges |
| `gdust1.webp` … `gdust3.webp` | Gold dust, on the deep red panels only |
| `paper-edge.webp` | The torn, scorched edge of the sheet |
| `paper-field.webp` | The paper fibre, tiled down the sheet |

The highlight captions live with the rest of the wording, under
`assets.highlights` in `src/content/weddingContent.ts`. Each caption doubles
as the photo's alt text, so keep it descriptive as well as fond.

`main_picture.webp` is a crop of the original, not the whole frame: the
full photograph gives about half its height to out-of-focus grass, and the
invitation wants the couple large. The crop box is in the note at the top
of the hero photograph in `src/components/Hero.tsx`.

All of the decorative artwork is referenced by *shape*, not by number —
`src/components/decor/FloralAccents.tsx` names the gold roses `ROSE_SPRAY`,
`ROSE_HEART`, `ROSE_COLUMN`, `ROSE_STEM` and `ROSE_SWAG`, the red-and-gold
ones `ROSE_BOUQUET`, `ROSE_CREST` and `ROSE_CASCADE`, and the petals and
dust likewise. The sections pick the shape that suits them. If you swap the
artwork, keep the shapes roughly alike or re-point the names.

Two things about that artwork are worth knowing before you replace any of
it:

- **The red-and-gold roses are for the cream sections.** Their red sinks
  into the maroon panels. `ROSE_CREST` is the exception — it carries enough
  gold leaf to hold its shape on the dark, which is why it is the one used
  as the divider under the order of the day.
- **The gold dust is baked onto black, not cut out**, and is drawn with
  `mix-blend-mode: screen`. Screen drops black to nothing, which makes the
  alpha channel dead weight — encoding it this way took `gdust2.webp` from
  288 KB to 44 KB. The cost is that it only works on the deep red panels: on
  cream it disappears, and without the blend mode it shows as a black
  rectangle. If you swap one of these files, keep it on a black ground.

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

### The dashboard at /dashboard

A private page on the site itself: head count, every reply, search, CSV
export, and a delete button for test rows. Set it up once:

1. **Run `supabase/dashboard.sql`** in the SQL Editor, after `schema.sql`.
2. **Create your account:** Authentication → Users → **Add user**, with a
   real email and a strong password. Repeat for the second person.
3. **Grant access.** Uncomment the `insert into public.admins` block at the
   bottom of `dashboard.sql`, put your email addresses in it (lowercase),
   and run it.
4. **Turn off public sign-ups:** Authentication → Sign In / Providers →
   Email → *Allow new users to sign up* **off**.

Then visit `/dashboard` on the site and sign in.

**Why it is actually private.** The site is a static page carrying only the
anon key, so nothing the browser does can be trusted — a password check in
JavaScript is decoration, and anyone can call the API directly with the key
out of the bundle. The protection is in the database: `rsvps` grants `anon`
no select at all, and the select it grants to signed-in users is conditional
on `public.is_admin()`, which checks the address against the `admins` table.
An unauthorised visitor who opens `/dashboard` sees a login form and, however
they poke at it, reads zero rows.

Step 4 is belt and braces. Access is already limited to the addresses you
listed, so an open sign-up form would not by itself expose anything — but
there is no reason to let strangers create accounts on your project.

The couple can read and delete replies. Updating them is deliberately not
granted: an RSVP is a record of what a guest said, and being able to edit it
quietly would make the list untrustworthy.

### Or straight from Supabase

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
    Dashboard.tsx             ← the couple's private RSVP page, at /dashboard
    decor/FloralAccents.tsx   ← roses, petals and gold dust, named by shape
    MediaGrid.tsx             ← Supabase-backed gallery, as a grid
    MediaCarousel.tsx         ← the same gallery, sliding sideways
    Lightbox.tsx              ← the viewer both galleries open
    RsvpForm.tsx              ← the RSVP form
  lib/supabase.ts             ← client, types, storage URL helper
supabase/schema.sql           ← run once in the SQL editor
supabase/dashboard.sql        ← then this, for the private dashboard
render.yaml                   ← Render deployment blueprint
public/theme/                 ← envelope video, photos, gold rose artwork
assets-source/                ← your original full-size files (not deployed)
```

## The letter layout

Everything the envelope contained is drawn as **one sheet of paper lying on
a dark desk**. `src/App.tsx` holds the two pieces: `.letter-desk` is the
deep maroon ground, `.letter-sheet` the cream page laid on it, and every
section lives inside the sheet.

Three things follow from that, and each one breaks the layout if it is
forgotten:

- **Sections must not paint their own paper.** The `paper` and
  `canvas-grain` classes belong to the sheet alone. Put them back on a
  section and its wash bands across the page, giving away that the letter
  is really seven stacked blocks.
- **The navbar has to stay outside the sheet.** The sheet is clipped with
  `overflow-hidden` to hold its torn edge, and `position: sticky` does not
  survive a clipping ancestor — move the navbar inside and it stops
  sticking. It is lettered in gold because it rides over the dark desk.
- **The two deep red sections are inset panels**, not full-bleed bands.
  They carry `.letter-panel` plus a horizontal margin, so cream shows around
  them and they read as cards laid on the letter.

To go back to full-bleed sections, unwrap the sheet in `App.tsx` and return
`paper canvas-grain` to each cream section.

### The paper itself

The sheet is a photograph of real paper — `assets-source/paper1.png` — split
into two pieces, because one image cannot stretch over a page 1000px wide and
9000px tall without smearing:

- `paper-edge.webp` is the torn, scorched border, drawn as a CSS
  `border-image`. The ragged run is *repeated* along the sides rather than
  stretched, so it stays the right size however long the page gets. The
  slice values (68px top and bottom, 84px left and right) are measured from
  the artwork — that is where the scorching fades back into cream.
- `paper-field.webp` is the clean centre, tiled down the page. It is sized
  to the full width so there is no horizontal join, and mirrored vertically
  so the vertical repeat has no seam either.

Two things here are easy to break:

- **`background-clip: padding-box` on `.letter-sheet` is load-bearing.**
  Without it the cream paints out to the border box and fills in behind the
  ragged notches, turning the torn silhouette back into a plain rectangle
  with a brown pattern printed on it.
- **Do not reach for `filter: drop-shadow`** to make the shadow follow the
  torn outline. It would, but `filter` establishes a containing block for
  fixed positioning, which traps the lightbox inside the sheet.

The field tile is normalised to near-white before it is multiplied over the
cream, so it contributes fibre without dragging the page darker. Even so the
paper ends up around `#EEE0C7` rather than `#FBF0DC`, which cost the gold
lettering its contrast margin — `--color-gold-deep` and the two lightest
`.foil` stops were re-derived against the new ground. **If you change the
texture strength, re-check those**; the note beside each one in `index.css`
says what it is aiming for.

## Notes

- Images ship as WebP and are trimmed to their artwork first, so each piece
  of decor costs 17–83 KB and the main photo 68 KB.
- The Highlights gallery slides sideways. The sliding is the browser's own
  scroll-snapping, so a phone swipe and a trackpad flick both feel native;
  the arrows and dots drive the same container. There is one dot per
  position the track can rest at, which on a wide screen is fewer than the
  number of photos — the last few share a resting place, and a dot you
  cannot reach is worse than no dot.
- The embedded map is a plain `<iframe>` — no Google API key, no billing.
- Animations respect the visitor's "reduce motion" setting.
- The envelope video is muted and `playsInline`, which is what lets it
  autoplay on iOS and Android.
