import { getInitialPhoneme } from './spanishPhonemes';

const VOWELS = 'aeiou';

function normalizeWord(wordText) {
  return wordText
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Cola de rima desde la última vocal acentuada */
export function extractRhymeTail(wordText) {
  const word = normalizeWord(wordText);

  // Sufijos frecuentes en vocabulario infantil
  if (word.endsWith('ion')) {
    return 'ion';
  }
  if (word.endsWith('on')) {
    return 'on';
  }
  if (word.endsWith('ato')) {
    return 'ato';
  }
  if (word.endsWith('ana')) {
    return 'ana';
  }
  if (word.endsWith('una')) {
    return 'una';
  }
  if (word.endsWith('asa')) {
    return 'asa';
  }
  if (word.endsWith('oro')) {
    return 'oro';
  }
  if (word.endsWith('ota')) {
    return 'ota';
  }
  if (word.endsWith('or')) {
    return 'or';
  }
  if (word.endsWith('arco')) {
    return 'arco';
  }

  let lastVowelIndex = -1;

  for (let i = word.length - 1; i >= 0; i -= 1) {
    if (VOWELS.includes(word[i])) {
      lastVowelIndex = i;
      break;
    }
  }

  if (lastVowelIndex === -1) {
    return word;
  }

  const tail = word.slice(lastVowelIndex);
  if (tail.length >= 2) {
    return tail;
  }

  if (lastVowelIndex > 0) {
    let prevVowel = -1;
    for (let i = lastVowelIndex - 1; i >= 0; i -= 1) {
      if (VOWELS.includes(word[i])) {
        prevVowel = i;
        break;
      }
    }
    if (prevVowel >= 0) {
      return word.slice(prevVowel);
    }
  }

  return tail;
}

export function wordsRhyme(wordA, wordB) {
  const a = normalizeWord(wordA);
  const b = normalizeWord(wordB);
  if (!a || !b || a === b) {
    return false;
  }

  const tailA = extractRhymeTail(a);
  const tailB = extractRhymeTail(b);
  if (tailA.length >= 2 && tailA === tailB) {
    return true;
  }

  return false;
}

export function shareInitialPhoneme(wordA, wordB) {
  const phonemeA = getInitialPhoneme(wordA);
  const phonemeB = getInitialPhoneme(wordB);
  return Boolean(phonemeA && phonemeB && phonemeA === phonemeB);
}

export function sameVisualEmoji(wordA, wordB) {
  return Boolean(wordA?.image && wordB?.image && wordA.image === wordB.image);
}

export function isUniqueWordOption(word, usedKeys) {
  return word?.audioKey && !usedKeys.has(word.audioKey);
}

export function sanitizeRhymeDistractors(anchor, rhyme, distractors, maxCount) {
  const used = new Set([anchor.audioKey, rhyme.audioKey]);

  return distractors.filter((item) => {
    if (!isUniqueWordOption(item, used)) {
      return false;
    }
    if (wordsRhyme(item.word, anchor.word)) {
      return false;
    }
    if (sameVisualEmoji(item, anchor) || sameVisualEmoji(item, rhyme)) {
      return false;
    }
    used.add(item.audioKey);
    return true;
  }).slice(0, maxCount);
}

export function sanitizeAlliterationDistractors(anchor, match, distractors, maxCount) {
  const used = new Set([anchor.audioKey, match.audioKey]);

  return distractors.filter((item) => {
    if (!isUniqueWordOption(item, used)) {
      return false;
    }
    if (shareInitialPhoneme(item.word, anchor.word)) {
      return false;
    }
    if (sameVisualEmoji(item, anchor) || sameVisualEmoji(item, match)) {
      return false;
    }
    used.add(item.audioKey);
    return true;
  }).slice(0, maxCount);
}

export function sanitizeVisualWordDistractors(correctWord, distractors, maxCount) {
  const used = new Set([correctWord.audioKey]);

  return distractors.filter((item) => {
    if (!isUniqueWordOption(item, used)) {
      return false;
    }
    if (sameVisualEmoji(item, correctWord)) {
      return false;
    }
    used.add(item.audioKey);
    return true;
  }).slice(0, maxCount);
}

export function sanitizeBlendDistractors(target, distractors, maxCount) {
  const used = new Set([target.audioKey]);

  return distractors.filter((item) => {
    if (!isUniqueWordOption(item, used)) {
      return false;
    }
    if (wordsRhyme(item.word, target.word)) {
      return false;
    }
    if (sameVisualEmoji(item, target)) {
      return false;
    }
    // Evita pares casi idénticos (avión/camión, mono/mano, rana/sapo)
    if (shareInitialPhoneme(item.word, target.word) && extractRhymeTail(item.word) === extractRhymeTail(target.word)) {
      return false;
    }
    used.add(item.audioKey);
    return true;
  }).slice(0, maxCount);
}
