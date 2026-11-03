# Reem AlMasri — Portfolio 2026

A static, single-page portfolio for Reem AlMasri: brand identity, campaign art direction, illustration, and motion. Built with hand-written HTML, CSS, and JavaScript. No framework, no build step.

**Live site:** https://reem0009.github.io/reem-almasri-portfolio/

## Preview locally

From this folder, run:

```bash
python -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173). On Windows, `py -m http.server 4173` works too.

## Deploy to GitHub Pages

The repository is [reem0009/reem-almasri-portfolio](https://github.com/reem0009/reem-almasri-portfolio). To publish an update:

```bash
git add .
git commit -m "Update portfolio"
git push
```

GitHub Pages serves the `main` branch from the repository root. The included `.nojekyll` file tells Pages to serve the files as-is.

## What to customize

| What | Where |
| --- | --- |
| Project titles, copy, tags, Behance links | `index.html` (project articles in `#work`) |
| Email, CV link, Instagram, LinkedIn | `index.html` (`#contact`, footer, and JSON-LD) |
| Colors, type scale, shadows, shapes | `styles.css` (`:root` tokens and project classes) |
| Project covers and portrait | `assets/` |
| Motion and menu behavior | `script.js` |
| Intro sequence copy and pacing | `index.html` (`.intro`), `styles.css`, `script.js` |

### Before changing the site

- If the GitHub username or repository name changes, update the canonical, `og:url`, and absolute Open Graph/Twitter image URLs in `index.html`.
- Replace `assets/reem-almasri-cv.pdf` when the CV is updated. Keep the filename so existing links keep working.
- Test on a real phone. The mobile menu, tap targets, and 3D tilt hover states are best checked on-device.

## Project structure

```
.
├── index.html          # Content and page structure
├── styles.css          # Saffron/ink visual system and responsive layout
├── script.js           # Intro sequence, menu, reveals, cursor, tilt, back-to-top
├── favicon.svg         # RA monogram
├── assets/
│   ├── avatar.webp
│   ├── deheiyya-cover.webp
│   ├── deheiyya-mood.webp
│   ├── asasi-cover.webp
│   ├── asasi-mobile.webp
│   ├── og-image.png
│   └── reem-almasri-cv.pdf
├── .nojekyll
└── README.md
```

## Credits

- Project imagery and illustrations: Reem AlMasri, sourced from [Behance](https://www.behance.net/reemomar25). All rights reserved.
- Typefaces: Bagel Fat One, Baloo 2, Nunito, and Baloo Bhaijaan 2, served by Google Fonts under the SIL Open Font License.
- Oppenheimer title card: an original typographic treatment built for this site, not a film still.

## Live links

- Portfolio: https://reem0009.github.io/reem-almasri-portfolio/
- Email: [duckquackquack107@gmail.com](mailto:duckquackquack107@gmail.com)
- Behance: https://www.behance.net/reemomar25
- DEHEIYYA case: https://www.behance.net/gallery/257949303/DEHEIYYA-Brand-Identity
- ASASI case: https://www.behance.net/gallery/257992643/Full-company-marketing-strategy-content-plan
- Oppenheimer case: https://www.behance.net/gallery/257794007/OPPENHEIMER-VIDEO-EDITING-PROJECT
