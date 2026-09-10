/**
 * Espaciado vertical del ejercicio.
 * Portrait: compacto para caber sin cortar; landscape puede hacer scroll.
 */

export const EXERCISE_LAYOUT = {
  'identify-phoneme': { profile: 'listen-letters' },
  'associate-word': { profile: 'listen-association-grid' },
  'choose-word': { profile: 'listen-word-grid' },
  'identify-initial': { profile: 'stimulus-listen-letters' },
  'identify-final': { profile: 'stimulus-listen-letters' },
  'identify-initial-syllable': { profile: 'stimulus-listen-syllables' },
  'syllable-count': { profile: 'stimulus-listen-syllables' },
  'complete-word-final': { profile: 'stimulus-listen-letters' },
  'complete-word-middle': { profile: 'stimulus-listen-letters' },
  rhyme: { profile: 'stimulus-listen-grid' },
  alliteration: { profile: 'stimulus-listen-grid' },
  'phoneme-blend': { profile: 'blend-listen-grid' },
  'short-sentences': { profile: 'listen-images' },
  'read-sentence': { profile: 'sentence-listen-images' },
};

export function getExerciseLayout(levelType) {
  return EXERCISE_LAYOUT[levelType] ?? { profile: 'listen-word-grid' };
}

/**
 * @param {string} profile
 * @param {{ isLandscape?: boolean, isCompact?: boolean, isTablet?: boolean, isPortraitPhone?: boolean }} opts
 */
export function getLayoutSpacing(profile, opts = {}) {
  const {
    isLandscape = false,
    isCompact = false,
    isPortraitPhone = false,
    isTablet = false,
  } = opts;
  const dense = isLandscape || isCompact;

  // progress bajo los puntos; prompt bajo la instrucción; listen entre Escuchar y cards
  const table = {
    'listen-letters': { prompt: 18, stimulus: 0, listen: 28, progress: 32 },
    'listen-association-grid': { prompt: 18, stimulus: 0, listen: 28, progress: 32 },
    'listen-word-grid': { prompt: 18, stimulus: 0, listen: 28, progress: 32 },
    'listen-images': { prompt: 18, stimulus: 0, listen: 28, progress: 32 },
    'stimulus-listen-letters': { prompt: 16, stimulus: 12, listen: 22, progress: 32 },
    'stimulus-listen-syllables': { prompt: 16, stimulus: 12, listen: 22, progress: 32 },
    'stimulus-listen-grid': { prompt: 14, stimulus: 10, listen: 22, progress: 32 },
    'blend-listen-grid': { prompt: 16, stimulus: 12, listen: 22, progress: 32 },
    'sentence-listen-images': { prompt: 14, stimulus: 10, listen: 22, progress: 32 },
  };

  const base = table[profile] ?? table['listen-word-grid'];

  if (isTablet && !isLandscape) {
    return {
      prompt: base.prompt + 6,
      stimulus: base.stimulus > 0 ? base.stimulus + 6 : 0,
      listen: base.listen + 8,
      progress: base.progress + 4,
    };
  }

  if (dense) {
    return {
      prompt: Math.max(14, base.prompt - 2),
      stimulus: Math.max(8, base.stimulus),
      listen: Math.max(18, base.listen - 4),
      // Nunca bajar demasiado: evita solape Tu reto / puntos de sesión
      progress: Math.max(28, base.progress - 2),
    };
  }

  // Portrait phone: densificar grids (8/9) y filas de 3 para caber sin scroll.
  if (isPortraitPhone) {
    const isGrid = profile.includes('grid') || profile === 'listen-images';
    return {
      prompt: Math.max(10, base.prompt - (isGrid ? 4 : 2)),
      stimulus: Math.max(6, base.stimulus - (isGrid ? 4 : 2)),
      listen: Math.max(16, base.listen - (isGrid ? 8 : 4)),
      progress: Math.max(24, base.progress - 4),
    };
  }

  return base;
}
