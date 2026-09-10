// icon.png, splash, etc. desde assets/icono.png — npm run assets:icons
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');
const SOURCE = path.join(ASSETS, 'icono.png');
const BG = { r: 244, g: 249, b: 252 }; // #F4F9FC — fondo app (colors.background)
const ICON_TILE = { r: 232, g: 244, b: 252 }; // #E8F4FC — azul del cuadrado del logo

const SPLASH_W = 1284;
const SPLASH_H = 2778;
const ICON_SIZE = 1024;

function readPng(filePath) {
  return PNG.sync.read(fs.readFileSync(filePath));
}

function writePng(png, filePath) {
  fs.writeFileSync(filePath, PNG.sync.write(png));
}

function fillRect(png, x, y, w, h, color) {
  for (let py = y; py < y + h; py += 1) {
    for (let px = x; px < x + w; px += 1) {
      const i = (png.width * py + px) << 2;
      png.data[i] = color.r;
      png.data[i + 1] = color.g;
      png.data[i + 2] = color.b;
      png.data[i + 3] = 255;
    }
  }
}

function clonePng(png) {
  const copy = new PNG({ width: png.width, height: png.height });
  copy.data.set(png.data);
  return copy;
}

// Recorta blanco/gris de bordes → azul de fondo app
function flattenWhiteEdges(png, fill) {
  const { width, height, data } = png;
  const visited = new Uint8Array(width * height);
  const queue = [];

  const isEdgeFill = (r, g, b, a) => {
    if (a < 20) return true;
    if (r > 232 && g > 232 && b > 232) return true;
    if (r > 198 && g > 198 && b > 198 && Math.abs(r - g) < 12 && Math.abs(g - b) < 12) return true;
    return false;
  };

  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx << 2;
    if (!isEdgeFill(data[i], data[i + 1], data[i + 2], data[i + 3])) return;
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

  let replaced = 0;
  while (queue.length) {
    const idx = queue.pop();
    const i = idx << 2;
    data[i] = fill.r;
    data[i + 1] = fill.g;
    data[i + 2] = fill.b;
    data[i + 3] = 255;
    replaced += 1;
    const x = idx % width;
    const y = Math.floor(idx / width);
    tryPush(x - 1, y);
    tryPush(x + 1, y);
    tryPush(x, y - 1);
    tryPush(x, y + 1);
  }
  return replaced;
}

function blitResize(src, dst, dx, dy, dw, dh) {
  for (let y = 0; y < dh; y += 1) {
    const sy = Math.min(src.height - 1, Math.floor((y / dh) * src.height));
    for (let x = 0; x < dw; x += 1) {
      const sx = Math.min(src.width - 1, Math.floor((x / dw) * src.width));
      const si = (src.width * sy + sx) << 2;
      const di = (dst.width * (dy + y) + (dx + x)) << 2;
      dst.data[di] = src.data[si];
      dst.data[di + 1] = src.data[si + 1];
      dst.data[di + 2] = src.data[si + 2];
      dst.data[di + 3] = src.data[si + 3];
    }
  }
}

function resizeSquare(src, size) {
  const out = new PNG({ width: size, height: size });
  blitResize(src, out, 0, 0, size, size);
  return out;
}

function buildSplash(logo) {
  const splash = new PNG({ width: SPLASH_W, height: SPLASH_H });
  fillRect(splash, 0, 0, SPLASH_W, SPLASH_H, BG);
  const logoSize = Math.round(SPLASH_W * 0.46);
  const x = Math.round((SPLASH_W - logoSize) / 2);
  const y = Math.round((SPLASH_H - logoSize) / 2);
  blitResize(logo, splash, x, y, logoSize, logoSize);
  return splash;
}

function buildFavicon(logo) {
  return resizeSquare(logo, 48);
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error('\n❌ No encuentro assets/icono.png');
    console.error('   Coloca tu logo ahí (1024×1024 px) y vuelve a ejecutar:\n');
    console.error('   npm run assets:icons\n');
    process.exit(1);
  }

  const source = readPng(SOURCE);
  if (source.width !== source.height) {
    console.warn(`⚠️  icono.png es ${source.width}×${source.height} — lo recomendado es cuadrado 1024×1024.`);
  }

  const cleaned = clonePng(source);
  const replaced = flattenWhiteEdges(cleaned, ICON_TILE);
  writePng(cleaned, SOURCE);

  const icon = resizeSquare(cleaned, ICON_SIZE);
  const adaptive = resizeSquare(cleaned, ICON_SIZE);
  const splash = buildSplash(icon);
  const favicon = buildFavicon(icon);

  writePng(icon, path.join(ASSETS, 'icon.png'));
  writePng(adaptive, path.join(ASSETS, 'adaptive-icon.png'));
  writePng(splash, path.join(ASSETS, 'splash.png'));
  writePng(favicon, path.join(ASSETS, 'favicon.png'));

  console.log(`✅ Esquinas blancas → azul logo #E8F4FC (${replaced.toLocaleString()} píxeles)`);
  console.log('✅ Generado desde assets/icono.png:');
  console.log('   assets/icon.png          (1024×1024 — Expo / App Store)');
  console.log('   assets/adaptive-icon.png (1024×1024 — Android Play Store)');
  console.log('   assets/splash.png        (1284×2778 — pantalla de carga)');
  console.log('   assets/favicon.png       (48×48 — web)');
  console.log('\n   Reinicia Expo: npx expo start -c\n');
}

main();
