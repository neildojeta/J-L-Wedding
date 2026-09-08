import { motion } from "framer-motion";
import { Ornament } from "./decor/FloralAccents";

export function SectionHeading({
  script,
  title,
  intro,
  tone = "dark",
}: {
  script?: string;
  title: string;
  intro?: string;
  tone?: "dark" | "light";
}) {
  const titleColor = tone === "light" ? "text-cream" : "text-maroon-900";
  const introColor = tone === "light" ? "text-cream/80" : "text-ink/75";
  const scriptColor = tone === "light" ? "text-gold-soft" : "text-gold";

  return (
    <motion.header
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mx-auto max-w-2xl text-center"
    >
      {script && (
        <p className={`font-script text-3xl sm:text-4xl ${scriptColor}`}>{script}</p>
      )}
      <h2
        className={`brush-underline mt-1 font-display text-3xl uppercase tracking-[0.22em] sm:text-4xl ${titleColor}`}
      >
        {title}
      </h2>
      <Ornament className="mx-auto mt-7 opacity-80" />
      {intro && (
        <p className={`mt-5 text-lg leading-relaxed ${introColor}`}>{intro}</p>
      )}
    </motion.header>
  );
}
