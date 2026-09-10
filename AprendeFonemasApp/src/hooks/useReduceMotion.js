import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useSettings } from '../context/SettingsContext';

/** true si el SO pide reduce motion o está activado en Ajustes */
export function useReduceMotion() {
  const { reduceMotionEnabled } = useSettings();
  const [systemReduce, setSystemReduce] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then((enabled) => {
        if (mounted) setSystemReduce(Boolean(enabled));
      })
      .catch(() => {});

    const sub = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      (enabled) => setSystemReduce(Boolean(enabled))
    );

    return () => {
      mounted = false;
      if (sub?.remove) sub.remove();
      else if (typeof sub === 'function') sub();
    };
  }, []);

  return Boolean(reduceMotionEnabled || systemReduce);
}
