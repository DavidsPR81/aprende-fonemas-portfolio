import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, motionLayout } from '../theme';
import { useReduceMotion } from '../hooks/useReduceMotion';

/** Altavoz; si `active`, ondas de reproducción. */
export default function SpeakerIcon({ size = 22, color = colors.surface, active = false }) {
  const reduceMotion = useReduceMotion();
  const wave = useRef(new Animated.Value(0)).current;
  const shouldWave = active && !reduceMotion;

  useEffect(() => {
    if (!shouldWave) {
      wave.setValue(0);
      return undefined;
    }
    const half = Math.round(motionLayout.speakerWaveMs / 2);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wave, {
          toValue: 1,
          duration: half,
          useNativeDriver: true,
        }),
        Animated.timing(wave, {
          toValue: 0,
          duration: half,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shouldWave, wave]);

  const barH = Math.max(8, Math.round(size * 0.55));
  const barW = Math.max(2, Math.round(size * 0.12));

  const scaleY1 = wave.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 1],
  });
  const scaleY2 = wave.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1.15],
  });
  const scaleY3 = wave.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.95],
  });

  return (
    <View style={styles.row} accessible={false} importantForAccessibility="no-hide-descendants">
      <Ionicons name={active ? 'volume-high' : 'volume-medium'} size={size} color={color} />
      {active ? (
        <View style={[styles.waves, { height: barH, marginLeft: Math.round(size * 0.08) }]}>
          {[scaleY1, scaleY2, scaleY3].map((scaleY, i) => (
            <Animated.View
              key={i}
              style={[
                styles.bar,
                {
                  width: barW,
                  height: barH,
                  backgroundColor: color,
                  borderRadius: barW,
                  opacity: reduceMotion ? 0.85 : undefined,
                  transform: [{ scaleY: shouldWave ? scaleY : 0.7 }],
                },
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waves: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bar: {
    alignSelf: 'center',
  },
});
