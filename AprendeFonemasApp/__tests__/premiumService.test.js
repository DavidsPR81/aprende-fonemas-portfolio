import { Platform } from 'react-native';
import {
  mapIapError,
  isPurchaseCompleted,
  isPurchasePending,
} from '../src/services/premiumService';

describe('mapIapError', () => {
  it('maps E_ITEM_UNAVAILABLE with Play Console hint', () => {
    const result = mapIapError({ code: 'E_ITEM_UNAVAILABLE' });
    expect(result.code).toBe('E_ITEM_UNAVAILABLE');
    expect(result.message).toMatch(/premium_unlock/);
    expect(result.message).toMatch(/in-app/i);
  });

  it('maps E_ALREADY_OWNED', () => {
    const result = mapIapError({ code: 'E_ALREADY_OWNED' });
    expect(result.message).toMatch(/Restaurar compra/i);
  });

  it('maps E_PENDING for Family Link', () => {
    const result = mapIapError({ code: 'E_PENDING' });
    expect(result.message).toMatch(/pendiente/i);
    expect(result.message).toMatch(/Family Link|parental/i);
  });

  it('maps STORE_UNAVAILABLE', () => {
    const result = mapIapError({ code: 'STORE_UNAVAILABLE' });
    expect(result.message).toMatch(/Google Play/i);
  });

  it('falls back for unknown codes', () => {
    const result = mapIapError({ code: 'E_WEIRD' });
    expect(result.message).toMatch(/E_WEIRD/);
  });
});

describe('purchase state guards', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it('treats Android PURCHASED (1) as completed', () => {
    Platform.OS = 'android';
    expect(
      isPurchaseCompleted({
        productId: 'premium_unlock',
        purchaseStateAndroid: 1,
      })
    ).toBe(true);
    expect(
      isPurchasePending({
        productId: 'premium_unlock',
        purchaseStateAndroid: 1,
      })
    ).toBe(false);
  });

  it('treats Android PENDING (2) as pending, not completed', () => {
    Platform.OS = 'android';
    const purchase = {
      productId: 'premium_unlock',
      purchaseStateAndroid: 2,
    };
    expect(isPurchaseCompleted(purchase)).toBe(false);
    expect(isPurchasePending(purchase)).toBe(true);
  });

  it('does not unlock Android purchase without purchaseState', () => {
    Platform.OS = 'android';
    expect(
      isPurchaseCompleted({
        productId: 'premium_unlock',
        purchaseToken: 'tok',
      })
    ).toBe(false);
  });

  it('ignores other product ids', () => {
    Platform.OS = 'android';
    expect(
      isPurchaseCompleted({
        productId: 'other',
        purchaseStateAndroid: 1,
      })
    ).toBe(false);
  });
});

describe('premiumLayout tokens used by AdultGate', () => {
  it('exports shared premium layout tokens', () => {
    const { premiumLayout } = require('../src/theme');
    expect(premiumLayout.stackGap).toBeDefined();
    expect(premiumLayout.wideSideGap).toBeDefined();
    expect(premiumLayout.titleSize).toBe(26);
  });
});
