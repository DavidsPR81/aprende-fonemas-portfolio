import { IS_BETA_TEST_BUILD } from './review';

export const PREMIUM_PRODUCT_ID = 'premium_unlock'; // Play Console, non-consumable

export const PREMIUM_PRICE_LABEL = '3,99 €';

/** Expo Go / builds beta: sin IAP real. Producción publicada: compra real. */
export const ALLOW_SIMULATED_PURCHASE = __DEV__ || IS_BETA_TEST_BUILD;
