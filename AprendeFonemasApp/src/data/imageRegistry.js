function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// Portfolio: ilustraciones de palabras/frases no incluidas.
export const WORD_IMAGES = {};
export const SENTENCE_IMAGES = {};

export function resolveImageKey(item) {
  if (!item) return null;
  if (item.imageKey) return item.imageKey;
  if (item.id) return item.id;
  if (item.word) return slugify(item.word);
  return null;
}

export function getIllustrationSource(item) {
  const key = resolveImageKey(item);
  if (!key) return null;
  return WORD_IMAGES[key] ?? SENTENCE_IMAGES[key] ?? null;
}
