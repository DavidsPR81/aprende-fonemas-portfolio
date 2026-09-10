import React from 'react';
import { Image, Text, StyleSheet } from 'react-native';
import { MASCOT_IMAGES } from '../data/mascotRegistry';

const FALLBACK = '★';

export default function MascotImage({ variant = 'normal', size = 100, style, accessibilityLabel = 'Mascota' }) {
  const source = MASCOT_IMAGES[variant];

  if (source) {
    return (
      <Image
        source={source}
        style={[styles.image, { width: size, height: size }, style]}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
        accessible
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  return (
    <Text style={[styles.fallback, { fontSize: size * 0.55, lineHeight: size }, style]}>
      {FALLBACK}
    </Text>
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  },
  fallback: {
    textAlign: 'center',
  },
});
