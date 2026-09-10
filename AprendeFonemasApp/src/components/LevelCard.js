import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import FloatingCrown from './icons/FloatingCrown';
import { LockGlyph } from './icons/PremiumLockBadge';
import PressableScale from './PressableScale';
import TwinklingSparkles from './TwinklingSparkles';
import { colors, fonts, getLevelCircleColor, levelsLayout, radius, shadows, spacing } from '../theme';
import { useResponsive } from '../hooks/useResponsive';

export default function LevelCard({
  level,
  status,
  onPress,
  width,
  premiumOwned = false,
  celebrate = false,
}) {
  const { isTablet, isLandscape, isPhone } = useResponsive();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!celebrate) return;
    scaleAnim.setValue(1);
    Animated.sequence([
      // Escala contenida: no invadir la card vecina del grid.
      Animated.spring(scaleAnim, {
        toValue: 1.04,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [celebrate, scaleAnim]);

  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isPremiumLocked = status === 'premium';
  const isPremiumLevel = !level.free;
  const isPremiumOpen = isPremiumLevel && premiumOwned && !isPremiumLocked;
  const showFreeBanner = Boolean(level.free) && !isPremiumLocked;

  const circleSize = isTablet ? levelsLayout.circleSizeTablet : levelsLayout.circleSizePhone;
  const circleColor = isPremiumLocked ? colors.premium : getLevelCircleColor(level.id);
  const circleNumberSize = isTablet
    ? levelsLayout.circleNumberSizeTablet
    : levelsLayout.circleNumberSize;
  const nameSize = isTablet ? levelsLayout.cardNameSizeTablet : levelsLayout.cardNameSize;
  const nameLineHeight = isTablet
    ? levelsLayout.cardNameLineHeightTablet
    : levelsLayout.cardNameLineHeight;
  const bannerTextSize = isTablet
    ? levelsLayout.bannerTextSizeTablet
    : levelsLayout.bannerTextSize;
  const bannerSlotHeight = isTablet
    ? levelsLayout.cardBannerHeightTablet
    : levelsLayout.cardBannerHeight;
  const smallNumberSize = isTablet
    ? levelsLayout.smallNumberSizeTablet
    : levelsLayout.smallNumberSize;
  const cardHeight = isTablet
    ? levelsLayout.cardFixedHeightTablet
    : levelsLayout.cardFixedHeight;

  const shortName = (level.description || level.name || '').split('·')[0].trim();

  const accessibilityLabel = isPremiumLocked
    ? `Nivel ${level.id}, premium bloqueado`
    : isCompleted
      ? `Nivel ${level.id}, ${shortName}, completado`
      : isLocked
        ? `Nivel ${level.id}, bloqueado`
        : `Nivel ${level.id}, ${shortName}${isPremiumOpen ? ', premium desbloqueado' : ''}`;

  const banner = showFreeBanner ? (
    <View style={styles.bannerFree}>
      <Text style={[styles.bannerFreeText, { fontSize: bannerTextSize }]} maxFontSizeMultiplier={1.2}>
        Gratis
      </Text>
    </View>
  ) : isPremiumLocked ? (
    <View style={styles.bannerPremium}>
      <Text style={[styles.bannerPremiumText, { fontSize: bannerTextSize }]} maxFontSizeMultiplier={1.2}>
        Premium
      </Text>
    </View>
  ) : isPremiumOpen ? (
    <View style={styles.bannerUnlocked}>
      <Text
        style={[
          styles.bannerUnlockedText,
          { fontSize: bannerTextSize },
          isLandscape && isPhone && styles.bannerUnlockedTextCompact,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        maxFontSizeMultiplier={1.2}
      >
        Desbloqueado
      </Text>
      <LockGlyph size={12} color={colors.premiumDark} open />
    </View>
  ) : isLocked ? (
    <View style={styles.bannerLocked}>
      <Text style={[styles.bannerLockedText, { fontSize: bannerTextSize }]} maxFontSizeMultiplier={1.2}>
        Bloqueado
      </Text>
    </View>
  ) : (
    <View style={[styles.bannerSpacer, { height: bannerSlotHeight }]} />
  );

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        width: width || undefined,
        height: cardHeight,
      }}
    >
      <PressableScale
        soft
        style={{ width: width || '100%', height: cardHeight }}
        contentStyle={[
          styles.card,
          shadows.card,
          { width: width || '100%', height: cardHeight },
          isPremiumLocked && styles.cardPremium,
          isPremiumOpen && styles.cardPremiumOwned,
          isLocked && styles.cardLocked,
        ]}
        onPress={onPress}
        disabled={isLocked}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isLocked }}
        accessibilityHint={isPremiumLocked ? 'Abre la pantalla premium' : undefined}
      >
        {isCompleted ? (
          <View style={styles.checkBadge}>
            <Text style={styles.checkText}>✓</Text>
          </View>
        ) : null}

        {isPremiumLocked ? (
          <FloatingCrown
            size={levelsLayout.cardCrownSize}
            color={colors.star}
            style={styles.cardCrownBadge}
          />
        ) : null}

        <View style={[styles.circleWrap, { width: circleSize + 24, height: circleSize + 26 }]}>
          <TwinklingSparkles
            items={isPremiumLocked ? levelsLayout.sparklesPremium : levelsLayout.sparklesFree}
          />
          <View
            style={[
              styles.circle,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                backgroundColor: circleColor,
              },
              isLocked && !isPremiumLocked && styles.circleLocked,
            ]}
          >
            {isPremiumLocked ? (
              <LockGlyph size={levelsLayout.lockInCircle} color={levelsLayout.onCircle} open={false} />
            ) : isLocked ? (
              <LockGlyph
                size={levelsLayout.lockInCircleLocked}
                color={levelsLayout.onCircle}
                open={false}
              />
            ) : (
              <Text
                style={[styles.circleNumber, { fontSize: circleNumberSize }]}
                maxFontSizeMultiplier={1.2}
              >
                {level.id}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.nameSlot}>
          {isPremiumLocked ? (
            <Text
              style={[styles.smallNumber, { fontSize: smallNumberSize }]}
              maxFontSizeMultiplier={1.2}
            >
              {level.id}
            </Text>
          ) : (
            <Text
              style={[
                styles.name,
                { fontSize: nameSize, lineHeight: nameLineHeight },
                isLocked && styles.textMuted,
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
              maxFontSizeMultiplier={1.2}
            >
              {shortName}
            </Text>
          )}
        </View>

        <View style={[styles.bannerSlot, { height: bannerSlotHeight }]}>{banner}</View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingTop: spacing.sm + 6,
    paddingBottom: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: levelsLayout.cardBorder,
  },
  cardPremium: {
    backgroundColor: colors.premiumLight,
    borderColor: levelsLayout.cardBorderPremium,
    borderWidth: 2.5,
  },
  cardPremiumOwned: {
    backgroundColor: 'rgba(240, 237, 250, 0.92)',
    borderColor: levelsLayout.cardBorderPremium,
    borderWidth: 2.5,
  },
  cardLocked: {
    opacity: 0.9,
  },
  checkBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  checkText: {
    color: colors.onPrimary,
    fontSize: 13,
    fontFamily: fonts.kids,
    lineHeight: 15,
  },
  cardCrownBadge: {
    position: 'absolute',
    top: levelsLayout.cardCrownTop,
    right: levelsLayout.cardCrownRight,
    zIndex: 4,
  },
  circleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.26,
    shadowRadius: 7,
    elevation: 5,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  circleLocked: {
    backgroundColor: colors.border,
  },
  circleNumber: {
    color: colors.onPrimary,
    fontFamily: fonts.kids,
    fontSize: levelsLayout.circleNumberSize,
    textShadowColor: colors.textShadowSoft,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  nameSlot: {
    width: '100%',
    height: levelsLayout.cardNameMinHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  smallNumber: {
    fontFamily: fonts.kids,
    color: colors.premiumDark,
    fontSize: levelsLayout.smallNumberSize,
    textAlign: 'center',
  },
  name: {
    fontFamily: fonts.kidsSemi,
    color: colors.navy,
    textAlign: 'center',
    fontSize: levelsLayout.cardNameSize,
    lineHeight: levelsLayout.cardNameLineHeight,
    width: '100%',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  textMuted: {
    color: colors.textMuted,
  },
  bannerSlot: {
    width: '100%',
    height: levelsLayout.cardBannerHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerSpacer: {
    height: levelsLayout.cardBannerHeight,
    width: '100%',
  },
  bannerFree: {
    backgroundColor: colors.free,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 5,
    minWidth: '78%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerFreeText: {
    fontFamily: fonts.kids,
    fontSize: 13,
    color: colors.onPrimary,
    includeFontPadding: false,
  },
  bannerPremium: {
    backgroundColor: colors.premium,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    minWidth: '78%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  bannerPremiumText: {
    fontFamily: fonts.kids,
    fontSize: 13,
    color: colors.onPrimary,
    includeFontPadding: false,
  },
  bannerUnlocked: {
    backgroundColor: colors.premiumLight,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.premiumBorder,
    paddingHorizontal: 6,
    paddingVertical: 4,
    maxWidth: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  bannerUnlockedText: {
    fontFamily: fonts.kidsSemi,
    fontSize: 11,
    color: colors.premiumDark,
    flexShrink: 1,
    includeFontPadding: false,
  },
  bannerUnlockedTextCompact: {
    fontSize: 10,
  },
  bannerLocked: {
    backgroundColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 5,
    minWidth: '78%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerLockedText: {
    fontFamily: fonts.kidsSemi,
    fontSize: 12,
    color: colors.textMuted,
    includeFontPadding: false,
  },
});
