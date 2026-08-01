# JPG75 is Enough

A tiny, privacy-friendly web app that converts images to JPG at a reduced quality — entirely in your browser. No files are ever uploaded to a server.

**Live at:** [jpg75.michels.world](https://jpg75.michels.world)

## Features

- Select or drag & drop one or multiple images (any browser-supported image format: PNG, WEBP, GIF, BMP, JPG, ...)
- All selected images are converted to `.jpg`
- Adjustable JPEG quality (default: 75%)
- Optional renaming, either
  - a plain custom name, or
  - a pattern with placeholders (tap the **i** button in the app for the full legend):
    | Placeholder | Meaning |
    |---|---|
    | `#` (repeatable) | Sequential number, padded to the number of `#` used (`#####` → `00032`) |
    | `*` | Original file name (without extension) |
    | `$P` | Folder name, entered manually in the app |
    | `$Y` `$M` `$D` | Current year / month / day |
    | `$H` `$N` `$S` | Current hour / minute / second |

    Example: `$Y-$M-$D_#####` → `2026-08-01_00032.jpg`
- Remove individual images from the list before downloading
- Download images individually, all at once (separate files), or all at once as a ZIP
- Dark mode by default, with a light mode toggle
- Mobile-first layout — designed to be used from a phone
- 100% client-side: no backend, no analytics, no image ever leaves the device

## How it works

Images are read locally via the `FileReader` API, drawn onto an in-memory `<canvas>`, and re-encoded with `canvas.toBlob(..., 'image/jpeg', quality)`. The resulting JPGs are offered as direct downloads via `URL.createObjectURL`, or bundled into a ZIP using [JSZip](https://stuk.github.io/jszip/) (loaded from a CDN).

## Deployment (Netlify)

1. Push this repository to GitHub.
2. In Netlify: **Add new site → Import an existing project**, and pick the repo.
3. Build settings: none needed — this is a static site.
   - Build command: *(leave empty)*
   - Publish directory: `/`
4. Deploy.
5. To use the `jpg75.michels.world` subdomain:
   - In Netlify: **Site settings → Domain management → Add a domain** → enter `jpg75.michels.world`.
   - In your DNS provider for `michels.world`, add a `CNAME` record:
     - Host: `jpg75`
     - Value: `<your-site-name>.netlify.app`
   - Netlify provisions an HTTPS certificate automatically once DNS is verified.

## Browser support

Works in all modern browsers (Chrome, Safari, Firefox, Edge). Formats not natively decodable by the browser's `<img>`/`<canvas>` (e.g. HEIC in most non-Safari browsers) cannot be converted.

## Version

**1.0.2** — images can now be removed from the list individually, and there's a "Download all" button for separate files in addition to the ZIP option.
