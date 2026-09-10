// Regenera docs/INVENTARIO_CONTENIDO.md — npm run content:inventory

const fs = require('fs');
const path = require('path');
const {
  AUDIO_MANIFEST,
  FREE_PHONEMES,
  PREMIUM_PHONEMES,
  FREE_WORDS,
  PREMIUM_WORDS,
  PREMIUM_SENTENCES,
  FEEDBACK,
  INSTRUCTIONS,
} = require('../src/data/audioManifest');

const outPath = path.join(__dirname, '..', 'docs', 'INVENTARIO_CONTENIDO.md');

function slugify(word) {
  return word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function countWords(map) {
  return Object.values(map).reduce((sum, arr) => sum + arr.length, 0);
}

const lines = [
  '# Inventario de contenido — Aprende Fonemas',
  '',
  '> **Para grabar audios y crear dibujos.** Fuente en código: `src/data/content.js` + `src/data/audioManifest.js`.',
  '> Guion audio detallado: `npm run audio:guion` → `docs/GUION_GRABACION_AUDIOS.md`',
  '',
  '## Resumen',
  '',
  '| Recurso | Gratis | Premium | Total |',
  '|---------|--------|---------|-------|',
  `| Fonemas / letras | ${FREE_PHONEMES.length} | ${PREMIUM_PHONEMES.length} | ${FREE_PHONEMES.length + PREMIUM_PHONEMES.length} |`,
  `| Palabras (por letra) | ${countWords(FREE_WORDS)} | ${countWords(PREMIUM_WORDS)} | ${countWords(FREE_WORDS) + countWords(PREMIUM_WORDS)} |`,
  `| Frases | 0 | ${PREMIUM_SENTENCES.length} | ${PREMIUM_SENTENCES.length} |`,
  `| Refuerzos (feedback) | ${FEEDBACK.length} | — | ${FEEDBACK.length} |`,
  `| Instrucciones | ${INSTRUCTIONS.filter((i) => i.free).length} | ${INSTRUCTIONS.filter((i) => !i.free).length} | ${INSTRUCTIONS.length} |`,
  `| **Audios totales (manifiesto)** | ${AUDIO_MANIFEST.filter((a) => a.free).length} | ${AUDIO_MANIFEST.filter((a) => !a.free).length} | **${AUDIO_MANIFEST.length}** |`,
  '',
  '### Cómo funciona la variedad',
  '- Cada partida = **5 ejercicios** aleatorios del pool disponible (free o premium).',
  '- Niveles 1–4: solo letras **a e i o u p m l s t** y sus palabras.',
  '- Premium: las **27 letras** (RAE) + niveles 5–12 + frases.',
  '- Los ejercicios de rima, sílabas, fusión y aliteración usan pools fijos en `content.js`.',
  '',
  '---',
  '',
  '## Fonemas GRATIS',
  '',
  ...FREE_PHONEMES.map((p) => `- **${p.id.toUpperCase()}** · \`phonemes/${p.id}.mp3\` · decir: *${p.text}*`),
  '',
  '## Fonemas PREMIUM',
  '',
  ...PREMIUM_PHONEMES.map((p) => `- **${p.id}** · \`phonemes/${p.id}.mp3\` · decir: *${p.text}*`),
  '',
];

for (const [letter, words] of Object.entries(FREE_WORDS)) {
  lines.push(`## Palabras GRATIS — ${letter.toUpperCase()}`, '');
  words.forEach((w) => {
    const slug = slugify(w);
    lines.push(`- **${w}** · audio: \`words/${slug}.mp3\` · dibujo: \`assets/images/words/${slug}.png\``);
  });
  lines.push('');
}

for (const [letter, words] of Object.entries(PREMIUM_WORDS)) {
  lines.push(`## Palabras PREMIUM — ${letter.toUpperCase()}`, '');
  words.forEach((w) => {
    const slug = slugify(w);
    lines.push(`- **${w}** · audio: \`words/${slug}.mp3\` · dibujo: \`assets/images/words/${slug}.png\``);
  });
  lines.push('');
}

lines.push('## Frases PREMIUM (Nivel 11)', '');
PREMIUM_SENTENCES.forEach((s) => {
  lines.push(`- **${s.text}** · \`sentences/${s.id}.mp3\``);
});

lines.push('', '## Refuerzos de voz', '');
FEEDBACK.forEach((f) => lines.push(`- **${f.text}** · \`feedback/${f.id}.mp3\` · ${f.use}`));

lines.push('', '## Instrucciones por nivel', '');
INSTRUCTIONS.forEach((i) => {
  lines.push(`- Nivel ${i.level} · **${i.text}** · \`instructions/${i.id}.mp3\` · ${i.free ? 'GRATIS' : 'PREMIUM'}`);
});

fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log('Written', outPath);
