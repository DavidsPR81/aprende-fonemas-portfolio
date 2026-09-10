import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { ALLOW_SIMULATED_PURCHASE, PREMIUM_PRODUCT_ID } from '../config/premium';

const PURCHASE_KEY = '@aprende_fonemas_premium_purchase';

/** Google Play Billing: PURCHASED=1, PENDING=2 (Family Link / pago diferido). */
const ANDROID_PURCHASED = 1;
const ANDROID_PENDING = 2;

let iapModule = null;
let connectionReady = false;

function getIap() {
  if (iapModule !== null) return iapModule;
  if (ALLOW_SIMULATED_PURCHASE) {
    iapModule = false;
    return false;
  }
  try {
    // eslint-disable-next-line global-require
    iapModule = require('react-native-iap');
    return iapModule;
  } catch {
    iapModule = false;
    return false;
  }
}

/** Mensajes legibles para errores de Google Play Billing. */
export function mapIapError(error) {
  const code = error?.code || error?.responseCode || 'E_UNKNOWN';
  const debugResponse = error?.debugMessage || error?.message || null;

  const messages = {
    E_USER_CANCELLED: 'Compra cancelada.',
    E_PENDING:
      'La compra está pendiente de aprobación parental (Family Link) o de pago. Premium se activará cuando Google Play la complete.',
    E_ITEM_UNAVAILABLE:
      'El producto premium_unlock no está disponible en Google Play. Comprueba en Play Console que sea un producto in-app (pago único) activo y que la app esté instalada desde el enlace de prueba interna.',
    E_ALREADY_OWNED:
      'Ya tienes este contenido en tu cuenta de Google. Usa «Restaurar compra».',
    E_NETWORK_ERROR: 'Revisa la conexión a internet e inténtalo de nuevo.',
    E_SERVICE_ERROR: 'Google Play no está disponible ahora. Inténtalo más tarde.',
    E_TIMEOUT: 'Tiempo de espera agotado. Si completaste el pago, usa «Restaurar compra».',
    STORE_UNAVAILABLE:
      'No se pudo conectar con Google Play. Instala la app desde Play Store (prueba interna) con una cuenta de tester.',
    PRODUCT_NOT_FOUND:
      'No se encontró premium_unlock en Play. Debe ser producto in-app (no suscripción), activo y con el mismo ID que en el código.',
    nothing_to_restore: 'No se encontró ninguna compra previa en este dispositivo.',
  };

  return {
    code,
    debugCode: code,
    debugResponse,
    message: messages[code] || `No se pudo completar la compra. (${code})`,
  };
}

/**
 * Solo desbloquear con purchaseState PURCHASED.
 * PENDING (Family Link) no da acceso.
 */
export function isPurchaseCompleted(purchase) {
  if (!purchase || purchase.productId !== PREMIUM_PRODUCT_ID) return false;

  if (Platform.OS === 'android') {
    const state = purchase.purchaseStateAndroid;
    // Sin estado → no asumir comprado (seguro ante Family Link).
    if (state == null) return false;
    return Number(state) === ANDROID_PURCHASED;
  }

  // iOS: si llega al listener con recibo, está completa.
  return Boolean(purchase.transactionReceipt || purchase.transactionId);
}

export function isPurchasePending(purchase) {
  if (!purchase || purchase.productId !== PREMIUM_PRODUCT_ID) return false;
  if (Platform.OS !== 'android') return false;
  return Number(purchase.purchaseStateAndroid) === ANDROID_PENDING;
}

function buildPurchaseRequest() {
  return Platform.select({
    ios: {
      sku: PREMIUM_PRODUCT_ID,
      andDangerouslyFinishTransactionAutomaticallyIOS: false,
    },
    android: {
      skus: [PREMIUM_PRODUCT_ID],
    },
    default: { skus: [PREMIUM_PRODUCT_ID] },
  });
}

export async function getStoredPurchase() {
  try {
    const raw = await AsyncStorage.getItem(PURCHASE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function hasVerifiedPurchase() {
  const purchase = await getStoredPurchase();
  return Boolean(purchase?.verified);
}

async function savePurchase(record) {
  await AsyncStorage.setItem(PURCHASE_KEY, JSON.stringify(record));
}

async function clearLocalPurchase() {
  await AsyncStorage.removeItem(PURCHASE_KEY);
}

async function initIapConnection() {
  const RNIap = getIap();
  if (!RNIap) return false;
  if (connectionReady) return true;
  try {
    await RNIap.initConnection();
    // No llamar flushFailedPurchasesCachedAsPendingAndroid: puede interferir
    // con compras PENDING reales (Family Link / pago diferido).
    connectionReady = true;
    return true;
  } catch (error) {
    console.warn('IAP init failed:', error);
    connectionReady = false;
    return false;
  }
}

async function persistVerifiedPurchase(match) {
  await savePurchase({
    verified: true,
    productId: PREMIUM_PRODUCT_ID,
    purchaseToken: match.transactionReceipt ?? match.purchaseToken,
    purchaseState: 'purchased',
    purchasedAt: new Date().toISOString(),
  });
}

async function acknowledgeIfNeeded(RNIap, purchase) {
  if (!isPurchaseCompleted(purchase)) return;
  try {
    await RNIap.finishTransaction({
      purchase,
      isConsumable: false,
    });
  } catch (error) {
    console.warn('IAP finishTransaction:', error);
  }
}

async function findStorePurchases(RNIap) {
  const purchases = await RNIap.getAvailablePurchases();
  return purchases.filter((p) => p.productId === PREMIUM_PRODUCT_ID);
}

async function findCompletedPremiumPurchase(RNIap) {
  const matches = await findStorePurchases(RNIap);
  return matches.find((p) => isPurchaseCompleted(p)) ?? null;
}

async function findPendingPremiumPurchase(RNIap) {
  const matches = await findStorePurchases(RNIap);
  return matches.find((p) => isPurchasePending(p)) ?? null;
}

/**
 * Solo restaura si Google tiene la compra en estado PURCHASED.
 * PENDING no desbloquea.
 */
async function restoreFromStore(RNIap) {
  const completed = await findCompletedPremiumPurchase(RNIap);
  if (completed) {
    await acknowledgeIfNeeded(RNIap, completed);
    await persistVerifiedPurchase(completed);
    return { purchase: completed, pending: false };
  }

  const pending = await findPendingPremiumPurchase(RNIap);
  if (pending) {
    await clearLocalPurchase();
    return { purchase: null, pending: true };
  }

  return { purchase: null, pending: false };
}

/**
 * Revalida con Play: si solo hay PENDING, quita Premium local (corrige desbloqueo prematuro).
 * Sin red / sin IAP: respeta el estado local.
 */
export async function revalidatePremiumFromStore() {
  const RNIap = getIap();
  if (!RNIap) {
    return hasVerifiedPurchase();
  }

  const ready = await initIapConnection();
  if (!ready) {
    return hasVerifiedPurchase();
  }

  try {
    const result = await restoreFromStore(RNIap);
    if (result.purchase) return true;
    if (result.pending) return false;
    return hasVerifiedPurchase();
  } catch (error) {
    console.warn('IAP revalidate error:', error);
    return hasVerifiedPurchase();
  }
}

function waitForPurchase(RNIap) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let updateSub;
    let errorSub;
    let timeout;

    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      if (timeout) clearTimeout(timeout);
      try {
        updateSub?.remove?.();
      } catch {
        /* ignore */
      }
      try {
        errorSub?.remove?.();
      } catch {
        /* ignore */
      }
      fn(value);
    };

    updateSub = RNIap.purchaseUpdatedListener(async (purchaseUpdate) => {
      try {
        if (purchaseUpdate?.productId !== PREMIUM_PRODUCT_ID) return;

        if (isPurchasePending(purchaseUpdate)) {
          finish(reject, {
            code: 'E_PENDING',
            message:
              'Compra pendiente de aprobación parental. Premium se activará cuando se complete.',
          });
          return;
        }

        if (!isPurchaseCompleted(purchaseUpdate)) {
          // Estado desconocido: no desbloquear; seguir esperando.
          return;
        }

        await acknowledgeIfNeeded(RNIap, purchaseUpdate);
        finish(resolve, purchaseUpdate);
      } catch (error) {
        finish(reject, error);
      }
    });

    errorSub = RNIap.purchaseErrorListener((error) => {
      finish(reject, error);
    });

    timeout = setTimeout(() => {
      finish(reject, { code: 'E_TIMEOUT', message: 'Tiempo de espera de compra agotado.' });
    }, 120000);

    RNIap.requestPurchase(buildPurchaseRequest()).catch((error) => {
      finish(reject, error);
    });
  });
}

/**
 * Compra Premium (producto in-app non-consumable premium_unlock).
 * Builds beta: simulada. Producción: Google Play Billing real.
 * Solo desbloquea con purchaseState PURCHASED (nunca PENDING).
 */
export async function purchasePremium() {
  const RNIap = getIap();

  if (RNIap) {
    const ready = await initIapConnection();
    if (ready) {
      try {
        const products = await RNIap.getProducts({ skus: [PREMIUM_PRODUCT_ID] });
        if (!products?.length) {
          return {
            success: false,
            error: 'PRODUCT_NOT_FOUND',
            ...mapIapError({ code: 'PRODUCT_NOT_FOUND' }),
          };
        }

        // Si ya hay compra completada, restaurar. Si PENDING, avisar sin desbloquear.
        const existing = await restoreFromStore(RNIap);
        if (existing.purchase) {
          return { success: true, restored: true };
        }
        if (existing.pending) {
          return {
            success: false,
            error: 'pending',
            ...mapIapError({ code: 'E_PENDING' }),
          };
        }

        const purchase = await waitForPurchase(RNIap);
        if (purchase && isPurchaseCompleted(purchase)) {
          await persistVerifiedPurchase(purchase);
          return { success: true };
        }

        return {
          success: false,
          error: 'pending',
          ...mapIapError({ code: 'E_PENDING' }),
        };
      } catch (error) {
        if (error?.code === 'E_USER_CANCELLED') {
          return { success: false, error: 'cancelled', message: 'Compra cancelada.' };
        }

        if (error?.code === 'E_PENDING') {
          await clearLocalPurchase();
          return { success: false, error: 'pending', ...mapIapError(error) };
        }

        if (error?.code === 'E_ALREADY_OWNED') {
          try {
            const restored = await restoreFromStore(RNIap);
            if (restored.purchase) {
              return { success: true, restored: true };
            }
            if (restored.pending) {
              return {
                success: false,
                error: 'pending',
                ...mapIapError({ code: 'E_PENDING' }),
              };
            }
          } catch (restoreError) {
            console.warn('IAP restore after E_ALREADY_OWNED:', restoreError);
          }
        }

        console.warn('IAP purchase error:', error);
        // No restaurar en cualquier error: eso desbloqueaba compras PENDING.
        return { success: false, ...mapIapError(error) };
      }
    }
  }

  if (!ALLOW_SIMULATED_PURCHASE) {
    return {
      success: false,
      error: 'store_unavailable',
      ...mapIapError({ code: 'STORE_UNAVAILABLE' }),
    };
  }

  await savePurchase({
    verified: true,
    productId: PREMIUM_PRODUCT_ID,
    simulated: true,
    purchaseState: 'purchased',
    purchasedAt: new Date().toISOString(),
  });

  return { success: true, simulated: true };
}

export async function getPremiumProductInfo() {
  const RNIap = getIap();
  if (!RNIap) return null;
  const ready = await initIapConnection();
  if (!ready) return null;
  try {
    const products = await RNIap.getProducts({ skus: [PREMIUM_PRODUCT_ID] });
    return products?.[0] ?? null;
  } catch (error) {
    console.warn('IAP getProducts error:', error);
    return null;
  }
}

export async function restorePurchases() {
  const RNIap = getIap();

  if (RNIap) {
    const ready = await initIapConnection();
    if (ready) {
      try {
        const result = await restoreFromStore(RNIap);
        if (result.purchase) {
          return { success: true, restored: true };
        }
        if (result.pending) {
          return {
            success: false,
            error: 'pending',
            ...mapIapError({ code: 'E_PENDING' }),
          };
        }
      } catch (error) {
        console.warn('IAP restore error:', error);
      }
    }
  }

  // Sin tienda: solo confiar en local si ya estaba verificado (p.ej. offline).
  const local = await getStoredPurchase();
  if (local?.verified && !local?.simulated) {
    return { success: true, restored: true };
  }
  if (local?.verified && local?.simulated && ALLOW_SIMULATED_PURCHASE) {
    return { success: true, restored: true, simulated: true };
  }

  return {
    success: false,
    error: 'nothing_to_restore',
    ...mapIapError({ code: 'nothing_to_restore' }),
  };
}

export async function clearPurchaseForDebug() {
  await clearLocalPurchase();
}
