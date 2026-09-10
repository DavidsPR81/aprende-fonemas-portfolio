/**
 * Reduce peso de PNG de cards: reescala a maxSide (default 512) y reescribe PNG.
 * Las cards se muestran ~112–200 px; 512 cubre retina tablet.
 *
 * node scripts/compress-card-images.js
 * node scripts/compress-card-images.js --side=512 --dirs=words,sentences
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const ROOT = path.join(__dirname, '..', 'assets', 'images');
const args = process.argv.slice(2);
const sideArg = args.find((a) => a.startsWith('--side='));
const dirsArg = args.find((a) => a.startsWith('--dirs='));
const MAX_SIDE = sideArg ? Number(sideArg.split('=')[1]) : 512;
const DIRS = (dirsArg ? dirsArg.split('=')[1] : 'words,sentences').split(',');

function resizeNearest(src, maxSide) {
  const { width, height, data } = src;
  const scale = Math.min(1, maxSide / Math.max(width, height));
  if (scale >= 0.999) return null;

  const w2 = Math.max(1, Math.round(width * scale));
  const h2 = Math.max(1, Math.round(height * scale));
  const out = new PNG({ width: w2, height: h2 });

  for (let y = 0; y < h2; y += 1) {
    for (let x = 0; x < w2; x += 1) {
      const sx = Math.min(width - 1, Math.floor(x / scale));
      const sy = Math.min(height - 1, Math.floor(y / scale));
      const si = (width * sy + sx) << 2;
      const di = (w2 * y + x) << 2;
      out.data[di] = data[si];
      out.data[di + 1] = data[si + 1];
      out.data[di + 2] = data[si + 2];
      out.data[di + 3] = data[si + 3];
    }
  }
  return out;
}

function processDir(name) {
  const dir = path.join(ROOT, name);
  if (!fs.existsSync(dir)) {
    console.warn('No existe:', dir);
    return { n: 0, before: 0, after: 0 };
  }

  let n = 0;
  let before = 0;
  let after = 0;

  for (const file of fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.png'))) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath);
    before += raw.length;

    const png = PNG.sync.read(raw);
    const resized = resizeNearest(png, MAX_SIDE);
    const outPng = resized || png;
    const buf = PNG.sync.write(outPng);
    fs.writeFileSync(filePath, buf);
    after += buf.length;
    n += 1;
  }

  return { n, before, after };
}

let totalBefore = 0;
let totalAfter = 0;
let totalN = 0;

console.log(`Comprimiendo PNG → lado máx. ${MAX_SIDE}px`);
for (const d of DIRS) {
  const r = processDir(d.trim());
  totalN += r.n;
  totalBefore += r.before;
  totalAfter += r.after;
  console.log(
    `  ${d}: ${r.n} archivos · ${(r.before / 1024 / 1024).toFixed(1)} MB → ${(r.after / 1024 / 1024).toFixed(1)} MB`
  );
}

console.log(
  `TOTAL: ${totalN} · ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(totalAfter / 1024 / 1024).toFixed(1)} MB`
);
