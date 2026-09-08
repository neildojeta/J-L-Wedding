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
  /** "dark" = drawn on the cream paper, "light" = on the red panels. */
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  const titleColor = light ? "text-cream" : "text-maroon-900";
  const introColor = light ? "text-cream/90" : "text-ink/90";
  // Gold leaf on the red panels; the darker gold gradient on cream, where
  // bright gold would drop to about 2:1 against the paper.
  const scriptColor = light ? "foil-light" : "foil";

  return (
    <motion.header
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mx-auto max-w-2xl text-center"
    >
      {script && (
        <p className={`font-script text-4xl sm:text-5xl ${scriptColor}`}>{script}</p>
      )}
      <h2
        className={`brush-underline mt-2 font-display text-3xl uppercase tracking-[0.2em] sm:text-4xl ${titleColor}`}
      >
        {title}
      </h2>
      <Ornament tone={tone} className="mx-auto mt-8 opacity-90" />
      {intro && (
        <p className={`mt-6 text-lg leading-relaxed sm:text-xl ${introColor}`}>{intro}</p>
      )}
    </motion.header>
  );
}
