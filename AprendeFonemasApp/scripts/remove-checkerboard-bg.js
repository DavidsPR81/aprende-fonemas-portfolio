// Quita checkerboard/blanco de PNG de mascota
// node scripts/remove-checkerboard-bg.js assets/images/mascot/normal.png
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const TOLERANCE = 28;

function colorDist(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function isBackgroundPixel(r, g, b, bgColors) {
  return bgColors.some(([br, bg, bb]) => colorDist(r, g, b, br, bg, bb) <= TOLERANCE);
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
  ];

  for (const [x, y] of points) {
    const i = (width * y + x) << 2;
    samples.push([data[i], data[i + 1], data[i + 2]]);
  }
  return samples;
}

function uniqueBgColors(samples) {
  const colors = [];
  for (const sample of samples) {
    if (!colors.some((c) => colorDist(c[0], c[1], c[2], sample[0], sample[1], sample[2]) < 8)) {
      colors.push(sample);
    }
  }
// Blanco + grises típicos de export con transparencia falsa
  colors.push([255, 255, 255], [204, 204, 204], [192, 192, 192], [238, 238, 238], [221, 221, 221]);
  const merged = [];
  for (const c of colors) {
    if (!merged.some((m) => colorDist(m[0], m[1], m[2], c[0], c[1], c[2]) < 12)) {
      merged.push(c);
    }
  }
  return merged;
}

function floodTransparent(data, width, height, bgColors) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx << 2;
    if (!isBackgroundPixel(data[i], data[i + 1], data[i + 2], bgColors)) return;
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
    data[i + 3] = 0;
    removed += 1;

    const x = idx % width;
    const y = (idx - x) / width;
    tryPush(x - 1, y);
    tryPush(x + 1, y);
    tryPush(x, y - 1);
    tryPush(x, y + 1);
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

      if (transparentNeighbors > 0 && isBackgroundPixel(copy[i], copy[i + 1], copy[i + 2], bgColors)) {
        data[i + 3] = 0;
      } else if (transparentNeighbors >= 2 && copy[i + 3] === 255) {
        const fringe = isBackgroundPixel(copy[i], copy[i + 1], copy[i + 2], bgColors);
        if (fringe) data[i + 3] = 0;
      }
    }
  }
}

function saturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max ? ((max - min) / max) * 100 : 0;
}

// Quita manchas internas de checkerboard (p. ej. dentro del brillo de premium)
function removeBgPockets(data, width, height, bgColors) {
  const n = width * height;
  const bgMask = new Uint8Array(n);

  for (let idx = 0; idx < n; idx += 1) {
    const i = idx << 2;
    if (data[i + 3] < 20) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (isBackgroundPixel(r, g, b, bgColors) || (saturation(r, g, b) < 8 && r > 175)) {
      bgMask[idx] = 1;
    }
  }

  const visited = new Uint8Array(n);
  let removed = 0;

  for (let idx = 0; idx < n; idx += 1) {
    if (!bgMask[idx] || visited[idx]) continue;

    const stack = [idx];
    const component = [];
    visited[idx] = 1;

    while (stack.length) {
      const cur = stack.pop();
      component.push(cur);
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
        if (bgMask[ni] && !visited[ni]) {
          visited[ni] = 1;
          stack.push(ni);
        }
      }
    }

    const touchesBorder = component.some(
      (c) => c < width || c >= n - width || c % width === 0 || c % width === width - 1
    );
    const isSmallSparkle = component.length <= 12;

    if (touchesBorder || (!isSmallSparkle && component.length > 20)) {
      for (const c of component) {
        data[(c << 2) + 3] = 0;
        removed += 1;
      }
    }
  }

  for (let pass = 0; pass < 3; pass += 1) {
    const copy = Buffer.from(data);
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const idx = y * width + x;
        const i = idx << 2;
        if (copy[i + 3] === 0) continue;
        if (!isBackgroundPixel(copy[i], copy[i + 1], copy[i + 2], bgColors) && saturation(copy[i], copy[i + 1], copy[i + 2]) >= 8) {
          continue;
        }

        let nearTransparent = 0;
        for (const [dx, dy] of [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ]) {
          const ni = ((y + dy) * width + (x + dx)) << 2;
          if (copy[ni + 3] === 0) nearTransparent += 1;
        }
        if (nearTransparent >= 2) data[i + 3] = 0;
      }
    }
  }

  return removed;
}

function isGlowPixel(r, g, b) {
  const s = saturation(r, g, b);
  if (s < 6) return true;
  if (s < 28 && r > 130 && g > 110 && b > 65) return true;
  return false;
}

function isSolidCharacter(r, g, b) {
  const s = saturation(r, g, b);
  if (b > 110 && b > r * 0.85 && r < 90) return true;
  if (r < 90 && g < 90) return true;
  if (s >= 28 && r > 150) return true;
  if (r > 200 && g > 150 && b < 100 && s > 18) return true;
  return false;
}

// Halo crema con checkerboard embebido (típico en premium.png)
function removeGlowHalo(data, width, height) {
  const n = width * height;
  const visited = new Uint8Array(n);
  const queue = [];
  let removed = 0;

  const tryPush = (idx) => {
    if (visited[idx]) return;
    const i = idx << 2;
    if (data[i + 3] < 20) {
      visited[idx] = 1;
      queue.push(idx);
      return;
    }
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (isSolidCharacter(r, g, b)) return;
    if (!isGlowPixel(r, g, b)) return;
    visited[idx] = 1;
    queue.push(idx);
  };

  for (let x = 0; x < width; x += 1) {
    tryPush(x);
    tryPush((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    tryPush(y * width);
    tryPush(y * width + width - 1);
  }

  while (queue.length) {
    const idx = queue.pop();
    const i = idx << 2;
    if (data[i + 3] > 0) {
      data[i + 3] = 0;
      removed += 1;
    }
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
      tryPush(ny * width + nx);
    }
  }

  return removed;
}

function removeSoftHalo(data, width, height) {
  const n = width * height;
  const softMask = new Uint8Array(n);

  for (let idx = 0; idx < n; idx += 1) {
    const i = idx << 2;
    if (data[i + 3] < 20) continue;
    if (!isSolidCharacter(data[i], data[i + 1], data[i + 2])) {
      softMask[idx] = 1;
    }
  }

  const visited = new Uint8Array(n);
  let removed = 0;

  for (let idx = 0; idx < n; idx += 1) {
    if (!softMask[idx] || visited[idx]) continue;

    const stack = [idx];
    const component = [];
    visited[idx] = 1;

    while (stack.length) {
      const cur = stack.pop();
      component.push(cur);
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
        if (softMask[ni] && !visited[ni]) {
          visited[ni] = 1;
          stack.push(ni);
        }
      }
    }

    if (component.length > 14) {
      for (const c of component) {
        data[(c << 2) + 3] = 0;
        removed += 1;
      }
    }
  }

  return removed;
}

function erodeGlowFringe(data, width, height) {
  let removed = 0;

  for (let pass = 0; pass < 6; pass += 1) {
    const copy = Buffer.from(data);
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const i = (width * y + x) << 2;
        if (copy[i + 3] === 0) continue;
        if (!isGlowPixel(copy[i], copy[i + 1], copy[i + 2])) continue;

        let nearTransparent = 0;
        for (const [dx, dy] of [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
          [-1, -1],
          [1, 1],
          [-1, 1],
          [1, -1],
        ]) {
          const ni = ((y + dy) * width + (x + dx)) << 2;
          if (copy[ni + 3] === 0) nearTransparent += 1;
        }
        if (nearTransparent >= 1) {
          data[i + 3] = 0;
          removed += 1;
        }
      }
    }
  }

  return removed;
}

function processFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  const png = PNG.sync.read(buffer);
  const { width, height, data } = png;

  const cornerSamples = collectCornerSamples(data, width, height);
  const bgColors = uniqueBgColors(cornerSamples);

  const removed = floodTransparent(data, width, height, bgColors);
  softenEdges(data, width, height, bgColors);
  const pockets = removeBgPockets(data, width, height, bgColors);
  const glow = removeGlowHalo(data, width, height);
  const soft = removeSoftHalo(data, width, height);
  const fringe = erodeGlowFringe(data, width, height);

  const out = PNG.sync.write(png);
  fs.writeFileSync(filePath, out);

  let transparent = 0;
  let opaque = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] === 0) transparent += 1;
    else opaque += 1;
  }

  return {
    file: path.basename(filePath),
    width,
    height,
    removed,
    pockets,
    glow,
    soft,
    fringe,
    transparentPct: Math.round((transparent / (transparent + opaque)) * 100),
  };
}

const targets = process.argv.slice(2);
if (!targets.length) {
  console.error('Indica uno o más archivos PNG');
  process.exit(1);
}

for (const target of targets) {
  const abs = path.resolve(target);
  const stats = processFile(abs);
  console.log(JSON.stringify(stats));
}
