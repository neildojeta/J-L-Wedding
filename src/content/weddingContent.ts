/* ==================================================================
   EDIT THIS FILE — everything the guests read lives here.
   No other file needs to change to update names, dates or wording.
   Values marked  // TODO  are placeholders.
   ================================================================== */

export const wedding = {
  /* ---- The couple -------------------------------------------- */
  // Ordered to match the J & L wax seal on the envelope.
  // TODO: add the surnames — they appear in the photo's alt text.
  partnerOne: { first: "Jonmarck", full: "Jonmarck [Surname]" },
  partnerTwo: { first: "Linneth", full: "Linneth [Surname]" },
  monogram: "J & L",
  hashtag: "#OnYourMarckGetSetLinn", // TODO: change if you have your own

  /* ---- Date & time ------------------------------------------- */
  // ISO 8601 with timezone offset. +08:00 = Philippine time.
  // The countdown reads this value.
  date: "2026-10-17T14:00:00+08:00",
  dayLabel: "17 October 2026",
  dateLabel: "Saturday",
  timeLabel: "3:00 in the afternoon",

  /* ---- Landing / envelope screen ------------------------------ */
  // The date is deliberately not shown here — the envelope keeps it
  // sealed, and the invitation gives it in full once opened.
  intro: {
    eyebrow: "Together with our families",
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
      "We are beyond joy and excitement to share this special day with you. Count with us ‘till the most awaited day arrives!",
  },

  /* ---- The day's schedule ------------------------------------- */
  // One card per part of the day. EventDetails lays a lone card out on its
  // own rather than stranding it in half a row, so adding a second entry
  // back (a reception, say) needs no change there.
  events: [
    {
      name: "Ceremony",
      time: "3:00 PM",
      venue: "Viridis Countryside Garden",
      address: "A. Mabini St, Amadeo, 4119 Cavite",
      // note: "Kindly be seated by 2:30 PM.",
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
    title: "Formal Attire",
    // ladies: "Elegant long dress in the palette below.",
    // gentlemen: "Barong Tagalog, paired with chocolate brown slacks.",
    note: "Please be guided accordingly.",
  },

  /* ---- The couple's story -------------------------------------- */
  // The poem is artwork now: a torn-paper collage set in typewriter, drawn
  // by the couple and exported from assets-source/story.png. The lines below
  // are a transcription of exactly what the picture says — they are what a
  // screen reader reads out and what a search engine indexes, since neither
  // can see the picture. Redraw the picture and these have to follow it.
  story: {
    script: "How it all began",
    title: "Our Story",
    image: "/theme/story.webp",
    poem: [
      [
        "On one Sunday night",
        "With the hymns of music around and hearts ablazed",
        "Amidst the roaring crowd and blinding lights",
        "There he saw the lady donned in white as he heard the chiming of bells",
      ],
      [
        "Taking ahold of time, as precious as gold",
        "When the moon is so high and the stars are shining bright",
        "A message from him, she received out of the blue",
        "He said his name, and she said hers back",
      ],
      [
        "It was unexpected and surely surprising",
        "And yet, by God’s divine power, they both knew it was fate all along",
        "Two different persons, two different paths",
        "Two different generations and two different hearts",
      ],
      [
        "Yet with God in the center, and His hand joining theirs",
        "Two worlds became one universe",
        "Two heartbeats became one rhythm",
        "A love story written by God, for both Jonmarck and Linneth",
      ],
    ],
    // Not in the picture — this is the line the page adds after it.
    coda:
      // "More marvelous and adventurous tales will come along, as they now awaits their blessed union.",
      "",
    // The plain account, after the verse. An array because it is six
    // paragraphs now, and Highlights sets each one as its own: run together
    // as a single string they would print as one centred slab, and centred
    // text that long is where the eye loses the start of each line.
    prose: [
      "For months, Jonmarck and Linneth existed in the same orbit, passing each other in every joint fellowships and youth events, sharing the same spaces. To Linneth, those were all ordinary days and activities. But to Jonmarck, the world had fundamentally shifted the exact moment he first saw her.",
      "It wasn’t a sudden, loud realization, but rather a quiet, undeniable certainty that settled deep within him, a clear, resonant truth: she was the one he had been waiting for. Taking a leap of faith, he made the first move and sent her a message.",
      "At first, they were nothing more than strangers sharing the same space. But from that single spark, the rest of their beautiful story began to unfold.",
      "Years passed in a beautiful rhythm of patience, growth, and unconditional support. They walked through seasons of waiting, anchored by their faith and a shared vision for the future. Every prayer whispered in silence seemed to lead them to this very moment.",
      "Now, the waiting is over. The melody that began with a quiet glance and a single message has swelled into a masterpiece.",
      "Hand in hand, with grateful hearts, Jonmarck and Linneth stand in faith, ready to unfold the most beautiful chapter of their lives.",
    ],
    // The photographs now sit under the story rather than carrying the
    // section on their own, so they get a heading of their own.
    galleryTitle: "Highlights",
  },

  /* ---- Gifts ---------------------------------------------------- */
  // Kept deliberately small on the page — see the note in GiftNote. The
  // copy leads with presence and closes on it, and the ask sits in the
  // middle where it belongs.
  gifts: {
    script: "A note on gifts",
    message:
      "Your love, support, and presence on our big day mean the world to us, but if you wish to bless us with a gift to help us start our new journey, a gift of cash as contribution toward our future together would be wonderful.",
    closing:
      "More than anything, we just want to celebrate this unforgettable day with you!",
  },

  /* ---- RSVP ---------------------------------------------------- */
  rsvp: {
    // TODO: confirm. Set to about two and a half weeks before the day.
    deadlineLabel: "September 30, 2026",
    intro:
      "Let us know if you can make it! We have seats saved just for you.",
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
      // { label: "[Coordinator name]", value: "[+63 900 000 0000]" }, // TODO
      { label: "", value: "" }, // TODO
    ],
  },

  /* ---- Bundled theme artwork (files in /public/theme) ---------- */
  assets: {
    // Transparent WebM: composites straight onto the paper background.
    envelopeVideo: "/theme/envelope_spin_transparent.webm",
    // Safari plays WebM but ignores its alpha channel, so it gets the
    // cream-background cut instead — the page is the same cream anyway.
    envelopeVideoFallback: "/theme/envelope_spin_cream.mp4",
    // Starts when a guest opens the letter, and loops from there. It is
    // only ever fetched once that happens — see the note on <audio> in App.
    themeSong: "/theme/themesong.mp3",
    mainPicture: "/theme/main_picture.webp",
    // The JL crest, standing over a section heading. Keyed off the white it
    // was drawn on. Two cuts, because one cannot serve both grounds: the
    // artwork's own deep gold is drawn for paper, and composited onto the
    // maroon it lands at about (126,69,4) against a (63,10,10) panel —
    // present, but barely. The panel cut is repainted champagne and its
    // filigree lifted out of half-opacity.
    monogramMark: {
      onPaper: "/theme/monogram.webp",
      onPanel: "/theme/monogram-light.webp",
    },
    // Gold rose artwork. The order is fixed — decor/FloralAccents names
    // each one by shape, and the components pick by shape, not by number.
    goldRoses: [
      "/theme/grose1.webp", // upright spray of three blooms
      "/theme/grose2.webp", // half-wreath that closes into a heart
      "/theme/grose3.webp", // tall climbing column
      "/theme/grose4.webp", // one long-stemmed rose
      "/theme/grose5.webp", // symmetrical swag, widest of the five
    ],
    // The same artwork family, but carrying deep red as well as gold. Kept
    // apart from goldRoses because they place differently: gold alone reads
    // on any ground, while these want the cream paper behind them — their
    // red would sink into the maroon panels.
    redGoldRoses: [
      "/theme/grose6.webp", // upright bouquet, red blooms over a gold rose
      "/theme/grose7.webp", // wide cluster, mostly gold leaf — the one that
      //                       still reads on a dark panel
      "/theme/grose8.webp", // tall cascade of red roses on gold stems
    ],
    // Two red roses with a crescent of petals trailing off them, used on
    // the envelope screen's corners. Two orientations because the two
    // corners need the petals running along a different edge:
    redRoseCrescent: {
      // petals arc along the top edge — top-left corner
      top: "/theme/grose-corner-top.webp",
      // petals arc down the side — bottom-right corner
      side: "/theme/grose-corner-side.webp",
    },
    // The drone shot that closes the story: a slow descent over the garden
    // with the couple, hand in hand, two small figures on the lawn. Their
    // smallness is the shot, so it is drawn wider than anything else in
    // that section.
    //
    // The original is 4K60 HEVC 10-bit at 180 MB — unplayable in Chrome and
    // unloadable on mobile data. What ships is 1600x900 H.264 at 4 MB, made
    // with (one line, from assets-source/):
    //   ffmpeg -i video-1.MP4 -map 0:v:0 -vf "scale=1600:-2,fps=30"
    //     -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 28 -preset medium
    //     -movflags +faststart -an public/theme/aerial.mp4
    // -map 0:v:0 matters: the file also carries two DJI data streams and a
    // stray thumbnail, and without it they ride along into the output.
    aerial: {
      src: "/theme/aerial.mp4",
      poster: "/theme/aerial-poster.webp",
      alt: "Looking straight down on the garden lawn from above, with Jonmarck and Linneth standing hand in hand at its centre",
    },
    // The attire cards, in place of the swatch list that used to stand
    // here: each carries its palette, silhouettes and rules as one piece of
    // artwork. Uploading dress_code media through Supabase takes over from
    // these rather than adding to them — see the note in DressCode.
    // `heading` is the line printed above each card on the page; `caption`
    // is the alt text and the lightbox label. The headings are matched to
    // the cards by position, so an uploaded card takes the heading of the
    // one it stands in for — keep this list in the order they appear.
    attireCards: [
      {
        heading: "For Ninong and Ninang",
        src: "/theme/attire-sponsors.webp",
        caption:
          "The dress code for principal sponsors: barong and Filipiniana, champagne gold to taupe",
      },
      {
        heading: "For Bridesmaid and Groomsmen",
        src: "/theme/attire-bmaid-gmen.webp",
        caption:
          "The dress code for the wedding party. Bridesmaids: bold, vibrant, fiery — three shades of deep crimson and wine. Groomsmen: ordinary Barong Tagalog with chocolate brown slacks or pants.",
      },
      {
        heading: "For Guests",
        src: "/theme/attire-guests.webp",
        caption:
          "The dress code for guests. Men and women in formal dress and attire, in terracotta and warm clay shades. This is a formal event — strictly no casual wear such as T-shirts, shorts, miniskirts or jeans.",
      },
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
