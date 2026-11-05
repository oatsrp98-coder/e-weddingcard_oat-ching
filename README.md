# Oat & Ching — Wedding invitation

A static, responsive wedding invitation with a laurel-green envelope, opening animation, and a portrait two-sided 5:7 card. Click the envelope to open, click the card or the flip button to turn it over, and use the enlarge button to read the full-resolution invitation.

The two supplied 1462 × 2048 JPEGs are copied byte-for-byte into `assets/card-front.jpg` and `assets/card-back.jpg`. CSS `object-fit: contain` preserves the complete original artwork without cropping, retouching, or re-encoding. Their near-5:7 ratio is fitted within an exact 5:7 card. The interface scales for screens; 5 × 7 inches describes the card proportions, not guaranteed physical display size. At 5 × 7 inches, source resolution is approximately 292 ppi.

`assets/envelope-web.jpg` is a high-quality web copy of the approved envelope design. The original card JPEGs remain untouched. The closed envelope shows that image; layered paper surfaces animate the flap and card. The site supports keyboard controls, reduced motion, native dialog focus handling, and full-resolution image viewing. There are no third-party scripts, analytics, or runtime dependencies. LilyUPC is the first-choice font for all live text; Sarabun is loaded from Google Fonts as a fallback.

## Preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` in this folder and open `http://127.0.0.1:4173`.

## Deploy on Vercel

Import this repository, select the **Other** framework preset, leave the build command empty, and use `.` as the output directory. `vercel.json` contains the matching static configuration. A connected GitHub project can deploy subsequent commits automatically.

## Files

- `index.html`: structure, Thai labels, invitation metadata
- `styles.css`: envelope layers, responsive layout, animation and 3D card
- `app.js`: opening sequence, card flip, image viewer, replay
- `assets/`: original two card images and approved envelope

Use the original image links in the enlarged viewer to access the source JPEGs without any resampling.

## Photo gallery

Five supplied wedding photos appear below the invitation in a responsive gallery. Their original JPEG bytes and complete compositions are retained. Tap a photo to open a separate full-screen viewer; use previous/next, left/right keys, or a horizontal swipe to browse all five. Escape or Close returns focus to the selected photo. Original-image links remain available, and the gallery links also work without JavaScript. Photos load lazily so the envelope opens first.

## Gift details (add later)

Edit `gift-details.js` to set `qrImage`, `bankName`, `accountNumber`, and `accountName`. Save the supplied QR image under `assets/` and use its relative path. Leave fields empty until real details are available. The public page displays pending messages and a gift icon (not a scannable sample QR). This is a display section for guests, not a form that collects their bank details. Real values render as text, and a missing QR image falls back to the pending panel.

## Typography

All live page text, including headings, names, dates, gift details, buttons, and image-viewer controls, uses the shared `--font-body` family: `"LilyUPC", "Lily UPC", "Sarabun", "Thonburi", "Tahoma", sans-serif`. Display text uses the same family.

LilyUPC currently uses the font installed on the visitor's device. No LilyUPC font binary is hosted: a licensed webfont kit has not been supplied. Devices without LilyUPC display Sarabun or a local Thai fallback. To enable consistent LilyUPC rendering on all devices, add an appropriately licensed webfont kit and its supplied `@font-face` declaration; do not copy desktop font files into the public repository. See [Microsoft's font FAQ](https://learn.microsoft.com/en-us/typography/fonts/font-faq) and the [Lily UPC webfont license](https://www.myfonts.com/collections/lily-upc-font-microsoft-corporation/).

Date and venue are displayed in Thai. Text baked into the original invitation JPEGs stays part of the original artwork and is not affected by CSS fonts.
