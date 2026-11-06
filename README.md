# Oat & Ching — Wedding invitation

A static, responsive wedding invitation with a laurel-green envelope and a portrait two-sided 5:7 card. Drag the closed envelope horizontally to view either side, or use the **พลิกซอง** button. Click the envelope or **เปิดคำเชิญ** to open it; the flap opens and the card emerges upright. Click the card or its flip button to view the other side, and enlarge it to read the original artwork.

The two supplied 1462 × 2048 JPEGs are copied byte-for-byte into `assets/card-front.jpg` and `assets/card-back.jpg`. CSS `object-fit: contain` preserves the complete original artwork without cropping, retouching, or re-encoding. Their near-5:7 ratio is fitted within an exact 5:7 card. The interface scales for screens; 5 × 7 inches describes the card proportions, not guaranteed physical display size. At 5 × 7 inches, source resolution is approximately 292 ppi.

The header opens with **ขอเรียนเชิญท่านผู้ทรงเกียรติร่วมเป็นสักขีพยานในพิธีมงคลสมรส**, followed by the first names **เบญจพร** and **ดิศดนัย**, separated by `assets/wedding-rings-white-gold.png`: white-gold rings with a larger oval solitaire referencing 1.5 ct and a smaller round solitaire referencing 0.40 ct. Their relative sizes are illustrative, not physical gemstone measurements. The date and venue appear in Thai.

`assets/envelope-web.jpg` supplies the approved sealed front. The plain reverse displays the unmodified `assets/envelope-label.png` flush with the left edge: `left: 0`, vertically centered at `top: 50%`. Its 20:7 ratio and 56.24297% envelope width represent a 10 × 3.5 cm label relative to a horizontal 7 × 5 inch envelope; the screen scales both together.

Horizontal dragging preserves vertical page scrolling and pinch zoom. Accessible flip/open buttons support keyboard activation; left/right arrows turn the focused closed envelope, and Escape cancels a drag. Reduced-motion preferences shorten the transitions. Compact screens can scroll vertically, and enlarged-image dialogs restore focus when closed. There are no third-party scripts, analytics, or runtime dependencies.

## Preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` in this folder and open `http://127.0.0.1:4173`.

## Deploy on Vercel

Import this repository, select the **Other** framework preset, leave the build command empty, and use `.` as the output directory. `vercel.json` contains the matching static configuration. A connected GitHub project can deploy subsequent commits automatically.

## Files

- `index.html`: structure, Thai labels, invitation metadata
- `styles.css`, `envelope.css`: typography, responsive layout, envelope rotation and card animation
- `app.js`: drag/keyboard controls, opening sequence, card flip, image viewer and replay
- `assets/`: original cards and photos, envelope, label, rings and licensed fonts

Use the original image links in the enlarged viewer to access the source JPEGs without any resampling.

## Photo gallery

Five supplied wedding photos appear below the invitation in a responsive gallery. Their original JPEG bytes and complete compositions are retained. Tap a photo to open a separate full-screen viewer; use previous/next, left/right keys, or a horizontal swipe to browse all five. Escape or Close returns focus to the selected photo. Original-image links remain available, and the gallery links also work without JavaScript. Photos load lazily so the envelope opens first.

## Gift details (add later)

Edit `gift-details.js` to set `qrImage`, `bankName`, `accountNumber`, and `accountName`. Save the supplied QR image under `assets/` and use its relative path. Leave fields empty until real details are available. The public page displays pending messages and a gift icon (not a scannable sample QR). This is a display section for guests, not a form that collects their bank details. Real values render as text, and a missing QR image falls back to the pending panel.

## Typography

All live text uses **Prompt**, a loopless Thai font, through shared body/display font variables. Regular and medium WOFF2 subsets are self-hosted in `assets/fonts/prompt/`; visitors need no installed font or external font service. `font-display: swap` keeps text visible while fonts load, with local Thai fallbacks if loading fails.

Prompt is distributed under the SIL Open Font License 1.1. Copyright and license are retained in `assets/fonts/prompt/OFL.txt`; official sources and checksums are recorded in the adjacent `sources.json`.

Text baked into the original invitation JPEGs and label remains part of the supplied artwork and is unaffected by CSS fonts.
