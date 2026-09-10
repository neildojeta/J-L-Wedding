import { isSupabaseConfigured } from "../lib/supabase";

/**
 * What a gallery shows when it has nothing to draw — either the couple has
 * not uploaded anything yet, or the fetch failed. Shared by the grid and
 * the carousel so both fall back the same way.
 */
export function GalleryEmpty({
  message,
  error,
  tone = "dark",
}: {
  message: string;
  error?: string | null;
  /** "dark" = drawn on the cream paper, "light" = on the red panels. */
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  const text = light ? "text-cream/85" : "text-ink/85";

  return (
    <div className="mx-auto max-w-md text-center">
      <div
        className={`painted-edge border border-dashed px-8 py-10 ${
          light ? "border-gold/50 bg-cream/[0.06]" : "border-gold-deep/50 bg-cream/60"
        }`}
      >
        <svg
          viewBox="0 0 48 48"
          aria-hidden="true"
          className={`mx-auto h-9 w-9 ${light ? "text-gold" : "text-gold-deep"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <rect x="5" y="10" width="38" height="28" rx="3" />
          <circle cx="16" cy="20" r="3.2" />
          <path d="M5 32l11-9 9 7 7-5 11 8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className={`mt-4 font-body text-lg italic ${text}`}>
          {error ? "We couldn't load these just now — please check back soon." : message}
        </p>
        {!isSupabaseConfigured && !error && (
          <p className={`mt-2 font-body text-base not-italic ${text}`}>
            Connect Supabase to publish media here.
          </p>
        )}
      </div>
    </div>
  );
}
