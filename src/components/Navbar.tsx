import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { wedding } from "../content/weddingContent";

const links = [
  { href: "#invitation", label: "Invitation" },
  { href: "#details", label: "Details" },
  { href: "#venue", label: "Venue" },
  { href: "#dress-code", label: "Attire" },
  { href: "#highlights", label: "Highlights" },
  { href: "#rsvp", label: "RSVP" },
];

export function Navbar() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className={`sticky top-0 z-40 border-b transition-colors duration-500 ${
        solid
          ? "border-gold/30 bg-cream/92 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Hidden on phones so all six links, RSVP included, stay reachable. */}
        <a
          href="#invitation"
          className="hidden shrink-0 font-script text-2xl text-maroon sm:block sm:text-3xl"
        >
          {wedding.monogram}
        </a>

        <ul className="flex w-full items-center justify-between gap-0.5 overflow-x-auto [scrollbar-width:none] sm:w-auto sm:justify-end sm:gap-2 [&::-webkit-scrollbar]:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="whitespace-nowrap px-1 py-2 font-display text-[0.55rem] uppercase tracking-[0.12em] text-ink/70 transition-colors hover:text-maroon sm:px-3 sm:text-[0.72rem] sm:tracking-[0.2em]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
}
