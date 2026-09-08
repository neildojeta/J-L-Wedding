import { useEffect, useState } from "react";
import {
  supabase,
  resolveMediaUrl,
  type MediaCategory,
  type MediaItem,
} from "../lib/supabase";

interface State {
  items: MediaItem[];
  loading: boolean;
  error: string | null;
}

/**
 * Loads a gallery category from the `media` table, newest ordering
 * controlled by `sort_order`. Never throws — an unreachable or
 * unconfigured backend simply yields an empty gallery.
 */
export function useMedia(category: MediaCategory): State {
  const [state, setState] = useState<State>({
    items: [],
    loading: Boolean(supabase),
    error: null,
  });

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("media")
        .select("id, category, media_type, url, caption, sort_order")
        .eq("category", category)
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (error) {
        setState({ items: [], loading: false, error: error.message });
        return;
      }

      const items = (data ?? []).map((row) => ({
        ...(row as MediaItem),
        url: resolveMediaUrl((row as MediaItem).url),
      }));
      setState({ items, loading: false, error: null });
    })();

    return () => {
      cancelled = true;
    };
  }, [category]);

  return state;
}
