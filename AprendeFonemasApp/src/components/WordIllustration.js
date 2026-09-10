import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getIllustrationSource } from '../data/imageRegistry';
import { colors, radius, spacing } from '../theme';

const CARD_SURFACE = colors.surface;

/**
 * Dibujo completo (nunca se recorta).
 * Fondo del marco = color exacto de la card; si el PNG tiene transparencia, se ve ese color.
 */
export default function WordIllustration({
  item,
  size = 48,
  style,
  textStyle,
  showLabel = false,
  imageBackground = CARD_SURFACE,
}) {
  const source = getIllustrationSource(item);
  const label = item?.word ?? item?.text ?? '';
  const emoji = item?.image;

  if (source) {
    return (
      <View
        style={[
          styles.matte,
          {
            width: size,
            height: size,
            backgroundColor: imageBackground,
          },
          style,
        ]}
      >
        <Image
          source={source}
          style={{ width: size, height: size }}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </View>
    );
  }

  if (emoji) {
    return (
      <View style={[styles.wrap, styles.emojiWrap, style]}>
        <Text style={[styles.emoji, { fontSize: Math.round(size * 0.88) }]}>{emoji}</Text>
        {showLabel && label ? (
          <Text
            style={[styles.label, textStyle, { fontSize: Math.max(9, Math.round(size * 0.18)) }]}
            numberOfLines={1}
          >
            {label}
          </Text>
        ) : null}
      </View>
    );
  }

  const initial = label.charAt(0).toUpperCase() || '?';
  const boxSize = Math.round(size * 1.05);

  return (
    <View style={[styles.placeholder, { width: boxSize, height: boxSize, borderRadius: radius.sm }, style]}>
      <Text style={[styles.initial, { fontSize: Math.round(size * 0.42) }]}>{initial}</Text>
      {showLabel && label ? (
        <Text
          style={[styles.label, textStyle, { fontSize: Math.max(9, Math.round(size * 0.18)) }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  matte: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  emojiWrap: {
    maxWidth: '100%',
  },
  emoji: {
    lineHeight: undefined,
    textAlign: 'center',
  },
  placeholder: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  initial: {
    fontFamily: 'Nunito_800ExtraBold',
    color: colors.primaryDark,
    lineHeight: undefined,
  },
  label: {
    fontFamily: 'Nunito_600SemiBold',
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
});
