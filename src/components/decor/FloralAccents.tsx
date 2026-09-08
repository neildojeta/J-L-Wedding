import { wedding } from "../../content/weddingContent";

const [ROSE_1, ROSE_2, ROSE_3] = wedding.assets.roses;

type Corner = "tl" | "tr" | "bl" | "br";

// A small inset keeps the trimmed artwork fully on the page instead of
// running off the edge mid-petal. The flips use the default centre
// origin so each cluster mirrors in place rather than being thrown
// outside the viewport.
const cornerStyle: Record<Corner, string> = {
  tl: "top-3 left-3",
  tr: "top-3 right-3 scale-x-[-1]",
  bl: "bottom-3 left-3 scale-y-[-1]",
  br: "bottom-3 right-3 scale-[-1]",
};

/** Painterly rose cluster tucked into a section corner. */
export function FloralCorner({
  corner,
  src = ROSE_3,
  className = "",
  size = "w-44 sm:w-60 lg:w-80",
  opacity = "opacity-70",
}: {
  corner: Corner;
  src?: string;
  className?: string;
  size?: string;
  opacity?: string;
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={`floral absolute ${cornerStyle[corner]} ${size} ${opacity} ${className}`}
    />
  );
}

/** Rose-and-rule flourish used between sections. */
export function FloralDivider({
  src = ROSE_2,
  className = "",
}: {
  src?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-3 sm:gap-5 ${className}`}
    >
      <Rule side="left" />
      <img src={src} alt="" loading="lazy" className="floral w-24 sm:w-32 shrink-0" />
      <Rule side="right" />
    </div>
  );
}

function Rule({ side }: { side: "left" | "right" }) {
  // Static class strings — Tailwind cannot see interpolated names.
  const gradient =
    side === "left"
      ? "bg-gradient-to-r from-transparent to-gold/70"
      : "bg-gradient-to-l from-transparent to-gold/70";
  return <span className={`h-px w-16 sm:w-28 ${gradient}`} />;
}

/** Small gold ornament for headings. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 16"
      aria-hidden="true"
      className={`h-4 w-28 text-gold ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
    >
      <path d="M2 8h34" strokeLinecap="round" />
      <path d="M84 8h34" strokeLinecap="round" />
      <path d="M60 2.5c-4.6 2-7 3.8-7 5.5s2.4 3.5 7 5.5c4.6-2 7-3.8 7-5.5s-2.4-3.5-7-5.5z" />
      <circle cx="45" cy="8" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="75" cy="8" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export { ROSE_1, ROSE_2, ROSE_3 };
