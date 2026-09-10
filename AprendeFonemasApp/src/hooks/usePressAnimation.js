import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { motionLayout } from '../theme';
import { hapticLight } from '../utils/haptics';
import { useReduceMotion } from './useReduceMotion';

/** Escala al pulsar + haptic. Corto y visible. */
export function usePressAnimation({
  scaleTo = motionLayout.pressScale,
  haptic = true,
  disabled = false,
  soft = false,
} = {}) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduceMotion = useReduceMotion();
  const pressCfg = soft ? motionLayout.cardPressSpring : motionLayout.pressSpring;
  const target = soft ? motionLayout.cardPressScale : scaleTo;

  const animateTo = useCallback(
    (toValue, pressed) => {
      if (reduceMotion) {
        scale.setValue(toValue);
        return;
      }
      Animated.spring(scale, {
        toValue,
        useNativeDriver: true,
        ...(pressed ? pressCfg : motionLayout.releaseSpring),
      }).start();
    },
    [pressCfg, reduceMotion, scale]
  );

  const onPressIn = useCallback(() => {
    if (disabled) return;
    if (haptic) hapticLight();
    animateTo(target, true);
  }, [animateTo, disabled, haptic, target]);

  const onPressOut = useCallback(() => {
    animateTo(1, false);
  }, [animateTo]);

  return {
    scale,
    onPressIn,
    onPressOut,
    reduceMotion,
    animatedStyle: { transform: [{ scale }] },
  };
}
