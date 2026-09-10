import { calculateStars, scoreSummary, starsMessage } from '../src/utils/sessionScore';
import {
  buildSyllableCountOptions,
  segmentWordForBlend,
  getMiddleGapIndex,
} from '../src/utils/spanishPhonemes';
import { getLevelStatus, hasCompletedAllLevels } from '../src/hooks/useProgress';
import { getHintThreshold } from '../src/config/appConfig';
import { assignDistinctLetterColors, getLetterColor } from '../src/theme';

describe('sessionScore', () => {
  test('calculateStars — 5/5 a la primera = 3', () => {
    expect(calculateStars(5, 5)).toBe(3);
  });

  test('calculateStars — 4/5 = 2', () => {
    expect(calculateStars(4, 5)).toBe(2);
  });

  test('calculateStars — 3/5 = 1', () => {
    expect(calculateStars(3, 5)).toBe(1);
  });

  test('scoreSummary formatea errores', () => {
    expect(scoreSummary(4, 5, 2)).toContain('4 de 5');
    expect(scoreSummary(4, 5, 1)).toContain('1 error');
  });

  test('starsMessage', () => {
    expect(starsMessage(3)).toMatch(/Tres estrellas/);
  });
});

describe('spanishPhonemes', () => {
  test('segmentWordForBlend — pato', () => {
    expect(segmentWordForBlend('Pato')).toEqual(['p', 'a', 't', 'o']);
  });

  test('segmentWordForBlend — ch digraph', () => {
    expect(segmentWordForBlend('Chico')).toEqual(['ch', 'i', 'c', 'o']);
  });

  test('buildSyllableCountOptions incluye correcto', () => {
    const opts = buildSyllableCountOptions(3);
    expect(opts).toContain(3);
    expect(opts.length).toBe(3);
  });

  test('getMiddleGapIndex — prioriza vocal central', () => {
    expect(getMiddleGapIndex('Mesa')).toBe(1);
    expect(getMiddleGapIndex('Elefante')).toBe(4);
  });

  test('getMiddleGapIndex — prioriza ñ interior', () => {
    expect(getMiddleGapIndex('Piñata')).toBe(2);
    expect(getMiddleGapIndex('Muñeca')).toBe(2);
    expect(getMiddleGapIndex('Mañana')).toBe(2);
  });

  test('getHintThreshold — adapta intentos al número de opciones', () => {
    expect(getHintThreshold(2)).toBe(1);
    expect(getHintThreshold(3)).toBe(2);
    expect(getHintThreshold(4)).toBe(3);
  });
});

describe('colores de letra', () => {
  test('ñ y rr no heredan el color de la e', () => {
    expect(getLetterColor('enie')).not.toBe(getLetterColor('e'));
    expect(getLetterColor('rr')).not.toBe(getLetterColor('r'));
  });

  test('sílabas distintas no comparten color por defecto', () => {
    const map = assignDistinctLetterColors(['PA', 'PE', 'TO']);
    expect(map.pa).toBeTruthy();
    expect(map.pe).toBeTruthy();
    expect(map.to).toBeTruthy();
    expect(new Set([map.pa, map.pe, map.to]).size).toBe(3);
  });
});

describe('getLevelStatus', () => {
  test('primer nivel free disponible', () => {
    const level = { id: 1, free: true };
    expect(getLevelStatus(level, [], false)).toBe('available');
  });

  test('nivel completado', () => {
    const level = { id: 1, free: true };
    expect(getLevelStatus(level, [1], false)).toBe('completed');
  });
});

describe('hasCompletedAllLevels', () => {
  test('requiere premium y los 12 niveles', () => {
    expect(hasCompletedAllLevels([1, 2, 3, 4], false)).toBe(false);
    expect(hasCompletedAllLevels([1, 2, 3, 4], true)).toBe(false);
    const all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    expect(hasCompletedAllLevels(all, true)).toBe(true);
  });
});
