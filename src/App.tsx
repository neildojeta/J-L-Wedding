import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { wedding } from "./content/weddingContent";
import { IntroGate } from "./components/IntroGate";
import { MusicToggle } from "./components/MusicToggle";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { EventDetails } from "./components/EventDetails";
import { Venue } from "./components/Venue";
import { DressCode } from "./components/DressCode";
import { Highlights } from "./components/Highlights";
import { GiftNote } from "./components/GiftNote";
import { RsvpForm } from "./components/RsvpForm";
import { Footer } from "./components/Footer";
import { Dashboard } from "./components/Dashboard";

/** `?open=1` jumps straight to the invitation, skipping the envelope. */
function shouldSkipIntro() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("open");
}

/**
 * The couple's dashboard lives at /dashboard. This is the whole router: one
 * path, checked once, so the site keeps its single dependency-free page.
 * Render already rewrites every unknown path to index.html (see
 * render.yaml), which is what lets a static host serve this at all.
 *
 * Being able to reach the page is not the same as being able to see the
 * replies — the database refuses those to everyone except the addresses in
 * the admins table. See supabase/dashboard.sql.
 */
function isDashboardRoute() {
  if (typeof window === "undefined") return false;
  return window.location.pathname.replace(/\/+$/, "") === "/dashboard";
}

export default function App() {
  const [opened, setOpened] = useState(shouldSkipIntro);
  const dashboard = isDashboardRoute();
  const themeSong = useRef<HTMLAudioElement>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  /**
   * Started from the Open-the-Letter click itself rather than from an effect
   * watching `opened`: iOS only honours play() while the click that asked
   * for it is still on the stack, and by the time the state lands it is not.
   * A refusal is not worth surfacing — the guest still has the toggle.
   */
  function startThemeSong() {
    const audio = themeSong.current;
    if (!audio) return;
    audio.volume = 0.5;
    void audio.play().catch(() => undefined);
  }

  function toggleThemeSong() {
    const audio = themeSong.current;
    if (!audio) return;
    if (audio.paused) void audio.play().catch(() => undefined);
    else audio.pause();
  }

  // The page must not scroll behind the envelope screen. The dashboard is
  // exempt: it never shows the envelope, so `opened` stays false there and
  // this would otherwise lock its scrolling for good.
  useEffect(() => {
    document.body.style.overflow = opened || dashboard ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened, dashboard]);

  if (dashboard) {
    return (
      <MotionConfig reducedMotion="user">
        <Dashboard />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {!opened && (
          <IntroGate
            key="intro"
            onOpen={() => setOpened(true)}
            onOpenStart={startThemeSong}
          />
        )}
      </AnimatePresence>

      {/* The song outlives the envelope, so it is mounted here rather than
          inside IntroGate — which unmounts the moment the letter opens,
          taking any audio element of its own with it.

          preload="none" is load-bearing: the file is about 6 MB, and every
          guest who never opens the letter would otherwise pay for it. The
          play() call below starts the fetch. State follows the element's own
          events rather than the calls, so the toggle still tells the truth
          if a browser refuses to start or stops playback itself. */}
      <audio
        ref={themeSong}
        src={wedding.assets.themeSong}
        loop
        preload="none"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
      />
      {opened && <MusicToggle playing={musicPlaying} onToggle={toggleThemeSong} />}

      {/* Everything the envelope contained is one sheet of paper lying on a
          dark desk. Note what must NOT move: the navbar stays outside the
          sheet, because the sheet is clipped with overflow-hidden to hold
          its torn edge, and `position: sticky` does not survive a clipping
          ancestor. */}
      <motion.main
        className="letter-desk relative min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: opened ? 0.25 : 0 }}
        aria-hidden={!opened}
        // visibility keeps the hidden page out of the tab order while the
        // envelope is still on screen; opacity still handles the fade.
        style={{ visibility: opened ? "visible" : "hidden" }}
      >
        <Navbar />

        <div className="relative px-3 pb-8 pt-2 sm:px-6 sm:pb-14 sm:pt-4">
          {/* canvas-grain is deliberately gone: the sheet now carries a
              photographed paper texture, and the procedural noise on top of
              it only muddied the fibre. */}
          <div className="letter-sheet paper relative mx-auto max-w-5xl overflow-hidden">
            <Hero />
            <EventDetails />
            <Venue />
            <DressCode />
            <Highlights />
            <GiftNote />
            <RsvpForm />
            <Footer />
          </div>
        </div>
      </motion.main>
    </MotionConfig>
  );
}
