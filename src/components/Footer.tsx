import { wedding } from "../content/weddingContent";
import { FloralDivider } from "./decor/FloralAccents";

export function Footer() {
  return (
    <footer className="relative overflow-hidden px-5 pb-16 pt-16 text-center sm:pb-20 sm:pt-20">
      <div className="relative mx-auto max-w-2xl">
        <FloralDivider />

        <p className="mt-10 font-script text-[clamp(2.2rem,12vw,3.25rem)] text-maroon-900 sm:text-6xl">
          {wedding.partnerOne.first} <span className="foil">&amp;</span>{" "}
          {wedding.partnerTwo.first}
        </p>
        {/* <p className="mt-4 font-display text-base uppercase tracking-[0.26em] text-maroon-900/90 sm:text-lg">
          {wedding.dateLabel}
        </p> */}
        <p className="mt-7 text-lg italic text-ink/90 sm:text-xl">
          {wedding.footer.closing}
        </p>

        {wedding.footer.contacts.length > 0 && (
          <div className="mt-9 border-t border-gold-deep/40 pt-7">
            {/* <p className="font-display text-base uppercase tracking-[0.2em] text-maroon-900">
              For questions, please reach
            </p> */}
            <ul className="mt-3 space-y-1 text-lg text-ink/90">
              {wedding.footer.contacts.map((contact) => (
                <li key={contact.label}>
                  {contact.label} &middot; {contact.value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* One unbreakable word in a script face, inside a sheet that clips
            its overflow to keep the torn edge — at a fixed 4xl the tail ran
            off both sides of a phone. Scaled off the viewport instead, and
            given room below for Great Vibes' descenders. */}
        <p className="foil mt-10 whitespace-nowrap font-script text-[clamp(1.4rem,7vw,2.25rem)] leading-[1.45]">
          {wedding.hashtag}
        </p>
      </div>
    </footer>
  );
}
