import React from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { usePressAnimation } from '../hooks/usePressAnimation';

/** Touchable con escala + haptic (como PrimaryButton). Iconos, filas, etc. */
export default function PressableScale({
  children,
  style,
  contentStyle,
  disabled = false,
  haptic = true,
  soft = false,
  activeOpacity = 0.92,
  onPressIn: onPressInProp,
  onPressOut: onPressOutProp,
  ...rest
}) {
  const { scale, onPressIn, onPressOut } = usePressAnimation({ disabled, haptic, soft });

  return (
    <TouchableOpacity
      {...rest}
      disabled={disabled}
      activeOpacity={activeOpacity}
      onPressIn={(e) => {
        onPressIn();
        onPressInProp?.(e);
      }}
      onPressOut={(e) => {
        onPressOut();
        onPressOutProp?.(e);
      }}
      style={style}
    >
      <Animated.View style={[contentStyle, { transform: [{ scale }] }]}>{children}</Animated.View>
    </TouchableOpacity>
  );
}
