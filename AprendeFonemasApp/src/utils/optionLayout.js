export const VISUAL_OPTION_COUNT = 4; // grid 2×2

export const LETTER_OPTION_COUNT = 3; // fila horizontal

export const LETTER_ROW_TYPES = [
  'identify-phoneme',
  'identify-initial',
  'identify-final',
  'identify-initial-syllable',
  'syllable-count',
  'complete-word-final',
  'complete-word-middle',
];

export const VISUAL_GRID_TYPES = [
  'associate-word',
  'choose-word',
  'alliteration',
  'rhyme',
  'phoneme-blend',
  'short-sentences',
  'read-sentence',
];

export function usesLetterRowLayout(exerciseType) {
  return LETTER_ROW_TYPES.includes(exerciseType);
}

export function usesVisualGridLayout(exerciseType) {
  return VISUAL_GRID_TYPES.includes(exerciseType);
}
