import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export default function SessionProgress({
  current,
  total,
  style,
  accessibilityLabel,
}) {
  const label =
    accessibilityLabel ?? `Progreso del nivel: ejercicio ${current} de ${total}`;

  return (
    <View
      style={[styles.row, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: total, now: current }}
    >
      {Array.from({ length: total }).map((_, index) => {
        const step = index + 1;
        const done = step < current;
        const active = step === current;
        return (
          <View
            key={step}
            style={[
              styles.dot,
              index < total - 1 && { marginRight: spacing.sm },
              done && styles.dotDone,
              active && styles.dotActive,
            ]}
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
  },
  dotDone: {
    backgroundColor: colors.primary,
  },
  dotActive: {
    backgroundColor: colors.primary,
    transform: [{ scale: 1.25 }],
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
});
