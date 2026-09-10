/**
 * Analiza métricas de calidad premium infantil en PNG de palabras.
 * node scripts/analyze-word-png-quality.js
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const DIR = path.join(__dirname, '..', 'assets', 'images', 'words');
const ALPHA_OPAQUE = 20;
const WHITE_RGB_MIN = 248;
const WHITE_ALPHA_MIN = 200;
const CHECKER_TARGET = 204;
const CHECKER_TOL = 12;
const EDGE_MARGIN_BAD = 0.03; // ocupa casi todo el canvas

function analyzeBuffer(buf, file) {
  const png = PNG.sync.read(buf);
  const { width, height, data } = png;
  const total = width * height;

  let transparent = 0;
  let nearWhiteOpaque = 0;
  let checkerish = 0;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let opaque = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) << 2;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a < ALPHA_OPAQUE) {
        transparent += 1;
        continue;
      }

      opaque += 1;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;

      if (r >= WHITE_RGB_MIN && g >= WHITE_RGB_MIN && b >= WHITE_RGB_MIN && a >= WHITE_ALPHA_MIN) {
        nearWhiteOpaque += 1;
      }

      // checkerboard grays ~204/#ccc with high alpha
      if (
        a >= 180 &&
        Math.abs(r - CHECKER_TARGET) <= CHECKER_TOL &&
        Math.abs(g - CHECKER_TARGET) <= CHECKER_TOL &&
        Math.abs(b - CHECKER_TARGET) <= CHECKER_TOL &&
        Math.abs(r - g) <= 6 &&
        Math.abs(g - b) <= 6
      ) {
        checkerish += 1;
      }
    }
  }

  const hasContent = maxX >= 0;
  const contentW = hasContent ? maxX - minX + 1 : 0;
  const contentH = hasContent ? maxY - minY + 1 : 0;
  const marginL = hasContent ? minX / width : 0;
  const marginR = hasContent ? (width - 1 - maxX) / width : 0;
  const marginT = hasContent ? minY / height : 0;
  const marginB = hasContent ? (height - 1 - maxY) / height : 0;
  const minMargin = Math.min(marginL, marginR, marginT, marginB);
  const fillRatio = hasContent ? (contentW * contentH) / total : 0;

  const transparentPct = (transparent / total) * 100;
  const whiteOpaquePct = (nearWhiteOpaque / total) * 100;
  const whiteOfOpaquePct = opaque ? (nearWhiteOpaque / opaque) * 100 : 0;
  const checkerPct = (checkerish / total) * 100;
  const checkerOfOpaquePct = opaque ? (checkerish / opaque) * 100 : 0;

  const flags = [];
  if (transparentPct < 5) flags.push('casi_sin_transparencia');
  if (whiteOpaquePct >= 8 || whiteOfOpaquePct >= 25) flags.push('blanco_opaco_residual');
  if (minMargin < EDGE_MARGIN_BAD && fillRatio > 0.85) flags.push('sin_margen_canvas');
  else if (minMargin < EDGE_MARGIN_BAD) flags.push('toca_borde');
  if (checkerPct >= 0.8 || checkerOfOpaquePct >= 3) flags.push('posible_checkerboard');
  if (width < 256 || height < 256) flags.push('resolucion_baja');
  if (Math.abs(width / height - 1) > 0.35) flags.push('aspecto_no_cuadrado');

  // severity score for ranking
  let score = 0;
  if (flags.includes('casi_sin_transparencia')) score += 40;
  if (flags.includes('blanco_opaco_residual')) score += 35;
  if (flags.includes('posible_checkerboard')) score += 45;
  if (flags.includes('sin_margen_canvas')) score += 20;
  if (flags.includes('toca_borde')) score += 10;
  if (flags.includes('resolucion_baja')) score += 15;
  if (flags.includes('aspecto_no_cuadrado')) score += 8;
  score += Math.min(25, whiteOpaquePct);
  score += Math.min(20, checkerPct * 2);

  return {
    file,
    width,
    height,
    transparentPct: +transparentPct.toFixed(2),
    whiteOpaquePct: +whiteOpaquePct.toFixed(2),
    whiteOfOpaquePct: +whiteOfOpaquePct.toFixed(2),
    checkerPct: +checkerPct.toFixed(2),
    checkerOfOpaquePct: +checkerOfOpaquePct.toFixed(2),
    minMarginPct: +(minMargin * 100).toFixed(2),
    fillRatio: +fillRatio.toFixed(3),
    contentBox: hasContent ? `${contentW}x${contentH}` : 'empty',
    flags,
    score: +score.toFixed(1),
  };
}

function main() {
  const files = fs.readdirSync(DIR).filter((f) => f.toLowerCase().endsWith('.png')).sort();
  const results = [];

  for (const file of files) {
    const buf = fs.readFileSync(path.join(DIR, file));
    try {
      results.push(analyzeBuffer(buf, file));
    } catch (err) {
      results.push({ file, error: String(err.message || err), score: 999, flags: ['error_lectura'] });
    }
  }

  results.sort((a, b) => (b.score || 0) - (a.score || 0));

  const bad = results.filter((r) => (r.score || 0) >= 25 || (r.flags && r.flags.length));
  const ok = results.filter((r) => (r.score || 0) < 25 && (!r.flags || r.flags.length === 0));

  const out = {
    total: results.length,
    badCount: bad.length,
    okCount: ok.length,
    thresholdNote:
      'score>=25 o cualquier flag: candidato a revisar. Flags: transparencia, blanco residual, margen, checkerboard, tamaño.',
    worst: results.slice(0, 40),
    allFlagged: bad,
    okFiles: ok.map((r) => r.file),
    all: results,
  };

  const outPath = path.join(__dirname, 'word-png-quality-report.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

  console.log(`Analizados: ${results.length}`);
  console.log(`Flagged: ${bad.length} | OK limpios: ${ok.length}`);
  console.log('\n=== TOP 40 peores (score) ===');
  for (const r of results.slice(0, 40)) {
    if (r.error) {
      console.log(`${r.file} ERROR ${r.error}`);
      continue;
    }
    console.log(
      `${r.file.padEnd(22)} score=${String(r.score).padStart(5)} ${r.width}x${r.height} ` +
        `trans=${String(r.transparentPct).padStart(6)}% white=${String(r.whiteOpaquePct).padStart(6)}% ` +
        `chk=${String(r.checkerPct).padStart(5)}% margin=${String(r.minMarginPct).padStart(5)}% ` +
        `flags=[${r.flags.join(',')}]`
    );
  }
  console.log(`\nReporte: ${outPath}`);
}

main();
