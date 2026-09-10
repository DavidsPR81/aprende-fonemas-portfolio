// docs/LISTADO_IMAGENES.md — PNG únicos, agrupados por tipo (npm run content:images)
const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, '..', 'src', 'data', 'content.js');
const outPath = path.join(__dirname, '..', 'docs', 'LISTADO_IMAGENES.md');
const content = fs.readFileSync(contentPath, 'utf8');

function slugify(word) {
  return word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

const EMOJI_CATEGORY = [
  { id: 'animales', test: /🐕|🐱|🐻|🐘|🦆|🐝|🕷|🦔|🐛|🦎|🐒|🦁|🐸|🐍|🐢|🐂|🐰|🐬|🦭|🐋|🐦|🦋|🦄|🦈|🐧|🐷|🐮|🐔|🦉|🐭|🦊|🐙|🦐|🐠|🐟|🐊|🦘|🦩|🐿|🦫|🦥|🦦|🐁|🐀|🐹|🐩|🦮|🐕‍🦺|🐈|🐈‍⬛|🐓|🦃|🦆|🦢|🦜|🦚|🦤|🦅|🕊|🐇|🦝|🦨|🦡|🦔|🐾/ },
  { id: 'cuerpo', test: /👁|👂|👄|👃|🦷|👆|👇|👈|👉|🖐|✋|🤚|💋|🦴|👅|🧠|🫁|❤|💪|🦵|🦶|👣|🤲|👋|🖖|✌|🤞|🤟|🤘|👌|🤏|👍|👎|✊|👊|🤛|🤜|👏|🙌|👐|🤲|🤝|🙏|💅|🦾|🦿/ },
  { id: 'comida', test: /🍎|🍇|🍓|🍉|🍅|🍬|🍪|🍞|🧀|🥚|🍳|🥓|🍖|🍗|🌭|🍔|🍟|🍕|🥪|🌮|🌯|🥗|🍝|🍜|🍲|🍛|🍣|🍱|🥟|🍤|🍙|🍚|🍘|🍥|🥠|🍢|🍡|🍧|🍨|🍦|🥧|🧁|🍰|🎂|🍮|🍭|🍫|🍿|🧃|🥤|🧋|☕|🍵|🫖|🍶|🍺|🍻|🥛|🧈|🫒|🥜|🌰|🍯|🥐|🥖|🫓|🥨|🧇|🥞|🍌|🍒|🍑|🥭|🍍|🥥|🥝|🫐|🍋|🍊|🍈|🥕|🌽|🥔|🧅|🧄|🥦|🥬|🥒|🌶|🫑|🍄|🥑|🍆|🥩|🍖|🧆|🥙|🧇|🫔|🥘|🍲|🫕|🥣|🍴|🥄|🍽|🧂|🥫|🍾|🍷|🥂|🍸|🍹|🧉|🍐|🫛|🍏|🥗|🍲|🥘|🍛|🍜|🍝|🍠|🍢|🍣|🍤|🍥|🥮|🍡|🥟|🍧|🍨|🍩|🍪|🎂|🍰|🧁|🥧|🍫|🍬|🍭|🍮|🍯|🍼|🥛|☕|🫖|🍵|🧃|🥤|🧋|🍶|🍺|🍻|🥂|🍷|🥃|🍸|🍹|🧉|🍾|🧊|🥄|🍴|🍽|🥢|🧂|🥡|🥫|🍱|🍘|🍙|🍚|🍛|🍜|🍝|🍠|🍢|🍣|🍤|🍥|🥮|🍡|🥟|🧆|🥙|🌮|🌯|🫔|🥗|🥘|🫕|🥣|🧈|🧀|🥚|🍳|🥞|🧇|🥓|🥩|🍗|🍖|🌭|🍔|🍟|🍕|🫓|🥪|🥨|🥖|🥐|🧁|🎂|🍰|🍩|🍪|🍫|🍬|🍭|🍮|🍯|🍼|🥛|☕|🫖|🍵|🧃|🥤|🧋/ },
  { id: 'vehiculos', test: /✈|🚗|🚂|🚢|🚲|🚚|🚁|🚀|🛸|🚕|🚙|🚌|🚎|🏎|🚓|🚑|🚒|🚐|🛻|🚛|🚜|🏍|🛵|⛵|🛶|🚤|⛴|🛳|⚓|🛫|🛬|🚃|🚋|🚞|🚝|🚄|🚅|🚈|🚉|🚊|🚇|🛥|🛩|🚟|🚠|🚡|🛰/ },
  { id: 'juguetes', test: /⚽|🏀|🎾|🎱|🎲|🥁|🎸|🎹|🎺|🪀|🪁|🧩|🎮|🕹|🎯|🎳|🏓|🏸|🥊|🥋|⛳|🛹|🛼|🛷|⛸|🎿|🏂|🏄|🏊|🚣|🧗|🚴|🚵|🏇|🏆|🎈|🧸|🪆|🪅|🎪|🤹|🎭|🎨|🎬|🎤|🎧|🎼|🪘|🪕|🪈|🎻|🎷|♟|🎰|🎖|🎫|🎗|🎀|🎁|⏰|⌚/ },
  { id: 'naturaleza', test: /🌳|🌊|☀|🌙|🌸|🔥|💧|🌿|🍃|🌱|🌴|🌵|🌾|🌻|🌺|🌷|🌹|🥀|🪻|🪷|🌼|🌛|🌜|🌝|🌞|⭐|🌟|✨|⚡|❄|☃|⛄|🌨|🌧|⛈|🌩|🌪|🌫|🌬|🌀|🌈|☁|⛅|🌤|🌥|🌦|🌧|🌨|🌩|🌪|🌫|🌬|🌀|🌈|🌊|💦|💧|🌊|🏔|⛰|🌋|🗻|🏕|🏖|🏜|🏝|🏞|🌅|🌄|🌠|🎆|🎇|🌃|🌌|🌉|🌁|🪨|🪵|🍂|🍁|🍄|🐚|🪸|🦀|🦞|🦐|🦑|🐙|🪼|🐡|🐠|🐟|🐬|🐳|🐋|🦈|🐊|🐢|🦎|🐍|🐲|🐉|🌵|🎋|🎍|🪴|🌾|🌿|☘|🍀|🍁|🍂|🍃|🪹|🪺|🥥|🌰|🫚|🫛/ },
  { id: 'casa', test: /🏠|🛏|🪑|🛋|🚪|🪟|🛁|🚿|🪞|🧻|🧼|🧽|🧴|🧹|🧺|🪣|🧯|🛒|🗑|🪑|🛏|🛋|🪞|🚪|🪟|🧸|🖼|🪴|⏰|📺|📻|🔌|💡|🕯|🪔|🔦|🏮|🗝|🔑|🪑|🛋|🪞|🚪|🪟|🛏|🛁|🚿|🧴|🧼|🧽|🧻|🪥|🪒|🧴|🧷|🧹|🧺|🪣|🧯|🛒|🗑|🪑|🛋|🪞|🚪|🪟|🛏|🛁|🚿|🧴|🧼|🧽|🧻|🪥|🪒|🧴|🧷|🧹|🧺|🪣|🧯|🛒|🗑/ },
  { id: 'escuela', test: /🏫|📝|📖|✏|📚|📕|📗|📘|📙|📓|📔|📒|📃|📄|📰|🗞|📑|🔖|🏷|💼|📁|📂|🗂|📅|📆|🗒|🗓|📇|📈|📉|📊|📋|📌|📍|📎|🖇|📏|📐|✂|🖊|🖋|✒|🖌|🖍|📝|✏|🔍|🔎|🔬|🔭|📡|💻|🖥|🖨|⌨|🖱|🖲|💾|💿|📀|🧮|🎓|🏫|🎒|🧑‍🏫|👩‍🏫|👨‍🏫/ },
  { id: 'personas', test: /👩|👨|👧|👦|👶|🧒|👵|👴|👪|👨‍👩‍👧|👨‍👩‍👦|👨‍👩‍👧‍👦|🧑|👱|🧔|👳|👲|🧕|🤵|👰|🤰|🤱|👼|🎅|🤶|🦸|🦹|🧙|🧚|🧛|🧜|🧝|🧞|🧟|💆|💇|🚶|🏃|💃|🕺|🧍|🧎|👫|👭|👬|💑|👩‍❤️‍👨|👨‍❤️‍👨|👩‍❤️‍👩|💏|👩‍❤️‍💋‍👨|👨‍❤️‍💋‍👨|👩‍❤️‍💋‍👩|👪|👨‍👩‍👧|👨‍👩‍👦|👨‍👩‍👧‍👦|👨‍👦|👨‍👦‍👦|👨‍👧|👨‍👧‍👦|👩‍👦|👩‍👦‍👦|👩‍👧|👩‍👧‍👧|🗣|👤|👥|🫂|👣/ },
  { id: 'ropa', test: /👕|👖|🧥|🧦|👗|👘|🥻|🩱|🩲|🩳|👙|👚|👛|👜|👝|🛍|🎒|👞|👟|🥾|🥿|👠|👡|🩰|👢|👑|👒|🎩|🧢|⛑|🪖|💄|💍|💎|👓|🕶|🥽|🧤|🧣|🧢|👒|🎩|👑|💍|💎|👝|👛|👜|🛍|🎒|👞|👟|🥾|🥿|👠|👡|🩰|👢|🧦|🧤|🧣|🧥|👘|🥻|🩱|🩲|🩳|👙|👚|👕|👖|👗|👔|🥼|🦺|👕|👖|🧥|🧦|👗|👘|🥻|🩱|🩲|🩳|👙|👚|👛|👜|👝|🛍|🎒|👞|👟|🥾|🥿|👠|👡|🩰|👢|👑|👒|🎩|🧢|⛑|🪖/ },
];

const WORD_HINTS = {
  animales: /pato|perro|gato|oso|elefante|abeja|araña|arana|erizo|iguana|oruga|mono|leon|león|sapo|serpiente|toro|tortuga|conejo|delfin|delfín|ballena|foca|jirafa|koala|pajaro|pájaro|mariposa|unicornio|insecto|mosquito|loro|rana|raton|ratón|zorro|zoo|burro|yegua/,
  cuerpo: /ojo|oreja|nariz|boca|dedo|diente|hueso|mano|pie|beso|uña|una/,
  comida: /manzana|uva|uvas|fresa|sandia|sandía|tomate|dulce|galleta|kiwi|jamon|jamón|jugo|queso|quesadilla|helado|sopa|arroz|yema|yogur|zumo|naranja|ketchup|masa/,
  vehiculos: /avion|avión|barco|coche|camion|camión|bicicleta|tren|kayak|yate|carro|taxi|waterpolo/,
  naturaleza: /arbol|árbol|agua|luna|sol|ola|flor|fuego|hoja|nube|noche|isla|estrella|iman|imán|rio|río|tierra|barro|nido|iglu|iglú/,
  casa: /casa|cuna|silla|mesa|espejo|ventana|vaso|vela|hilo|wifi/,
  escuela: /escuela|pizarra|libro|lapiz|lápiz|musica|música|uniforme|xilofono|xilófono/,
  personas: /mama|mamá|familia|nino|niño|nina|niña|hada|extraterrestre/,
  juguetes: /pelota|dado|juguete|muneca|muñeca|yoyo|pinata|piñata|tambor|globo|guitarra|karate|raqueta|walkie|color/,
  lugares: /jardin|jardín|zoo|isla|quiosco/,
  ropa: /bota|boton|botón|kimono|zapato/,
};

const CATEGORY_LABELS = {
  animales: 'Animales',
  cuerpo: 'Cuerpo y cara',
  comida: 'Comida y bebida',
  vehiculos: 'Vehículos y transporte',
  naturaleza: 'Naturaleza y clima',
  casa: 'Casa y objetos',
  escuela: 'Escuela y material',
  personas: 'Personas y familia',
  juguetes: 'Juguetes y deporte',
  lugares: 'Lugares y edificios',
  ropa: 'Ropa y accesorios',
  objetos: 'Otros objetos',
};

function categorize(word, emoji) {
  const slug = slugify(word);
  for (const { id, test } of EMOJI_CATEGORY) {
    if (test.test(emoji)) return id;
  }
  for (const [id, re] of Object.entries(WORD_HINTS)) {
    if (re.test(slug) || re.test(word.toLowerCase())) return id;
  }
  return 'objetos';
}

/** Palabras por letra del abecedario */
function parseLetterWords() {
  const re = /\{\s*id:\s*'([a-z])',[\s\S]*?words:\s*\[([\s\S]*?)\],\s*free:\s*(true|false)/g;
  const items = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    const letter = m[1];
    const block = m[2];
    const free = m[3] === 'true';
    const entries = [...block.matchAll(/wordEntry\('([^']+)',\s*'([^']*)'\)/g)];
    entries.forEach(([_, word, emoji]) => {
      items.push({ word, emoji, letter, free, source: `letra ${letter.toUpperCase()}` });
    });
  }
  return items;
}

function parseSentences() {
  const block = content.match(/export const SENTENCES = \[([\s\S]*?)\];/);
  if (!block) return [];
  return [...block[1].matchAll(/id:\s*'([^']+)'[\s\S]*?text:\s*'([^']+)'/g)].map((m) => ({
    id: m[1],
    text: m[2],
  }));
}

function collectUniqueWords(letterItems) {
  const bySlug = new Map();

  letterItems.forEach((item) => {
    const slug = slugify(item.word);
    const existing = bySlug.get(slug);
    if (!existing) {
      bySlug.set(slug, {
        word: item.word,
        slug,
        emoji: item.emoji,
        category: categorize(item.word, item.emoji),
        free: item.free,
        sources: new Set([item.source]),
        letters: new Set([item.letter]),
      });
      return;
    }
    existing.sources.add(item.source);
    existing.letters.add(item.letter);
    if (item.free) existing.free = true;
    if (!existing.emoji && item.emoji) existing.emoji = item.emoji;
  });

  // Palabras en ejercicios (rimas, sílabas…) que no están en letras
  const allEntries = [...content.matchAll(/wordEntry\('([^']+)',\s*'([^']*)'\)/g)];
  allEntries.forEach(([_, word, emoji]) => {
    const slug = slugify(word);
    if (bySlug.has(slug)) return;
    bySlug.set(slug, {
      word,
      slug,
      emoji,
      category: categorize(word, emoji),
      free: false,
      sources: new Set(['ejercicios (rimas, sílabas, fusión…)']),
      letters: new Set(),
    });
  });

  return [...bySlug.values()].sort((a, b) => a.word.localeCompare(b.word, 'es'));
}

function groupByCategory(words) {
  const groups = {};
  words.forEach((w) => {
    if (!groups[w.category]) groups[w.category] = [];
    groups[w.category].push(w);
  });
  const order = [
    'animales',
    'cuerpo',
    'comida',
    'vehiculos',
    'naturaleza',
    'casa',
    'juguetes',
    'escuela',
    'lugares',
    'personas',
    'ropa',
    'objetos',
  ];
  return order
    .filter((id) => groups[id]?.length)
    .map((id) => ({ id, label: CATEGORY_LABELS[id], items: groups[id] }));
}

const letterItems = parseLetterWords();
const words = collectUniqueWords(letterItems);
const sentences = parseSentences();
const groups = groupByCategory(words);

const freeUnique = words.filter((w) => w.free).length;
const premiumUnique = words.length - freeUnique;
const dupesAvoided =
  [...content.matchAll(/wordEntry\('([^']+)'/g)].length - words.length;

const lines = [
  '# Listado de dibujos PNG — Aprende Fonemas',
  '',
  'Todos los dibujos a crear, **por tipo** y **sin duplicar**. Una palabra = un PNG aunque salga en varios niveles.',
  '',
  'Regenerar: `npm run content:images` · Estilo: [`GUIA_CREACION_IMAGENES.md`](GUIA_CREACION_IMAGENES.md)',
  '',
  '## Resumen',
  '',
  '| Concepto | Cantidad |',
  '|----------|----------|',
  `| **PNG de palabras únicos** | **${words.length}** |`,
  `| └ Gratis (niveles 1–4) | ${freeUnique} |`,
  `| └ Premium / ejercicios | ${premiumUnique} |`,
  `| Escenas de frases (nivel 12) | ${sentences.length} |`,
  `| **Total PNG a crear** | **${words.length + sentences.length}** |`,
  `| Apariciones en código deduplicadas | ${dupesAvoided} (misma imagen reutilizada) |`,
  '',
  '**Formato:** 512×512 px · PNG · fondo transparente · nombre = slug (`Pato` → `pato.png`)',
  '',
  '**Orden:** por categoría (animales, vehículos…), no por letra.',
  '',
  '---',
  '',
];

groups.forEach(({ id, label, items }) => {
  const freeN = items.filter((w) => w.free).length;
  lines.push(`## ${label} (${items.length})`, '');
  if (freeN > 0 && freeN < items.length) {
    lines.push(`_${freeN} gratis · ${items.length - freeN} premium/ejercicios_`, '');
  } else if (freeN === items.length) {
    lines.push('_Todos gratis (niveles 1–4)_', '');
  }
  items.forEach((w) => {
    const tags = [];
    if (w.free) tags.push('gratis');
    else tags.push('premium');
    if (w.letters.size) tags.push(`letras: ${[...w.letters].join(', ')}`);
    if (w.sources.size > 1 || !w.letters.size) {
      tags.push([...w.sources].join('; '));
    }
    const note = tags.length ? ` _(${tags.join(' · ')})_` : '';
    lines.push(`- [ ] **${w.word}**${w.emoji ? ` ${w.emoji}` : ''} → \`words/${w.slug}.png\`${note}`);
  });
  lines.push('');
});

lines.push('## Frases — escena ilustrada (nivel 12)', '', `_${sentences.length} imágenes en \`assets/images/sentences/\` — una escena por frase._`, '');
sentences.forEach((s) => {
  lines.push(`- [ ] **${s.text}** → \`sentences/${s.id}.png\``);
});
lines.push('');

lines.push(
  '---',
  '',
  '## Notas',
  '',
  '- Cada palabra aparece **una sola vez** en este listado (aunque se use en varios niveles).',
  '- **Uva** y **Uvas** son dos PNG distintos.',
  '- Estilo: 512×512, fondo transparente, mismo pack de dibujo infantil.',
  '- Empieza por categorías con más ítems gratis (animales, comida, casa).',
  '- Regenerar: `npm run content:images`',
  ''
);

fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`Written ${outPath}`);
console.log(`Unique words: ${words.length}, sentences: ${sentences.length}, total PNG: ${words.length + sentences.length}`);
console.log(`Deduped ${dupesAvoided} duplicate wordEntry appearances`);
