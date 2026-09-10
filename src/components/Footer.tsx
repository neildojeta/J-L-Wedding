import { wedding } from "../content/weddingContent";
import { FloralDivider, PETALS_DRIFT } from "./decor/FloralAccents";

export function Footer() {
  // The deep bottom padding is load-bearing: the petals below settle against
  // the foot of the sheet, and without it the hashtag sits on top of them.
  return (
    <footer className="relative overflow-hidden px-5 pb-40 pt-16 text-center sm:pb-48 sm:pt-20">
      {/* The last of the petals, come to rest at the foot of the page.
          Held at its drawn size and centred rather than stretched — this
          piece is a dense clump, and widening it enlarges every petal. */}
      <img
        src={PETALS_DRIFT}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto w-full max-w-lg select-none opacity-35"
      />

      <div className="relative mx-auto max-w-2xl">
        <FloralDivider />

        <p className="mt-10 font-script text-[clamp(2.2rem,12vw,3.25rem)] text-maroon-900 sm:text-6xl">
          {wedding.partnerOne.first} <span className="foil">&amp;</span>{" "}
          {wedding.partnerTwo.first}
        </p>
        <p className="mt-4 font-display text-base uppercase tracking-[0.26em] text-maroon-900/90 sm:text-lg">
          {wedding.dateLabel}
        </p>
        <p className="mt-7 text-lg italic text-ink/90 sm:text-xl">
          {wedding.footer.closing}
        </p>

        {wedding.footer.contacts.length > 0 && (
          <div className="mt-9 border-t border-gold-deep/40 pt-7">
            <p className="font-display text-base uppercase tracking-[0.2em] text-maroon-900">
              For questions, please reach
            </p>
            <ul className="mt-3 space-y-1 text-lg text-ink/90">
              {wedding.footer.contacts.map((contact) => (
                <li key={contact.label}>
                  {contact.label} &middot; {contact.value}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="foil mt-10 font-script text-4xl">{wedding.hashtag}</p>
      </div>
    </footer>
  );
}
