import { wedding } from "../../content/weddingContent";

/* The five pieces of gold rose artwork, named by shape rather than by
   file number so the callers below read as decisions instead of indexes. */
const [ROSE_SPRAY, ROSE_HEART, ROSE_COLUMN, ROSE_STEM, ROSE_SWAG] =
  wedding.assets.goldRoses;

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

export { ROSE_SPRAY, ROSE_HEART, ROSE_COLUMN, ROSE_STEM, ROSE_SWAG };
