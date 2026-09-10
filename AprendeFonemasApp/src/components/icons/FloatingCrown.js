import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import CrownIcon from './CrownIcon';
import { colors, motionLayout } from '../../theme';
import { useReduceMotion } from '../../hooks/useReduceMotion';

/** Corona flotante en esquina de cards / CTAs premium. */
export default function FloatingCrown({
  size = 34,
  color = colors.star,
  style,
  animate = true,
}) {
  const bob = useRef(new Animated.Value(0)).current;
  const reduceMotion = useReduceMotion();
  const isFocused = useIsFocused();
  const shouldAnimate = animate && !reduceMotion && isFocused;

  useEffect(() => {
    if (!shouldAnimate) {
      bob.setValue(0);
      return undefined;
    }
    const half = Math.round(motionLayout.crownBobMs / 2);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: half,
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: half,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shouldAnimate, bob]);

  const translateY = bob.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -motionLayout.crownBobPx],
  });

  return (
    <Animated.View
      style={[
        styles.wrap,
        style,
        { width: size, height: size, transform: [{ translateY: shouldAnimate ? translateY : 0 }] },
      ]}
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
    >
      <CrownIcon size={size} color={color} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
