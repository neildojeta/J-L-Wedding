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
  ? createClient(url, anonKey, { auth: { persistSession: false } })
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
