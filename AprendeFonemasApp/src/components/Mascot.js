import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Modal, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radius, shadows, spacing } from '../theme';
import MascotImage from './MascotImage';
import { useResponsive } from '../hooks/useResponsive';

/** Overlay de feedback tras responder. Cubre TODA la pantalla (no corta cards). */
export default function Mascot({
  visible,
  message = '¡Muy bien!',
  variant = 'thumbsUp',
  onDismiss,
}) {
  const { mascotSize, modalMaxWidth, isTablet, isLandscape, isCompact } = useResponsive();
  const insets = useSafeAreaInsets();
  const { height: windowH, width: windowW } = useWindowDimensions();
  const scale = useRef(new Animated.Value(0.94)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const isSuccess = variant === 'thumbsUp' || variant === 'celebrate';
  const isCheer = variant === 'cheer';
  const accentColor = isSuccess ? colors.success : isCheer ? colors.skyBright : colors.primaryDark;
  const borderColor = isSuccess
    ? colors.feedbackSuccessBorder
    : isCheer
      ? colors.feedbackBorder
      : colors.feedbackSkyBorder;

  useEffect(() => {
    if (visible) {
      scale.setValue(0.94);
      opacity.setValue(0);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 9,
          tension: 55,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.94);
      opacity.setValue(0);
    }
  }, [visible, opacity, scale]);

  const dense = isLandscape || isCompact;
  const cardMaxWidth = Math.min(
    modalMaxWidth,
    Math.max(280, windowW - Math.max(spacing.lg, insets.left + spacing.md) * 2)
  );
  const imageSize = Math.round(
    dense
      ? Math.min(mascotSize, isTablet ? 128 : 96)
      : Math.min(mascotSize + (isTablet ? 36 : 16), isTablet ? 200 : 160)
  );
  const messageSize = dense ? (isTablet ? 22 : 17) : isTablet ? 26 : 20;
  const messageLine = Math.round(messageSize * 1.3);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
      onRequestClose={onDismiss}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity,
            paddingTop: Math.max(spacing.md, insets.top + spacing.sm),
            paddingBottom: Math.max(spacing.md, insets.bottom + spacing.sm),
            paddingLeft: Math.max(spacing.lg, insets.left + spacing.md),
            paddingRight: Math.max(spacing.lg, insets.right + spacing.md),
          },
        ]}
        accessibilityLiveRegion="polite"
        accessibilityLabel={message}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Cerrar mensaje"
          accessibilityHint="Toca para continuar"
        />
        <Animated.View
          style={[
            styles.cardShell,
            shadows.soft,
            {
              width: cardMaxWidth,
              maxWidth: cardMaxWidth,
              maxHeight: Math.max(180, windowH - insets.top - insets.bottom - spacing.lg * 2),
              borderColor,
              transform: [{ scale }],
            },
            isTablet && !dense && styles.cardShellTablet,
          ]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={[colors.skyLight, colors.surface, colors.backgroundBottom]}
            locations={[0, 0.55, 1]}
            style={[
              styles.cardGradient,
              dense && styles.cardGradientLandscape,
              isTablet && !dense && styles.cardGradientTablet,
            ]}
          >
            <MascotImage variant={variant} size={imageSize} style={styles.mascot} />

            <View
              style={[
                styles.ribbon,
                { backgroundColor: accentColor },
                dense && styles.ribbonDense,
                isTablet && !dense && styles.ribbonTablet,
              ]}
            >
              <Text
                style={[
                  styles.message,
                  { fontSize: messageSize, lineHeight: messageLine },
                  dense && styles.messageDense,
                ]}
                numberOfLines={3}
              >
                {message}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardShell: {
    borderRadius: radius.xl,
    borderWidth: 2.5,
    overflow: 'hidden',
  },
  cardShellTablet: {
    borderRadius: radius.xxl,
  },
  cardGradient: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardGradientLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  cardGradientTablet: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  mascot: {
    marginBottom: spacing.xs,
  },
  ribbon: {
    borderRadius: radius.full,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    minWidth: '70%',
    alignItems: 'center',
  },
  ribbonDense: {
    flex: 1,
    minWidth: 0,
    marginBottom: 0,
  },
  ribbonTablet: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minWidth: '78%',
  },
  message: {
    fontFamily: fonts.kids,
    color: colors.onPrimary,
    textAlign: 'center',
    includeFontPadding: false,
  },
  messageDense: {
    includeFontPadding: false,
  },
});
