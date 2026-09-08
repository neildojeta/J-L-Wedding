import { SectionHeading } from "./SectionHeading";
import { MediaGrid } from "./MediaGrid";
import { FloralCorner, ROSE_1 } from "./decor/FloralAccents";
import { wedding } from "../content/weddingContent";

export function Highlights() {
  return (
    <section
      id="highlights"
      className="paper canvas-grain relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
    >
      <FloralCorner corner="tr" src={ROSE_1} opacity="opacity-45" className="hidden sm:block" />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          script="Our story so far"
          title="Highlights"
          intro={`A few of our favourite moments on the way to ${wedding.dateLabel}.`}
        />

        <div className="mt-14">
          <MediaGrid
            category="highlight"
            columns="three"
            emptyLabel="Our favourite photos and videos are on their way."
          />
        </div>
      </div>
    </section>
  );
}
