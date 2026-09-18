// ---------- Theme ----------
const root = document.documentElement;
const menuTheme = document.getElementById('menuTheme');
function setTheme(t) {
  root.setAttribute('data-theme', t);
  localStorage.setItem('jpg75-theme', t);
  menuTheme.textContent = t === 'dark' ? '☀ Light mode' : '☾ Dark mode';
}
setTheme(localStorage.getItem('jpg75-theme') || 'dark');
menuTheme.addEventListener('click', () => {
  menuDropdown.style.display = 'none';
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ---------- Brand / home ----------
const brandHome = document.getElementById('brandHome');
function goHome() {
  window.location.reload();
}
brandHome.addEventListener('click', goHome);
brandHome.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goHome(); }
});

// ---------- Fullscreen ----------
const fullscreenToggle = document.getElementById('fullscreenToggle');
fullscreenToggle.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else {
    document.exitFullscreen?.();
  }
});

// ---------- ⋮ Menu ----------
const menuToggle = document.getElementById('menuToggle');
const menuDropdown = document.getElementById('menuDropdown');
const menuAbout = document.getElementById('menuAbout');
const modalAbout = document.getElementById('modalAbout');

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  menuDropdown.style.display = menuDropdown.style.display === 'none' ? 'flex' : 'none';
});
document.addEventListener('click', () => { menuDropdown.style.display = 'none'; });
menuAbout.addEventListener('click', () => {
  menuDropdown.style.display = 'none';
  modalAbout.classList.add('open');
});
const menuExport = document.getElementById('menuExport');
const exportCard = document.getElementById('exportCard');
const exportCloseBtn = document.getElementById('exportCloseBtn');
menuExport.addEventListener('click', () => {
  menuDropdown.style.display = 'none';
  exportCard.style.display = 'block';
  exportCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
exportCloseBtn.addEventListener('click', () => {
  exportCard.style.display = 'none';
});

// ---------- Toast ----------
let toastTimer;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

// ---------- Enlarged image preview + rotate ----------
// ---------- Inline item detail (accordion) ----------
// Only one item's detail panel is open at a time; opening another closes
// the previous one. Populated in addItem, toggled from the item's summary row.
let openItemId = null;
function closeItemDetail(p) {
  if (!p || !p.detailEl) return;
  p.detailEl.style.display = 'none';
  if (openItemId === p.id) openItemId = null;
}
function toggleItemDetail(id) {
  const p = processed.find(x => x.id === id);
  if (!p) return;
  if (openItemId === id) {
    closeItemDetail(p);
    return;
  }
  if (openItemId !== null) {
    const prev = processed.find(x => x.id === openItemId);
    if (prev) closeItemDetail(prev);
  }
  p.detailImgEl.src = p.url;
  p.renameInputEl.value = p.customName || '';
  p.renameLockEl.checked = p.nameLocked;
  p.renameFieldsEl.classList.remove('open');
  p.detailEl.style.display = 'block';
  openItemId = id;
}
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('.modal-bg').classList.remove('open'));
});
document.querySelectorAll('.modal-bg').forEach(bg => {
  bg.addEventListener('click', (e) => { if (e.target === bg) bg.classList.remove('open'); });
});

// ---------- Elements ----------
const drop = document.getElementById('drop');
const fileInput = document.getElementById('fileInput');
const sourceToggle = document.getElementById('sourceToggle');
const sourceHint = document.getElementById('sourceHint');
const list = document.getElementById('list');
const qualitySlider = document.getElementById('quality');
const qualityLabel = document.getElementById('qualityLabel');
const allBtn = document.getElementById('allBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const resetAllBtn = document.getElementById('resetAllBtn');
const resizeEnabled = document.getElementById('resizeEnabled');
const resizeFields = document.getElementById('resizeFields');
const resizeModeToggle = document.getElementById('resizeModeToggle');
const resizePercentFields = document.getElementById('resizePercentFields');
const resizePixelFields = document.getElementById('resizePixelFields');
const resizePercent = document.getElementById('resizePercent');
const resizePercentLabel = document.getElementById('resizePercentLabel');
const resizeWidth = document.getElementById('resizeWidth');
const resizeHeight = document.getElementById('resizeHeight');
const resizeLockRatio = document.getElementById('resizeLockRatio');
const resizeFitFields = document.getElementById('resizeFitFields');
const resizeFitToggle = document.getElementById('resizeFitToggle');
const resizeFillFields = document.getElementById('resizeFillFields');
const resizeFillToggle = document.getElementById('resizeFillToggle');
const resizePresetFields = document.getElementById('resizePresetFields');
const resizePreset = document.getElementById('resizePreset');
const resizeDpi = document.getElementById('resizeDpi');
const resizeCurrentInfo = document.getElementById('resizeCurrentInfo');
const resizePercentResult = document.getElementById('resizePercentResult');
const resizePresetResult = document.getElementById('resizePresetResult');
const toastEl = document.getElementById('toast');
const exportFormatToggle = document.getElementById('exportFormatToggle');
const exportPngFields = document.getElementById('exportPngFields');
const exportWebpFields = document.getElementById('exportWebpFields');
const exportColor = document.getElementById('exportColor');
const exportTolerance = document.getElementById('exportTolerance');
const exportToleranceLabel = document.getElementById('exportToleranceLabel');
const exportAllBtn = document.getElementById('exportAllBtn');
const exportZipBtn = document.getElementById('exportZipBtn');
const renameEnabled = document.getElementById('renameEnabled');
const renameFields = document.getElementById('renameFields');
const patternInput = document.getElementById('pattern');
const patternPreset = document.getElementById('patternPreset');
const preview = document.getElementById('preview');
const modalBg = document.getElementById('modalBg');
const infoBtn = document.getElementById('infoBtn');

let processed = [];
let counter = 0;
let itemCounter = 0;

// Warn before an accidental reload/navigation throws away unsaved progress.
window.addEventListener('beforeunload', (e) => {
  if (processed.length > 0) {
    e.preventDefault();
    e.returnValue = '';
  }
});

// ---------- Quality ----------
qualitySlider.addEventListener('input', () => {
  qualityLabel.textContent = qualitySlider.value + '%';
});
// Re-encode already-processed images once the slider is released — not on
// every 'input' tick while dragging, since that would re-run the whole
// batch dozens of times per second.
qualitySlider.addEventListener('change', () => {
  if (processed.length > 0) reprocessAll();
});

// ---------- Resize ----------
function setActiveSeg(container, dataAttr, value) {
  container.querySelectorAll('.seg-btn').forEach(b => {
    b.classList.toggle('active', b.dataset[dataAttr] === value);
  });
}

function currentResizeMode() {
  return resizeModeToggle.querySelector('.seg-btn.active').dataset.mode;
}

// One place deciding which sub-sections are visible, for all three modes —
// Fit/Fill only matters for an exact target box (Pixel with ratio unlocked,
// or any Preset), never for Percent or ratio-locked Pixel.
function updateResizeSubfieldsVisibility() {
  const mode = currentResizeMode();
  resizePercentFields.style.display = mode === 'percent' ? 'block' : 'none';
  resizePixelFields.style.display = mode === 'pixel' ? 'block' : 'none';
  resizePresetFields.style.display = mode === 'preset' ? 'block' : 'none';

  const showFit = (mode === 'pixel' && !resizeLockRatio.checked) || mode === 'preset';
  resizeFitFields.style.display = showFit ? 'block' : 'none';
}

// The reference resolution used for every live preview below: only
// meaningful if there's exactly one image, or every loaded image happens
// to share the same original size.
function getReferenceResolution() {
  if (processed.length === 0) return null;
  const first = processed[0];
  if (!first.originalWidth || !first.originalHeight) return null;
  const allSame = processed.every(p => p.originalWidth === first.originalWidth && p.originalHeight === first.originalHeight);
  return allSame ? { w: first.originalWidth, h: first.originalHeight } : null;
}

function updateResizeInfo() {
  if (!resizeEnabled.checked) {
    resizeCurrentInfo.style.display = 'none';
    resizePercentResult.style.display = 'none';
    resizePresetResult.style.display = 'none';
    return;
  }
  const ref = getReferenceResolution();

  if (ref) {
    resizeCurrentInfo.textContent = `Current image size: ${ref.w} × ${ref.h} px`;
    resizeCurrentInfo.style.display = 'block';
    resizeWidth.placeholder = `${ref.w} px`;
    resizeHeight.placeholder = `${ref.h} px`;
  } else if (processed.length > 1) {
    resizeCurrentInfo.textContent = 'Loaded images have different sizes — live preview unavailable';
    resizeCurrentInfo.style.display = 'block';
    resizeWidth.placeholder = 'Width (px)';
    resizeHeight.placeholder = 'Height (px)';
  } else {
    resizeCurrentInfo.style.display = 'none';
    resizeWidth.placeholder = 'Width (px)';
    resizeHeight.placeholder = 'Height (px)';
  }

  if (ref) {
    const pct = (parseFloat(resizePercentLabel.value) || 100) / 100;
    resizePercentResult.textContent = `Result: ${Math.round(ref.w * pct)} × ${Math.round(ref.h * pct)} px`;
    resizePercentResult.style.display = 'block';
  } else {
    resizePercentResult.style.display = 'none';
  }

  if (ref && resizePreset.value) {
    const target = computeResizeTarget(ref.w, ref.h);
    if (target) {
      resizePresetResult.textContent = `Result: ${target.w} × ${target.h} px`;
      resizePresetResult.style.display = 'block';
    } else {
      resizePresetResult.style.display = 'none';
    }
  } else {
    resizePresetResult.style.display = 'none';
  }
}

resizeEnabled.addEventListener('change', () => {
  resizeFields.style.display = resizeEnabled.checked ? 'block' : 'none';
  updateResizeInfo();
  if (processed.length > 0) reprocessAll();
});
resizeModeToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('.seg-btn');
  if (!btn) return;
  setActiveSeg(resizeModeToggle, 'mode', btn.dataset.mode);
  updateResizeSubfieldsVisibility();
  updateResizeInfo();
  if (processed.length > 0) reprocessAll();
});

// Range (5% steps) and the precise number field stay in sync either way.
resizePercent.addEventListener('input', () => {
  resizePercentLabel.value = resizePercent.value;
  updateResizeInfo();
});
resizePercent.addEventListener('change', () => {
  if (processed.length > 0) reprocessAll();
});
resizePercentLabel.addEventListener('input', () => {
  updateResizeInfo();
});
resizePercentLabel.addEventListener('change', () => {
  let v = parseFloat(resizePercentLabel.value);
  if (isNaN(v)) v = 100;
  v = Math.min(300, Math.max(10, v));
  resizePercentLabel.value = v;
  resizePercent.value = v;
  localStorage.setItem('jpg75-resizePercent', String(v));
  document.getElementById('resizePercentFieldLabel').classList.toggle('is-modified', v !== 100);
  updateResizeInfo();
  if (processed.length > 0) reprocessAll();
});

resizeLockRatio.addEventListener('change', () => {
  updateResizeSubfieldsVisibility();
  if (processed.length > 0) reprocessAll();
});
// With "keep aspect ratio" on and a known reference resolution, editing one
// side live-updates the other to match that resolution's proportions.
resizeWidth.addEventListener('input', () => {
  if (resizeLockRatio.checked) {
    const ref = getReferenceResolution();
    if (ref && resizeWidth.value) {
      resizeHeight.value = Math.round(parseFloat(resizeWidth.value) * ref.h / ref.w);
    }
  }
});
resizeHeight.addEventListener('input', () => {
  if (resizeLockRatio.checked) {
    const ref = getReferenceResolution();
    if (ref && resizeHeight.value) {
      resizeWidth.value = Math.round(parseFloat(resizeHeight.value) * ref.w / ref.h);
    }
  }
});
resizeWidth.addEventListener('change', () => { if (processed.length > 0) reprocessAll(); });
resizeHeight.addEventListener('change', () => { if (processed.length > 0) reprocessAll(); });

resizePreset.addEventListener('change', () => {
  updateResizeInfo();
  if (processed.length > 0) reprocessAll();
});
resizeDpi.addEventListener('change', () => {
  updateResizeInfo();
  if (processed.length > 0) reprocessAll();
});
resizeFitToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('.seg-btn');
  if (!btn) return;
  setActiveSeg(resizeFitToggle, 'fit', btn.dataset.fit);
  updateResizeInfo();
  if (processed.length > 0) reprocessAll();
});
resizeFillToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('.seg-btn');
  if (!btn) return;
  setActiveSeg(resizeFillToggle, 'fill', btn.dataset.fill);
  if (processed.length > 0) reprocessAll();
});
updateResizeSubfieldsVisibility();

async function reprocessAll() {
  const items = processed.slice();
  const total = items.length;
  let completed = 0;
  let nextIndex = 0;
  processingHint.style.display = 'block';
  processingHint.textContent = `Re-encoding 0 of ${total}…`;

  async function worker() {
    while (nextIndex < items.length) {
      const p = items[nextIndex++];
      await reencodeItem(p);
      completed++;
      processingHint.textContent = `Re-encoding ${completed} of ${total}…`;
    }
  }

  const workerCount = Math.min(CONCURRENCY, items.length);
  await Promise.all(Array.from({ length: workerCount }, worker));
  updateAllNames(); // in case the pattern uses $Q, which just changed
  processingHint.style.display = 'none';
}

async function reencodeItem(p) {
  let output;
  try {
    output = await buildOutput(p.file, p.rotation);
  } catch (err) {
    return; // leave the existing blob untouched if the file can't be re-read
  }
  URL.revokeObjectURL(p.url);
  URL.revokeObjectURL(p.thumbUrl);
  p.blob = output.blob;
  p.url = URL.createObjectURL(output.blob);
  p.thumbUrl = URL.createObjectURL(output.thumbBlob);
  p.quality = parseInt(qualitySlider.value);
  p.dlEl.href = p.url;
  p.thumbEl.src = p.thumbUrl;
  if (openItemId === p.id) p.detailImgEl.src = p.url;
  const savings = Math.round((1 - output.blob.size / p.originalSize) * 100);
  p.sizesEl.textContent = `${formatSize(p.originalSize)} → ${formatSize(output.blob.size)}${savings > 0 ? ' · ' + savings + '% smaller' : ''}`;
}

async function rotateItem(p) {
  p.rotation = (p.rotation + 90) % 360;
  await reencodeItem(p);
}

// ---------- Export (PNG/WebP) settings ----------
exportFormatToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('.seg-btn');
  if (!btn) return;
  exportFormatToggle.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const isPng = btn.dataset.format === 'png';
  exportPngFields.style.display = isPng ? 'block' : 'none';
  exportWebpFields.style.display = isPng ? 'none' : 'block';
});

// Persists a control's value in localStorage, restores it on load, and lets
// clicking its label reset it back to the default (with a small dot marker
// shown on the label whenever the current value differs from the default).
function setupPersistedControl({ storageKey, defaultValue, inputEl, labelEl, onApply, fireChangeOnReset }) {
  const stored = localStorage.getItem(storageKey);
  if (stored !== null) inputEl.value = stored;
  function markState() {
    labelEl.classList.toggle('is-modified', inputEl.value !== String(defaultValue));
  }
  onApply();
  markState();
  inputEl.addEventListener('input', () => {
    localStorage.setItem(storageKey, inputEl.value);
    onApply();
    markState();
  });
  labelEl.addEventListener('click', () => {
    inputEl.value = defaultValue;
    localStorage.setItem(storageKey, String(defaultValue));
    onApply();
    markState();
    if (fireChangeOnReset) inputEl.dispatchEvent(new Event('change'));
  });
}

setupPersistedControl({
  storageKey: 'jpg75-quality',
  defaultValue: 75,
  inputEl: qualitySlider,
  labelEl: document.getElementById('qualityFieldLabel'),
  onApply: () => { qualityLabel.textContent = qualitySlider.value + '%'; },
  fireChangeOnReset: true // re-encodes already-processed images, same as manually moving the slider
});
setupPersistedControl({
  storageKey: 'jpg75-exportColor',
  defaultValue: '#ffffff',
  inputEl: exportColor,
  labelEl: document.getElementById('exportColorFieldLabel'),
  onApply: () => {}
});
setupPersistedControl({
  storageKey: 'jpg75-exportTolerance',
  defaultValue: 15,
  inputEl: exportTolerance,
  labelEl: document.getElementById('exportToleranceFieldLabel'),
  onApply: () => { exportToleranceLabel.textContent = exportTolerance.value + '%'; }
});
setupPersistedControl({
  storageKey: 'jpg75-resizePercent',
  defaultValue: 100,
  inputEl: resizePercent,
  labelEl: document.getElementById('resizePercentFieldLabel'),
  onApply: () => { resizePercentLabel.value = resizePercent.value; updateResizeInfo(); },
  fireChangeOnReset: true
});

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Makes pixels close to the chosen color transparent. Tolerance is a percent
// of the maximum possible color distance (0% = exact match only).
function applyColorKey(imageData, [tr, tg, tb], tolerancePercent) {
  const maxDist = Math.sqrt(3 * 255 * 255);
  const threshold = (tolerancePercent / 100) * maxDist;
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const dr = data[i] - tr, dg = data[i + 1] - tg, db = data[i + 2] - tb;
    if (Math.sqrt(dr * dr + dg * dg + db * db) <= threshold) data[i + 3] = 0;
  }
}

// Builds a PNG or WebP export from the already-converted JPG output (i.e.
// after the main Quality setting has already been applied) — the export
// feature is a re-packaging step, not an alternate path from the original.
async function buildExportBlob(p, format) {
  const source = await loadSource(p.blob);
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(source.drawable, 0, 0);
  source.close();

  if (format === 'png') {
    const tolerance = parseInt(exportTolerance.value);
    const rgb = hexToRgb(exportColor.value);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    applyColorKey(imgData, rgb, tolerance);
    ctx.putImageData(imgData, 0, 0);
    return canvasToBlob(canvas, undefined, 'image/png');
  }
  // WebP reuses the main Quality slider — no separate export quality control
  const quality = parseInt(qualitySlider.value) / 100;
  return canvasToBlob(canvas, quality, 'image/webp');
}

function exportName(p, format) {
  return p.name.replace(/\.jpg$/, '.' + format);
}

async function runExport(format, onFile) {
  const items = processed.slice();
  const total = items.length;
  let completed = 0;
  let nextIndex = 0;
  processingHint.style.display = 'block';
  processingHint.textContent = `Exporting 0 of ${total}…`;

  async function worker() {
    while (nextIndex < items.length) {
      const p = items[nextIndex++];
      const blob = await buildExportBlob(p, format);
      onFile(exportName(p, format), blob);
      completed++;
      processingHint.textContent = `Exporting ${completed} of ${total}…`;
    }
  }

  const workerCount = Math.min(CONCURRENCY, items.length);
  await Promise.all(Array.from({ length: workerCount }, worker));
  processingHint.style.display = 'none';
}

function currentExportFormat() {
  return exportFormatToggle.querySelector('.seg-btn.active').dataset.format;
}

exportAllBtn.addEventListener('click', async () => {
  const format = currentExportFormat();
  let i = 0;
  await runExport(format, (name, blob) => {
    const url = URL.createObjectURL(blob);
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }, i * 150);
    i++;
  });
});

exportZipBtn.addEventListener('click', async () => {
  const format = currentExportFormat();
  const zip = new JSZip();
  const usedNames = new Set();
  await runExport(format, (name, blob) => {
    let finalName = name;
    let i = 1;
    while (usedNames.has(finalName)) {
      finalName = name.replace(new RegExp(`\\.${format}$`), `(${i}).${format}`);
      i++;
    }
    usedNames.add(finalName);
    zip.file(finalName, blob);
  });
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jpg75-${format}.zip`;
  a.click();
});

// ---------- Rename toggle ----------
renameEnabled.addEventListener('change', () => {
  renameFields.style.display = renameEnabled.checked ? 'block' : 'none';
  updatePreview();
  updateAllNames();
});
patternInput.addEventListener('input', () => {
  updatePreview();
  updateAllNames();
});
patternPreset.addEventListener('change', () => {
  if (!patternPreset.value) return;
  patternInput.value = patternPreset.value;
  renameEnabled.checked = true;
  renameFields.style.display = 'block';
  updatePreview();
  updateAllNames();
});

function pad(num, len) { return String(num).padStart(len, '0'); }

function buildName(pattern, { index, originalBase, dateObj, quality }) {
  if (!pattern) return originalBase;
  const d = dateObj || new Date();
  let out = pattern;
  out = out.replace(/#+/g, (m) => pad(index, m.length));
  out = out.replaceAll('*', originalBase);
  out = out.replaceAll('$Y', d.getFullYear());
  out = out.replaceAll('$M', pad(d.getMonth() + 1, 2));
  out = out.replaceAll('$D', pad(d.getDate(), 2));
  out = out.replaceAll('$h', pad(d.getHours(), 2));
  out = out.replaceAll('$m', pad(d.getMinutes(), 2));
  out = out.replaceAll('$s', pad(d.getSeconds(), 2));
  out = out.replaceAll('$Q', quality != null ? quality : qualitySlider.value);
  return out;
}

function computeName(originalName, index, dateObj, quality) {
  const originalBase = originalName.replace(/\.[^.]+$/, '');
  const pattern = patternInput.value.trim();
  let base = originalBase;
  if (renameEnabled.checked && pattern) {
    base = buildName(pattern, { index, originalBase, dateObj, quality }) || originalBase;
  }
  return base + '.jpg';
}

function updatePreview() {
  if (!renameEnabled.checked) return;
  const name = buildName(patternInput.value.trim(), {
    index: 42, originalBase: 'picture', quality: qualitySlider.value
  });
  preview.textContent = `Example: picture.png → ${name || 'picture'}.jpg`;
}
updatePreview();

function updateAllNames() {
  processed.forEach(p => {
    if (p.nameLocked) {
      p.baseName = (p.customName || p.originalName.replace(/\.[^.]+$/, '')) + '.jpg';
    } else {
      p.baseName = computeName(p.originalName, p.index, p.dateObj, p.quality);
    }
  });
  resolveDuplicateNames();
}

// If several images end up with the same computed name (e.g. a pattern
// without a sequential number, and two photos taken close together),
// every image in that group gets numbered chronologically: "_1", "_2", ...
// inserted before the .jpg extension, based on capture/file time.
// Locked names (set via the per-image Rename panel) are left untouched —
// neither recomputed nor folded into the dedup numbering.
function resolveDuplicateNames() {
  const groups = {};
  processed.forEach(p => {
    if (p.nameLocked) return;
    (groups[p.baseName] ||= []).push(p);
  });
  Object.values(groups).forEach(group => {
    if (group.length > 1) {
      group.sort((a, b) => {
        const at = a.dateObj ? a.dateObj.getTime() : 0;
        const bt = b.dateObj ? b.dateObj.getTime() : 0;
        return at !== bt ? at - bt : a.index - b.index;
      });
      group.forEach((p, i) => {
        p.name = p.baseName.replace(/\.jpg$/, `_${i + 1}.jpg`);
      });
    } else {
      group[0].name = group[0].baseName;
    }
  });
  processed.forEach(p => {
    if (p.nameLocked) p.name = p.baseName;
    p.nameEl.textContent = p.name;
    p.nameEl.title = p.name;
    p.dlEl.download = p.name;
  });
}

// ---------- Naming pattern help modal ----------
infoBtn.addEventListener('click', () => modalBg.classList.add('open'));

// ---------- Source toggle: Bilder (photo picker) vs Dateien (file browser) ----------
const hints = {
  images: "Photo picker — fast, but original file names aren't preserved on Android.",
  files: 'File browser — pick "Files"/"My Files" (not Google Photos) to keep original file names.'
};
sourceToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('.seg-btn');
  if (!btn) return;
  sourceToggle.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const mode = btn.dataset.mode;
  fileInput.accept = mode === 'files' ? '*/*' : 'image/*';
  sourceHint.textContent = hints[mode];
});

// ---------- Drag & drop / file picking ----------
drop.addEventListener('click', () => fileInput.click());
['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => {
  e.preventDefault(); drop.classList.add('drag');
}));
['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => {
  e.preventDefault(); drop.classList.remove('drag');
}));
drop.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
fileInput.addEventListener('change', e => { handleFiles(e.target.files); fileInput.value = ''; });

// ---------- Paste from clipboard (e.g. Windows screenshot tool) ----------
document.addEventListener('paste', (e) => {
  const items = e.clipboardData?.items;
  if (!items) return;
  const files = [];
  for (const item of items) {
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) files.push(file);
    }
  }
  if (files.length > 0) {
    e.preventDefault();
    handleFiles(files);
  }
});

// Mobile has no Ctrl+V — this button uses the async Clipboard API instead,
// which requires an explicit user gesture (tap) for permission reasons.
const pasteBtn = document.getElementById('pasteBtn');
pasteBtn.addEventListener('click', async () => {
  if (!navigator.clipboard || !navigator.clipboard.read) {
    alert("Clipboard paste isn't supported in this browser. Please select the image as a file instead.");
    return;
  }
  try {
    const clipboardItems = await navigator.clipboard.read();
    const files = [];
    for (const item of clipboardItems) {
      const imageType = item.types.find(t => t.startsWith('image/'));
      if (imageType) {
        const blob = await item.getType(imageType);
        const ext = imageType.split('/')[1] || 'png';
        files.push(new File([blob], `clipboard.${ext}`, { type: imageType }));
      }
    }
    if (files.length > 0) {
      handleFiles(files);
    } else {
      alert('No image found in the clipboard.');
    }
  } catch (err) {
    alert("Couldn't access the clipboard — permission may have been denied, or there's nothing to paste.");
  }
});

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

const processingHint = document.getElementById('processingHint');

// A small worker pool: several images decode/encode at once (fast), but not
// so many that memory/CPU get overwhelmed on mobile (which caused the
// freezes/crashes in 1.0.6 and earlier).
const CONCURRENCY = 3;

async function handleFiles(files) {
  const images = Array.from(files).filter(f => f.type.startsWith('image/'));
  if (images.length === 0) {
    alert('Please choose image files.');
    return;
  }
  processingHint.style.display = 'block';
  const total = images.length;
  let completed = 0;
  let nextIndex = 0;
  processingHint.textContent = `Processing 0 of ${total}…`;

  async function worker() {
    while (nextIndex < images.length) {
      const file = images[nextIndex++];
      await processFile(file);
      completed++;
      processingHint.textContent = `Processing ${completed} of ${total}…`;
    }
  }

  const workerCount = Math.min(CONCURRENCY, images.length);
  await Promise.all(Array.from({ length: workerCount }, worker));
  processingHint.style.display = 'none';
}

// ---------- Date reading: EXIF capture date, falling back to file date ----------
function readBytes(view, offset, length) {
  let s = '';
  for (let i = 0; i < length; i++) s += String.fromCharCode(view.getUint8(offset + i));
  return s;
}

function parseExifDateTime(view, tiffStart) {
  const little = view.getUint16(tiffStart) === 0x4949;
  const u16 = (o) => view.getUint16(o, little);
  const u32 = (o) => view.getUint32(o, little);
  if (u16(tiffStart + 2) !== 0x002A) return null;

  const ifd0 = tiffStart + u32(tiffStart + 4);
  const entries = u16(ifd0);
  let dateStr = null;
  let exifIFDOffset = null;

  for (let i = 0; i < entries; i++) {
    const e = ifd0 + 2 + i * 12;
    const tag = u16(e);
    if (tag === 0x8769) exifIFDOffset = u32(e + 8);
    if (tag === 0x0132) dateStr = readBytes(view, tiffStart + u32(e + 8), 19);
  }

  let subSecStr = null;
  if (exifIFDOffset) {
    const exifIFD = tiffStart + exifIFDOffset;
    const exifEntries = u16(exifIFD);
    for (let i = 0; i < exifEntries; i++) {
      const e = exifIFD + 2 + i * 12;
      const tag = u16(e);
      if (tag === 0x9003) { // DateTimeOriginal
        dateStr = readBytes(view, tiffStart + u32(e + 8), 19);
      }
      if (tag === 0x9291) { // SubSecTimeOriginal — fractional seconds as ASCII digits
        const count = u32(e + 4);
        const valOffset = count <= 4 ? e + 8 : tiffStart + u32(e + 8);
        subSecStr = readBytes(view, valOffset, count).replace(/\0+$/, '');
      }
    }
  }

  if (!dateStr) return null;
  const m = dateStr.match(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
  if (!m) return null;
  const date = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  if (subSecStr && /^\d+$/.test(subSecStr)) {
    date.setMilliseconds(Math.round(parseFloat('0.' + subSecStr) * 1000));
  }
  return date;
}

async function getExifDate(file) {
  if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') return null;
  try {
    const buf = await file.slice(0, 131072).arrayBuffer();
    const view = new DataView(buf);
    if (view.getUint16(0) !== 0xFFD8) return null;
    let offset = 2;
    while (offset < view.byteLength - 4) {
      const marker = view.getUint16(offset);
      if (marker === 0xFFE1) {
        const segLength = view.getUint16(offset + 2);
        if (readBytes(view, offset + 4, 4) === 'Exif') {
          return parseExifDateTime(view, offset + 10);
        }
        offset += 2 + segLength;
      } else if ((marker & 0xFF00) === 0xFF00) {
        const segLength = view.getUint16(offset + 2);
        offset += 2 + segLength;
      } else {
        break;
      }
    }
  } catch (err) {
    return null;
  }
  return null;
}

async function getFileDate(file) {
  const exifDate = await getExifDate(file);
  if (exifDate) return exifDate;
  return new Date(file.lastModified);
}

// ---------- Preserve EXIF metadata through re-encoding ----------
// canvas.toBlob() strips all metadata (capture date, camera model, etc).
// We extract the original APP1/Exif segment's raw bytes from the source
// JPEG and splice them back into the freshly encoded output.
async function getExifSegment(file) {
  if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') return null;
  try {
    const headBuf = await file.slice(0, 16384).arrayBuffer();
    const headView = new DataView(headBuf);
    if (headView.getUint16(0) !== 0xFFD8) return null;
    let offset = 2;
    while (offset < headView.byteLength - 4) {
      const marker = headView.getUint16(offset);
      if (marker === 0xFFE1) {
        const segLength = headView.getUint16(offset + 2); // includes the length field itself
        if (readBytes(headView, offset + 4, 4) !== 'Exif') return null;
        const totalLength = 2 + segLength; // marker + length field + payload
        if (offset + totalLength <= headBuf.byteLength) {
          return new Uint8Array(headBuf.slice(offset, offset + totalLength));
        }
        // segment extends beyond what we read (large thumbnail/maker notes) — fetch it fully
        const fullBuf = await file.slice(offset, offset + totalLength).arrayBuffer();
        return new Uint8Array(fullBuf);
      } else if ((marker & 0xFF00) === 0xFF00) {
        const segLength = headView.getUint16(offset + 2);
        offset += 2 + segLength;
      } else {
        break;
      }
    }
  } catch (err) {
    return null;
  }
  return null;
}

async function insertExifSegment(blob, exifBytes) {
  const buf = await blob.arrayBuffer();
  const view = new DataView(buf);
  if (view.getUint16(0) !== 0xFFD8) return blob; // not a valid JPEG, leave untouched
  const soi = new Uint8Array(buf, 0, 2);
  const rest = new Uint8Array(buf, 2);
  const combined = new Uint8Array(2 + exifBytes.length + rest.length);
  combined.set(soi, 0);
  combined.set(exifBytes, 2);
  combined.set(rest, 2 + exifBytes.length);
  return new Blob([combined], { type: 'image/jpeg' });
}

// We already decode with { imageOrientation: 'from-image' }, so the canvas
// pixels are already rotated upright. If we then copied the *original*
// Orientation tag (0x0112) back in unchanged, viewers that respect EXIF
// orientation would rotate an already-correct image a second time. So we
// reset it to 1 (normal) in the copied segment before splicing it back in.
function patchOrientation(exifBytes) {
  try {
    const view = new DataView(exifBytes.buffer, exifBytes.byteOffset, exifBytes.byteLength);
    const tiffStart = 10; // marker(2) + length(2) + "Exif\0\0"(6)
    if (tiffStart + 8 > exifBytes.length) return;
    const little = view.getUint16(tiffStart) === 0x4949;
    const u16 = (o) => view.getUint16(o, little);
    const u32 = (o) => view.getUint32(o, little);
    if (u16(tiffStart + 2) !== 0x002A) return;
    const ifd0 = tiffStart + u32(tiffStart + 4);
    if (ifd0 + 2 > exifBytes.length) return;
    const entries = u16(ifd0);
    for (let i = 0; i < entries; i++) {
      const e = ifd0 + 2 + i * 12;
      if (e + 12 > exifBytes.length) break;
      if (u16(e) === 0x0112) { // Orientation, type SHORT, value inline in first 2 bytes
        view.setUint16(e + 8, 1, little);
        break;
      }
    }
  } catch (err) {
    // leave segment untouched if anything looks malformed
  }
}

// ---------- Small promise helpers ----------
function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function canvasToBlob(canvas, quality, mime = 'image/jpeg') {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, mime, quality);
  });
}

// Decode the file into something drawable onto a canvas. createImageBitmap
// avoids the ~33% memory overhead of a base64 data URL and decodes off the
// main thread where supported — important when processing many large photos.
// Falls back to the classic FileReader + <img> approach if unavailable.
async function loadSource(file) {
  if (window.createImageBitmap) {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return { drawable: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
    } catch (err) {
      // fall through to the Image-based fallback below
    }
  }
  const dataUrl = await readAsDataURL(file);
  const img = await loadImage(dataUrl);
  return { drawable: img, width: img.width, height: img.height, close: () => {} };
}

const THUMB_SIZE = 64;
const ANTHRACITE = '#2b2b2b';

// ---------- Resize ----------
function coverRatioBox(srcW, srcH, ratio) {
  // Largest box of the given ratio that fits entirely inside the source — crops the rest away.
  const srcRatio = srcW / srcH;
  let w, h;
  if (srcRatio > ratio) { h = srcH; w = h * ratio; } else { w = srcW; h = w / ratio; }
  return { w: Math.round(w), h: Math.round(h) };
}

function containRatioBox(srcW, srcH, ratio) {
  // Smallest box of the given ratio that fully contains the source — no upscale beyond what's needed.
  const h = Math.max(srcH, srcW / ratio);
  const w = h * ratio;
  return { w: Math.round(w), h: Math.round(h) };
}

function computeResizeTarget(srcW, srcH) {
  if (!resizeEnabled.checked) return null;
  const mode = resizeModeToggle.querySelector('.seg-btn.active').dataset.mode;

  if (mode === 'percent') {
    const pct = (parseFloat(resizePercentLabel.value) || 100) / 100;
    return { w: Math.max(1, Math.round(srcW * pct)), h: Math.max(1, Math.round(srcH * pct)), fit: 'scale' };
  }

  if (mode === 'preset') {
    if (!resizePreset.value) return null;
    const [kind, dims] = resizePreset.value.split(':');
    const [a, b] = dims.split('x').map(Number);
    const fitMode = resizeFitToggle.querySelector('.seg-btn.active').dataset.fit;
    const fillMode = resizeFillToggle.querySelector('.seg-btn.active').dataset.fill;
    const fit = fitMode === 'crop' ? 'cover' : 'contain';

    if (kind === 'print' || kind === 'fixed') {
      const cmToPx = parseInt(resizeDpi.value) / 2.54;
      const w = kind === 'print' ? Math.round(a * cmToPx) : a;
      const h = kind === 'print' ? Math.round(b * cmToPx) : b;
      return { w, h, fit, fill: fillMode };
    }

    if (kind === 'ratio') {
      const ratio = a / b;
      const box = fit === 'cover' ? coverRatioBox(srcW, srcH, ratio) : containRatioBox(srcW, srcH, ratio);
      return { ...box, fit, fill: fillMode };
    }
    return null;
  }

  // Pixel mode
  const wIn = parseInt(resizeWidth.value) || null;
  const hIn = parseInt(resizeHeight.value) || null;

  if (resizeLockRatio.checked) {
    if (wIn && hIn) {
      const scale = Math.min(wIn / srcW, hIn / srcH);
      return { w: Math.max(1, Math.round(srcW * scale)), h: Math.max(1, Math.round(srcH * scale)), fit: 'scale' };
    }
    if (wIn) return { w: wIn, h: Math.max(1, Math.round(srcH * (wIn / srcW))), fit: 'scale' };
    if (hIn) return { w: Math.max(1, Math.round(srcW * (hIn / srcH))), h: hIn, fit: 'scale' };
    return null;
  }

  if (!wIn || !hIn) return null; // an exact box needs both sides when ratio isn't locked
  const fitMode = resizeFitToggle.querySelector('.seg-btn.active').dataset.fit; // 'crop' | 'fit'
  const fillMode = resizeFillToggle.querySelector('.seg-btn.active').dataset.fill; // 'white' | 'black' | 'blur'
  return { w: wIn, h: hIn, fit: fitMode === 'crop' ? 'cover' : 'contain', fill: fillMode };
}

function buildResizedCanvas(source) {
  const target = computeResizeTarget(source.width, source.height);
  const canvas = document.createElement('canvas');

  if (!target) {
    canvas.width = source.width;
    canvas.height = source.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source.drawable, 0, 0);
    return canvas;
  }

  canvas.width = target.w;
  canvas.height = target.h;
  const ctx = canvas.getContext('2d');

  if (target.fit === 'scale') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source.drawable, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  if (target.fit === 'cover') {
    // Center-crop the source to the target's aspect ratio, then scale to fill it exactly.
    const srcRatio = source.width / source.height;
    const dstRatio = target.w / target.h;
    let sx, sy, sw, sh;
    if (srcRatio > dstRatio) {
      sh = source.height; sw = sh * dstRatio; sy = 0; sx = (source.width - sw) / 2;
    } else {
      sw = source.width; sh = sw / dstRatio; sx = 0; sy = (source.height - sh) / 2;
    }
    ctx.drawImage(source.drawable, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  // 'contain': the whole image fits inside the target box; the leftover border gets filled.
  const scale = Math.min(target.w / source.width, target.h / source.height);
  const dw = source.width * scale, dh = source.height * scale;
  const dx = (target.w - dw) / 2, dy = (target.h - dh) / 2;

  if (target.fill === 'blur') {
    ctx.save();
    ctx.filter = 'blur(24px)';
    const bgScale = Math.max(target.w / source.width, target.h / source.height) * 1.1;
    const bw = source.width * bgScale, bh = source.height * bgScale;
    ctx.drawImage(source.drawable, (target.w - bw) / 2, (target.h - bh) / 2, bw, bh);
    ctx.restore();
  } else {
    ctx.fillStyle = target.fill === 'black' ? ANTHRACITE : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(source.drawable, dx, dy, dw, dh);
  return canvas;
}

// ---------- Rotation ----------
// Applied to the decoded source BEFORE resizing, not after — so a preset
// like 16:9 stays 16:9 once the image is rotated, instead of the resize
// math computing the ratio against the pre-rotation dimensions and then
// having rotation swap width/height underneath it.
function rotateSource(source, angleDeg) {
  const angle = ((angleDeg % 360) + 360) % 360;
  if (angle === 0) return source;
  const swapped = angle % 180 !== 0;
  const canvas = document.createElement('canvas');
  canvas.width = swapped ? source.height : source.width;
  canvas.height = swapped ? source.width : source.height;
  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(angle * Math.PI / 180);
  ctx.drawImage(source.drawable, -source.width / 2, -source.height / 2);
  return { drawable: canvas, width: canvas.width, height: canvas.height, close: () => {} };
}

// ---------- Shared output pipeline (resize + rotate + encode + EXIF) ----------
// Used for the initial conversion, live re-encodes when Quality/Resize
// change, and single-image rotation — always re-decoding from the original
// file, never compounding loss on top of a previous JPG output.
async function buildOutput(file, rotation) {
  const source = await loadSource(file);
  const originalWidth = source.width;
  const originalHeight = source.height;
  const rotated = rotateSource(source, rotation);
  const canvas = buildResizedCanvas(rotated);
  source.close();

  const quality = parseInt(qualitySlider.value) / 100;
  let blob = await canvasToBlob(canvas, quality);
  const exifSegment = await getExifSegment(file);
  if (exifSegment) {
    patchOrientation(exifSegment);
    blob = await insertExifSegment(blob, exifSegment);
  }

  const scale = Math.min(1, THUMB_SIZE / Math.max(canvas.width, canvas.height));
  const tw = Math.max(1, Math.round(canvas.width * scale));
  const th = Math.max(1, Math.round(canvas.height * scale));
  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = tw;
  thumbCanvas.height = th;
  thumbCanvas.getContext('2d').drawImage(canvas, 0, 0, tw, th);
  const thumbBlob = await canvasToBlob(thumbCanvas, 0.6);

  return { blob, thumbBlob, originalWidth, originalHeight };
}

async function processFile(file) {
  counter += 1;
  const index = counter;
  const qualityPercent = parseInt(qualitySlider.value);

  const dateObj = await getFileDate(file);
  let output;
  try {
    output = await buildOutput(file, 0);
  } catch (err) {
    alert(`Could not read "${file.name}" as an image.`);
    return;
  }
  const thumbUrl = URL.createObjectURL(output.thumbBlob);
  const baseName = computeName(file.name, index, dateObj, qualityPercent);
  addItem(file, output.blob, thumbUrl, baseName, index, dateObj, qualityPercent, output.originalWidth, output.originalHeight);
}

function updateBulkButtons() {
  const showBulk = processed.length > 1 ? 'block' : 'none';
  const showAny = processed.length > 0 ? 'block' : 'none';
  allBtn.style.display = showBulk;
  downloadAllBtn.style.display = showBulk;
  clearAllBtn.style.display = showAny;
  resetAllBtn.style.display = showAny;
  exportAllBtn.style.display = showAny;
  exportZipBtn.style.display = showBulk;
  updateResizeInfo();
}

function addItem(file, blob, thumbUrl, baseName, index, dateObj, quality, originalWidth, originalHeight) {
  const id = ++itemCounter;
  const row = document.createElement('div');
  row.className = 'item';
  row.dataset.id = id;

  const itemRow = document.createElement('div');
  itemRow.className = 'item-row';

  const summary = document.createElement('div');
  summary.className = 'item-summary';
  summary.title = 'Tap to expand';
  summary.addEventListener('click', () => toggleItemDetail(id));

  const thumb = document.createElement('img');
  thumb.className = 'thumb';
  thumb.src = thumbUrl;

  const info = document.createElement('div');
  info.className = 'info';
  const savings = Math.round((1 - blob.size / file.size) * 100);

  const nameEl = document.createElement('div');
  nameEl.className = 'name';
  nameEl.textContent = baseName;
  nameEl.title = baseName;

  const sizes = document.createElement('div');
  sizes.className = 'sizes';
  sizes.textContent = `${formatSize(file.size)} → ${formatSize(blob.size)}${savings > 0 ? ' · ' + savings + '% smaller' : ''}`;

  info.appendChild(nameEl);
  info.appendChild(sizes);
  summary.appendChild(thumb);
  summary.appendChild(info);

  const url = URL.createObjectURL(blob);
  const dl = document.createElement('a');
  dl.className = 'dl';
  dl.href = url;
  dl.download = baseName;
  dl.textContent = 'Save';

  const remove = document.createElement('button');
  remove.className = 'remove';
  remove.innerHTML = '&times;';
  remove.title = 'Remove';
  remove.addEventListener('click', () => {
    const current = processed.find(p => p.id === id);
    if (current) {
      URL.revokeObjectURL(current.url);
      URL.revokeObjectURL(current.thumbUrl);
      if (openItemId === id) openItemId = null;
    }
    row.remove();
    processed = processed.filter(p => p.id !== id);
    resolveDuplicateNames();
    updateBulkButtons();
  });

  itemRow.appendChild(summary);
  itemRow.appendChild(dl);
  itemRow.appendChild(remove);

  // ---- Expandable detail panel: full image + rotate/rename/reset ----
  const detail = document.createElement('div');
  detail.className = 'item-detail';
  detail.style.display = 'none';

  const detailImg = document.createElement('img');
  detail.appendChild(detailImg);

  const actions = document.createElement('div');
  actions.className = 'item-detail-actions';
  const rotateBtn = document.createElement('button');
  rotateBtn.textContent = '🔄 Rotate';
  const renameBtn = document.createElement('button');
  renameBtn.textContent = '✏️ Rename';
  const resetBtn = document.createElement('button');
  resetBtn.textContent = '↺ Reset';
  actions.appendChild(rotateBtn);
  actions.appendChild(renameBtn);
  actions.appendChild(resetBtn);
  detail.appendChild(actions);

  const renameFields = document.createElement('div');
  renameFields.className = 'item-rename-fields';
  const renameRow = document.createElement('div');
  renameRow.className = 'row';
  const renameInput = document.createElement('input');
  renameInput.type = 'text';
  renameInput.placeholder = 'Custom name (without .jpg)';
  renameRow.appendChild(renameInput);
  const renameLockRow = document.createElement('div');
  renameLockRow.className = 'toggle-row';
  const renameLockLabel = document.createElement('label');
  renameLockLabel.textContent = "Keep this name even if Rename files changes";
  const renameLock = document.createElement('input');
  renameLock.type = 'checkbox';
  renameLockRow.appendChild(renameLockLabel);
  renameLockRow.appendChild(renameLock);
  const renameSaveBtn = document.createElement('button');
  renameSaveBtn.className = 'btn-secondary';
  renameSaveBtn.style.cssText = 'width:100%; margin-top:8px; background:var(--surface-2); color:var(--text); border:1px solid var(--border); padding:9px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;';
  renameSaveBtn.textContent = 'Save name';
  renameFields.appendChild(renameRow);
  renameFields.appendChild(renameLockRow);
  renameFields.appendChild(renameSaveBtn);
  detail.appendChild(renameFields);

  row.appendChild(itemRow);
  row.appendChild(detail);
  list.appendChild(row);

  const item = {
    id, index, file, originalName: file.name, originalSize: file.size,
    baseName, name: baseName, blob, url, thumbUrl, nameEl, sizesEl: sizes, thumbEl: thumb, dlEl: dl,
    dateObj, quality, rotation: 0, originalWidth, originalHeight,
    customName: null, nameLocked: false,
    detailEl: detail, detailImgEl: detailImg, renameFieldsEl: renameFields,
    renameInputEl: renameInput, renameLockEl: renameLock
  };
  processed.push(item);

  rotateBtn.addEventListener('click', async () => {
    await rotateItem(item);
    detailImg.src = item.url;
    showToast('Image rotated');
  });
  renameBtn.addEventListener('click', () => {
    renameFields.classList.toggle('open');
  });
  renameSaveBtn.addEventListener('click', () => {
    const val = renameInput.value.trim();
    if (val) {
      item.customName = val;
      item.nameLocked = renameLock.checked;
    } else {
      item.customName = null;
      item.nameLocked = false;
    }
    updateAllNames();
    renameFields.classList.remove('open');
    showToast(item.nameLocked ? 'Name saved and locked' : 'Name updated');
  });
  resetBtn.addEventListener('click', async () => {
    item.customName = null;
    item.nameLocked = false;
    item.rotation = 0;
    renameInput.value = '';
    renameLock.checked = false;
    renameFields.classList.remove('open');
    await reencodeItem(item);
    updateAllNames();
    detailImg.src = item.url;
    showToast('Image reset');
  });

  resolveDuplicateNames();
  updateBulkButtons();
  updateResizeInfo();
}

clearAllBtn.addEventListener('click', () => {
  if (processed.length === 0) return;
  if (!confirm(`Remove all ${processed.length} images from the list? This can't be undone.`)) return;
  processed.forEach(p => {
    URL.revokeObjectURL(p.url);
    URL.revokeObjectURL(p.thumbUrl);
  });
  processed = [];
  list.innerHTML = '';
  counter = 0;
  itemCounter = 0;
  updateBulkButtons();
});

resetAllBtn.addEventListener('click', async () => {
  if (!confirm('Reset all settings to default? Your uploaded images stay in the list.')) return;

  // Quality
  qualitySlider.value = 75;
  qualityLabel.textContent = '75%';
  localStorage.setItem('jpg75-quality', '75');
  document.getElementById('qualityFieldLabel').classList.remove('is-modified');

  // Resize
  resizeEnabled.checked = false;
  resizeFields.style.display = 'none';
  setActiveSeg(resizeModeToggle, 'mode', 'percent');
  resizePercent.value = 100;
  resizePercentLabel.value = 100;
  localStorage.setItem('jpg75-resizePercent', '100');
  document.getElementById('resizePercentFieldLabel').classList.remove('is-modified');
  resizeWidth.value = '';
  resizeHeight.value = '';
  resizeLockRatio.checked = true;
  resizePreset.value = '';
  resizeDpi.value = '300';
  setActiveSeg(resizeFitToggle, 'fit', 'crop');
  setActiveSeg(resizeFillToggle, 'fill', 'white');
  updateResizeSubfieldsVisibility();
  updateResizeInfo();

  // Rename
  renameEnabled.checked = false;
  renameFields.style.display = 'none';
  patternInput.value = '';
  patternPreset.value = '';
  updatePreview();

  // Export
  setActiveSeg(exportFormatToggle, 'format', 'png');
  exportPngFields.style.display = 'block';
  exportWebpFields.style.display = 'none';
  exportColor.value = '#ffffff';
  localStorage.setItem('jpg75-exportColor', '#ffffff');
  document.getElementById('exportColorFieldLabel').classList.remove('is-modified');
  exportTolerance.value = 15;
  exportToleranceLabel.textContent = '15%';
  localStorage.setItem('jpg75-exportTolerance', '15');
  document.getElementById('exportToleranceFieldLabel').classList.remove('is-modified');

  // Per-image rotation and name overrides
  processed.forEach(p => {
    p.rotation = 0;
    p.customName = null;
    p.nameLocked = false;
    if (p.renameInputEl) p.renameInputEl.value = '';
    if (p.renameLockEl) p.renameLockEl.checked = false;
    if (p.renameFieldsEl) p.renameFieldsEl.classList.remove('open');
  });

  if (processed.length > 0) await reprocessAll();
  updateAllNames();
  showToast('Settings reset to default');
});

downloadAllBtn.addEventListener('click', () => {
  processed.forEach((p, i) => {
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = p.url;
      a.download = p.name;
      a.click();
    }, i * 150);
  });
});

allBtn.addEventListener('click', async () => {
  const zip = new JSZip();
  const usedNames = new Set();
  processed.forEach(p => {
    let name = p.name;
    let i = 1;
    while (usedNames.has(name)) {
      name = p.name.replace(/\.jpg$/, `(${i}).jpg`);
      i++;
    }
    usedNames.add(name);
    zip.file(name, p.blob);
  });
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'jpg75.zip';
  a.click();
});
