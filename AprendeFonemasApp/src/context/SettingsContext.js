
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTO_UNLOCK_PREMIUM_FOR_REVIEW,
  SHOW_DEBUG_PREMIUM_TOGGLE,
  SHOW_REVIEW_BANNER,
} from '../config/review';
import {
  hasVerifiedPurchase,
  revalidatePremiumFromStore,
} from '../services/premiumService';

const STORAGE_KEY = '@aprende_fonemas_settings';

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  voiceEnabled: true,
  premiumUnlocked: false,
  /** Ajustes: reducir animaciones (además del flag del sistema) */
  reduceMotionEnabled: false,
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [purchaseVerified, setPurchaseVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshPremiumStatus = useCallback(async () => {
    // PENDING (Family Link) no desbloquea; PURCHASED sí (también tras aprobar fuera de la app).
    const verified = await revalidatePremiumFromStore();
    setPurchaseVerified(verified);
    return verified;
  }, []);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_KEY),
      revalidatePremiumFromStore().catch(() => hasVerifiedPurchase()),
    ])
      .then(([raw, verified]) => {
        if (raw) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
        }
        setPurchaseVerified(verified);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Tras aprobar Family Link en el teléfono del padre, al volver a la app se revalida.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        refreshPremiumStatus().catch(() => {});
      }
    });
    return () => sub.remove();
  }, [refreshPremiumStatus]);

  const persist = useCallback(async (next) => {
    setSettings(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, []);

  const updateSetting = useCallback(
    (key, value) => {
      persist({ ...settings, [key]: value });
    },
    [persist, settings]
  );

  const value = useMemo(
    () => ({
      ...settings,
      loading,
      purchaseVerified,
      premiumActive:
        AUTO_UNLOCK_PREMIUM_FOR_REVIEW ||
        purchaseVerified ||
        settings.premiumUnlocked,
      reviewMode: SHOW_DEBUG_PREMIUM_TOGGLE,
      showReviewBanner: SHOW_REVIEW_BANNER,
      showDebugPremium: SHOW_DEBUG_PREMIUM_TOGGLE,
      setSoundEnabled: (value) => updateSetting('soundEnabled', value),
      setVoiceEnabled: (value) => updateSetting('voiceEnabled', value),
      setPremiumUnlocked: (value) => updateSetting('premiumUnlocked', value),
      setReduceMotionEnabled: (value) => updateSetting('reduceMotionEnabled', value),
      refreshPremiumStatus,
    }),
    [settings, loading, purchaseVerified, updateSetting, refreshPremiumStatus]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}

// Snapshot para módulos fuera del Provider (p.ej. audioPlayer)
let runtimeSettings = { ...DEFAULT_SETTINGS, premiumActive: false };

export function syncRuntimeSettings(settings) {
  runtimeSettings = { ...runtimeSettings, ...settings };
}

export function getRuntimeSettings() {
  return runtimeSettings;
}

export function useSyncRuntimeSettings() {
  const settings = useSettings();
  useEffect(() => {
    syncRuntimeSettings(settings);
  }, [settings]);
}
