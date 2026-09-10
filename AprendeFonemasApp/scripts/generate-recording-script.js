// Guía + guion ElevenLabs TTS v3 es-ES + CSV
// node scripts/generate-recording-script.js
// Flujo: misma voz ya elegida (profesora) × Text to Speech. Sin Voice Design / clonación.

const fs = require('fs');
const path = require('path');
const {
  AUDIO_MANIFEST,
  FREE_PHONEMES,
  PREMIUM_PHONEMES,
  FREE_WORDS,
  PREMIUM_WORDS,
  EXTRA_WORDS,
  PREMIUM_SENTENCES,
  FEEDBACK,
  INSTRUCTIONS,
  TUTORIAL,
  UI_VOICE,
  FINAL_CELEBRATION_VOICE,
} = require('../src/data/audioManifest');

const docsDir = path.join(__dirname, '..', 'docs');
const outMd = path.join(docsDir, 'GUION_GRABACION_AUDIOS.md');
const outCsv = path.join(docsDir, 'ELEVENLABS_IMPORT.csv');

const freeCount = AUDIO_MANIFEST.filter((a) => a.free).length;
const premiumCount = AUDIO_MANIFEST.length - freeCount;
const premiumWordsCount =
  Object.values(PREMIUM_WORDS).flat().length + EXTRA_WORDS.length;
const celebrationCount = FEEDBACK.filter((f) => f.tone === 'alegria').length;
const finalCelebrationCount = FINAL_CELEBRATION_VOICE.length;

function badge(free) {
  return free ? 'GRATIS' : 'PREMIUM';
}

function csvEscape(value) {
  const s = String(value ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function section(title, rows) {
  const lines = [
    `## ${title}`,
    '',
    '| # | Archivo | Texto exacto (ElevenLabs) | Notas de pronunciación | Acceso |',
    '|---|---------|---------------------------|------------------------|--------|',
  ];
  rows.forEach((row, index) => {
    lines.push(
      `| ${index + 1} | \`${row.file}\` | ${row.text} | ${row.how} | ${badge(row.free)} |`
    );
  });
  lines.push('');
  return lines;
}

const lines = [];

function add(...parts) {
  lines.push(...parts);
}

add('# Guía + guion ElevenLabs — Aprende Fonemas (español de España)');
add('');
add('> **Documento único** para generar todos los MP3 con Text to Speech (ElevenLabs v3).');
add('> Incluye: cómo trabajar · configuración · entonación · catálogo completo fila a fila.');
add('>');
add(
  '> **PDF para imprimir / tablet:** [GUION_GRABACION_AUDIOS.pdf](GUION_GRABACION_AUDIOS.pdf) · CSV: [ELEVENLABS_IMPORT.csv](ELEVENLABS_IMPORT.csv)'
);
add('>');
add('> Regenerar: `npm run audio:guion` · `npm run audio:guion:pdf`');
add('');
add('**Idioma fijo: español de España (Castilla / ceceo).** No uses seseo.');
add('');
add(
  `> **Total clips: ${AUDIO_MANIFEST.length}** · Gratis: ${freeCount} · Premium: ${premiumCount}`
);
add('');
add(
  'Cada fila del catálogo = **un MP3**. El nombre de archivo debe coincidir exactamente (ruta relativa bajo assets/audio/).'
);
add('');
add('---');
add('');
add('## Cómo usar este documento en ElevenLabs');
add('');
add('```');
add(
  'Misma voz (profesora)  →  pegar texto de la fila  →  Eleven v3 TTS  →  escuchar  →  MP3  →  assets/audio/...'
);
add('```');
add('');
add('1. Abre Text to Speech con tu **voz fija** + modelo **eleven_v3**.');
add('2. Trabaja **por bloques** (ver orden más abajo): no mezcles fonemas con celebraciones.');
add('3. Copia el **texto exacto** de cada fila.');
add('4. Ajusta solo entrega (estabilidad, emoción, pausas) según el tipo.');
add('5. Revisa la checklist → exporta MP3 con el nombre indicado.');
add('');
add('Licencia: **comercial** (app de pago en Play Store).');
add('');
add('---');
add('');
add('## Flujo real (Text to Speech)');
add('');
add('Este proyecto **no** usa Voice Design, Voice Cloning ni creación de una voz nueva.');
add('');
add('Vas a repetir este ciclo para cada fila del guion:');
add('');
add('1. Elegir **siempre la misma voz** (profesora infantil ya seleccionada).');
add('2. Pegar el **texto exacto** de la columna.');
add('3. Ajustar solo controles de entrega (estabilidad, emoción/etiquetas, pausas) según el tipo de clip.');
add('4. Generar con **ElevenLabs v3** (`eleven_v3`) → Text to Speech.');
add('5. Escuchar → exportar MP3 → guardar con el nombre de archivo indicado.');
add('');
add('---');
add('');
add('## Qué NO hacemos');
add('');
add('- ❌ Voice Design / diseñar una voz con prompt');
add('- ❌ Voice Cloning / entrenar o clonar una voz nueva');
add('- ❌ Cambiar de voz entre clips');
add('- ❌ Grabar con iPhone + Audacity (flujo antiguo; obsoleto para v1)');
add('');
add('---');
add('');
add('## Voz seleccionada');
add('');
add('| Campo | Valor |');
add('|-------|--------|');
add('| Voz | La misma profesora infantil ya elegida (biblioteca / cuenta) |');
add('| Modelo | Eleven v3 (`eleven_v3`) en todos los clips |');
add('| Idioma | Español de España |');
add('| Personaje (comportamiento) | Profesora cálida, clara, paciente, 3–7 años |');
add('| Edad percibida | 30–40 años |');
add('| Estilo | Aula / cuento: amable, lenta, sin gritar |');
add('| Formato salida | MP3 mono 128–192 kbps |');
add('');
add('**Reglas:**');
add('');
add('- No cambiar de voz a mitad de proyecto.');
add('- No modificar la identidad de la voz entre bloques.');
add('- El texto de cada fila es el **script hablado**, no un “prompt para diseñar voz”.');
add('');
add(
  '> Si en el futuro ElevenLabs muestra un campo tipo *Character Prompt* para esa voz, úsalo solo para el **comportamiento** (cálida, infantil, paciente). Nunca para inventar otra voz.'
);
add('');
add('---');
add('');
add('## Configuración fija de ElevenLabs');
add('');
add('Antes de cada sesión de generación, deja fijos:');
add('');
add('- ✔ Mismo **modelo** (v3)');
add('- ✔ Misma **voz**');
add('- ✔ Mismo **idioma** (es-ES)');
add('- ✔ Mismo **volumen** / loudness percibido');
add('- ✔ Misma **calidad** / bitrate de exportación');
add('- ✔ Mismo **formato** (MP3)');
add(
  '- ✔ Misma **estabilidad** base (recomendado: Natural; Creativo solo si una celebración lo necesita y suena bien)'
);
add('');
add(
  '**Nunca** cambies configuración entre bloques del mismo día sin anotarlo. Si cambias, regenera el bloque entero.'
);
add('');
add('---');
add('');
add('## Configuración por tipo de audio');
add('');
add('| Tipo | Objetivo de entrega | Controles / etiquetas (v3) |');
add('|------|---------------------|----------------------------|');
add('| Fonemas | Neutral, solo sonido | Sin dramatizar; sin risas; estabilidad Natural/Robusto |');
add('| Palabras | Natural | Sin etiquetas emocionales fuertes |');
add('| Frases | Conversacional | Puntuación natural; preguntas con ¿? |');
add('| Instrucciones | Profesora clara | Lento; preguntas con final ascendente |');
add('| Tutorial | Profesora paciente | Claro, explicativo, sin prisas |');
add(
  '| Feedback acierto / UI celebración de nivel | Alegría **moderada** | `[excited]` suave o mayúsculas puntuales; nunca gritar |'
);
add('| Feedback error / pista | Calma | Suave; nunca enfado; sin sarcasmo |');
add(
  '| **Gran final** (12 niveles) | Alegría especial, orgullo | Más energía que un acierto normal, sin chillar |'
);
add('');
add('---');
add('');
add('## Entonación (reglas)');
add('');
add('No reescribas el texto del catálogo salvo correcciones de pronunciación documentadas abajo.');
add('');
add('| Tipo | Regla |');
add('|------|--------|');
add('| Fonemas | Solo el sonido. **Nunca** añadir vocales de apoyo («ja», «pe», «eme»). |');
add('| Palabras | Natural. Sin dramatizar. |');
add('| Frases | Conversación normal de aula. |');
add('| Preguntas (`¿…?`) | Final **siempre ascendente**. Nunca plano. |');
add('| Celebraciones de nivel | Alegría moderada. Nunca exagerada ni chillona. |');
add('| Gran final | Orgullo y alegría; más emotivo que un «¡Muy bien!», sin gritar. |');
add('| Correcciones / pistas | Muy tranquilizadoras. Nunca enfadada. |');
add('');
add('### Pausas (Eleven v3)');
add('');
add('- Preferir puntuación natural (…, —, comas).');
add(
  '- Si hace falta pausa explícita: etiqueta break de Eleven (máx. ~3 s). **No abusar** (inestabilidad / artefactos).'
);
add('- En fonemas y palabras cortas: **no** uses breaks.');
add('');
add('### Emoción (Eleven v3)');
add('');
add(
  '- Etiquetas de audio (`[excited]`, `[curious]`, …) solo en celebraciones/tutorial/gran final si mejoran el resultado.'
);
add('- Si la etiqueta se oye dicha en voz alta, regenera **sin** etiqueta.');
add('- No uses efectos (`[applause]`, etc.) en este proyecto.');
add('');
add('### Pronunciación avanzada (opcional)');
add('');
add('- En **v3** usa IPA nativo: `"/transcripción/"` (NO etiquetas XML `<phoneme>` ni CMU Arpabet: eso es de v2).');
add('- En **fonemas sostenidos** (aaaa, mmm…) suele funcionar **mejor** repetir letras que el IPA.');
add('- Validar siempre a oído con **esta** voz (el IPA no es 100 % estable).');
add('');
add('---');
add('');
add('## Pronunciación de fonemas (cómo hacerlo en Eleven v3)');
add('');
add('### Qué NO uses');
add('');
add('- ❌ `<phoneme alphabet="cmu-arpabet" …>` → **no aplica a v3** (es de modelos v2 / flash_v2).');
add('- ❌ Decir «a de avión», «pe», «eme», «jota».');
add('- ❌ Estabilidad **Creativo** + etiquetas `[excited]` en fonemas (entonación rara).');
add('');
add('### Receta para vocales largas (a, e, i, o, u) — app de fonemas');
add('');
add('Objetivo: tono **plano**, sonido **sostenido ~1–1,5 s**, como en clase.');
add('');
add('1. **Texto:** `aaaaaa` (6–10 letras iguales). Empieza con 8: `aaaaaaaa`.');
add('2. **Velocidad (Speed):** baja a **0,75–0,85** (más lento = más largo y claro).');
add('3. **Estabilidad:** **Robusto** o **Natural** (nunca Creativo en este bloque).');
add('4. **Sin** etiquetas de emoción ni breaks.');
add('5. Genera **3–5 veces** y quédate con la más plana y limpia.');
add('6. Si sigue corta: sube a 10–12 letras (`aaaaaaaaaaaa`) o baja un poco más la velocidad.');
add('');
add('| Vocal | Texto a probar primero | IPA v3 (solo si falla) |');
add('|-------|------------------------|-------------------------|');
add('| A | `aaaaaaaa` | `"/aː/"` o `"/aaaa/"` |');
add('| E | `eeeeeeee` | `"/eː/"` |');
add('| I | `iiiiiiii` | `"/iː/"` |');
add('| O | `oooooooo` | `"/oː/"` |');
add('| U | `uuuuuuuu` | `"/uː/"` |');
add('');
add('> Tip: el IPA alarga con `ː` (dos puntos triangulares). Si Eleven “canta” la vocal, vuelve al texto con letras repetidas + velocidad baja.');
add('');
add('### Consonantes');
add('');
add('| Tipo | Ejemplo texto | Nota |');
add('|------|---------------|------|');
add('| Sostenidas (m, s, f, l, n, ñ, r…) | `mmmm`, `ssss`, `ffff` | Misma receta: velocidad baja, tono plano |');
add('| Explosivas (p, t, k, b, d, g) | una sola letra: `p`, `t`, `k` | Cortas a propósito; NO «pe» |');
add('| J (/x/) | `jjjj` | Si dice «ja», anota en Casos validados la cadena que sí funcione |');
add('');
add('1. El niño debe oír el **fonema**, no el nombre de la letra.');
add('2. Si Eleven convierte el fonema en sílaba → **incorrecto** (ja / pe / eme).');
add('3. Valida **cada** fonema a oído; no copies ciegamente el IPA de otro idioma.');
add('');
add('---');
add('');
add('## Casos validados para este proyecto');
add('');
add('> Rellena esta tabla con lo que confirmes al generar. Es la sección más útil a medio plazo.');
add('');
add('| Clip / caso | Texto / ajustes que SÍ funcionan en Eleven v3 | Evitar | Notas |');
add('|-------------|-----------------------------------------------|--------|-------|');
add(
  '| Vocales `a e i o u` | Letras ×8–12 + Speed ~0,8 + estabilidad Robusto/Natural | `<phoneme>` Arpabet; Creativo | Anotar el texto exacto que uses |'
);
add(
  '| `phonemes/j` | *(probar `jjjj`; si dice «ja», probar IPA o la sintaxis que valides)* | «ja», «jota» | Documentar cadena exacta |'
);
add('| `phonemes/h` | silencio 0,3–0,5 s (o archivo silencioso) | aspiración inglesa | No usar H en niveles 1–3 |');
add('| `phonemes/v` | mismo resultado que `b` | /v/ labiodental inglesa | V = B en es-ES |');
add('| `phonemes/z` | ceceo /θ/ sostenido (`zzzz` o IPA) | /s/ (seseo) | |');
add('| `words/una` | «Uña» | «Una» | El archivo se llama `una.mp3` |');
add('');
add('---');
add('');
add('## Reglas obligatorias (español de España)');
add('');
add(`1. **Misma voz** en los ${AUDIO_MANIFEST.length} clips.`);
add('2. Fonemas = solo el **sonido**, nunca el nombre de la letra.');
add(
  '3. **H muda**: `phonemes/h.mp3` = silencio 0,3–0,5 s. En Hada, Helado, etc. **no** aspirar la H.'
);
add('4. **V = B** (/b/). Vaca suena como si empezara por B.');
add(
  '5. **Z = /θ/** (ceceo). Zapato, Zorro, Zumo, Zoo, Lápiz, Nariz, Arroz, Manzana, Erizo…'
);
add('6. **C/K/Q** = mismo /k/ duro (Casa). No hay Ce/Ci en el catálogo.');
add('7. **G** = /g/ duro (Gato). Guitarra con u muda.');
add('8. **R** al inicio (Rana, Ratón) = vibrante múltiple. **RR** = múltiples en Torre, Perro…');
add('9. Archivo `words/una.mp3` → decir **«Uña»**.');
add('10. **Sí generar** tutorial, pista, celebraciones de nivel y **gran final**.');
add('11. **No generar** fusiones «p, a, t, o», nombres de letra, ni botones de menú.');
add('');
add('---');
add('');
add('## Revisión antes de exportar');
add('');
add('Cada MP3:');
add('');
add('- □ Misma voz');
add('- □ Mismo ritmo / energía percibida que el resto del bloque');
add('- □ Pronunciación correcta (es-ES)');
add('- □ Sin respiraciones raras, clics ni cortes');
add('- □ Fonema correcto (si aplica) — sin sílaba inventada');
add('- □ Preguntas con final ascendente (si aplica)');
add('- □ Celebración alegre / corrección calmada / gran final con orgullo');
add('- □ Nombre de archivo exacto');
add('');
add('---');
add('');
add('## Resumen por tipo');
add('');
add('| Tipo | Cantidad | Orden de generación |');
add('|------|----------|---------------------|');
add(
  `| Fonemas (gratis+premium) | ${FREE_PHONEMES.length + PREMIUM_PHONEMES.length} | 1 |`
);
add(
  `| Palabras (gratis+premium) | ${Object.values(FREE_WORDS).flat().length + premiumWordsCount} | 2 |`
);
add(`| Feedback | ${FEEDBACK.length} | 3 |`);
add(`| Tutorial | ${TUTORIAL.length} | 4 |`);
add(`| UI (pista / nivel / gran final) | ${UI_VOICE.length} | 5 |`);
add(`| Frases | ${PREMIUM_SENTENCES.length} | 6 |`);
add(`| Instrucciones | ${INSTRUCTIONS.length} | 7 |`);
add(`| **TOTAL** | **${AUDIO_MANIFEST.length}** | — |`);
add('');
add(`- Refuerzos de alegría (feedback acierto): **${celebrationCount}** frases.`);
add(
  `- Gran final (12 niveles): **${finalCelebrationCount}** frases (la app elige una al azar).`
);
add('');
add('---');
add('');
add('## Orden de generación (por bloques)');
add('');
add('**No** generes los clips mezclados. Mantén el estilo dentro de cada bloque:');
add('');
add('1. **Fonemas** (gratis → premium; cuidado H/V/Z/J)');
add('2. **Palabras** (gratis → premium)');
add('3. **Feedback** (aciertos, errores, pistas)');
add('4. **Tutorial**');
add('5. **UI** (pista → celebraciones de nivel → **gran final**)');
add('6. **Frases** (nivel 12)');
add('7. Instrucciones / consignas');
add('');
add(
  'Luego: sustituir archivos en `assets/audio/` manteniendo el nombre → `USE_SPEECH_PREVIEW = false`.'
);
add('');
add('---');
add('');
add('# Catálogo de clips (fila = un MP3)');
add('');

const categories = [
  ['1. Fonemas gratis', AUDIO_MANIFEST.filter((a) => a.category === 'phoneme' && a.free)],
  ['2. Fonemas premium', AUDIO_MANIFEST.filter((a) => a.category === 'phoneme' && !a.free)],
  ['3. Palabras gratis', AUDIO_MANIFEST.filter((a) => a.category === 'word' && a.free)],
  ['4. Palabras premium', AUDIO_MANIFEST.filter((a) => a.category === 'word' && !a.free)],
  ['5. Frases (nivel 12)', AUDIO_MANIFEST.filter((a) => a.category === 'sentence')],
  ['6. Feedback', AUDIO_MANIFEST.filter((a) => a.category === 'feedback')],
  ['7. Instrucciones (consignas)', AUDIO_MANIFEST.filter((a) => a.category === 'instruction')],
  ['8. Tutorial', AUDIO_MANIFEST.filter((a) => a.category === 'tutorial')],
  ['9. UI (pista, nivel y gran final)', AUDIO_MANIFEST.filter((a) => a.category === 'ui')],
];

for (const [title, items] of categories) {
  lines.push(...section(title, items));
}

add('---');
add('');
add(
  '*Generado desde `src/data/audioManifest.js` — regenerar con `npm run audio:guion` y `npm run audio:guion:pdf`.*'
);
add('');

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(outMd, lines.join('\n'), 'utf8');

const csvRows = [
  ['filename', 'text', 'category', 'access', 'notes'].join(','),
  ...AUDIO_MANIFEST.map((row) =>
    [
      csvEscape(row.file),
      csvEscape(row.text),
      csvEscape(row.category),
      csvEscape(row.free ? 'free' : 'premium'),
      csvEscape(row.how),
    ].join(',')
  ),
];
fs.writeFileSync(outCsv, csvRows.join('\n'), 'utf8');

console.log('Guion MD:', outMd);
console.log('CSV ElevenLabs:', outCsv);
console.log('Total clips:', AUDIO_MANIFEST.length);
