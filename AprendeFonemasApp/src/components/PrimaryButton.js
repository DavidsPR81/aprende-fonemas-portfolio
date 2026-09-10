import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import SpeakerIcon from './SpeakerIcon';
import { fonts as themeFonts, getButtonTokens, scaleTypography, exerciseUi, motionLayout } from '../theme';
import { useResponsive } from '../hooks/useResponsive';
import { usePressAnimation } from '../hooks/usePressAnimation';
import { useReduceMotion } from '../hooks/useReduceMotion';

function ButtonShimmer({ active }) {
  const reduceMotion = useReduceMotion();
  const isFocused = useIsFocused();
  const slide = useRef(new Animated.Value(0)).current;
  const shouldRun = active && !reduceMotion && isFocused;

  useEffect(() => {
    if (!shouldRun) {
      slide.setValue(0);
      return undefined;
    }
    slide.setValue(0);
    const loop = Animated.loop(
      Animated.timing(slide, {
        toValue: 1,
        duration: motionLayout.shimmerMs,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [shouldRun, slide]);

  if (!shouldRun) return null;

  const translateX = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 280],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.shimmerBand, { transform: [{ translateX }] }]}
    />
  );
}

export default function PrimaryButton({
  title,
  onPress,
  variant = 'secondary',
  size = 'md',
  style,
  containerStyle,
  textStyle,
  disabled = false,
  loading = false,
  icon,
  iconType,
  accessibilityLabel,
  accessibilityHint,
  /** Si true, puede reducir un poco el texto; nunca por debajo de minimumFontScale. */
  fitTitle = true,
  /** Escala mínima al encajar (0.92 = legible; evita letras minúsculas). */
  minimumFontScale = 0.92,
  numberOfLines = 1,
  haptic = true,
  shimmer = false,
  speaking = false,
  hitSlop,
}) {
  const { scale, onPressIn, onPressOut } = usePressAnimation({
    disabled: disabled || loading,
    haptic,
  });
  const { scale: scaleFn, touchMinHeight, isTablet } = useResponsive();
  const tokens = getButtonTokens(variant, size);
  const labelStyle = scaleTypography(scaleFn, tokens.fontKey);
  const iconSize =
    iconType === 'speaker'
      ? size === 'lg'
        ? exerciseUi.listenIconSize
        : 22
      : 22;
  // Solo tablet: área táctil ≥ touchMinHeight. Phone portrait no cambia de altura.
  const minHeight = isTablet ? Math.max(tokens.minHeight, touchMinHeight) : tokens.minHeight;
  const resolvedHitSlop =
    hitSlop ??
    (isTablet
      ? { top: 14, bottom: 14, left: 12, right: 12 }
      : { top: 8, bottom: 8, left: 8, right: 8 });

  return (
    <TouchableOpacity
      style={containerStyle}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.92}
      hitSlop={resolvedHitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: speaking }}
    >
      <Animated.View
        style={[
          styles.button,
          tokens.shadow,
          {
            minHeight,
            paddingVertical: tokens.paddingVertical,
            paddingHorizontal: tokens.paddingHorizontal,
            borderRadius: tokens.borderRadius,
            borderWidth: tokens.borderWidth,
            backgroundColor: tokens.backgroundColor,
            borderColor: tokens.borderColor,
            opacity: disabled ? 0.5 : 1,
            transform: [{ scale }],
            overflow: 'hidden',
          },
          style,
        ]}
      >
        <ButtonShimmer active={shimmer && !disabled && !loading} />
        {loading ? (
          <ActivityIndicator color={tokens.textColor} />
        ) : (
          <>
            {iconType === 'speaker' ? (
              <View style={styles.iconSlot} pointerEvents="none">
                <SpeakerIcon size={iconSize} color={tokens.textColor} active={speaking} />
              </View>
            ) : icon ? (
              <Text style={styles.icon}>{icon}</Text>
            ) : null}
            <Text
              style={[
                styles.text,
                labelStyle,
                {
                  fontFamily: themeFonts.kids,
                  color: tokens.textColor,
                  includeFontPadding: false,
                },
                numberOfLines > 1 && styles.textMultiline,
                textStyle,
              ]}
              numberOfLines={numberOfLines}
              adjustsFontSizeToFit={fitTitle && numberOfLines === 1}
              minimumFontScale={minimumFontScale}
            >
              {title}
            </Text>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconSlot: {
    flexShrink: 0,
  },
  text: {
    textAlign: 'center',
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  textMultiline: {
    flexShrink: 1,
    textAlign: 'center',
  },
  icon: {
    fontSize: 22,
  },
  shimmerBand: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 48,
    backgroundColor: 'rgba(255,255,255,0.35)',
    zIndex: 1,
  },
});
