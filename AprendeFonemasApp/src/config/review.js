/**
 * Builds de prueba (EAS profile `testing` con EXPO_PUBLIC_BETA_REVIEW=1).
 * La build de producción no lleva esa variable → freemium + IAP real.
 */
export const IS_BETA_TEST_BUILD = process.env.EXPO_PUBLIC_BETA_REVIEW === '1';

/** Toggle Premium de prueba en Ajustes (Expo Go / __DEV__ / build beta). */
export const SHOW_DEBUG_PREMIUM_TOGGLE = __DEV__ || IS_BETA_TEST_BUILD;

export const SHOW_REVIEW_BANNER = SHOW_DEBUG_PREMIUM_TOGGLE;

/** En beta, con premium activo, se saltan prerequisitos de nivel. */
export const UNLOCK_ALL_LEVELS_FOR_REVIEW = __DEV__ || IS_BETA_TEST_BUILD;

/**
 * Premium gratis sin compra solo en AAB beta (prueba cerrada).
 * En Expo Go usa el toggle de Ajustes; production usa IAP.
 */
export const AUTO_UNLOCK_PREMIUM_FOR_REVIEW = IS_BETA_TEST_BUILD;
