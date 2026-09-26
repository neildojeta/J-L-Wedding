import { useEffect, useRef, useState } from "react";
import { wedding } from "../content/weddingContent";

const { aerial } = wedding.assets;

/**
 * The drone shot that closes the story.
 *
 * Note what is deliberately missing: the `autoplay` attribute. With it set,
 * a browser begins pulling the file as soon as the page loads, and a guest
 * who never scrolls this far would spend 4 MB of mobile data on something
 * they never saw. `preload="none"` plus the observer below means the first
 * byte is fetched when the clip is actually on screen — the same bargain
 * the theme song already makes in App.
 *
 * It loops without ever fighting that song, because the source has no audio
 * track at all: the drone recorded none. `muted` is still set, since a
 * browser will refuse to start an unmuted video on its own regardless.
 */
export function AerialFilm() {
  const video = useRef<HTMLVideoElement>(null);

  // Read once, at mount. A guest who has asked their system for less motion
  // gets the poster and a set of controls instead of a clip that starts by
  // itself — and `controls` has to be decided before the observer runs.
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const element = video.current;
    if (!element || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // A refusal is not worth surfacing: the poster stays up and the
        // guest loses nothing they knew they were owed.
        if (entry.isIntersecting) void element.play().catch(() => undefined);
        else element.pause();
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <video
      ref={video}
      src={aerial.src}
      poster={aerial.poster}
      preload="none"
      muted
      loop
      playsInline
      controls={reducedMotion}
      aria-label={aerial.alt}
    />
  );
}
