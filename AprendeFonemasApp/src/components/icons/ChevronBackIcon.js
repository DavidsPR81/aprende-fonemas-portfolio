import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ChevronBackIcon({ size = 20, color = '#2D3748' }) {
  const barW = Math.max(2, Math.round(size * 0.12));
  const barL = Math.round(size * 0.42);
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View
        style={[
          styles.bar,
          {
            width: barL,
            height: barW,
            backgroundColor: color,
            transform: [{ rotate: '-45deg' }, { translateY: -3 }],
          },
        ]}
      />
      <View
        style={[
          styles.bar,
          {
            width: barL,
            height: barW,
            backgroundColor: color,
            transform: [{ rotate: '45deg' }, { translateY: 3 }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    position: 'absolute',
    borderRadius: 2,
  },
});
