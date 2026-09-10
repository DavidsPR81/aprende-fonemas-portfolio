import React from 'react';
import { Switch, Platform } from 'react-native';
import { colors } from '../theme';
import { hapticLight } from '../utils/haptics';

export default function SettingsSwitch({
  value,
  onValueChange,
  disabled = false,
  accent = 'sky',
  accessibilityLabel,
  accessibilityHint,
}) {
  const onColor = accent === 'premium' ? colors.premium : colors.skyBright;
  const stateLabel = value ? 'activado' : 'desactivado';

  return (
    <Switch
      value={value}
      onValueChange={(next) => {
        hapticLight();
        onValueChange?.(next);
      }}
      disabled={disabled}
      trackColor={{ false: colors.switchTrackOff, true: onColor }}
      thumbColor={colors.surface}
      ios_backgroundColor={colors.switchTrackOff}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ checked: value, disabled }}
      accessibilityValue={{ text: stateLabel }}
      {...(Platform.OS === 'android'
        ? { thumbColor: value ? colors.surface : colors.surfaceSubtle }
        : {})}
    />
  );
}
