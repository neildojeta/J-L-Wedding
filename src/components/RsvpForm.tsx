import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { wedding } from "../content/weddingContent";
import {
  supabase,
  isSupabaseConfigured,
  RSVP_LIMITS,
  type RsvpSubmission,
} from "../lib/supabase";
import { SectionHeading } from "./SectionHeading";
import {
  FloralCorner,
  FloralDivider,
  ROSE_HEART,
} from "./decor/FloralAccents";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full border border-gold/55 bg-cream px-4 py-3.5 font-body text-lg text-ink placeholder:text-ink/60 transition-colors focus:border-maroon";
// The form sits on the deep maroon panel, so labels need the light tone.
const label =
  "block font-display text-base uppercase tracking-[0.16em] text-gold-soft";

export function RsvpForm() {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [partySize, setPartySize] = useState(1);
  const [messageLength, setMessageLength] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (attending === null || status === "sending") return;

    const form = new FormData(event.currentTarget);
    // `limit` is a last guard, not the main defence: maxLength on the inputs
    // already stops a guest typing or pasting past these. It covers values
    // that arrive some other way — autofill, an extension — because the
    // database rejects anything longer, and that rejection reaches the guest
    // only as a generic failure that retrying can never clear.
    const text = (key: string, limit?: number) => {
      const value = (form.get(key) as string | null)?.trim();
      if (!value) return null;
      return limit ? value.slice(0, limit) : value;
    };

    const fullName = text("full_name", RSVP_LIMITS.fullName);
    if (!fullName) {
      setErrorText("Please tell us your name.");
      setStatus("error");
      return;
    }

    const payload: RsvpSubmission = {
      full_name: fullName,
      email: text("email"),
      phone: text("phone"),
      attending,
      party_size: attending ? partySize : 0,
      guest_names: attending ? text("guest_names", RSVP_LIMITS.guestNames) : null,
      dietary_notes: attending ? text("dietary_notes", RSVP_LIMITS.dietaryNotes) : null,
      message: text("message", RSVP_LIMITS.message),
    };

    if (!supabase) {
      setErrorText(
        "The RSVP list is not connected yet. Please try again shortly, or message us directly.",
      );
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorText(null);

    const { error } = await supabase.from("rsvps").insert(payload);

    if (error) {
      setErrorText(
        "Something went wrong sending your reply. Please try again, or message us directly.",
      );
      setStatus("error");
      return;
    }

    setStatus("sent");
  }

  return (
    <section
      id="rsvp"
      className="letter-panel relative mx-4 my-2 scroll-mt-24 overflow-hidden bg-maroon-950 px-5 py-16 text-cream sm:mx-8 sm:my-4 sm:px-8 sm:py-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(85%_65%_at_50%_100%,rgba(122,16,16,0.8),transparent_72%)]"
      />
      <div className="canvas-grain absolute inset-0 opacity-40" aria-hidden="true" />

      <FloralCorner
        corner="tl"
        src={ROSE_HEART}
        size="w-32 lg:w-44"
        opacity="opacity-45"
        onDark
        className="hidden sm:block"
      />

      <div className="relative mx-auto max-w-2xl">
        <SectionHeading
          script="Will you join us?"
          title="RSVP"
          intro={wedding.rsvp.intro}
          tone="light"
        />

        <p className="mt-6 text-center font-display text-base uppercase tracking-[0.2em] text-gold-soft sm:text-lg">
          Kindly reply by {wedding.rsvp.deadlineLabel}
        </p>

        <AnimatePresence mode="wait">
          {status === "sent" ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="painted-edge mt-12 border border-gold/40 bg-cream/[0.07] px-8 py-12 text-center backdrop-blur-sm"
            >
              <p className="foil-light font-script text-6xl">
                {wedding.rsvp.thankYouTitle}
              </p>
              <p className="mx-auto mt-5 max-w-md text-xl leading-relaxed text-cream/95">
                {attending
                  ? wedding.rsvp.thankYouAttending
                  : wedding.rsvp.thankYouDeclined}
              </p>
              <FloralDivider className="mt-10" onDark />
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className="mt-12 space-y-7"
              noValidate
            >
              <div>
                <label className={label} htmlFor="full_name">
                  Full name *
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  required
                  autoComplete="name"
                  maxLength={RSVP_LIMITS.fullName}
                  className={`${field} mt-2`}
                  placeholder="As it appears on your invitation"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`${field} mt-2`}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className={label} htmlFor="phone">
                    Mobile number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className={`${field} mt-2`}
                    placeholder="+63 900 000 0000"
                  />
                </div>
              </div>

              <fieldset>
                <legend className={label}>Will you be attending? *</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[
                    { value: true, text: "Joyfully accepts" },
                    { value: false, text: "Regretfully declines" },
                  ].map((choice) => {
                    const selected = attending === choice.value;
                    return (
                      <button
                        key={String(choice.value)}
                        type="button"
                        onClick={() => setAttending(choice.value)}
                        aria-pressed={selected}
                        className={`painted-edge border px-5 py-4 font-display text-base uppercase tracking-[0.14em] transition-colors ${
                          selected
                            ? "border-gold bg-gold text-maroon-950"
                            : "border-gold/50 bg-cream/[0.08] text-cream hover:bg-cream/[0.16]"
                        }`}
                      >
                        {choice.text}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <AnimatePresence initial={false}>
                {attending && (
                  <motion.div
                    key="guest-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="space-y-7 overflow-hidden"
                  >
                    <div className="pt-1">
                      <label className={label} htmlFor="party_size">
                        Number attending (including you)
                      </label>
                      <select
                        id="party_size"
                        name="party_size"
                        value={partySize}
                        onChange={(event) => setPartySize(Number(event.target.value))}
                        className={`${field} mt-2 appearance-none`}
                      >
                        {Array.from(
                          { length: wedding.rsvp.maxPartySize },
                          (_, i) => i + 1,
                        ).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>

                    {partySize > 1 && (
                      <div>
                        <label className={label} htmlFor="guest_names">
                          Names of those joining you
                        </label>
                        <input
                          id="guest_names"
                          name="guest_names"
                          maxLength={RSVP_LIMITS.guestNames}
                          className={`${field} mt-2`}
                          placeholder="Separate names with a comma"
                        />
                      </div>
                    )}

                    <div>
                      <label className={label} htmlFor="dietary_notes">
                        Dietary restrictions or allergies
                      </label>
                      <input
                        id="dietary_notes"
                        name="dietary_notes"
                        maxLength={RSVP_LIMITS.dietaryNotes}
                        className={`${field} mt-2`}
                        placeholder="Optional"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                {/* The counter sits beside the label, not under the box. Under
                    it, it lands on the foot of the panel where the gold dust
                    is brightest, and gold-soft over that measures about
                    2.4:1 — unreadable exactly when a guest needs it. Up here
                    the ground is clean maroon, and the limit is visible while
                    they are still typing. */}
                <div className="flex items-baseline justify-between gap-4">
                  <label className={label} htmlFor="message">
                    A message for the couple
                  </label>
                  {/* Only once the limit is in sight: a counter under an empty
                      box reads as a word limit on a well-wish. */}
                  {messageLength > RSVP_LIMITS.message * 0.75 && (
                    <p
                      aria-live="polite"
                      className="shrink-0 font-body text-base text-gold-soft"
                    >
                      {RSVP_LIMITS.message - messageLength === 1
                        ? "1 character left"
                        : `${RSVP_LIMITS.message - messageLength} characters left`}
                    </p>
                  )}
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={RSVP_LIMITS.message}
                  onChange={(event) => setMessageLength(event.target.value.length)}
                  className={`${field} mt-2 resize-y`}
                  placeholder="Optional — we would love to hear from you"
                />
              </div>

              {status === "error" && errorText && (
                <p
                  role="alert"
                  className="border border-gold/60 bg-cream/12 px-4 py-3 text-center text-base text-gold-soft"
                >
                  {errorText}
                </p>
              )}

              {!isSupabaseConfigured && (
                <p className="text-center text-base italic text-cream/75">
                  Preview mode — replies are not recorded until Supabase is connected.
                </p>
              )}

              <button
                type="submit"
                disabled={attending === null || status === "sending"}
                className="painted-edge w-full border border-gold bg-gold px-8 py-4 font-display text-sm font-medium uppercase tracking-[0.26em] text-maroon-950 transition-all hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-45 sm:text-base"
              >
                {status === "sending" ? "Sending…" : "Send our reply"}
              </button>

              {attending === null && (
                <p className="text-center text-base italic text-cream/80">
                  Please choose an answer above to send your reply.
                </p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
