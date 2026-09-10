
import { EXERCISES_PER_SESSION, getSessionSizeForLevel } from '../config/session';
import {
  ALLITERATION_EXERCISES,
  BLEND_EXERCISES,
  buildBlendLabel,
  buildBlendSpeech,
  buildPartialWord,
  findLetterForChar,
  getAllWords,
  getMissingCharForGap,
  getSentencesForLevel,
  INITIAL_SYLLABLE_EXERCISES,
  LETTERS,
  LEVELS,
  lettersForEdgePhoneme,
  lettersSoundAlike,
  lettersWithInitialWord,
  pickWordEndingWithLetter,
  pickWordForLetter,
  RHYME_EXERCISES,
  sentencesConflictVisually,
  SYLLABLE_EXERCISES,
  wordImagesConflict,
  wordStartsWithLetter,
} from '../data/content';
import { LETTER_OPTION_COUNT, VISUAL_OPTION_COUNT } from './optionLayout';
import { buildSyllableCountOptions, getInitialPhoneme, segmentWordForBlend } from './spanishPhonemes';
import {
  sanitizeAlliterationDistractors,
  sanitizeBlendDistractors,
  sanitizeRhymeDistractors,
  sameVisualEmoji,
  shareInitialPhoneme,
  wordsRhyme,
} from './spanishRhymes';

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

const OVERUSED_DISTRACTOR_KEYS = new Set(['words/tomate']);

function itemContentKey(item) {
  const word = item?.word?.word ?? item?.target?.word ?? item?.anchor?.word ?? item?.word?.audioKey ?? item?.id ?? '';
  return String(word)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function isItemInSeen(item, seenKeys) {
  if (!seenKeys || !seenKeys.size) return false;
  const candidates = [
    item?.word?.audioKey,
    item?.correctWord?.audioKey,
    item?.target?.audioKey,
    item?.anchor?.audioKey,
    item?.sentence?.id,
    item?.correctSyllable,
    item?.correctCount ? `count:${item.correctCount}:${item?.word?.audioKey}` : null,
    item?.correctLetter?.id ? `letter:${item.correctLetter.id}` : null,
    itemContentKey(item),
  ];
  for (const c of candidates) {
    if (!c) continue;
    if (seenKeys.has(String(c))) return true;
  }
  return false;
}

function shufflePreferringVariety(candidates) {
  const fresh = shuffle(candidates.filter((c) => !OVERUSED_DISTRACTOR_KEYS.has(c.audioKey)));
  const fallback = shuffle(candidates.filter((c) => OVERUSED_DISTRACTOR_KEYS.has(c.audioKey)));
  return [...fresh, ...fallback];
}

/** Palabras nuevas post-v8: garantizar al menos 1 por sesión si hay hueco en el pool. */
const NEW_CONTENT_KEYS = new Set([
  'mosquito',
  'kimono',
  'quesadilla',
  'raqueta',
  'taxi',
  'wifi',
  'walkie',
  'extraterrestre',
]);

function pickSessionItems(items, sessionSize = EXERCISES_PER_SESSION) {
  return shuffle(items).slice(0, Math.min(sessionSize, items.length));
}

function pickSessionItemsPreferringVarietyCore(items, sessionSize, seenKeys) {
  if (!items.length || sessionSize <= 0) return [];

  const keys = seenKeys && seenKeys.size ? seenKeys : null;

  const preferred = shuffle(items.filter((item) => NEW_CONTENT_KEYS.has(itemContentKey(item))));
  const rest = shuffle(items.filter((item) => !NEW_CONTENT_KEYS.has(itemContentKey(item))));

  const picked = [];
  const seenExcluded = [];

  const tryPush = (item) => {
    if (!item) return false;
    if (picked.includes(item)) return false;
    if (keys && isItemInSeen(item, keys)) {
      seenExcluded.push(item);
      return false;
    }
    picked.push(item);
    return true;
  };

  if (preferred.length) {
    tryPush(preferred[0]);
  }

  const remainder = [...preferred.slice(1), ...rest];
  for (const item of remainder) {
    if (picked.length >= sessionSize) break;
    tryPush(item);
  }

  // Fallback 1: si seenKeys filtró demasiados → reusar los ya vistos para llegar al tamaño
  if (picked.length < sessionSize && seenExcluded.length) {
    for (const item of shuffle(seenExcluded)) {
      if (picked.length >= sessionSize) break;
      if (picked.includes(item)) continue;
      picked.push(item);
    }
  }

  // Fallback 2: si todavía faltan → repetir del pool original (defensivo: pool muy pequeño)
  if (picked.length < sessionSize) {
    for (const item of shuffle(items)) {
      if (picked.length >= sessionSize) break;
      if (picked.includes(item)) continue;
      picked.push(item);
    }
  }

  return shuffle(picked).slice(0, Math.min(sessionSize, picked.length));
}

function pickSessionItemsPreferringNew(items, sessionSize = EXERCISES_PER_SESSION) {
  return pickSessionItemsPreferringVarietyCore(items, sessionSize, null);
}

function pickSessionItemsPreferringUnseen(items, sessionSize = EXERCISES_PER_SESSION, seenKeys = null) {
  const setKeys = Array.isArray(seenKeys) ? new Set(seenKeys) : seenKeys;
  return pickSessionItemsPreferringVarietyCore(items, sessionSize, setKeys);
}

/**
 * Distractores de letra sin sonidos equivalentes al correcto (C/K/Q, B/V, R/RR…).
 * `excludedPhoneme` cubre grafemas cuya palabra suena distinto (Hilo → /i/: fuera la I;
 * Xilófono → /s/: fuera la S), para que nunca haya dos opciones fonéticamente válidas.
 */
function pickDistractorLetters(letters, correctLetter, count = LETTER_OPTION_COUNT - 1, excludedPhoneme = null) {
  const pool = shuffle(letters.filter((item) => {
    if (item.id === correctLetter.id) return false;
    if (lettersSoundAlike(item.id, correctLetter.id)) return false;
    if (excludedPhoneme && (item.id === excludedPhoneme || lettersSoundAlike(item.id, excludedPhoneme))) {
      return false;
    }
    return true;
  }));

  const picked = [];
  for (const item of pool) {
    if (picked.some((chosen) => lettersSoundAlike(chosen.id, item.id))) {
      continue;
    }
    picked.push(item);
    if (picked.length >= count) break;
  }
  return picked;
}

function pickDistractorWords(allLetters, correctLetter, correctWord, count = VISUAL_OPTION_COUNT - 1) {
  // Ni letras que suenan igual (Q/K cuando el objetivo es C) ni palabras que
  // empiezan por el mismo sonido (Conejo vs Quiosco, Avión vs Hada).
  const targetPhoneme = getInitialPhoneme(correctWord.word);
  const shuffledLetters = shuffle(
    allLetters.filter(
      (item) => item.id !== correctLetter.id && !lettersSoundAlike(item.id, correctLetter.id)
    )
  );
  const distractors = [];
  const usedKeys = new Set([correctWord.audioKey]);
  const usedEmoji = new Set([correctWord.image]);
  const usedPhonemes = new Set([targetPhoneme]);

  for (const letter of shuffledLetters) {
    const validWords = letter.words.filter((entry) => wordStartsWithLetter(entry.word, letter));
    const pool = shuffle(validWords.length ? validWords : letter.words);

    const entry = pool.find(
      (word) =>
        !usedKeys.has(word.audioKey) &&
        !usedEmoji.has(word.image) &&
        !usedPhonemes.has(getInitialPhoneme(word.word)) &&
        !wordImagesConflict(word, correctWord) &&
        !distractors.some((picked) => wordImagesConflict(word, picked))
    );

    if (!entry) {
      continue;
    }

    distractors.push({ ...entry, letter });
    usedKeys.add(entry.audioKey);
    usedEmoji.add(entry.image);
    usedPhonemes.add(getInitialPhoneme(entry.word));

    if (distractors.length >= count) {
      break;
    }
  }

  return distractors.slice(0, count);
}

function fillVisualDistractors(anchor, correct, distractors, isPremium, count, mode = 'rhyme') {
  let clean;
  if (mode === 'rhyme') {
    clean = sanitizeRhymeDistractors(anchor, correct, distractors, count);
  } else if (mode === 'alliteration') {
    clean = sanitizeAlliterationDistractors(anchor, correct, distractors, count);
  } else {
    clean = sanitizeBlendDistractors(correct, distractors, count);
  }

  if (clean.length >= count) {
    return clean;
  }

  const used = new Set([
    anchor?.audioKey,
    correct.audioKey,
    ...clean.map((item) => item.audioKey),
  ].filter(Boolean));

  const extras = shufflePreferringVariety(getAllWords(isPremium).filter((candidate) => {
    if (!candidate.audioKey || used.has(candidate.audioKey)) {
      return false;
    }
    if (sameVisualEmoji(candidate, anchor ?? correct) || sameVisualEmoji(candidate, correct)) {
      return false;
    }
    if (
      wordImagesConflict(candidate, correct) ||
      (anchor && wordImagesConflict(candidate, anchor)) ||
      clean.some((item) => wordImagesConflict(candidate, item))
    ) {
      return false;
    }
    if (mode === 'rhyme' && anchor && wordsRhyme(candidate.word, anchor.word)) {
      return false;
    }
    if (mode === 'alliteration' && anchor && shareInitialPhoneme(candidate.word, anchor.word)) {
      return false;
    }
    if (mode === 'blend' && wordsRhyme(candidate.word, correct.word)) {
      return false;
    }
    return true;
  }));

  return [...clean, ...extras].slice(0, count);
}

export function getPlayableLetters(isPremium = false) {
  return LETTERS.filter((letter) => isPremium || letter.free);
}

export function buildSessionLetters(letters, sessionSize = EXERCISES_PER_SESSION, seenKeys = null) {
  return pickSessionItemsPreferringUnseen(letters, sessionSize, seenKeys);
}

export const LEVEL_INSTRUCTIONS = {
  'identify-phoneme': 'Escucha y elige la letra',
  'associate-word': 'Escucha y elige el dibujo',
  'choose-word': 'Escucha y elige la palabra',
  'identify-initial': '¿Con qué letra empieza?',
  'identify-final': '¿Con qué letra termina?',
  'identify-initial-syllable': '¿Con qué sílaba empieza?',
  'syllable-count': '¿Cuántas sílabas tiene?',
  'complete-word-final': '¿Qué letra falta al final?',
  'complete-word-middle': '¿Qué letra falta en medio?',
  alliteration: 'Elige la que empieza igual',
  rhyme: 'Elige la que rima',
  'phoneme-blend': 'Junta los sonidos y elige la palabra',
  'short-sentences': 'Escucha y elige el dibujo',
  'read-sentence': 'Lee la frase y elige el dibujo',
};

export function getExerciseInstruction(exercise, level) {
  if (!exercise) {
    return LEVEL_INSTRUCTIONS[level.type] ?? 'Escucha con atención';
  }

  switch (exercise.type) {
    case 'complete-word-final':
      return '¿Qué letra falta al final?';
    case 'complete-word-middle':
      return '¿Qué letra falta en medio?';
    case 'identify-initial':
      return '¿Con qué letra empieza?';
    case 'identify-final':
      return '¿Con qué letra termina?';
    case 'identify-initial-syllable':
      return '¿Con qué sílaba empieza?';
    case 'associate-word':
      return 'Escucha y elige el dibujo';
    case 'choose-word':
      return 'Escucha y elige la palabra';
    case 'phoneme-blend':
      return 'Junta los sonidos y elige la palabra';
    case 'rhyme':
      return 'Elige la que rima';
    case 'read-sentence':
      return 'Lee la frase y elige el dibujo';
    case 'syllable-count':
      return '¿Cuántas sílabas tiene?';
    default:
      return LEVEL_INSTRUCTIONS[level.type] ?? LEVEL_INSTRUCTIONS[exercise.type] ?? 'Escucha con atención';
  }
}

function buildIdentifyPhonemeExercises(sessionLetters, allLetters) {
  // H muda: no es fonema audible; se trabaja como grafema en otros niveles
  const phonemeLetters = sessionLetters.filter((letter) => letter.id !== 'h');
  const letters = phonemeLetters.length ? phonemeLetters : sessionLetters;
  const distractorPool = allLetters.filter((letter) => letter.id !== 'h');

  return letters.map((letter) => ({
    type: 'identify-phoneme',
    correctLetter: letter,
    options: shuffle([letter, ...pickDistractorLetters(distractorPool, letter)]),
    playKey: letter.phonemeAudioKey,
  }));
}

function buildAssociateWordExercises(sessionLetters, allLetters) {
  // H muda: no hay fonema /h/; se trabaja como grafema en letra inicial
  // ñ/rr y similares: solo si hay palabra que EMPIEZA por ese sonido (no Piñata/Torre).
  const withInitial = lettersWithInitialWord(
    sessionLetters.filter((letter) => letter.id !== 'h')
  );
  const pool = withInitial.length
    ? withInitial
    : lettersWithInitialWord(allLetters.filter((letter) => letter.id !== 'h'));

  return pool
    .map((letter) => {
      const picked = pickWordForLetter(letter, { requireInitial: true });
      if (!picked) return null;
      const correctWord = { ...picked, letter };
      const distractorWords = pickDistractorWords(allLetters, letter, correctWord);

      return {
        type: 'associate-word',
        correctLetter: letter,
        correctWord,
        options: shuffle([correctWord, ...distractorWords]),
        playKey: letter.phonemeAudioKey,
      };
    })
    .filter(Boolean);
}

function buildChooseWordExercises(sessionLetters, allLetters) {
  const withInitial = lettersWithInitialWord(
    sessionLetters.filter((letter) => letter.id !== 'h')
  );
  const pool = withInitial.length
    ? withInitial
    : lettersWithInitialWord(allLetters.filter((letter) => letter.id !== 'h'));

  return pool
    .map((letter) => {
      const picked = pickWordForLetter(letter, { requireInitial: true });
      if (!picked) return null;
      const correctWord = { ...picked, letter };
      const distractors = pickDistractorWords(allLetters, letter, correctWord);

      return {
        type: 'choose-word',
        correctLetter: letter,
        correctWord,
        options: shuffle([correctWord, ...distractors]),
        playKey: letter.phonemeAudioKey,
      };
    })
    .filter(Boolean);
}

function buildIdentifyInitialExercises(sessionLetters, allLetters) {
  const usable = lettersForEdgePhoneme(sessionLetters, 'initial', false);
  const letters = usable.length
    ? usable
    : lettersWithInitialWord(sessionLetters.length ? sessionLetters : allLetters);

  return letters
    .map((letter) => {
      const picked = pickWordForLetter(letter, { requireInitial: true });
      if (!picked) return null;
      const word = { ...picked, letter };

      return {
        type: 'identify-initial',
        correctLetter: letter,
        word,
        partialWord: buildPartialWord(word.word, 'initial'),
        // El niño oye la palabra: fuera letras que suenan como su inicio real
        // (Hilo suena /i/ → sin I; Queso suena /k/ → sin K ni C).
        options: shuffle([
          letter,
          ...pickDistractorLetters(allLetters, letter, LETTER_OPTION_COUNT - 1, getInitialPhoneme(word.word)),
        ]),
        playKey: word.audioKey,
      };
    })
    .filter(Boolean);
}

function buildIdentifyFinalExercises(sessionSize, allLetters, isPremium, seenKeys = null) {
  const usable = lettersForEdgePhoneme(allLetters, 'final', isPremium);
  const sessionLetters = pickSessionItemsPreferringUnseen(
    usable.length ? usable : allLetters.filter((l) => l.id !== 'rr'),
    sessionSize,
    seenKeys
  );

  return sessionLetters.map((letter) => {
    const word = pickWordEndingWithLetter(letter, isPremium);

    return {
      type: 'identify-final',
      correctLetter: letter,
      word,
      partialWord: buildPartialWord(word.word, 'final'),
      options: shuffle([letter, ...pickDistractorLetters(allLetters, letter)]),
      playKey: word.audioKey,
    };
  });
}

function wordEligibleForGap(entry, gapPosition, allLetters) {
  if (!entry?.letter || entry.word.length < (gapPosition === 'middle' ? 4 : 3)) {
    return false;
  }
  const missing = getMissingCharForGap(entry.word, gapPosition);
  if (!findLetterForChar(missing, allLetters)) {
    return false;
  }
  // Empieza por su letra de catálogo, o es vocabulario ñ/rr (grafema interior)
  if (wordStartsWithLetter(entry.word, entry.letter)) {
    return true;
  }
  if (entry.letter.id === 'enie' && /ñ/i.test(entry.word)) {
    return true;
  }
  if (entry.letter.id === 'rr') {
    const normalized = entry.word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalized.includes('rr');
  }
  return false;
}

function buildCompleteWordGapExercises(allLetters, sessionSize, isPremium, gapPosition, seenKeys = null) {
  const type = gapPosition === 'final' ? 'complete-word-final' : 'complete-word-middle';

  const wordPool = getAllWords(isPremium).filter((entry) =>
    wordEligibleForGap(entry, gapPosition, allLetters)
  );

  let sessionWords;
  if (gapPosition === 'middle') {
    // Reservar huecos con ñ (Piñata, Muñeca…) para que el grafema se practique
    const withEnie = wordPool.filter((entry) => /ñ/i.test(entry.word));
    const withoutEnie = wordPool.filter((entry) => !/ñ/i.test(entry.word));
    const reserved = Math.min(2, withEnie.length, sessionSize);
    const pickedEnie = pickSessionItemsPreferringUnseen(withEnie, reserved, seenKeys);
    const usedKeys = new Set(pickedEnie.map((e) => e.audioKey));
    const rest = withoutEnie.filter((e) => !usedKeys.has(e.audioKey));
    const pickedRest = pickSessionItemsPreferringUnseen(rest, Math.max(0, sessionSize - pickedEnie.length), seenKeys);
    sessionWords = shuffle([...pickedEnie, ...pickedRest]);
  } else {
    sessionWords = pickSessionItemsPreferringUnseen(wordPool, sessionSize, seenKeys);
  }

  return sessionWords.map((entry) => {
    const missingChar = getMissingCharForGap(entry.word, gapPosition);
    const correctLetter = findLetterForChar(missingChar, allLetters);

    return {
      type,
      gapPosition,
      correctLetter,
      word: entry,
      partialWord: buildPartialWord(entry.word, gapPosition),
      options: shuffle([correctLetter, ...pickDistractorLetters(allLetters, correctLetter)]),
      playKey: entry.audioKey,
    };
  });
}

function buildAlliterationExercises(sessionSize, isPremium, seenKeys = null) {
  const available = isPremium
    ? ALLITERATION_EXERCISES
    : ALLITERATION_EXERCISES.filter((item) =>
      [item.anchor, item.match, ...item.distractors].every((word) =>
        getAllWords(false).some((entry) => entry.audioKey === word.audioKey)
      )
    );

  const sessionItems = pickSessionItemsPreferringUnseen(available, sessionSize, seenKeys);

  return sessionItems.map((item) => ({
    type: 'alliteration',
    anchor: item.anchor,
    correctWord: item.match,
    options: shuffle([
      item.match,
      ...fillVisualDistractors(item.anchor, item.match, item.distractors, isPremium, VISUAL_OPTION_COUNT - 1, 'alliteration'),
    ]),
    playKey: item.anchor.audioKey,
  }));
}

function buildRhymeExercises(sessionSize, isPremium, seenKeys = null) {
  const availableRhymes = isPremium
    ? RHYME_EXERCISES
    : RHYME_EXERCISES.filter((item) =>
      [item.anchor, item.rhyme, ...item.distractors].every((word) =>
        getAllWords(false).some((entry) => entry.audioKey === word.audioKey)
      )
    );
  const sessionRhymes = pickSessionItemsPreferringUnseen(availableRhymes, sessionSize, seenKeys);

  return sessionRhymes.map((item) => ({
    type: 'rhyme',
    anchor: item.anchor,
    correctWord: item.rhyme,
    options: shuffle([
      item.rhyme,
      ...fillVisualDistractors(item.anchor, item.rhyme, item.distractors, isPremium, VISUAL_OPTION_COUNT - 1, 'rhyme'),
    ]),
    playKey: item.anchor.audioKey,
  }));
}

const SYLLABLE_OPTION_COUNTS = [2, 3, 4]; // histórico; opciones reales en buildSyllableCountOptions

function buildSyllableCountExercises(sessionSize, isPremium, seenKeys = null) {
  const available = isPremium
    ? SYLLABLE_EXERCISES
    : SYLLABLE_EXERCISES.filter((item) =>
      getAllWords(false).some((entry) => entry.audioKey === item.word.audioKey)
    );

  const sessionItems = pickSessionItemsPreferringUnseen(available, sessionSize, seenKeys);

  return sessionItems.map((item) => ({
    type: 'syllable-count',
    word: item.word,
    correctCount: item.syllables,
    options: shuffle(buildSyllableCountOptions(item.syllables)),
    playKey: item.word.audioKey,
  }));
}

function buildIdentifyInitialSyllableExercises(sessionSize, isPremium, seenKeys = null) {
  const available = isPremium
    ? INITIAL_SYLLABLE_EXERCISES
    : INITIAL_SYLLABLE_EXERCISES.filter((item) =>
      getAllWords(false).some((entry) => entry.audioKey === item.word.audioKey)
    );

  const sessionItems = pickSessionItemsPreferringUnseen(available, sessionSize, seenKeys);

  return sessionItems.map((item) => {
    const distractors = shuffle(item.distractors)
      .filter((syl) => syl.toUpperCase() !== item.correct.toUpperCase())
      .slice(0, LETTER_OPTION_COUNT - 1);

    return {
      type: 'identify-initial-syllable',
      word: item.word,
      correctSyllable: item.correct.toUpperCase(),
      options: shuffle([item.correct.toUpperCase(), ...distractors.map((s) => s.toUpperCase())]),
      playKey: item.word.audioKey,
    };
  });
}

function buildPhonemeBlendExercises(sessionSize, isPremium, seenKeys = null) {
  const available = isPremium
    ? BLEND_EXERCISES
    : BLEND_EXERCISES.filter((item) =>
      [item.target, ...item.distractors].every((word) =>
        getAllWords(false).some((entry) => entry.audioKey === word.audioKey)
      )
    );

  const sessionItems = pickSessionItemsPreferringUnseen(available, sessionSize, seenKeys);

  return sessionItems.map((item) => ({
    type: 'phoneme-blend',
    correctWord: item.target,
    blendLabel: buildBlendLabel(item.target.word),
    blendSpeech: buildBlendSpeech(item.target.word),
    blendSegments: segmentWordForBlend(item.target.word),
    options: shuffle([
      item.target,
      ...fillVisualDistractors(null, item.target, item.distractors, isPremium, VISUAL_OPTION_COUNT - 1, 'blend'),
    ]),
    playKey: item.target.audioKey,
  }));
}

function buildSentenceExercises(levelId, sessionSize, type, seenKeys = null) {
  const sentences = getSentencesForLevel(levelId);
  const sessionSentences = pickSessionItemsPreferringUnseen(sentences, sessionSize, seenKeys);

  return sessionSentences.map((sentence) => {
    const usedKeys = new Set([sentence.id]);
    const usedEmoji = new Set([sentence.image]);
    const distractors = [];

    for (const item of shuffle(sentences.filter((entry) => entry.id !== sentence.id))) {
      if (usedKeys.has(item.id) || usedEmoji.has(item.image)) {
        continue;
      }
      if (sentencesConflictVisually(sentence.id, item.id)) {
        continue;
      }
      if (distractors.some((d) => sentencesConflictVisually(d.id, item.id))) {
        continue;
      }
      distractors.push(item);
      usedKeys.add(item.id);
      usedEmoji.add(item.image);
      if (distractors.length >= VISUAL_OPTION_COUNT - 1) {
        break;
      }
    }

    return {
      type,
      sentence,
      options: shuffle([sentence, ...distractors]),
      playKey: sentence.audioKey,
      showText: type === 'read-sentence',
      imageOnlyOptions: true,
    };
  });
}

export function buildExercises(level, options = {}) {
  const { isPremium = false, sessionSize, seenKeys = null } = options;
  const effectiveSessionSize = getSessionSizeForLevel(level.type, sessionSize);
  const allLetters = getPlayableLetters(isPremium);

  switch (level.type) {
    case 'identify-phoneme':
      return buildIdentifyPhonemeExercises(
        buildSessionLetters(allLetters, effectiveSessionSize, seenKeys),
        allLetters
      );
    case 'associate-word':
      return buildAssociateWordExercises(
        buildSessionLetters(allLetters, effectiveSessionSize, seenKeys),
        allLetters
      );
    case 'choose-word':
      return buildChooseWordExercises(
        buildSessionLetters(allLetters, effectiveSessionSize, seenKeys),
        allLetters
      );
    case 'identify-initial':
      return buildIdentifyInitialExercises(
        buildSessionLetters(
          lettersForEdgePhoneme(allLetters, 'initial', isPremium),
          effectiveSessionSize,
          seenKeys
        ),
        allLetters
      );
    case 'identify-final':
      return buildIdentifyFinalExercises(effectiveSessionSize, allLetters, isPremium, seenKeys);
    case 'syllable-count':
      return buildSyllableCountExercises(effectiveSessionSize, isPremium, seenKeys);
    case 'identify-initial-syllable':
      return buildIdentifyInitialSyllableExercises(effectiveSessionSize, isPremium, seenKeys);
    case 'complete-word-final':
      return buildCompleteWordGapExercises(allLetters, effectiveSessionSize, isPremium, 'final', seenKeys);
    case 'complete-word-middle':
      return buildCompleteWordGapExercises(allLetters, effectiveSessionSize, isPremium, 'middle', seenKeys);
    case 'rhyme':
      return buildRhymeExercises(effectiveSessionSize, isPremium, seenKeys);
    case 'alliteration':
      return buildAlliterationExercises(effectiveSessionSize, isPremium, seenKeys);
    case 'phoneme-blend':
      return buildPhonemeBlendExercises(effectiveSessionSize, isPremium, seenKeys);
    case 'short-sentences':
      return buildSentenceExercises(9, effectiveSessionSize, 'short-sentences', seenKeys);
    case 'read-sentence':
      return buildSentenceExercises(12, effectiveSessionSize, 'read-sentence', seenKeys);
    default:
      return [];
  }
}

export function isExerciseCorrect(exercise, selection) {
  if (!exercise || !selection) return false;

  switch (exercise.type) {
    case 'identify-phoneme':
    case 'identify-initial':
    case 'identify-final':
    case 'complete-word-final':
    case 'complete-word-middle':
      return selection.id === exercise.correctLetter.id;
    case 'syllable-count':
      return selection === exercise.correctCount;
    case 'identify-initial-syllable':
      return selection === exercise.correctSyllable;
    case 'associate-word':
    case 'choose-word':
    case 'alliteration':
    case 'phoneme-blend':
      return selection.audioKey === exercise.correctWord.audioKey;
    case 'rhyme':
      return selection.audioKey === exercise.correctWord.audioKey;
    case 'short-sentences':
    case 'read-sentence':
      return selection.id === exercise.sentence.id;
    default:
      return false;
  }
}

export function getSelectionKey(exercise, selection) {
  if (!selection) return null;

  switch (exercise.type) {
    case 'identify-phoneme':
    case 'identify-initial':
    case 'identify-final':
    case 'complete-word-final':
    case 'complete-word-middle':
      return selection.id;
    case 'syllable-count':
      return selection;
    case 'identify-initial-syllable':
      return selection;
    case 'associate-word':
    case 'choose-word':
    case 'alliteration':
    case 'rhyme':
    case 'phoneme-blend':
      return selection.audioKey;
    case 'short-sentences':
    case 'read-sentence':
      return selection.id;
    default:
      return null;
  }
}

export function getCorrectKey(exercise) {
  switch (exercise.type) {
    case 'identify-phoneme':
    case 'identify-initial':
    case 'identify-final':
    case 'complete-word-final':
    case 'complete-word-middle':
      return exercise.correctLetter.id;
    case 'syllable-count':
      return exercise.correctCount;
    case 'identify-initial-syllable':
      return exercise.correctSyllable;
    case 'associate-word':
    case 'choose-word':
    case 'alliteration':
    case 'rhyme':
    case 'phoneme-blend':
      return exercise.correctWord.audioKey;
    case 'short-sentences':
    case 'read-sentence':
      return exercise.sentence.id;
    default:
      return null;
  }
}

export function getPlayableLevels(isPremium = false) {
  return LEVELS.filter((level) => level.free || isPremium);
}

export function getExerciseAudioOptions(exercise) {
  if (!exercise) return {};

  switch (exercise.type) {
    case 'identify-phoneme':
    case 'choose-word':
    case 'associate-word':
      return { speechMode: 'phoneme' };
    case 'identify-initial':
    case 'identify-final':
    case 'identify-initial-syllable':
    case 'syllable-count':
    case 'complete-word-final':
    case 'complete-word-middle':
      return { speechMode: 'word', fallbackText: exercise.word?.word };
    case 'alliteration':
    case 'rhyme':
      return { speechMode: 'word', fallbackText: exercise.anchor?.word };
    case 'phoneme-blend':
      return {
        speechMode: 'blend',
        blendSegments:
          exercise.blendSegments ?? segmentWordForBlend(exercise.correctWord?.word ?? ''),
        fallbackText: exercise.blendSpeech,
      };
    case 'short-sentences':
    case 'read-sentence':
      return { speechMode: 'word', fallbackText: exercise.sentence?.text };
    default:
      return {};
  }
}
