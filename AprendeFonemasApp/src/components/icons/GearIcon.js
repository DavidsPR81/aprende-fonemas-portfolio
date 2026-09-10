import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function GearIcon({ size = 24, color = '#718096' }) {
  const s = size / 24;
  const toothW = 4.5 * s;
  const toothH = 7 * s;
  const hub = 8 * s;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <View
          key={deg}
          style={[
            styles.tooth,
            {
              width: toothW,
              height: toothH,
              borderRadius: 1.5 * s,
              backgroundColor: color,
              transform: [{ rotate: `${deg}deg` }, { translateY: -10 * s }],
            },
          ]}
        />
      ))}
      <View
        style={{
          width: hub,
          height: hub,
          borderRadius: hub / 2,
          borderWidth: 2.5 * s,
          borderColor: color,
          backgroundColor: 'transparent',
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 3.5 * s,
          height: 3.5 * s,
          borderRadius: 2 * s,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooth: {
    position: 'absolute',
  },
});
