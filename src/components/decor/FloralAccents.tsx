import { wedding } from "../../content/weddingContent";

/* Every piece of artwork is named by shape rather than by file number, so
   the callers below read as decisions instead of indexes. */
const [ROSE_SPRAY, ROSE_HEART, ROSE_COLUMN, ROSE_STEM, ROSE_SWAG] =
  wedding.assets.goldRoses;

/* Red-and-gold roses. ROSE_CREST is the only one of the three with enough
   gold leaf to hold up on a maroon panel; the other two are for cream. */
const [ROSE_BOUQUET, ROSE_CREST, ROSE_CASCADE] = wedding.assets.redGoldRoses;

const [PETALS_STREWN, PETALS_DRIFT, PETALS_FALL] = wedding.assets.petals;

const [DUST_SPECKLE, DUST_SPARKLE, DUST_SCATTER] = wedding.assets.goldDust;

type Corner = "tl" | "tr" | "bl" | "br";

// A small inset keeps the trimmed artwork fully on the page instead of
// running off the edge mid-petal. Only the horizontal mirror is used: the
// roses are drawn growing upward, and flipping one head-down reads as a
// mistake rather than as a corner piece.
const cornerStyle: Record<Corner, string> = {
  tl: "top-3 left-3",
  tr: "top-3 right-3 scale-x-[-1]",
  bl: "bottom-3 left-3",
  br: "bottom-3 right-3 scale-x-[-1]",
};

/** Gold rose cluster tucked into a section corner. */
export function FloralCorner({
  corner,
  src = ROSE_SPRAY,
  className = "",
  size = "w-40 sm:w-52 lg:w-64",
  opacity = "opacity-90",
  onDark = false,
}: {
  corner: Corner;
  src?: string;
  className?: string;
  size?: string;
  opacity?: string;
  /** Set on the deep red sections, where the gold needs lift, not shadow. */
  onDark?: boolean;
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={`floral ${onDark ? "floral-on-dark" : ""} absolute ${
        cornerStyle[corner]
      } ${size} ${opacity} ${className}`}
    />
  );
}

/** Gold swag flanked by rules, used between sections. */
export function FloralDivider({
  src = ROSE_SWAG,
  className = "",
  onDark = false,
}: {
  src?: string;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-3 sm:gap-5 ${className}`}
    >
      <Rule side="left" />
      <img
        src={src}
        alt=""
        loading="lazy"
        className={`floral ${onDark ? "floral-on-dark" : ""} w-32 shrink-0 sm:w-44`}
      />
      <Rule side="right" />
    </div>
  );
}

function Rule({ side }: { side: "left" | "right" }) {
  // Static class strings — Tailwind cannot see interpolated names.
  const gradient =
    side === "left"
      ? "bg-gradient-to-r from-transparent via-gold/60 to-gold"
      : "bg-gradient-to-l from-transparent via-gold/60 to-gold";
  return <span className={`h-px w-16 sm:w-28 ${gradient}`} />;
}

/**
 * A band of fallen petals along a section's top or bottom edge.
 *
 * The band is given a height and cropped to it rather than being stretched
 * to fit: left to scale freely across a wide screen, a 1300px-wide strip of
 * petals becomes 320px tall and each petal blows up into a soft pink blob.
 * Cropping keeps every petal at roughly its drawn size, whatever the
 * screen — `object-top` picks the densest run of them to show.
 */
export function PetalEdge({
  edge,
  src = PETALS_STREWN,
  className = "",
  opacity = "opacity-70",
  height = "h-24 sm:h-32",
}: {
  edge: "top" | "bottom";
  src?: string;
  className?: string;
  opacity?: string;
  height?: string;
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={`band-fade pointer-events-none absolute inset-x-0 w-full select-none object-cover object-top ${
        // Flipped head-down along the bottom so the petals fall towards the
        // edge of the page in both places.
        edge === "top" ? "top-0" : "bottom-0 scale-y-[-1]"
      } ${height} ${opacity} ${className}`}
    />
  );
}

/**
 * A narrow column of petals falling down one side of a section.
 * Decorative and tall, so callers usually hide it on phones.
 */
export function PetalColumn({
  side,
  src = PETALS_FALL,
  className = "",
  opacity = "opacity-45",
}: {
  side: "left" | "right";
  src?: string;
  className?: string;
  opacity?: string;
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={`pointer-events-none absolute select-none ${
        side === "left" ? "left-0" : "right-0 scale-x-[-1]"
      } ${opacity} ${className}`}
    />
  );
}

/**
 * Gold sparkle laid over a deep red panel.
 *
 * The dust artwork is baked onto black rather than cut out — it costs a
 * fraction of the bytes that way, and screen blending drops the black to
 * nothing. Two rules follow from that, and both matter:
 *
 *   1. It must keep `mix-blend-mode: screen`. Without it the artwork shows
 *      as a black rectangle.
 *   2. It only belongs on the dark panels. Screened onto cream it does
 *      nothing at all, because the paper is already brighter than the dust.
 */
export function GoldDust({
  src = DUST_SPARKLE,
  className = "",
  opacity = "opacity-60",
}: {
  src?: string;
  className?: string;
  opacity?: string;
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      style={{ mixBlendMode: "screen" }}
      className={`pointer-events-none absolute select-none ${opacity} ${className}`}
    />
  );
}

/** Small gold ornament for headings. */
export function Ornament({
  className = "",
  tone = "dark",
}: {
  className?: string;
  /** "dark" = drawn on the cream paper, "light" = on the red panels. */
  tone?: "dark" | "light";
}) {
  return (
    <svg
      viewBox="0 0 120 16"
      aria-hidden="true"
      className={`h-4 w-28 ${tone === "light" ? "text-gold" : "text-gold-deep"} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    >
      <path d="M2 8h34" strokeLinecap="round" />
      <path d="M84 8h34" strokeLinecap="round" />
      <path d="M60 2.5c-4.6 2-7 3.8-7 5.5s2.4 3.5 7 5.5c4.6-2 7-3.8 7-5.5s-2.4-3.5-7-5.5z" />
      <circle cx="45" cy="8" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="75" cy="8" r="1.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export {
  ROSE_SPRAY,
  ROSE_HEART,
  ROSE_COLUMN,
  ROSE_STEM,
  ROSE_SWAG,
  ROSE_BOUQUET,
  ROSE_CREST,
  ROSE_CASCADE,
  PETALS_STREWN,
  PETALS_DRIFT,
  PETALS_FALL,
  DUST_SPECKLE,
  DUST_SPARKLE,
  DUST_SCATTER,
};
