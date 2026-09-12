import { SectionHeading } from "./SectionHeading";
import { MediaCarousel } from "./MediaCarousel";
import { FloralCorner, ROSE_STEM } from "./decor/FloralAccents";
import { wedding } from "../content/weddingContent";

export function Highlights() {
  return (
    <section
      id="highlights"
      className="relative scroll-mt-24 overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
    >
      <FloralCorner
        corner="tr"
        src={ROSE_STEM}
        size="w-28 sm:w-36"
        opacity="opacity-55"
        className="hidden sm:block"
      />
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          script="Our story so far"
          title="Highlights"
          intro={`A few of our favourite moments on the way to ${wedding.dateLabel}.`}
        />

        {/* The carousel's arrows sit outside the track, so this keeps a
            little room for them at the wide sizes. */}
        <div className="mt-14 sm:px-6 lg:px-8">
          <MediaCarousel
            category="highlight"
            label="Highlights"
            bundled={wedding.assets.highlights}
            emptyLabel="Our favourite photos and videos are on their way."
          />
        </div>
      </div>
    </section>
  );
}
