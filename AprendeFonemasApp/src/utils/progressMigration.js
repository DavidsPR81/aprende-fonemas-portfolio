/** Versión del esquema de progreso (ids / estrellas). */
export const PROGRESS_SCHEMA_KEY = '@aprende_fonemas_progress_schema';
export const PROGRESS_SCHEMA_VERSION = 2;

/**
 * v1 → v2: metimos Nivel 5 (sílaba inicial).
 * Los premium viejos 5–11 pasan a 6–12.
 */
const V1_TO_V2_LEVEL_MAP = {
  5: 6,
  6: 7,
  7: 8,
  8: 9,
  9: 10,
  10: 11,
  11: 12,
};

export function migrateCompletedLevelIds(ids, fromVersion = 1) {
  if (fromVersion >= PROGRESS_SCHEMA_VERSION) return ids;
  return [...new Set(ids.map((id) => V1_TO_V2_LEVEL_MAP[Number(id)] ?? Number(id)))];
}

export function migrateLevelStarsMap(starsMap, fromVersion = 1) {
  if (fromVersion >= PROGRESS_SCHEMA_VERSION || !starsMap || typeof starsMap !== 'object') {
    return starsMap || {};
  }
  const next = {};
  for (const [key, value] of Object.entries(starsMap)) {
    const id = Number(key);
    const mapped = V1_TO_V2_LEVEL_MAP[id] ?? id;
    next[mapped] = Math.max(next[mapped] ?? 0, Number(value) || 0);
  }
  return next;
}
