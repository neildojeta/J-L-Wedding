import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * The site is designed to render fully without Supabase configured —
 * galleries fall back to an empty state and the RSVP form explains that
 * it is not connected yet, instead of white-screening.
 */
export const isSupabaseConfigured = Boolean(
  url && anonKey && !url.includes("YOUR-PROJECT-REF"),
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey, {
      // The session is persisted for the couple's dashboard, so a refresh
      // does not sign them out. Guests never sign in, so nothing is stored
      // for them — the entry only appears once a session exists.
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

/* ---------------- Table shapes ---------------- */

export type MediaCategory = "highlight" | "venue" | "dress_code";

export interface MediaItem {
  id: string;
  category: MediaCategory;
  media_type: "image" | "video";
  /** Either a full URL, or a path inside the storage bucket. */
  url: string;
  caption: string | null;
  sort_order: number;
}

/**
 * Length caps that mirror the CHECK constraint and the RLS policy in
 * `supabase/schema.sql`. The database rejects anything longer, and that
 * rejection reaches the guest only as a generic "something went wrong" —
 * which retrying can never fix. The form enforces the same limits up front
 * so the dead end cannot happen.
 *
 * These two must be changed together. Note the browser counts UTF-16 code
 * units where Postgres counts characters, so an emoji costs 2 here and 1
 * there: the form is the stricter of the two, which is the safe direction.
 */
export const RSVP_LIMITS = {
  fullName: 120,
  guestNames: 500,
  dietaryNotes: 500,
  message: 2000,
} as const;

/**
 * A reply as it comes back out of the database, for the couple's dashboard.
 * Guests never see this shape: `rsvps` grants them no select at all, so a
 * read with the anon key returns zero rows rather than an error.
 */
export interface Rsvp extends RsvpSubmission {
  id: string;
  created_at: string;
}

export interface RsvpSubmission {
  full_name: string;
  email: string | null;
  phone: string | null;
  attending: boolean;
  party_size: number;
  guest_names: string | null;
  dietary_notes: string | null;
  message: string | null;
}

/** Public bucket that holds gallery, venue and dress-code media. */
export const MEDIA_BUCKET = "wedding-media";

/**
 * Rows may store either a full public URL or just the object path
 * (e.g. "highlights/beach-01.jpg"). Both resolve here.
 */
export function resolveMediaUrl(value: string): string {
  if (/^https?:\/\//i.test(value) || value.startsWith("/")) return value;
  if (!supabase) return value;
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(value).data.publicUrl;
}
