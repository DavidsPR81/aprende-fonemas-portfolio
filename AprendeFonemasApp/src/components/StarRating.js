import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { colors, motionLayout, spacing } from '../theme';
import { useReduceMotion } from '../hooks/useReduceMotion';

export default function StarRating({
  stars = 0,
  max = 3,
  size = 16,
  style,
  /** Parpadeo al completar nivel (Progreso) */
  celebrate = false,
}) {
  const reduceMotion = useReduceMotion();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!celebrate || reduceMotion) {
      pulse.setValue(1);
      return undefined;
    }
    pulse.setValue(1);
    const loop = Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1.28,
        duration: motionLayout.badgePopMs / 2,
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 1,
        duration: motionLayout.badgePopMs / 2,
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 1.18,
        duration: motionLayout.badgePopMs / 2,
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 1,
        duration: motionLayout.badgePopMs / 2,
        useNativeDriver: true,
      }),
    ]);
    loop.start();
    return () => loop.stop();
  }, [celebrate, pulse, reduceMotion]);

  return (
    <Animated.View style={[styles.row, style, { transform: [{ scale: pulse }] }]}>
      {Array.from({ length: max }).map((_, index) => {
        const filled = index < stars;
        return (
          <Text
            key={index}
            style={[
              styles.star,
              { fontSize: size, lineHeight: Math.round(size * 1.2) },
              filled ? styles.starFilled : styles.starEmpty,
              index < max - 1 && { marginRight: Math.max(3, spacing.xs) },
            ]}
          >
            {filled ? '★' : '☆'}
          </Text>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    textAlign: 'center',
  },
  starFilled: {
    color: colors.star,
    textShadowColor: colors.starGlow,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  starEmpty: {
    color: colors.starEmpty,
  },
});
