
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ChevronBackIcon from './icons/ChevronBackIcon';
import PressableScale from './PressableScale';
import {
  colors,
  fonts,
  getIconButtonTokens,
  iconButton,
  radius,
  spacing,
  textColors,
  scaleTypography,
} from '../theme';
import { useResponsive } from '../hooks/useResponsive';

export default function AppHeader({
  title,
  onBack,
  rightAction,
  compact = false,
  largeTitle = false,
  /** En ejercicio: título más suave, no pisa la frase-reto */
  mutedTitle = false,
}) {
  const { isTablet, scale } = useResponsive();
  const backTokens = getIconButtonTokens('sky', 'icon');
  const titleStyle = largeTitle
    ? scaleTypography(scale, 'titleScreen')
    : mutedTitle
      ? { fontSize: scale(20), lineHeight: scale(26) }
      : scaleTypography(scale, 'title');

  return (
    <View
      style={[
        styles.container,
        isTablet && styles.containerTablet,
        compact && styles.containerCompact,
        mutedTitle && styles.containerMuted,
      ]}
    >
      <View style={styles.side}>
        {onBack ? (
          <PressableScale
            contentStyle={[
              styles.backButton,
              backTokens.shadow,
              isTablet && styles.backButtonTablet,
              {
                backgroundColor: backTokens.backgroundColor,
                borderWidth: backTokens.borderWidth,
                borderColor: backTokens.borderColor,
              },
            ]}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ChevronBackIcon size={22} color={backTokens.textColor} />
          </PressableScale>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {title ? (
        <Text
          style={[
            styles.title,
            titleStyle,
            mutedTitle && styles.titleMuted,
          ]}
          numberOfLines={1}
          accessibilityRole="header"
        >
          {title}
        </Text>
      ) : (
        <View style={styles.flex} />
      )}

      <View style={styles.side}>{rightAction ?? <View style={styles.placeholder} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    minHeight: 52,
  },
  containerTablet: {
    minHeight: 60,
    marginBottom: spacing.lg,
  },
  containerCompact: {
    marginBottom: 0,
  },
  side: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  backButton: {
    width: iconButton.size,
    height: iconButton.size,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonTablet: {
    width: iconButton.size,
    height: iconButton.size,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: textColors.screenTitle,
    fontFamily: fonts.kids,
  },
  titleMuted: {
    color: textColors.subheading,
    fontFamily: fonts.kidsMed,
    letterSpacing: 0.2,
  },
  containerMuted: {
    marginBottom: spacing.sm,
    minHeight: 48,
  },
  placeholder: {
    width: iconButton.size,
    height: iconButton.size,
  },
});
