# JPG75 is Enough

A tiny, privacy-friendly web app that converts images to JPG at a reduced quality — entirely in your browser. No files are ever uploaded to a server.

**Live at:** [jpg75.michels.world](https://jpg75.michels.world)

## Features

- Select or drag & drop one or multiple images (any browser-supported image format: PNG, WEBP, GIF, BMP, JPG, ...)
- All selected images are converted to `.jpg`
- Adjustable JPEG quality (default: 75%)
- Optional renaming — only applied if "Rename files" is checked **and** the pattern field isn't empty; otherwise the original file name is kept (with `.jpg` as the extension, since the file is always converted)
  - a plain custom name, or
  - a pattern with placeholders (tap the **i** button in the app for the full legend), or
  - a ready-made preset picked from the dropdown (`DSC_$Y$M$D_$h$m$s`, `S23_$Y$M$D_$h$m$s`, `*_smalled`)

    | Placeholder | Meaning |
    |---|---|
    | `#` (repeatable) | Sequential number, padded to the number of `#` used (`#####` → `00042`) |
    | `*` | Original file name (without extension) |
    | `$Y` `$M` `$D` | Year / month / day the photo was taken (EXIF capture date), falling back to the file's last-modified date if no EXIF data is present |
    | `$h` `$m` `$s` | Hour / minute / second, same source |
    | `$Q` | The JPEG quality used for that image (e.g. `75`) |

    Example: `*_$Q` → `picture.png` at 75% quality becomes `picture_75.jpg`
- Names update live in the list as you change the rename pattern
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

Works in all modern browsers (Chrome, Safari, Firefox, Edge). Formats not natively decodable by the browser's `<img>`/`<canvas>` (e.g. HEIC in most non-Safari browsers) cannot be converted. EXIF capture-date reading for the `$Y`/`$M`/`$D`/`$h`/`$m`/`$s` placeholders only works on JPEG source files that contain EXIF metadata; other formats and JPEGs without EXIF data use the file's last-modified date instead.

## Changelog

### 1.0.4
- Fixed the original-name tooltip being clipped/truncated by a CSS `overflow: hidden` on the wrong element, which made it display incorrectly
- Added a native hover tooltip (desktop) via the `title` attribute as a fallback alongside the custom tooltip
- `$Y` `$M` `$D` `$H` `$N` `$S` in rename patterns now use each photo's EXIF capture date/time when available (JPEGs only), falling back to the file's last-modified date otherwise — instead of always using the current time

### 1.0.3
- Removed the unused folder name field and `$P` placeholder (no real folder access is possible from a mobile file picker)
- File list now shows only the new file name; hover (desktop) or long-press (mobile) reveals the original name as a tooltip
- File names in the list now update live when the rename pattern is changed, without reprocessing the images

### 1.0.2
- Images can now be removed from the list individually
- Added a "Download all" button for separate files, in addition to the existing "Download all as ZIP" option

### 1.0.1
- Original filename is now shown alongside the converted name in the file list

### 1.0.0
- Initial release
