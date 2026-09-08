import { wedding } from "../content/weddingContent";
import { FloralDivider } from "./decor/FloralAccents";

export function Footer() {
  return (
    <footer className="paper canvas-grain relative overflow-hidden px-5 py-16 text-center sm:py-20">
      <div className="relative mx-auto max-w-2xl">
        <FloralDivider className="opacity-90" />

        <p className="mt-10 font-script text-5xl text-maroon sm:text-6xl">
          {wedding.bride.first} &amp; {wedding.groom.first}
        </p>
        <p className="mt-4 font-display text-xs uppercase tracking-[0.3em] text-ink/70">
          {wedding.dateLabel}
        </p>
        <p className="mt-7 text-lg italic text-ink/80">{wedding.footer.closing}</p>

        {wedding.footer.contacts.length > 0 && (
          <div className="mt-9 border-t border-gold/35 pt-7">
            <p className="font-display text-[0.66rem] uppercase tracking-[0.26em] text-maroon/75">
              For questions, please reach
            </p>
            <ul className="mt-3 space-y-1 text-ink/75">
              {wedding.footer.contacts.map((contact) => (
                <li key={contact.label}>
                  {contact.label} &middot; {contact.value}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-10 font-script text-3xl text-gold">{wedding.hashtag}</p>
      </div>
    </footer>
  );
}
