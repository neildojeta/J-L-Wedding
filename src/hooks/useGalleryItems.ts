import { useMemo } from "react";
import { useMedia } from "./useMedia";
import type { MediaCategory, MediaItem } from "../lib/supabase";

/** A photo that ships with the site, rather than one uploaded later. */
export interface BundledPhoto {
  src: string;
  caption: string;
}

interface Gallery {
  items: MediaItem[];
  loading: boolean;
  error: string | null;
}

/**
 * The photos for one gallery: those bundled with the site first, then
 * anything the couple has since added through Supabase.
 *
 * Bundled photos are given the same shape as an uploaded row, so nothing
 * downstream — grid, carousel or lightbox — needs to know where a photo
 * came from.
 */
export function useGalleryItems(
  category: MediaCategory,
  bundled?: readonly BundledPhoto[],
): Gallery {
  const { items: uploaded, loading, error } = useMedia(category);

  const items = useMemo<MediaItem[]>(
    () => [
      ...(bundled ?? []).map(
        (photo, index): MediaItem => ({
          id: `bundled-${index}`,
          category,
          media_type: "image",
          url: photo.src,
          caption: photo.caption,
          sort_order: index,
        }),
      ),
      ...uploaded,
    ],
    [bundled, uploaded, category],
  );

  return { items, loading, error };
}
