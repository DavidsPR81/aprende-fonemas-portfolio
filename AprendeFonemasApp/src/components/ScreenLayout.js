
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../theme';
import { useResponsive } from '../hooks/useResponsive';
import SkyBackground from './SkyBackground';

export default function ScreenLayout({
  children,
  style,
  // Incluye left/right: cutout, cámara y barra Samsung en landscape.
  edges = ['top', 'right', 'bottom', 'left'],
  scroll = false,
  header = null,
  contentStyle,
  sky = true,
  overlay = null,
}) {
  const { horizontalPadding, contentMaxWidth, useScrollLayout } = useResponsive();
  const insets = useSafeAreaInsets();
  const shouldScroll = scroll === true ? true : scroll === false ? false : useScrollLayout;

  // SafeAreaView ya aplica edges; no volver a sumar insets.bottom en el ScrollView.
  const scrollPadBottom = shouldScroll
    ? Math.max(spacing.lg, spacing.md + (edges.includes('bottom') ? 0 : insets.bottom))
    : 0;

  const innerStyle = [
    styles.inner,
    shouldScroll ? styles.innerScroll : styles.innerFixed,
    shouldScroll && header ? styles.innerBelowHeader : null,
    {
      paddingHorizontal: horizontalPadding,
      maxWidth: contentMaxWidth,
      alignSelf: 'center',
    },
    contentStyle,
  ];

  const body = shouldScroll ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPadBottom }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
    >
      <View style={innerStyle}>{children}</View>
    </ScrollView>
  ) : (
    <View style={[styles.bodyShell, { alignItems: 'center' }]}>
      <View style={innerStyle}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      {sky ? <SkyBackground /> : null}
      {header ? (
        <View style={[styles.headerShell, { paddingHorizontal: horizontalPadding }]}>
          <View style={[styles.headerInner, { maxWidth: contentMaxWidth, alignSelf: 'center' }]}>
            {header}
          </View>
        </View>
      ) : null}
      {body}
      {overlay ? (
        <View style={styles.overlay} pointerEvents="box-none">
          {overlay}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  headerShell: {
    width: '100%',
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    zIndex: 10,
  },
  headerInner: {
    width: '100%',
  },
  bodyShell: {
    flex: 1,
    width: '100%',
    zIndex: 1,
  },
  inner: {
    width: '100%',
    zIndex: 1,
  },
  innerFixed: {
    flex: 1,
  },
  innerScroll: {},
  innerBelowHeader: {
    paddingTop: spacing.md,
  },
  scroll: {
    flex: 1,
    width: '100%',
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
    flexGrow: 1,
  },
});
