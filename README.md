# JPG75 is Enough

A tiny, privacy-friendly web app that converts images to JPG at a reduced quality — entirely in your browser. No files are ever uploaded to a server.

**Live at:** [jpg75.michels.world](https://jpg75.michels.world)

## Features

- Select or drag & drop one or multiple images (any browser-supported image format: PNG, WEBP, GIF, BMP, JPG, ...)
- **Bilder / Dateien** toggle above the picker (default: **Bilder**):
  - **Bilder** uses the OS photo picker — quick to browse, but on Android the original file name is not preserved (the OS gives the browser an anonymized temporary name instead)
  - **Dateien** opens the regular file browser instead — slower to navigate, but keeps the real file name if you pick it from "Files"/"My Files" rather than "Google Photos"
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
- If a rename pattern produces the same name for multiple images (e.g. no `#` counter and two photos taken close together), **every** image in that group is numbered chronologically — `_1`, `_2`, ... inserted before `.jpg` — using millisecond-precision EXIF capture time where available
- Remove individual images from the list, or clear the whole list at once with **Clear all**
- You're warned before an accidental page reload or navigation throws away unsaved progress
- Download buttons ("Download all" / "Download all as ZIP") sit above the file list; images are converted **one at a time** using `createImageBitmap` and small real thumbnails, so large batches (hundreds of photos) don't run out of memory on mobile
- Dark mode by default, with a light mode toggle
- Mobile-first layout — designed to be used from a phone
- 100% client-side: no backend, no analytics, no image ever leaves the device

## How it works

Each file is decoded with `createImageBitmap()` (falling back to `FileReader` + `<img>` if unsupported), drawn onto an in-memory `<canvas>` at full resolution for the actual JPG output, and separately onto a small (≤64px) canvas for a lightweight list thumbnail — avoiding both the large base64 data URLs and the full-resolution `<img>` elements that previously caused out-of-memory crashes with large batches. Files are processed **sequentially, one after another**, since decoding and re-encoding several full-resolution photos in parallel can overwhelm memory and CPU on phones. The resulting JPGs are offered as direct downloads via `URL.createObjectURL`, or bundled into a ZIP using [JSZip](https://stuk.github.io/jszip/) (loaded from a CDN).

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

### 1.0.9
- Fixed out-of-memory crashes when selecting large batches (e.g. 300 photos): images now decode via `createImageBitmap()` instead of base64 data URLs, and the list shows a small real thumbnail (≤64px) instead of the full-resolution image, cutting per-image memory use from several MB to a few KB
- Added a **Clear all** button to reset the whole list at once, instead of removing images one by one
- Added a warning before an accidental reload/navigation discards unsaved progress
- Duplicate-name numbering now applies to **every** image sharing a name (not just the ones after the first), and uses millisecond-precision EXIF capture time (`SubSecTimeOriginal`) when available so photos taken within the same second still sort correctly

### 1.0.8
- Fixed the "Processing X of Y…" indicator overlapping the download buttons, and added spacing between the buttons and the file list below them
- Duplicate file names (e.g. from a rename pattern without a `#` counter) are now automatically numbered — `_1`, `_2`, ... — ordered chronologically by capture/file date instead of colliding

### 1.0.7
- Images are now processed **sequentially** instead of all in parallel — fixes freezes/timeouts on Android when selecting many photos at once, caused by decoding and re-encoding several full-resolution images simultaneously
- A "Processing X of Y…" hint is shown while a batch is being converted
- Moved the "Download all" and "Download all as ZIP" buttons above the file list instead of below it

### 1.0.6
- Added a **Bilder / Dateien** toggle (default: Bilder) above the picker. "Dateien" switches the file input's `accept` attribute to `*/*`, which makes Android open its regular file browser (Storage Access Framework) instead of the anonymized photo picker — preserving real file names when picked from "Files"/"My Files"
- Non-image files selected in "Dateien" mode are ignored with a notice, same as before

### 1.0.5
- Renaming now only applies if "Rename files" is checked **and** the pattern field isn't empty; otherwise the original name is kept (as `name.jpg`)
- Removed the hover/long-press tooltip for the original name — no longer needed given the rule above
- Rename placeholders `$H`/`$N`/`$S` renamed to `$h`/`$m`/`$s`
- Added a `$Q` placeholder for the JPEG quality used
- Added a preset dropdown with ready-made patterns: `DSC_$Y$M$D_$h$m$s`, `S23_$Y$M$D_$h$m$s`, `*_smalled`
- Example numbers in the app now use `00042` instead of `00032`

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
