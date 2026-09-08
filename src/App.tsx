import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { IntroGate } from "./components/IntroGate";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { EventDetails } from "./components/EventDetails";
import { Venue } from "./components/Venue";
import { DressCode } from "./components/DressCode";
import { Highlights } from "./components/Highlights";
import { RsvpForm } from "./components/RsvpForm";
import { Footer } from "./components/Footer";

/** `?open=1` jumps straight to the invitation, skipping the envelope. */
function shouldSkipIntro() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("open");
}

export default function App() {
  const [opened, setOpened] = useState(shouldSkipIntro);

  // The page must not scroll behind the envelope screen.
  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {!opened && <IntroGate key="intro" onOpen={() => setOpened(true)} />}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: opened ? 0.25 : 0 }}
        aria-hidden={!opened}
        // visibility keeps the hidden page out of the tab order while the
        // envelope is still on screen; opacity still handles the fade.
        style={{ visibility: opened ? "visible" : "hidden" }}
      >
        <Navbar />
        <Hero />
        <EventDetails />
        <Venue />
        <DressCode />
        <Highlights />
        <RsvpForm />
        <Footer />
      </motion.main>
    </MotionConfig>
  );
}
