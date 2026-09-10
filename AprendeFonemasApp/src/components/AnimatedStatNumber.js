import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import { motionLayout } from '../theme';
import { useReduceMotion } from '../hooks/useReduceMotion';

/** Count-up en stats de Progreso. Con reduce motion, valor final ya. */
export default function AnimatedStatNumber({
  value = 0,
  duration = 700,
  suffix = '',
  style,
  accessibilityLabel,
}) {
  const reduceMotion = useReduceMotion();
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = React.useState(0);

  useEffect(() => {
    const target = Math.max(0, Number(value) || 0);
    if (reduceMotion) {
      anim.setValue(target);
      setDisplay(target);
      return undefined;
    }

    anim.setValue(0);
    setDisplay(0);
    const id = anim.addListener(({ value: v }) => {
      setDisplay(Math.round(v));
    });
    const springLike = Animated.timing(anim, {
      toValue: target,
      duration: Math.min(duration, motionLayout.confettiDurationMs),
      useNativeDriver: false,
    });
    springLike.start();
    return () => {
      anim.removeListener(id);
      springLike.stop();
    };
  }, [value, duration, reduceMotion, anim]);

  return (
    <Text style={style} accessibilityLabel={accessibilityLabel ?? `${display}${suffix}`}>
      {display}
      {suffix}
    </Text>
  );
}
