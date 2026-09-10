import React from 'react';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../theme';

/** Mismo asset que el splash nativo (expo-splash-screen → splash-icon.png). */
const SPLASH_ICON_PHONE = 280;
const SPLASH_ICON_TABLET = 320;

export default function AppSplash({ onReady }) {
  const { width, height } = useWindowDimensions();
  const shortSide = Math.min(width, height);
  const size = shortSide >= 600 ? SPLASH_ICON_TABLET : SPLASH_ICON_PHONE;

  return (
    <View style={styles.wrap} onLayout={onReady}>
      <Image
        source={require('../../assets/splash-icon.png')}
        style={{ width: size, height: size }}
        resizeMode="contain"
        accessibilityLabel="Aprende Fonemas"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
