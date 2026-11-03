# Oat & Ching — Wedding invitation

A static, responsive wedding invitation with a laurel-green envelope, opening animation, and a portrait two-sided 5:7 card. Click the envelope to open, click the card or the flip button to turn it over, and use the enlarge button to read the full-resolution invitation.

The two supplied 1462 × 2048 JPEGs are copied byte-for-byte into `assets/card-front.jpg` and `assets/card-back.jpg`. CSS `object-fit: contain` preserves the complete original artwork without cropping, retouching, or re-encoding. Their near-5:7 ratio is fitted within an exact 5:7 card. The interface scales for screens; 5 × 7 inches describes the card proportions, not guaranteed physical display size. At 5 × 7 inches, source resolution is approximately 292 ppi.

`assets/envelope-web.jpg` is a high-quality web copy of the approved envelope design. The original card JPEGs remain untouched. The closed envelope shows that image; layered paper surfaces animate the flap and card. The site supports keyboard controls, reduced motion, native dialog focus handling, and full-resolution image viewing. There are no third-party scripts, external fonts, analytics, or runtime dependencies.

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
