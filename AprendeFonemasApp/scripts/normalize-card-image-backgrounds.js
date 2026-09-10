// Quita fondos blancos, grises y oscuros de PNG de palabras/frases (transparencia real)
// node scripts/normalize-card-image-backgrounds.js
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const TOLERANCE = 28;
const CARD_WHITE = [255, 255, 255];
const MIN_OPAQUE_RATIO = 0.08;
const MAX_TRANSPARENT_PCT = 93;

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

function isBackgroundPixel(r, g, b, bgColors) {
  return bgColors.some(([br, bg, bb]) => colorDist(r, g, b, br, bg, bb) <= TOLERANCE);
}

function isLightRemovable(r, g, b) {
  const s = saturation(r, g, b);
  const lum = luminance(r, g, b);
  if (lum > 228 && s < 18) return true;
  if (lum > 205 && s < 12) return true;
  if (lum > 188 && s < 8) return true;
  if (s < 8 && lum > 158) return true;
  return false;
}

function isDarkRemovable(r, g, b) {
  const lum = luminance(r, g, b);
  const s = saturation(r, g, b);
  if (lum < 38) return true;
  if (lum < 72 && r < 98 && g < 72 && b < 58) return true;
  if (lum < 95 && s < 22 && r < 120 && g < 110 && b < 100) return true;
  return false;
}

function isRemovablePixel(r, g, b, bgColors) {
  return isBackgroundPixel(r, g, b, bgColors) || isLightRemovable(r, g, b) || isDarkRemovable(r, g, b);
}

function isCharacterPixel(r, g, b) {
  const s = saturation(r, g, b);
  const lum = luminance(r, g, b);
  return s > 42 && lum > 55;
}

function collectCornerSamples(data, width, height) {
  const samples = [];
  const points = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [Math.floor(width * 0.05), Math.floor(height * 0.05)],
    [Math.floor(width * 0.95), Math.floor(height * 0.05)],
    [Math.floor(width * 0.05), Math.floor(height * 0.95)],
    [Math.floor(width * 0.95), Math.floor(height * 0.95)],
  ];

  for (const [x, y] of points) {
    const i = (width * y + x) << 2;
    if (data[i + 3] > 20) {
      samples.push([data[i], data[i + 1], data[i + 2]]);
    }
  }
  return samples;
}

function uniqueBgColors(samples) {
  const colors = [...samples];
  const defaults = [
    CARD_WHITE,
    [254, 254, 254],
    [253, 253, 253],
    [252, 252, 252],
    [250, 250, 250],
    [248, 248, 248],
    [245, 245, 245],
    [240, 240, 240],
    [238, 238, 238],
    [235, 235, 235],
    [230, 230, 230],
    [221, 221, 221],
    [204, 204, 204],
    [192, 192, 192],
    [0, 0, 0],
    [12, 12, 12],
    [24, 18, 12],
    [32, 24, 16],
    [48, 36, 24],
  ];
  for (const c of defaults) {
    if (!colors.some((s) => colorDist(s[0], s[1], s[2], c[0], c[1], c[2]) < 8)) {
      colors.push(c);
    }
  }
  const merged = [];
  for (const c of colors) {
    if (!merged.some((m) => colorDist(m[0], m[1], m[2], c[0], c[1], c[2]) < 12)) {
      merged.push(c);
    }
  }
  return merged;
}

function makeTransparent(data, idx) {
  data[(idx << 2) + 3] = 0;
}

function countOpaque(data) {
  let opaque = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] >= 20) opaque += 1;
  }
  return opaque;
}

function floodFromBorder(data, width, height, isRemovable) {
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
    if (!isRemovable(data[i], data[i + 1], data[i + 2])) return;
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
    if (data[(idx << 2) + 3] >= 20) {
      makeTransparent(data, idx);
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

function expandFromTransparent(data, width, height, isRemovable) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  for (let idx = 0; idx < width * height; idx += 1) {
    if (data[(idx << 2) + 3] < 20) {
      visited[idx] = 1;
      queue.push(idx);
    }
  }

  let removed = 0;
  while (queue.length) {
    const idx = queue.pop();
    const x = idx % width;
    const y = (idx - x) / width;

    for (const [dx, dy] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const ni = ny * width + nx;
      if (visited[ni]) continue;
      const i = ni << 2;
      if (data[i + 3] < 20) {
        visited[ni] = 1;
        queue.push(ni);
        continue;
      }
      if (!isRemovable(data[i], data[i + 1], data[i + 2])) continue;
      visited[ni] = 1;
      queue.push(ni);
      makeTransparent(data, ni);
      removed += 1;
    }
  }
  return removed;
}

function removeBottomFloor(data, width, height) {
  const maxRows = Math.floor(height * 0.34);
  let removed = 0;

  for (let x = 0; x < width; x += 1) {
    let streak = 0;
    for (let row = 0; row < maxRows; row += 1) {
      const y = height - 1 - row;
      const idx = y * width + x;
      const i = idx << 2;
      if (data[i + 3] < 20) break;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (!isDarkRemovable(r, g, b) && !isLightRemovable(r, g, b)) break;
      makeTransparent(data, idx);
      removed += 1;
      streak += 1;
      if (streak > 0 && row === maxRows - 1) break;
    }
  }
  return removed;
}

function componentHasCharacterPixels(data, component) {
  let colorful = 0;
  for (const idx of component) {
    const i = idx << 2;
    if (isCharacterPixel(data[i], data[i + 1], data[i + 2])) colorful += 1;
    if (colorful >= 12) return true;
  }
  return false;
}

function removeEnclosedPockets(data, width, height, maskFn, minSize, minAvgLum, maxAvgLum) {
  const n = width * height;
  const mask = new Uint8Array(n);
  for (let idx = 0; idx < n; idx += 1) {
    const i = idx << 2;
    if (data[i + 3] < 20) continue;
    if (maskFn(data[i], data[i + 1], data[i + 2])) mask[idx] = 1;
  }

  const visited = new Uint8Array(n);
  let removed = 0;

  for (let idx = 0; idx < n; idx += 1) {
    if (!mask[idx] || visited[idx]) continue;

    const stack = [idx];
    const component = [];
    let lumSum = 0;
    visited[idx] = 1;

    while (stack.length) {
      const cur = stack.pop();
      component.push(cur);
      const i = cur << 2;
      lumSum += luminance(data[i], data[i + 1], data[i + 2]);

      const x = cur % width;
      const y = (cur - x) / width;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const ni = ny * width + nx;
        if (mask[ni] && !visited[ni]) {
          visited[ni] = 1;
          stack.push(ni);
        }
      }
    }

    const avgLum = lumSum / component.length;
    if (component.length < minSize) continue;
    if (avgLum < minAvgLum || avgLum > maxAvgLum) continue;
    if (componentHasCharacterPixels(data, component)) continue;

    for (const c of component) {
      makeTransparent(data, c);
      removed += 1;
    }
  }

  return removed;
}

function softenEdges(data, width, height, bgColors) {
  const copy = Buffer.from(data);
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const idx = y * width + x;
      const i = idx << 2;
      if (copy[i + 3] === 0) continue;

      let transparentNeighbors = 0;
      for (const [dx, dy] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        const ni = ((y + dy) * width + (x + dx)) << 2;
        if (copy[ni + 3] === 0) transparentNeighbors += 1;
      }

      const r = copy[i];
      const g = copy[i + 1];
      const b = copy[i + 2];
      if (
        transparentNeighbors > 0 &&
        (isRemovablePixel(r, g, b, bgColors) || isLightRemovable(r, g, b) || isDarkRemovable(r, g, b))
      ) {
        data[i + 3] = 0;
      }
    }
  }
}

function processBuffer(originalBuffer, mode = 'full') {
  const png = PNG.sync.read(Buffer.from(originalBuffer));
  const { width, height, data } = png;
  const initialOpaque = countOpaque(data);

  const cornerSamples = collectCornerSamples(data, width, height);
  const bgColors = uniqueBgColors(cornerSamples);
  const isRemovable = (r, g, b) => isRemovablePixel(r, g, b, bgColors);
  const isCheckerGray = (r, g, b) => {
    const s = saturation(r, g, b);
    const lum = luminance(r, g, b);
    return s < 8 && lum > 158 && lum < 245;
  };

  const border = floodFromBorder(data, width, height, isRemovable);
  let expandLight = 0;
  if (mode !== 'border-only') {
    expandLight = expandFromTransparent(data, width, height, (r, g, b) =>
      isRemovablePixel(r, g, b, bgColors) || isLightRemovable(r, g, b) || isCheckerGray(r, g, b)
    );
  }

  let expandDark = 0;
  let floor = 0;
  let darkPockets = 0;
  let lightPockets = 0;

  if (mode !== 'border' && mode !== 'border-only') {
    expandDark = expandFromTransparent(data, width, height, isDarkRemovable);
  }
  if (mode === 'full') {
    floor = removeBottomFloor(data, width, height);
    darkPockets = removeEnclosedPockets(data, width, height, isDarkRemovable, 4500, 0, 58);
    lightPockets = removeEnclosedPockets(data, width, height, isLightRemovable, 14000, 188, 255);
    removeEnclosedPockets(data, width, height, isCheckerGray, 800, 155, 248);
  }

  softenEdges(data, width, height, bgColors);

  const finalOpaque = countOpaque(data);
  const transparentPct = Math.round(
    ((width * height - finalOpaque) / (width * height)) * 100
  );

  if (
    mode === 'full' &&
    (finalOpaque < initialOpaque * MIN_OPAQUE_RATIO || transparentPct > MAX_TRANSPARENT_PCT)
  ) {
    return { reverted: true, initialOpaque, finalOpaque, transparentPct };
  }

  return {
    reverted: false,
    png,
    border,
    expandLight,
    expandDark,
    floor,
    darkPockets,
    lightPockets,
    transparentPct,
    keptPct: initialOpaque ? Math.round((finalOpaque / initialOpaque) * 100) : 100,
    mode,
  };
}

function processCheckerFix(filePath) {
  const originalBuffer = fs.readFileSync(filePath);
  let result = processBuffer(originalBuffer, 'border-only');
  if (result.reverted) return { file: path.basename(filePath), reverted: true };

  const { width, height, data } = result.png;
  const cornerSamples = collectCornerSamples(data, width, height);
  const bgColors = uniqueBgColors(cornerSamples);
  const isCheckerGray = (r, g, b) => {
    const s = saturation(r, g, b);
    const lum = luminance(r, g, b);
    return s < 10 && lum > 155 && lum < 248;
  };

  const checkerPockets = removeEnclosedPockets(data, width, height, isCheckerGray, 400, 155, 248);
  const checkerExpand = expandFromTransparent(data, width, height, isCheckerGray);
  softenEdges(data, width, height, bgColors);

  const finalOpaque = countOpaque(data);
  const transparentPct = Math.round(
    ((width * height - finalOpaque) / (width * height)) * 100
  );

  fs.writeFileSync(filePath, PNG.sync.write(result.png));
  return {
    file: path.basename(filePath),
    reverted: false,
    checkerFix: true,
    checkerPockets,
    checkerExpand,
    transparentPct,
  };
}

function processFile(filePath, mode = forcedMode) {
  if (mode === 'checker-fix') {
    return processCheckerFix(filePath);
  }
  const originalBuffer = fs.readFileSync(filePath);
  let result = processBuffer(originalBuffer, mode);
  if (result.reverted && mode === 'full') {
    result = processBuffer(originalBuffer, 'border-only');
    if (!result.reverted) {
      fs.writeFileSync(filePath, PNG.sync.write(result.png));
      return { file: path.basename(filePath), reverted: false, fallbackBorder: true, ...result };
    }
    return { file: path.basename(filePath), reverted: true, ...result };
  }

  if (result.reverted) {
    return { file: path.basename(filePath), reverted: true, ...result };
  }

  fs.writeFileSync(filePath, PNG.sync.write(result.png));
  return { file: path.basename(filePath), reverted: false, ...result };
}

function listPngFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.png'))
    .map((f) => path.join(dir, f));
}

const root = path.join(__dirname, '..');
const dirs = [
  path.join(root, 'assets/images/words'),
  path.join(root, 'assets/images/sentences'),
];

const seen = new Set();
const files = [];
for (const dir of dirs) {
  for (const file of listPngFiles(dir)) {
    const key = file.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    files.push(file);
  }
}

const onlyArgs = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const forcedMode = process.argv.includes('--checker-fix')
  ? 'checker-fix'
  : process.argv.includes('--border-only')
    ? 'border-only'
    : 'full';
const targetFiles = onlyArgs.length
  ? onlyArgs.map((f) => path.resolve(f))
  : files;

if (!targetFiles.length) {
  console.error('No se encontraron PNG en words/ ni sentences/');
  process.exit(1);
}

console.log(`Procesando ${targetFiles.length} imágenes (seguro: fondo claro + oscuro + suelo)…`);
let reverted = 0;
for (const file of targetFiles.sort()) {
  const stats = processFile(file);
  if (stats.reverted) {
    reverted += 1;
    console.log(`${stats.file}: REVERTIDA (protección anti-borrado)`);
  } else if (stats.checkerFix) {
    console.log(`${stats.file}: ${stats.transparentPct}% transp (checker fix)`);
  } else if (stats.fallbackBorder) {
    console.log(`${stats.file}: ${stats.transparentPct}% transp (solo fondo claro), conserva ${stats.keptPct}%`);
  } else {
    console.log(`${stats.file}: ${stats.transparentPct}% transp, conserva ${stats.keptPct}%`);
  }
}
console.log(`Listo. ${targetFiles.length} archivos, ${reverted} revertidos por seguridad.`);
