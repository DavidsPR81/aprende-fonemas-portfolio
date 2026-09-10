/**
 * Solo quita fondos casi blancos conectados al BORDE (transparencia).
 * No toca el dibujo, no quita negros, no borra bolsillos internos de color.
 * Reintentos al escribir (Windows / Expo a veces bloquean el PNG).
 *
 * node scripts/unify-card-white-backgrounds.js
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const WHITE = [255, 255, 255];
const WHITE_DIST = 22;
const MIN_LUM = 235;
const MAX_SAT = 14;
const MIN_KEEP_RATIO = 0.12;
const WRITE_RETRIES = 8;

function colorDist(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function saturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max ? ((max - min) / max) * 100 : 0;
}

function luminance(r, g, b) {
  return (r + g + b) / 3;
}

function isNearWhiteBg(r, g, b) {
  if (colorDist(r, g, b, WHITE[0], WHITE[1], WHITE[2]) <= WHITE_DIST) return true;
  const lum = luminance(r, g, b);
  const sat = saturation(r, g, b);
  return lum >= MIN_LUM && sat <= MAX_SAT;
}

function countOpaque(data) {
  let n = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] >= 20) n += 1;
  }
  return n;
}

function floodWhiteFromBorder(data, width, height) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx << 2;
    if (data[i + 3] < 20) {
      visited[idx] = 1;
      queue.push(idx);
      return;
    }
    if (!isNearWhiteBg(data[i], data[i + 1], data[i + 2])) return;
    visited[idx] = 1;
    queue.push(idx);
  };

  for (let x = 0; x < width; x += 1) {
    tryPush(x, 0);
    tryPush(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    tryPush(0, y);
    tryPush(width - 1, y);
  }

  let removed = 0;
  while (queue.length) {
    const idx = queue.pop();
    const i = idx << 2;
    if (data[i + 3] >= 20) {
      data[i + 3] = 0;
      removed += 1;
    }
    const x = idx % width;
    const y = (idx - x) / width;
    tryPush(x - 1, y);
    tryPush(x + 1, y);
    tryPush(x, y - 1);
    tryPush(x, y + 1);
  }
  return removed;
}

function softenWhiteEdge(data, width, height) {
  const copy = Buffer.from(data);
  let removed = 0;
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = (y * width + x) << 2;
      if (copy[i + 3] < 20) continue;
      if (!isNearWhiteBg(copy[i], copy[i + 1], copy[i + 2])) continue;

      let nearT = 0;
      for (const [dx, dy] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        if (copy[((y + dy) * width + (x + dx)) * 4 + 3] < 20) nearT += 1;
      }
      if (nearT > 0) {
        data[i + 3] = 0;
        removed += 1;
      }
    }
  }
  return removed;
}

function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    /* busy wait: sync script, short retries only */
  }
}

function writePngSafe(filePath, buf) {
  const tmp = `${filePath}.tmp-${process.pid}.png`;
  let lastErr;
  for (let attempt = 1; attempt <= WRITE_RETRIES; attempt += 1) {
    try {
      fs.writeFileSync(tmp, buf);
      try {
        fs.renameSync(tmp, filePath);
      } catch (renameErr) {
        fs.copyFileSync(tmp, filePath);
        fs.unlinkSync(tmp);
      }
      return;
    } catch (err) {
      lastErr = err;
      try {
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
      } catch (_) {
        /* ignore */
      }
      sleep(120 * attempt);
    }
  }
  throw lastErr;
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath);
  const png = PNG.sync.read(Buffer.from(original));
  const { width, height, data } = png;
  const before = countOpaque(data);

  const removed = floodWhiteFromBorder(data, width, height);
  const soft = softenWhiteEdge(data, width, height);
  const after = countOpaque(data);

  if (before > 0 && after / before < MIN_KEEP_RATIO) {
    return { file: path.basename(filePath), reverted: true, removed, soft, before, after };
  }

  if (removed + soft === 0) {
    return { file: path.basename(filePath), skipped: true, removed: 0 };
  }

  writePngSafe(filePath, PNG.sync.write(png));
  return {
    file: path.basename(filePath),
    removed: removed + soft,
    keepPct: Math.round((after / before) * 100),
  };
}

function listPng(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.png'))
    .map((f) => path.join(dir, f));
}

const root = path.join(__dirname, '..');
const files = [
  ...listPng(path.join(root, 'assets/images/words')),
  ...listPng(path.join(root, 'assets/images/sentences')),
];

console.log(`Unificando fondos claros (solo borde) en ${files.length} PNG…`);
let ok = 0;
let skipped = 0;
let reverted = 0;
let failed = 0;
for (const file of files.sort()) {
  try {
    const stats = processFile(file);
    if (stats.reverted) {
      reverted += 1;
      console.log(`${stats.file}: REVERTIDA (protección)`);
    } else if (stats.skipped) {
      skipped += 1;
    } else {
      ok += 1;
      console.log(`${stats.file}: -${stats.removed} px fondo, conserva ${stats.keepPct}%`);
    }
  } catch (err) {
    failed += 1;
    console.error(`${path.basename(file)}: ERROR ${err.code || err.message}`);
  }
}
console.log(
  `Listo. actualizadas=${ok} sin cambios=${skipped} protegidas=${reverted} errores=${failed}`
);
if (failed > 0) process.exitCode = 1;
