import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { cloudRender, getSkyCloudProfile, gradients, iconButton, spacing } from '../theme';

const PHONE_LANDSCAPE_COMPACT_H = 420;
const TABLET_MIN_SHORT_SIDE = 600;

function cloudHeight(width, aspect) {
  return Math.round(width * aspect);
}

function CloudShape({ width = 180, aspect, style, opacity = 1, flip = false, gradientId = 'cloud' }) {
  const h = cloudHeight(width, aspect);
  const gradRef = `cloud-grad-${gradientId}`;

  return (
    <View
      style={[
        styles.cloudWrap,
        style,
        { width, height: h, opacity, transform: flip ? [{ scaleX: -1 }] : undefined },
      ]}
      pointerEvents="none"
    >
      <Svg width={width} height={h} viewBox="0 0 200 110">
        <Defs>
          <SvgGradient id={gradRef} x1="28%" y1="8%" x2="72%" y2="92%">
            <Stop offset="0" stopColor={cloudRender.gradientTop} />
            <Stop offset="0.52" stopColor={cloudRender.gradientMid} />
            <Stop offset="1" stopColor={cloudRender.gradientBottom} />
          </SvgGradient>
        </Defs>
        <Path d={cloudRender.path} fill={`url(#${gradRef})`} />
      </Svg>
    </View>
  );
}

export default function SkyBackground() {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = screenW > screenH;
  const shortSide = Math.min(screenW, screenH);
  const isTablet = shortSide >= TABLET_MIN_SHORT_SIDE;
  const isCompact = isLandscape && !isTablet && screenH < PHONE_LANDSCAPE_COMPACT_H;

  const layout = useMemo(() => {
    const clouds = getSkyCloudProfile(isLandscape, isCompact, isTablet);
    const settingsBottom = insets.top + clouds.contentTopPadding + iconButton.size;

    const topLeftW = screenW * clouds.topLeftWidth;
    const topRightW = screenW * clouds.topRightWidth;
    const topLeftTop = settingsBottom + clouds.belowSettingsGap + clouds.topLeftDrop;
    const topRightTop = settingsBottom + clouds.belowSettingsGap + clouds.topRightDrop;
    const topRowBottom = Math.max(
      topLeftTop + cloudHeight(topLeftW, clouds.aspect),
      topRightTop + cloudHeight(topRightW, clouds.aspect)
    );

    const bottomLeftTop = Math.max(
      screenH * clouds.bottomBandRatio +
        clouds.bottomRowOffset +
        clouds.bottomRowLift +
        clouds.bottomLeftExtraLift,
      topRowBottom + cloudRowGap(isLandscape)
    );
    const bottomRightTop =
      screenH * clouds.bottomBandRatio +
      clouds.bottomRowOffset +
      clouds.bottomRowLift +
      clouds.bottomRowStagger;

    return { clouds, topLeftW, topRightW, topLeftTop, topRightTop, bottomLeftTop, bottomRightTop };
  }, [screenW, screenH, insets.top, isLandscape, isCompact, isTablet]);

  const { clouds } = layout;

  return (
    <View
      style={styles.root}
      pointerEvents="none"
      importantForAccessibility="no"
      accessibilityElementsHidden
    >
      <LinearGradient
        colors={gradients.sky.colors}
        locations={gradients.sky.locations}
        style={StyleSheet.absoluteFill}
      />

      <CloudShape
        gradientId="tl"
        width={layout.topLeftW}
        aspect={clouds.aspect}
        opacity={clouds.topLeftOpacity}
        style={{ top: layout.topLeftTop, left: screenW * clouds.topLeftInset }}
      />
      <CloudShape
        gradientId="tr"
        width={layout.topRightW}
        aspect={clouds.aspect}
        opacity={clouds.topRightOpacity}
        flip
        style={{ top: layout.topRightTop, right: screenW * clouds.topRightInset }}
      />
      <CloudShape
        gradientId="bl"
        width={screenW * clouds.bottomLeftWidth}
        aspect={clouds.aspect}
        opacity={clouds.bottomLeftOpacity}
        style={{ top: layout.bottomLeftTop, left: screenW * clouds.bottomLeftInset }}
      />
      <CloudShape
        gradientId="br"
        width={screenW * clouds.bottomRightWidth}
        aspect={clouds.aspect}
        opacity={clouds.bottomRightOpacity}
        flip
        style={{ top: layout.bottomRightTop, right: screenW * clouds.bottomRightInset }}
      />
    </View>
  );
}

function cloudRowGap(isLandscape) {
  return isLandscape ? spacing.sm : spacing.md;
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  cloudWrap: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});
