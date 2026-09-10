import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts, shadows, radius, levelsLayout } from '../theme';

/** Anillo de progreso (%). Panel como el de stats en Progreso. */
export default function ProgressRing({
  progress = 0,
  size = 84,
  thickness = 8,
  trackColor = levelsLayout.ringTrack,
  fillColor = levelsLayout.ringFill,
  textColor = levelsLayout.ringText,
  showPanel = true,
}) {
  const clamped = Math.min(1, Math.max(0, Number(progress) || 0));
  const percent = Math.round(clamped * 100);
  const radiusRing = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radiusRing;
  const strokeDashoffset = circumference * (1 - clamped);
  const center = size / 2;
  const panelPad = showPanel ? 10 : 0;
  const outer = size + panelPad * 2;

  const ring = (
    <View style={{ width: size, height: size }} accessibilityLabel={`${percent} por ciento completado`}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radiusRing}
          stroke={trackColor}
          strokeWidth={thickness}
          fill="transparent"
        />
        <Circle
          cx={center}
          cy={center}
          r={radiusRing}
          stroke={fillColor}
          strokeWidth={thickness}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.percent, { color: textColor, fontSize: Math.round(size * 0.26) }]}>
          {percent}%
        </Text>
      </View>
    </View>
  );

  if (!showPanel) return ring;

  return (
    <View style={[styles.panel, { width: outer, height: outer, borderRadius: radius.lg }, shadows.soft]}>
      {ring}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: levelsLayout.ringPanelBg,
    borderWidth: 2,
    borderColor: levelsLayout.ringPanelBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    fontFamily: fonts.kids,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
