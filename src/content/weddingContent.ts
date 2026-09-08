/* ==================================================================
   EDIT THIS FILE — everything the guests read lives here.
   No other file needs to change to update names, dates or wording.
   Values marked  // TODO  are placeholders.
   ================================================================== */

export const wedding = {
  /* ---- The couple -------------------------------------------- */
  // TODO: replace with the full names.
  bride: { first: "Jane", full: "Jane [Surname]" },
  groom: { first: "Liam", full: "Liam [Surname]" },
  monogram: "J & L",
  hashtag: "#JandLForever", // TODO

  /* ---- Date & time ------------------------------------------- */
  // ISO 8601 with timezone offset. +08:00 = Philippine time.
  // TODO: set the real date — the countdown reads this value.
  date: "2027-02-14T14:00:00+08:00",
  dateLabel: "February 14, 2027", // TODO
  dayLabel: "Sunday",
  timeLabel: "2:00 in the afternoon",

  /* ---- Landing / envelope screen ------------------------------ */
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
  events: [
    {
      name: "Ceremony",
      time: "2:00 PM",
      venue: "[Church / Ceremony Venue]", // TODO
      address: "[Street, City, Province]", // TODO
      note: "Kindly be seated by 1:30 PM.",
    },
    {
      name: "Reception",
      time: "5:00 PM",
      venue: "[Reception Venue]", // TODO
      address: "[Street, City, Province]", // TODO
      note: "Dinner, toasts and dancing to follow.",
    },
  ],

  /* ---- Venue section ------------------------------------------ */
  venue: {
    name: "[Venue Name]", // TODO
    address: "[Full address, City, Province]", // TODO
    description:
      "A short note about the venue — how to get there, where to park, or anything your guests should know before the day.", // TODO
    // TODO: paste the Google Maps share link for the venue.
    mapsUrl: "https://www.google.com/maps",
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
    deadlineLabel: "January 15, 2027", // TODO
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
    envelopeVideo: "/theme/envelope_spin_cream.mp4",
    mainPicture: "/theme/main_picture.webp",
    roses: ["/theme/rose1.webp", "/theme/rose2.webp", "/theme/rose3.webp"],
  },
} as const;

export type Wedding = typeof wedding;
