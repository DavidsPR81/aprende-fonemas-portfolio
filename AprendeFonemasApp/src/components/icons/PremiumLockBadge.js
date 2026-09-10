import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, motionLayout, shadows } from '../../theme';
import { useReduceMotion } from '../../hooks/useReduceMotion';

/** Candado cerrado / abierto (Progreso y Niveles). */
export function LockGlyph({ size = 24, color = colors.premiumDark, open = false }) {
  const stroke = Math.max(1.6, size * 0.09);

  if (open) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M8.2 10.2 V7.4 C8.2 5.1 10 3.4 12.2 3.4 C13.6 3.4 14.8 4.1 15.5 5.1"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M7.6 10.2 H16.4 C17.5 10.2 18.4 11.1 18.4 12.2 V17.6 C18.4 18.7 17.5 19.6 16.4 19.6 H7.6 C6.5 19.6 5.6 18.7 5.6 17.6 V12.2 C5.6 11.1 6.5 10.2 7.6 10.2 Z"
          fill={color}
        />
        <Circle cx="12" cy="14.6" r={size * 0.055} fill="rgba(255,255,255,0.75)" />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.2 10.2 V7.6 C8.2 5.3 10 3.6 12.2 3.6 C14.4 3.6 16.2 5.3 16.2 7.6 V10.2"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M7.6 10.2 H16.4 C17.5 10.2 18.4 11.1 18.4 12.2 V17.6 C18.4 18.7 17.5 19.6 16.4 19.6 H7.6 C6.5 19.6 5.6 18.7 5.6 17.6 V12.2 C5.6 11.1 6.5 10.2 7.6 10.2 Z"
        fill={color}
      />
      <Circle cx="12" cy="14.6" r={size * 0.055} fill="rgba(255,255,255,0.75)" />
    </Svg>
  );
}

/** Badge premium; crossfade al cambiar `locked`. */
export default function PremiumLockBadge({ locked = true, size = 24, minimal = false }) {
  const reduceMotion = useReduceMotion();
  const openProgress = useRef(new Animated.Value(locked ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(openProgress, {
      toValue: locked ? 0 : 1,
      duration: reduceMotion ? motionLayout.reduceMotionMaxMs : motionLayout.lockMorphMs,
      useNativeDriver: true,
    }).start();
  }, [locked, openProgress, reduceMotion]);

  const closedOpacity = openProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const openOpacity = openProgress;
  const openScale = openProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  if (minimal) {
    const iconSize = size;
    return (
      <View style={{ width: iconSize, height: iconSize }}>
        <Animated.View style={[styles.glyphLayer, { opacity: closedOpacity }]}>
          <LockGlyph size={iconSize} color={colors.premiumDark} open={false} />
        </Animated.View>
        <Animated.View style={[styles.glyphLayer, { opacity: openOpacity, transform: [{ scale: openScale }] }]}>
          <LockGlyph size={iconSize} color={colors.premiumDark} open />
        </Animated.View>
      </View>
    );
  }

  const iconSize = Math.round(size * 0.62);

  return (
    <View style={[styles.badge, { width: size, height: size, borderRadius: size / 2 }]}>
      <Animated.View style={[styles.glyphLayer, { opacity: closedOpacity }]}>
        <LockGlyph size={iconSize} color="#FFFFFF" open={false} />
      </Animated.View>
      <Animated.View style={[styles.glyphLayer, { opacity: openOpacity, transform: [{ scale: openScale }] }]}>
        <LockGlyph size={iconSize} color="#FFFFFF" open />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.premium,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.42)',
    ...shadows.soft,
  },
  glyphLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
