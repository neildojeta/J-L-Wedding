#!/usr/bin/env python3
"""Draws public/theme/share-card.png — the thumbnail chat apps show when the
invitation link is pasted.

Run by hand, not by the build: `python scripts/make-share-card.py`. It needs
Python with Pillow, which the site itself does not, so it is deliberately
kept out of `npm run build` — the card only changes when the names or the
date do. Great Vibes is fetched from Google Fonts on first run (the same
file the site already serves to every guest) and cached next to this script.

The size is fixed at 1200x630. That is the ratio Facebook, Messenger and
Viber crop to; anything squarer gets its top and bottom cut off. The
composition is centred rather than ranged left because WhatsApp and iMessage
sometimes crop the card to a square, and centred artwork survives that.
"""

import math
import os
import urllib.request

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "theme", "share-card.png")
MONOGRAM = os.path.join(ROOT, "public", "theme", "monogram-light.webp")
FONT_CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".fonts")
VIBES_URL = "https://fonts.gstatic.com/s/greatvibes/v21/RWmMoKWR9v4ksMfaWd_JN-XC.ttf"

# ---- What the card says. Keep in step with weddingContent.ts. -------------
EYEBROW = "THE WEDDING OF"
NAMES = "Jonmarck & Linneth"
DATE = "17 OCTOBER 2026"

# ---- Palette, taken from the @theme block in src/index.css ----------------
MAROON_950 = (0x3F, 0x0A, 0x0A)
MAROON = (0x7A, 0x10, 0x10)
MAROON_900 = (0x5C, 0x0D, 0x0D)
GOLD = (0xC9, 0xA0, 0x5B)
GOLD_DEEP = (0x8A, 0x65, 0x20)
GOLD_MID = (0xA8, 0x82, 0x3F)
CHAMPAGNE = (0xF2, 0xDF, 0xB6)

W, H = 1200, 630
SS = 2  # drawn at 2x and downsampled, so the filigree and the script keep
#         their edges instead of stair-stepping.


def great_vibes(size):
    """The site's script face. Cached after the first download."""
    os.makedirs(FONT_CACHE, exist_ok=True)
    path = os.path.join(FONT_CACHE, "GreatVibes.ttf")
    if not os.path.exists(path):
        urllib.request.urlretrieve(VIBES_URL, path)
    return ImageFont.truetype(path, size)


def georgia(size, bold=False):
    """Playfair Display's own declared fallback in src/index.css, so the card
    is lettered in the face the site drops to anyway when Playfair is slow."""
    name = "georgiab.ttf" if bold else "georgia.ttf"
    return ImageFont.truetype(os.path.join(r"C:\Windows\Fonts", name), size)


def radial(size, cx, cy, rx, ry, alpha, reach):
    """A soft radial falloff as an L mask, mirroring the radial-gradient()
    calls on .letter-desk. Computed small and scaled up — a gradient has no
    detail to lose, and the full-size loop would be 3M pixels of Python."""
    w, h = size
    lw, lh = max(1, w // 8), max(1, h // 8)
    mask = Image.new("L", (lw, lh), 0)
    px = mask.load()
    for j in range(lh):
        for i in range(lw):
            dx = (i + 0.5) / lw - cx
            dy = (j + 0.5) / lh - cy
            d = math.hypot(dx / rx, dy / ry) / reach
            t = 1.0 - min(1.0, d)
            px[i, j] = int(255 * alpha * t * t)
    return mask.resize((w, h), Image.BICUBIC)


def tracked(draw, text, font, tracking, fill, cx, top):
    """Letterspaced caps. Pillow has no letter-spacing, so the glyphs are set
    one at a time and the run is centred on its measured width."""
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = cx - total / 2
    for ch, w in zip(text, widths):
        draw.text((x, top), ch, font=font, fill=fill, anchor="lt")
        x += w + tracking
    return total


def main():
    w, h = W * SS, H * SS
    card = Image.new("RGB", (w, h), MAROON_950)

    # The lit ground: a glow off the top, a deeper pool at the foot.
    card.paste(Image.new("RGB", (w, h), MAROON),
               (0, 0), radial((w, h), 0.5, 0.04, 1.15, 0.60, 0.60, 1.0))
    card.paste(Image.new("RGB", (w, h), MAROON_900),
               (0, 0), radial((w, h), 0.5, 1.0, 0.90, 0.45, 0.55, 1.0))
    # Corners taken down, so the gold frame sits in the light.
    card.paste(Image.new("RGB", (w, h), (0x2A, 0x06, 0x06)),
               (0, 0), Image.eval(radial((w, h), 0.5, 0.5, 0.78, 0.78, 1.0, 1.0),
                                  lambda v: 255 - v).point(lambda v: int(v * 0.5)))

    draw = ImageDraw.Draw(card)

    # Thick-thin double rule — the border an engraved invitation carries.
    draw.rectangle([30 * SS, 30 * SS, w - 30 * SS, h - 30 * SS],
                   outline=GOLD_DEEP, width=3 * SS)
    draw.rectangle([43 * SS, 43 * SS, w - 43 * SS, h - 43 * SS],
                   outline=GOLD, width=1 * SS)

    # ---- The stack, measured then centred as one block -------------------
    crest = Image.open(MONOGRAM).convert("RGBA")
    crest_h = 236 * SS
    crest_w = round(crest.width * crest_h / crest.height)
    crest = crest.resize((crest_w, crest_h), Image.LANCZOS)

    f_eyebrow = georgia(23 * SS)
    f_names = great_vibes(104 * SS)
    f_date = georgia(27 * SS)

    eyebrow_h = f_eyebrow.getbbox(EYEBROW)[3] - f_eyebrow.getbbox(EYEBROW)[1]
    nb = f_names.getbbox(NAMES)
    names_h = nb[3] - nb[1]
    date_h = f_date.getbbox(DATE)[3] - f_date.getbbox(DATE)[1]

    gap_crest, gap_eyebrow, gap_names = 30 * SS, 20 * SS, 26 * SS
    total = (crest_h + gap_crest + eyebrow_h + gap_eyebrow
             + names_h + gap_names + date_h)
    # Nudged up off true centre: the eye reads a centred block as low.
    y = (h - total) / 2 - 10 * SS
    cx = w / 2

    card.paste(crest, (round(cx - crest_w / 2), round(y)), crest)
    y += crest_h + gap_crest

    tracked(draw, EYEBROW, f_eyebrow, 7 * SS, GOLD_MID, cx, y - f_eyebrow.getbbox(EYEBROW)[1])
    y += eyebrow_h + gap_eyebrow

    # Centred on the ink box rather than the advance width: Great Vibes hangs
    # a long swash off the final "h", and centring on the advance would push
    # the whole line visibly left of the crest above it.
    draw.text((cx - (nb[2] - nb[0]) / 2 - nb[0], y - nb[1]),
              NAMES, font=f_names, fill=CHAMPAGNE)
    y += names_h + gap_names

    tracked(draw, DATE, f_date, 6 * SS, GOLD, cx, y - f_date.getbbox(DATE)[1])

    card.resize((W, H), Image.LANCZOS).save(OUT, "PNG", optimize=True)
    print("wrote", OUT, os.path.getsize(OUT) // 1024, "KB")


if __name__ == "__main__":
    main()
