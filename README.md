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

Colours live in **`src/index.css`** under `@theme`. The five values there
are the palette; change a hex and the whole site follows.

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

Highlights, venue photos and dress-code inspiration are **not** in the code —
you add them from the Supabase dashboard, and the site picks them up on the
next page load. No redeploy needed.

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

### Replacing the envelope video or the main photo

Those two are part of the design rather than content, so they ship with the
site: `public/theme/`. Swap the file, keep the name, and redeploy. The
originals you sent are kept untouched in `assets-source/`.

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
    Hero.tsx                  ← names, main photo, countdown
    EventDetails.tsx          ← ceremony and reception cards
    Venue.tsx / DressCode.tsx / Highlights.tsx
    MediaGrid.tsx             ← Supabase-backed gallery + lightbox
    RsvpForm.tsx              ← the RSVP form
  lib/supabase.ts             ← client, types, storage URL helper
supabase/schema.sql           ← run once in the SQL editor
render.yaml                   ← Render deployment blueprint
public/theme/                 ← envelope video, main photo, rose artwork
assets-source/                ← your original full-size files (not deployed)
```

## Notes

- Images ship as WebP (roses 473 KB → 77 KB each, main photo 209 KB → 68 KB).
- Animations respect the visitor's "reduce motion" setting.
- The envelope video is muted and `playsInline`, which is what lets it
  autoplay on iOS and Android.
