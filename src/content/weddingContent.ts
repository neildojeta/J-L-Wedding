/* ==================================================================
   EDIT THIS FILE — everything the guests read lives here.
   No other file needs to change to update names, dates or wording.
   Values marked  // TODO  are placeholders.
   ================================================================== */

export const wedding = {
  /* ---- The couple -------------------------------------------- */
  // Ordered to match the J & L wax seal on the envelope.
  // TODO: add the surnames — they appear in the photo's alt text.
  partnerOne: { first: "Jonmark", full: "Jonmark [Surname]" },
  partnerTwo: { first: "Linneth", full: "Linneth [Surname]" },
  monogram: "J & L",
  hashtag: "#JonmarkAndLinneth2026", // TODO: change if you have your own

  /* ---- Date & time ------------------------------------------- */
  // ISO 8601 with timezone offset. +08:00 = Philippine time.
  // The countdown reads this value.
  date: "2026-10-17T14:00:00+08:00",
  dateLabel: "October 17, 2026",
  dayLabel: "Saturday",
  timeLabel: "2:00 in the afternoon",

  /* ---- Landing / envelope screen ------------------------------ */
  // The date is deliberately not shown here — the envelope keeps it
  // sealed, and the invitation gives it in full once opened.
  intro: {
    eyebrow: "Together with their families",
    title: "You Are Invited",
    subtitle: "to the wedding celebration of",
    cta: "Open the Letter",
  },

  /* ---- Invitation opening words ------------------------------- */
  invitation: {
    quote:
      "And now these three remain: faith, hope and love. But the greatest of these is love.",
    quoteSource: "1 Corinthians 13:13",
    message:
      "With hearts full of joy, and together with our families, we invite you to share in the celebration of our marriage. Your presence is the greatest gift we could ask for.",
  },

  /* ---- The day's schedule ------------------------------------- */
  // Both halves of the day are at Viridis. If the reception moves
  // elsewhere, change the venue and address on the second card.
  events: [
    {
      name: "Ceremony",
      time: "2:00 PM",
      venue: "Viridis Countryside Garden",
      address: "A. Mabini St, Amadeo, 4119 Cavite",
      note: "Kindly be seated by 1:30 PM.",
    },
    {
      name: "Reception",
      time: "5:00 PM",
      venue: "Viridis Countryside Garden",
      address: "A. Mabini St, Amadeo, 4119 Cavite",
      note: "Dinner, toasts and dancing to follow.",
    },
  ],

  /* ---- Venue section ------------------------------------------ */
  venue: {
    name: "Viridis Countryside Garden",
    address: "A. Mabini St, Amadeo, 4119 Cavite",
    coordinates: "14.186488, 120.915425",
    description:
      "An open-air garden in the Cavite countryside. The ceremony is held on the lawn, so flats or block heels will carry you further than stilettos.",
    // Drops a pin on the coordinates above.
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=14.186488%2C120.915425",
    // Opens turn-by-turn directions from wherever the guest is.
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=14.186488%2C120.915425",
    // The embedded map on the page. `output=embed` needs no API key.
    // Zoom 17 is deliberate: it is the level at which Google draws its own
    // "Viridis Countryside Garden" label, so the venue names itself at the
    // centre of the map. Zoom out and the label disappears.
    embedUrl:
      "https://maps.google.com/maps?q=14.186488,120.915425&ll=14.186488,120.915425&z=17&hl=en&iwloc=A&output=embed",
    photo: {
      src: "/theme/venue.webp",
      alt: "The Viridis Countryside Garden entrance sign, set among the planting",
    },
  },

  /* ---- Dress code --------------------------------------------- */
  dressCode: {
    title: "Formal / Semi-Formal",
    ladies: "Long dress or elegant cocktail dress in the palette below.",
    gentlemen: "Barong Tagalog or suit, paired with dark slacks.",
    note: "We kindly ask our guests to avoid wearing white, ivory or cream.",
    // The wedding palette, shown to guests as colour guidance.
    palette: [
      { name: "Deep Maroon", hex: "#7A1010" },
      { name: "Burgundy", hex: "#5C0D0D" },
      { name: "Cream", hex: "#FBF0DC" },
      { name: "Antique Gold", hex: "#C9A05B" },
      { name: "Champagne", hex: "#E3CDA8" },
    ],
  },

  /* ---- RSVP ---------------------------------------------------- */
  rsvp: {
    // TODO: confirm. Set to about two and a half weeks before the day.
    deadlineLabel: "September 30, 2026",
    intro:
      "Kindly let us know if you can join us. We have reserved seats for the names on your invitation.",
    // Guests cannot request more seats than this.
    maxPartySize: 6,
    thankYouTitle: "Thank you!",
    thankYouAttending:
      "We can't wait to celebrate with you. See you on the day!",
    thankYouDeclined:
      "We'll miss you dearly — thank you for letting us know. You'll be in our hearts that day.",
  },

  /* ---- Footer -------------------------------------------------- */
  footer: {
    closing: "We look forward to celebrating with you.",
    contacts: [
      { label: "[Coordinator name]", value: "[+63 900 000 0000]" }, // TODO
    ],
  },

  /* ---- Bundled theme artwork (files in /public/theme) ---------- */
  assets: {
    // Transparent WebM: composites straight onto the paper background.
    envelopeVideo: "/theme/envelope_spin_transparent.webm",
    // Safari plays WebM but ignores its alpha channel, so it gets the
    // cream-background cut instead — the page is the same cream anyway.
    envelopeVideoFallback: "/theme/envelope_spin_cream.mp4",
    mainPicture: "/theme/main_picture.webp",
    // Gold rose artwork. The order is fixed — decor/FloralAccents names
    // each one by shape, and the components pick by shape, not by number.
    goldRoses: [
      "/theme/grose1.webp", // upright spray of three blooms
      "/theme/grose2.webp", // half-wreath that closes into a heart
      "/theme/grose3.webp", // tall climbing column
      "/theme/grose4.webp", // one long-stemmed rose
      "/theme/grose5.webp", // symmetrical swag, widest of the five
    ],
    // The Highlights gallery. These ship with the site and appear ahead of
    // anything later added through Supabase. The caption is used as the
    // photo's alt text too, so keep it descriptive as well as fond.
    highlights: [
      { src: "/theme/highlight1.webp", caption: "A kiss among the chrysanthemums" },
      { src: "/theme/highlight2.webp", caption: "A walk through the garden" },
      { src: "/theme/highlight3.webp", caption: "Under the lace parasol" },
      { src: "/theme/highlight4.webp", caption: "In maroon, among the cosmos" },
    ],
  },
} as const;

export type Wedding = typeof wedding;
