// Solo redimensiona PNG a 1024×1024. NO quita fondos.
// node scripts/normalize-word-images.js [carpeta]
// Por defecto: assets/images/words

const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const SIZE = 1024;
const ROOT = path.join(__dirname, '..');
const dirArg = process.argv[2] || path.join(ROOT, 'assets', 'images', 'words');
const DIR = path.resolve(dirArg);

function resizeBilinear(src, targetW, targetH) {
  const out = new PNG({ width: targetW, height: targetH });
  const sw = src.width;
  const sh = src.height;
  const sdata = src.data;
  const ddata = out.data;

  for (let y = 0; y < targetH; y += 1) {
    const sy = ((y + 0.5) * sh) / targetH - 0.5;
    const y0 = Math.max(0, Math.floor(sy));
    const y1 = Math.min(sh - 1, y0 + 1);
    const fy = sy - y0;

    for (let x = 0; x < targetW; x += 1) {
      const sx = ((x + 0.5) * sw) / targetW - 0.5;
      const x0 = Math.max(0, Math.floor(sx));
      const x1 = Math.min(sw - 1, x0 + 1);
      const fx = sx - x0;

      const i00 = (sw * y0 + x0) << 2;
      const i10 = (sw * y0 + x1) << 2;
      const i01 = (sw * y1 + x0) << 2;
      const i11 = (sw * y1 + x1) << 2;
      const di = (targetW * y + x) << 2;

      for (let c = 0; c < 4; c += 1) {
        const v0 = sdata[i00 + c] * (1 - fx) + sdata[i10 + c] * fx;
        const v1 = sdata[i01 + c] * (1 - fx) + sdata[i11 + c] * fx;
        ddata[di + c] = Math.round(v0 * (1 - fy) + v1 * fy);
      }
    }
  }

  return out;
}

const files = fs
  .readdirSync(DIR)
  .filter((f) => f.toLowerCase().endsWith('.png'))
  .map((f) => path.join(DIR, f))
  .sort();

if (!files.length) {
  console.error('No hay PNG en', DIR);
  process.exit(1);
}

console.log(`Redimensionando ${files.length} PNG → ${SIZE}×${SIZE} (sin tocar fondos)`);
for (const file of files) {
  const name = path.basename(file);
  const png = PNG.sync.read(fs.readFileSync(file));
  if (png.width === SIZE && png.height === SIZE) {
    console.log(JSON.stringify({ file: name, skipped: true, size: `${SIZE}x${SIZE}` }));
    continue;
  }
  const out = resizeBilinear(png, SIZE, SIZE);
  fs.writeFileSync(file, PNG.sync.write(out));
  console.log(
    JSON.stringify({
      file: name,
      from: `${png.width}x${png.height}`,
      to: `${SIZE}x${SIZE}`,
    })
  );
}
console.log('Listo.');
