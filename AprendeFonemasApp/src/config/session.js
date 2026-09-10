// 7 ejercicios por sesión (~2-3 min por nivel): más recorrido sin agotar
// la atención de los más pequeños (3-4 años). Pools verificados para ≥7
// tanto en free (10 letras) como en premium.
export const EXERCISES_PER_SESSION = 7;

export function getSessionSizeForLevel(_levelType, override) {
  if (override != null) return override;
  return EXERCISES_PER_SESSION;
}
