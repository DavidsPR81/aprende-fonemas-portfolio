import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { getRuntimeSettings } from '../context/SettingsContext';

function hapticsAllowed() {
  const settings = getRuntimeSettings();
  if (settings.reduceMotionEnabled) return false;
  return true;
}

/** Tap suave en botones / cards */
export function hapticLight() {
  if (!hapticsAllowed()) return;
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Expo Go / web sin hápticos
  }
}

/** Acierto */
export function hapticSuccess() {
  if (!hapticsAllowed()) return;
  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // ignore
  }
}

/** Fallo suave (sin castigar) */
export function hapticErrorSoft() {
  if (!hapticsAllowed()) return;
  try {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  } catch {
    // ignore
  }
}
