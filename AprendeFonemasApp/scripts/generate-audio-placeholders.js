// MP3 silenciosos desde audioManifest — sustituir por grabaciones reales (mismo nombre)
// node scripts/generate-audio-placeholders.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets', 'audio');
const PLACEHOLDER = path.join(ASSETS, '_placeholder.mp3');
const { AUDIO_MANIFEST } = require('../src/data/audioManifest');

function ensureSilentPlaceholder() {
  fs.mkdirSync(ASSETS, { recursive: true });
  if (!fs.existsSync(PLACEHOLDER)) {
    execSync(
      `ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=mono -t 0.3 -q:a 9 -acodec libmp3lame "${PLACEHOLDER}"`,
      { stdio: 'pipe' }
    );
    console.log('Creado placeholder base:', PLACEHOLDER);
  }
}

function copyPlaceholder(relativePath) {
  const fullPath = path.join(ASSETS, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  if (!fs.existsSync(fullPath)) {
    fs.copyFileSync(PLACEHOLDER, fullPath);
    return true;
  }
  return false;
}

function generateRegistry() {
  const lines = [
    '// AUTO-GENERADO — no editar a mano. Ejecuta: node scripts/generate-audio-placeholders.js',
    '',
    'export const AUDIO_REGISTRY = {',
  ];

  for (const entry of AUDIO_MANIFEST) {
    lines.push(`  '${entry.key}': require('../../assets/audio/${entry.file}'),`);
  }

  lines.push('};', '');
  lines.push('export function getAudioSource(key) {');
  lines.push('  return AUDIO_REGISTRY[key] ?? null;');
  lines.push('}', '');

  const outPath = path.join(ROOT, 'src', 'data', 'audioRegistry.js');
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log('Registro generado:', outPath);
}

ensureSilentPlaceholder();

let created = 0;
for (const entry of AUDIO_MANIFEST) {
  if (copyPlaceholder(entry.file)) created++;
}

generateRegistry();
console.log(`Listo: ${created} placeholders nuevos, ${AUDIO_MANIFEST.length} audios en total.`);
