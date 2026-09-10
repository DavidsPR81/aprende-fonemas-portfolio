import {
  migrateCompletedLevelIds,
  migrateLevelStarsMap,
} from '../src/utils/progressMigration';

describe('progressMigration v1→v2', () => {
  test('remapea niveles premium 5–11 → 6–12', () => {
    expect(migrateCompletedLevelIds([1, 2, 5, 11], 1)).toEqual([1, 2, 6, 12]);
    expect(migrateCompletedLevelIds([1, 2, 5, 11], 2)).toEqual([1, 2, 5, 11]);
  });

  test('remapear estrellas conserva el máximo', () => {
    expect(migrateLevelStarsMap({ 5: 2, 6: 3 }, 1)).toEqual({ 6: 2, 7: 3 });
  });
});
