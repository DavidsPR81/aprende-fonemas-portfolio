import { EXERCISES_PER_SESSION } from '../config/session';

// Todo a la primera → 3★, un fallo → 2★, resto → 1★
export function calculateStars(firstTryCorrect, total = EXERCISES_PER_SESSION) {
  if (total <= 0) return 1;
  if (firstTryCorrect >= total) return 3;
  if (firstTryCorrect >= total - 1) return 2;
  return 1;
}

export function starsMessage(stars) {
  if (stars >= 3) return '¡Genial! Tres estrellas.';
  if (stars >= 2) return '¡Muy bien! Dos estrellas.';
  return '¡Bien hecho! Sigue practicando.';
}

export function scoreSummary(firstTryCorrect, total, mistakeCount) {
  const errorsLabel = mistakeCount === 1 ? '1 error' : `${mistakeCount} errores`;
  return `${firstTryCorrect} de ${total} a la primera · ${errorsLabel}`;
}
