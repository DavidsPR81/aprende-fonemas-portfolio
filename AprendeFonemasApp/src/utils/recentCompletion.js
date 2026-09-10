/** Nivel acabado hace poco — animación al volver a Progreso / Niveles */
let pending = null;

export function markLevelJustCompleted(levelId, stars = 3) {
  pending = {
    levelId: Number(levelId),
    stars,
    at: Date.now(),
  };
}

/** Peek (varias pantallas pueden leerlo hasta que expire o se limpie) */
export function getLevelJustCompleted(maxAgeMs = 90000) {
  if (!pending) return null;
  if (Date.now() - pending.at > maxAgeMs) {
    pending = null;
    return null;
  }
  return pending;
}

export function clearLevelJustCompleted() {
  pending = null;
}

/** Lee y limpia */
export function takeLevelJustCompleted(maxAgeMs = 90000) {
  const value = getLevelJustCompleted(maxAgeMs);
  pending = null;
  return value;
}
