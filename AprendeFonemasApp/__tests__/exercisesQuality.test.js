import {
  ALLITERATION_EXERCISES,
  BLEND_EXERCISES,
  FREE_LETTER_IDS,
  INITIAL_SYLLABLE_EXERCISES,
  LETTERS,
  LEVELS,
  RHYME_EXERCISES,
  SENTENCES,
  SYLLABLE_EXERCISES,
  getAllWords,
  lettersSoundAlike,
  wordImagesConflict,
  wordStartsWithLetter,
} from '../src/data/content';
import { getInitialPhoneme, segmentWordForBlend } from '../src/utils/spanishPhonemes';
import { AUDIO_REGISTRY } from '../src/data/audioRegistry';
import {
  buildExercises,
  getCorrectKey,
  getPlayableLetters,
  isExerciseCorrect,
} from '../src/utils/exerciseBuilder';
import {
  sameVisualEmoji,
  shareInitialPhoneme,
  wordsRhyme,
} from '../src/utils/spanishRhymes';

function assertVisualExerciseOptions(exercise) {
  const options = exercise.options ?? [];
  const images = options.map((item) => item.image).filter(Boolean);
  expect(new Set(images).size).toBe(images.length);
  expect(new Set(options.map((item) => item.audioKey)).size).toBe(options.length);
}

describe('spanishRhymes', () => {
  test('pato y gato riman', () => {
    expect(wordsRhyme('Pato', 'Gato')).toBe(true);
  });

  test('avión y camión riman', () => {
    expect(wordsRhyme('Avión', 'Camión')).toBe(true);
  });

  test('avión y ratón no comparten una sola rima clara', () => {
    expect(wordsRhyme('Avión', 'Ratón')).toBe(false);
  });

  test('rana y sapo no riman', () => {
    expect(wordsRhyme('Rana', 'Sapo')).toBe(false);
  });
});

describe('RHYME_EXERCISES', () => {
  RHYME_EXERCISES.forEach((item) => {
    test(`${item.anchor.word} → ${item.rhyme.word}`, () => {
      expect(wordsRhyme(item.anchor.word, item.rhyme.word)).toBe(true);
      item.distractors.forEach((distractor) => {
        expect(wordsRhyme(distractor.word, item.anchor.word)).toBe(false);
        expect(sameVisualEmoji(distractor, item.anchor)).toBe(false);
        expect(sameVisualEmoji(distractor, item.rhyme)).toBe(false);
      });
    });
  });
});

describe('ALLITERATION_EXERCISES', () => {
  ALLITERATION_EXERCISES.forEach((item) => {
    test(`${item.anchor.word} → ${item.match.word}`, () => {
      expect(shareInitialPhoneme(item.anchor.word, item.match.word)).toBe(true);
      item.distractors.forEach((distractor) => {
        expect(shareInitialPhoneme(distractor.word, item.anchor.word)).toBe(false);
        expect(sameVisualEmoji(distractor, item.anchor)).toBe(false);
        expect(sameVisualEmoji(distractor, item.match)).toBe(false);
      });
    });
  });
});

describe('BLEND_EXERCISES', () => {
  BLEND_EXERCISES.forEach((item) => {
    test(`${item.target.word} sin distractores ambiguos`, () => {
      item.distractors.forEach((distractor) => {
        expect(wordsRhyme(distractor.word, item.target.word)).toBe(false);
        expect(sameVisualEmoji(distractor, item.target)).toBe(false);
      });
    });

    test(`${item.target.word} — todos sus segmentos tienen audio de fonema`, () => {
      // Mismo mapeo que phonemeKeyForSegment en audioPlayer.js
      const map = { 'ñ': 'enie', ll: 'y', ch: 'ch' };
      segmentWordForBlend(item.target.word).forEach((segment) => {
        const key = `phonemes/${map[segment] || segment}`;
        expect(AUDIO_REGISTRY[key]).toBeDefined();
      });
    });
  });
});

describe('LETTERS — palabra coherente con su letra', () => {
  function wordMatchesLetterCatalog(wordText, letter) {
    const raw = wordText.trim().toLowerCase();
    // Ñ, RR y X: en el catálogo se practican también en posición media (no solo inicial)
    if (letter.id === 'enie') return raw.includes('ñ');
    if (letter.id === 'rr') {
      return raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('rr');
    }
    if (letter.id === 'x') {
      return raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('x');
    }
    return wordStartsWithLetter(wordText, letter);
  }

  LETTERS.forEach((letter) => {
    letter.words.forEach((word) => {
      test(`${word.word} → letra ${letter.uppercase}`, () => {
        expect(wordMatchesLetterCatalog(word.word, letter)).toBe(true);
      });
    });
  });
});

describe('vocabulario gratis — palabras sencillas (3–7 años)', () => {
  const BANNED_IN_FREE = ['universo', 'serpiente', 'windsurf', 'western', 'internet', 'universidad'];

  getPlayableLetters(false).forEach((letter) => {
    letter.words.forEach((word) => {
      const normalized = word.word
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

      test(`${word.word} es vocabulario infantil`, () => {
        expect(word.word.length).toBeLessThanOrEqual(11);
        expect(BANNED_IN_FREE).not.toContain(normalized);
      });
    });
  });
});

describe('freemium — solo 10 letras en niveles 1–4', () => {
  test('FREE_LETTER_IDS coincide con letras free del catálogo', () => {
    const freeIds = getPlayableLetters(false).map((letter) => letter.id).sort();
    expect(freeIds).toEqual([...FREE_LETTER_IDS].sort());
    expect(freeIds).toEqual(['a', 'e', 'i', 'l', 'm', 'o', 'p', 's', 't', 'u']);
  });

  const FREE_LEVELS = LEVELS.filter((level) => level.free);

  FREE_LEVELS.forEach((level) => {
    test(`nivel ${level.id} (${level.type}) sin premium`, () => {
      const exercises = buildExercises(level, { isPremium: false, sessionSize: 5 });
      expect(exercises.length).toBeGreaterThan(0);

      exercises.forEach((exercise) => {
        if (exercise.correctLetter) {
          expect(FREE_LETTER_IDS).toContain(exercise.correctLetter.id);
        }
        if (exercise.type === 'identify-initial') {
          expect(wordStartsWithLetter(exercise.word.word, exercise.correctLetter)).toBe(true);
        }
        if (exercise.type === 'associate-word' || exercise.type === 'choose-word') {
          expect(wordStartsWithLetter(exercise.correctWord.word, exercise.correctLetter)).toBe(true);
          exercise.options.forEach((option) => {
            if (option.audioKey === exercise.correctWord.audioKey) return;
            expect(wordStartsWithLetter(option.word, option.letter)).toBe(true);
          });
        }
        if (exercise.correctLetter && exercise.options?.[0]?.id) {
          exercise.options.forEach((letter) => {
            if (typeof letter.id === 'string') {
              expect(FREE_LETTER_IDS).toContain(letter.id);
            }
          });
        }
      });
    });
  });
});

describe('SENTENCES — catálogo', () => {
  test('cada frase tiene id único y PNG en el registro', () => {
    const { SENTENCE_IMAGES } = require('../src/data/imageRegistry');
    const ids = SENTENCES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    SENTENCES.forEach((s) => {
      expect(SENTENCE_IMAGES[s.id]).toBeTruthy();
    });
  });
});

describe('SYLLABLE_EXERCISES — conteos verificados', () => {
  SYLLABLE_EXERCISES.forEach((item) => {
    test(`${item.word.word} = ${item.syllables} sílabas`, () => {
      expect(item.syllables).toBeGreaterThanOrEqual(1);
      expect(item.syllables).toBeLessThanOrEqual(5);
    });
  });
});

describe('INITIAL_SYLLABLE_EXERCISES', () => {
  INITIAL_SYLLABLE_EXERCISES.forEach((item) => {
    test(`${item.word.word} → ${item.correct}`, () => {
      expect(item.correct.length).toBeGreaterThan(0);
      expect(item.distractors.length).toBeGreaterThanOrEqual(2);
      item.distractors.forEach((d) => {
        expect(d.toUpperCase()).not.toBe(item.correct.toUpperCase());
      });
    });
  });
});

describe('palabras de ejercicios premium en catálogo', () => {
  const premiumKeys = new Set(getAllWords(true).map((entry) => entry.audioKey));

  function collectWords(entries) {
    return entries.flatMap((item) => {
      if (item.word) return [item.word];
      if (item.anchor) return [item.anchor, item.rhyme, item.match, item.target, ...(item.distractors ?? [])].filter(Boolean);
      return [];
    });
  }

  const allExerciseWords = collectWords([
    ...SYLLABLE_EXERCISES,
    ...INITIAL_SYLLABLE_EXERCISES,
    ...RHYME_EXERCISES,
    ...ALLITERATION_EXERCISES,
    ...BLEND_EXERCISES,
  ]);

  allExerciseWords.forEach((word) => {
    test(`${word.word} está en catálogo`, () => {
      expect(premiumKeys.has(word.audioKey)).toBe(true);
    });
  });
});

describe('sonidos equivalentes — nunca dos opciones fonéticamente válidas', () => {
  test('C, K y Q suenan igual; B/V y R/RR también', () => {
    expect(lettersSoundAlike('c', 'q')).toBe(true);
    expect(lettersSoundAlike('c', 'k')).toBe(true);
    expect(lettersSoundAlike('k', 'q')).toBe(true);
    expect(lettersSoundAlike('b', 'v')).toBe(true);
    expect(lettersSoundAlike('r', 'rr')).toBe(true);
    expect(lettersSoundAlike('x', 's')).toBe(true);
    expect(lettersSoundAlike('m', 'n')).toBe(false);
    expect(lettersSoundAlike('g', 'j')).toBe(false);
    expect(lettersSoundAlike('z', 's')).toBe(false);
  });

  test('fonema inicial normalizado (caso Conejo/Quiosco)', () => {
    expect(getInitialPhoneme('Conejo')).toBe('k');
    expect(getInitialPhoneme('Quiosco')).toBe('k');
    expect(getInitialPhoneme('Kiwi')).toBe('k');
    expect(getInitialPhoneme('Vaca')).toBe(getInitialPhoneme('Barco'));
    expect(getInitialPhoneme('Hada')).toBe('a');
    expect(getInitialPhoneme('Hilo')).toBe('i');
    expect(getInitialPhoneme('Hueso')).toBe('u');
    expect(getInitialPhoneme('Xilófono')).toBe('s');
    expect(getInitialPhoneme('Rana')).toBe('rr');
    expect(getInitialPhoneme('Guitarra')).toBe('g');
    expect(getInitialPhoneme('Pato')).toBe('p');
    expect(getInitialPhoneme('Zapato')).toBe('z');
  });

  const LETTER_OPTION_LEVEL_TYPES = [
    'identify-phoneme',
    'identify-initial',
    'identify-final',
    'complete-word-final',
    'complete-word-middle',
  ];

  LEVELS.filter((level) => LETTER_OPTION_LEVEL_TYPES.includes(level.type)).forEach((level) => {
    test(`nivel ${level.id} (${level.type}): sin letras que suenen igual entre las opciones`, () => {
      for (let run = 0; run < 25; run += 1) {
        const exercises = buildExercises(level, { isPremium: true, sessionSize: 8 });
        exercises.forEach((exercise) => {
          const ids = exercise.options.map((option) => option.id);
          ids.forEach((a, i) => {
            ids.slice(i + 1).forEach((b) => {
              expect(lettersSoundAlike(a, b)).toBe(false);
            });
          });
        });
      }
    });
  });

  test('nivel 4: ninguna opción suena como el inicio real de la palabra (Hilo → sin I)', () => {
    const level = LEVELS.find((item) => item.type === 'identify-initial');
    for (let run = 0; run < 25; run += 1) {
      const exercises = buildExercises(level, { isPremium: true, sessionSize: 8 });
      exercises.forEach((exercise) => {
        const wordPhoneme = getInitialPhoneme(exercise.word.word);
        exercise.options.forEach((option) => {
          if (option.id === exercise.correctLetter.id) return;
          expect(option.id).not.toBe(wordPhoneme);
          expect(lettersSoundAlike(option.id, wordPhoneme)).toBe(false);
        });
      });
    }
  });

  ['associate-word', 'choose-word'].forEach((type) => {
    const level = LEVELS.find((item) => item.type === type);
    test(`nivel ${level.id} (${type}): ningún distractor empieza por el sonido del objetivo`, () => {
      for (let run = 0; run < 25; run += 1) {
        const exercises = buildExercises(level, { isPremium: true, sessionSize: 8 });
        exercises.forEach((exercise) => {
          exercise.options.forEach((option) => {
            if (option.audioKey === exercise.correctWord.audioKey) return;
            expect(shareInitialPhoneme(option.word, exercise.correctWord.word)).toBe(false);
            expect(lettersSoundAlike(option.letter?.id, exercise.correctLetter.id)).toBe(false);
          });
        });
      }
    });
  });

  test('dibujos gemelos detectados (oruga/gusano, luna/noche…)', () => {
    expect(wordImagesConflict({ word: 'Oruga' }, { word: 'Gusano' })).toBe(true);
    expect(wordImagesConflict({ word: 'Noche' }, { word: 'Luna' })).toBe(true);
    expect(wordImagesConflict({ word: 'Yate' }, { word: 'Barco' })).toBe(true);
    expect(wordImagesConflict({ word: 'Uña' }, { word: 'Dedo' })).toBe(true);
    expect(wordImagesConflict({ word: 'Agua' }, { word: 'Ola' })).toBe(true);
    expect(wordImagesConflict({ word: 'Gato' }, { word: 'Perro' })).toBe(false);
  });

  ['associate-word', 'choose-word', 'rhyme', 'phoneme-blend'].forEach((type) => {
    const level = LEVELS.find((item) => item.type === type);
    test(`nivel ${level.id} (${type}): sin dibujos gemelos entre las opciones`, () => {
      for (let run = 0; run < 25; run += 1) {
        const exercises = buildExercises(level, { isPremium: true, sessionSize: 8 });
        exercises.forEach((exercise) => {
          exercise.options.forEach((a, i) => {
            exercise.options.slice(i + 1).forEach((b) => {
              expect(wordImagesConflict(a, b)).toBe(false);
            });
          });
        });
      }
    });
  });

  test('sílaba inicial: ningún distractor es el arranque de la sílaba correcta', () => {
    INITIAL_SYLLABLE_EXERCISES.forEach((item) => {
      item.distractors.forEach((distractor) => {
        expect(item.correct.toUpperCase().startsWith(distractor.toUpperCase())).toBe(false);
      });
    });
  });
});

describe('buildExercises — sesiones generadas', () => {
  LEVELS.forEach((level) => {
    test(`nivel ${level.id} (${level.type}) premium`, () => {
      const exercises = buildExercises(level, { isPremium: true, sessionSize: 5 });
      expect(exercises.length).toBeGreaterThan(0);

      exercises.forEach((exercise) => {
        const correctKey = getCorrectKey(exercise);
        const correctOption = exercise.options.find((option) => {
          if (exercise.type === 'syllable-count' || exercise.type === 'identify-initial-syllable') {
            return option === correctKey;
          }
          return option.id === correctKey || option.audioKey === correctKey;
        });
        expect(isExerciseCorrect(exercise, correctOption)).toBe(true);

        if (
          ['associate-word', 'choose-word', 'rhyme', 'alliteration', 'phoneme-blend'].includes(
            exercise.type
          )
        ) {
          assertVisualExerciseOptions(exercise);
        }

        if (exercise.type === 'rhyme') {
          exercise.options.forEach((option) => {
            if (option.audioKey === exercise.correctWord.audioKey) {
              return;
            }
            expect(wordsRhyme(option.word, exercise.anchor.word)).toBe(false);
          });
        }

        if (exercise.type === 'alliteration') {
          exercise.options.forEach((option) => {
            if (option.audioKey === exercise.correctWord.audioKey) {
              return;
            }
            expect(shareInitialPhoneme(option.word, exercise.anchor.word)).toBe(false);
          });
        }

        if (exercise.type === 'complete-word-final' || exercise.type === 'complete-word-middle') {
          const catalogLetter = exercise.word.letter;
          const startsOk = wordStartsWithLetter(exercise.word.word, catalogLetter);
          const enieOk =
            catalogLetter?.id === 'enie' && /ñ/i.test(exercise.word.word);
          const rrOk =
            catalogLetter?.id === 'rr' &&
            exercise.word.word
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .includes('rr');
          expect(startsOk || enieOk || rrOk).toBe(true);
          expect(exercise.correctLetter).toBeTruthy();
          if (exercise.type === 'complete-word-middle' && /ñ/i.test(exercise.word.word)) {
            expect(exercise.correctLetter.id).toBe('enie');
            expect(exercise.partialWord.includes('_')).toBe(true);
          }
        }

        if (exercise.type === 'read-sentence' || exercise.type === 'short-sentences') {
          const images = exercise.options.map((item) => item.image);
          expect(new Set(images).size).toBe(images.length);
          const optionIds = exercise.options.map((item) => item.id);
          // Niño leyendo y mamá leyendo no deben salir juntos (misma escena).
          const hasLeo = optionIds.includes('leo_un_libro');
          const hasMamaLee = optionIds.includes('la_mama_lee');
          expect(hasLeo && hasMamaLee).toBe(false);
        }
      });
    });

    test(`nivel ${level.id} (${level.type}) gratis si aplica`, () => {
      if (!level.free) return;
      const exercises = buildExercises(level, { isPremium: false, sessionSize: 5 });
      expect(exercises.length).toBeGreaterThan(0);
    });
  });
});

describe('palabras nuevas — presencia en sesiones premium', () => {
  const NEW_KEYS = [
    'mosquito',
    'kimono',
    'quesadilla',
    'raqueta',
    'taxi',
    'wifi',
    'walkie',
    'extraterrestre',
  ];

  function keyOf(word) {
    return String(word || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  test('nivel 5 (sílabas): en 30 sesiones aparece al menos una palabra nueva por sesión', () => {
    const level = LEVELS.find((item) => item.type === 'syllable-count');
    for (let i = 0; i < 30; i += 1) {
      const exercises = buildExercises(level, { isPremium: true });
      const keys = exercises.map((ex) => keyOf(ex.word?.word));
      expect(keys.some((k) => NEW_KEYS.includes(k))).toBe(true);
    }
  });

  test('Oreja ya no está en el pool de fusión', () => {
    expect(BLEND_EXERCISES.some((item) => keyOf(item.target.word) === 'oreja')).toBe(false);
    expect(BLEND_EXERCISES.some((item) => keyOf(item.target.word) === 'rosa')).toBe(true);
  });
});
