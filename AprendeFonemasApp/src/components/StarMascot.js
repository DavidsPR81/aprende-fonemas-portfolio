import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { colors, motionLayout, spacing } from '../theme';
import { useResponsive } from '../hooks/useResponsive';
import { useReduceMotion } from '../hooks/useReduceMotion';
import MascotImage from './MascotImage';

/** Mascota. Con `idle`, respiración suave (Home). */
export default function StarMascot({
  size = 'large',
  variant = 'normal',
  showTagline = true,
  style,
  pixelSize,
  idle = false,
}) {
  const { mascotSize, fonts, isTablet } = useResponsive();
  const reduceMotion = useReduceMotion();
  const isFocused = useIsFocused();
  const breath = useRef(new Animated.Value(0)).current;
  const isHero = size === 'hero';
  const isLarge = size === 'large' || isHero;
  const shouldIdle = idle && !reduceMotion && isFocused;

  const imageSize =
    typeof pixelSize === 'number'
      ? pixelSize
      : isHero
        ? Math.round(mascotSize * (isTablet ? 1.65 : 1.85))
        : isLarge
          ? mascotSize
          : Math.round(mascotSize * 0.56);

  useEffect(() => {
    if (!shouldIdle) {
      breath.setValue(0);
      return undefined;
    }
    const half = Math.round(motionLayout.mascotIdleMs / 2);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: half,
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: half,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shouldIdle, breath]);

  const scale = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [1, motionLayout.mascotIdleScale],
  });
  const translateY = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -motionLayout.mascotIdleBobPx],
  });

  return (
    <View
      style={[
        styles.container,
        isLarge && showTagline && styles.large,
        isHero && styles.hero,
        style,
      ]}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Mascota estrella"
    >
      <Animated.View
        style={shouldIdle ? { transform: [{ scale }, { translateY }] } : undefined}
      >
        <MascotImage variant={variant} size={imageSize} />
      </Animated.View>
      {isLarge && !isHero && showTagline ? (
        <Text style={[styles.tagline, fonts.caption, { fontFamily: 'Nunito_600SemiBold' }]}>
          ¡Hola! Vamos a jugar
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  large: {
    marginBottom: spacing.lg,
  },
  hero: {
    marginBottom: spacing.xs,
  },
  tagline: {
    color: colors.primaryDark,
    marginTop: spacing.sm,
  },
});
