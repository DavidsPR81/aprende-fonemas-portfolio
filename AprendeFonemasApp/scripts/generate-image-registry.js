// Registra todos los PNG de assets/images en src/data/imageRegistry.js
// node scripts/generate-image-registry.js

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WORDS_DIR = path.join(ROOT, 'assets', 'images', 'words');
const SENTENCES_DIR = path.join(ROOT, 'assets', 'images', 'sentences');
const OUT = path.join(ROOT, 'src', 'data', 'imageRegistry.js');

function listPngKeys(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.png'))
    .map((f) => f.replace(/\.png$/i, ''))
    .sort((a, b) => a.localeCompare(b, 'es'));
}

function buildRegistryObject(keys, folder) {
  return keys
    .map((key) => `  ${key}: require('../../assets/images/${folder}/${key}.png'),`)
    .join('\n');
}

const wordKeys = listPngKeys(WORDS_DIR);
const sentenceKeys = listPngKeys(SENTENCES_DIR);

const lines = [
  "import { slugify } from '../utils/slugify';",
  '',
  '// AUTO-GENERADO — no editar a mano. Ejecuta: npm run content:images:registry',
  '',
  'export const WORD_IMAGES = {',
  buildRegistryObject(wordKeys, 'words'),
  '};',
  '',
  'export const SENTENCE_IMAGES = {',
  buildRegistryObject(sentenceKeys, 'sentences'),
  '};',
  '',
  'export function resolveImageKey(item) {',
  '  if (!item) return null;',
  '  if (item.imageKey) return item.imageKey;',
  '  if (item.id) return item.id;',
  '  if (item.word) return slugify(item.word);',
  '  return null;',
  '}',
  '',
  'export function getIllustrationSource(item) {',
  '  const key = resolveImageKey(item);',
  '  if (!key) return null;',
  '  return WORD_IMAGES[key] ?? SENTENCE_IMAGES[key] ?? null;',
  '}',
  '',
];

fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`Registro generado: ${OUT}`);
console.log(`  Palabras: ${wordKeys.length}`);
console.log(`  Frases: ${sentenceKeys.length}`);
