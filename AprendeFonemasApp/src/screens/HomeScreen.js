import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import StarMascot from '../components/StarMascot';
import PrimaryButton from '../components/PrimaryButton';
import PressableScale from '../components/PressableScale';
import GearIcon from '../components/icons/GearIcon';
import FloatingCrown from '../components/icons/FloatingCrown';
import { useSettings } from '../context/SettingsContext';
import {
  getIconButtonTokens,
  homeLayout,
  iconButton,
  radius,
  spacing,
  textColors,
  textShadows,
  scaleTypography,
} from '../theme';
import { useResponsive } from '../hooks/useResponsive';

export default function HomeScreen({ navigation }) {
  const { premiumActive } = useSettings();
  const {
    buttonMaxWidth,
    scale,
    fonts: rFonts,
    isLandscape,
    isCompact,
    isTablet,
    isPhone,
    needsPortraitScroll,
  } = useResponsive();

  const settingsTokens = getIconButtonTokens(
    homeLayout.settingsIconVariant,
    homeLayout.settingsIconSize
  );
  /** Landscape (móvil + tablet): marca/CTAs | mascota. Portrait: stack compacto. */
  const useWideLayout = homeLayout.useWideLandscapeLayout && isLandscape;
  const titleKey =
    isCompact || (isLandscape && !isTablet)
      ? homeLayout.landscapeTitleKey
      : homeLayout.portraitTitleKey;
  const titleStyle = scaleTypography(scale, titleKey);
  const brandTitleLineHeight = Math.round(titleStyle.fontSize * homeLayout.brandLineHeightRatio);
  const brandTitleMetrics = {
    lineHeight: brandTitleLineHeight,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  };
  const isPortraitPhone = !isLandscape && !isTablet;
  const isPortraitTablet = isTablet && !isLandscape;
  const subtitleStyle = scaleTypography(scale, 'subtitle');

  const shouldScroll =
    (homeLayout.scrollInLandscape && isLandscape) || needsPortraitScroll;

  const sectionGap = isCompact
    ? homeLayout.landscapeSectionGap
    : isPortraitTablet
      ? homeLayout.tabletPortraitSectionGap
      : homeLayout.sectionGap;
  const mascotToBrandGap = isPortraitPhone
    ? homeLayout.portraitMascotToBrandGap
    : isPortraitTablet
      ? homeLayout.tabletPortraitMascotGap
      : sectionGap;
  const actionsWidth = buttonMaxWidth
    ? { maxWidth: buttonMaxWidth, width: '100%', alignSelf: 'center' }
    : { width: '100%', alignSelf: 'center' };
  const secondaryBtnSize = isLandscape && !isTablet ? 'homeHalf' : 'homeWide';
  const secondaryFitTitle = !(isLandscape && !isTablet);

  const SettingsButton = (
    <PressableScale
      onPress={() => navigation.navigate('Settings')}
      accessibilityLabel="Ajustes"
      accessibilityRole="button"
      hitSlop={{ top: spacing.md, bottom: spacing.md, left: spacing.md, right: spacing.md }}
      contentStyle={[
        styles.settingsCircle,
        settingsTokens.shadow,
        {
          width: settingsTokens.minHeight,
          height: settingsTokens.minHeight,
          borderRadius: radius.full,
          backgroundColor: settingsTokens.backgroundColor,
          borderWidth: settingsTokens.borderWidth,
          borderColor: settingsTokens.borderColor,
        },
      ]}
    >
      <GearIcon size={22} color={settingsTokens.textColor} />
    </PressableScale>
  );

  const mascotBlock = (
    <View
      style={[styles.mascotWrap, !useWideLayout && { marginBottom: mascotToBrandGap }]}
      accessible
      accessibilityLabel="Mascota estrella de la app"
      accessibilityRole="image"
    >
      <StarMascot
        size="hero"
        variant={homeLayout.mascotVariant}
        showTagline={false}
        idle
        style={isPortraitPhone || isPortraitTablet ? styles.mascotHomeHero : undefined}
      />
    </View>
  );

  const brandBlock = (
    <View style={styles.brand}>
      <Text
        style={[styles.wordAprende, titleStyle, brandTitleMetrics]}
        numberOfLines={1}
        accessibilityRole="header"
      >
        Aprende
      </Text>
      <Text
        style={[styles.wordFonemas, titleStyle, brandTitleMetrics]}
        numberOfLines={1}
        accessibilityRole="header"
      >
        Fonemas
      </Text>
      <Text
        style={[styles.subtitle, subtitleStyle]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        accessibilityRole="text"
        accessibilityLabel={homeLayout.subtitleText}
      >
        {homeLayout.subtitleText}
      </Text>
    </View>
  );

  const actionsBlock = (
    <View
      style={[
        styles.actions,
        actionsWidth,
        isPortraitPhone && styles.actionsPortraitPhone,
        isPortraitTablet && styles.actionsPortraitTablet,
        isLandscape && styles.actionsLandscape,
      ]}
      accessibilityRole="menu"
      accessibilityLabel="Acciones principales"
    >
      <PrimaryButton
        title="Empezar"
        variant="accent"
        size="lg"
        onPress={() => navigation.navigate('Levels')}
        style={styles.fullWidthButton}
        accessibilityLabel="Empezar a jugar"
        accessibilityHint="Abre la lista de niveles"
      />
      <View style={styles.secondaryRow}>
        <View style={styles.halfButtonWrap}>
          <PrimaryButton
            title="Progreso"
            variant="sky"
            size={secondaryBtnSize}
            fitTitle={secondaryFitTitle}
            onPress={() => navigation.navigate('Progress')}
            containerStyle={styles.halfButtonInner}
            style={styles.fullWidthButton}
            accessibilityLabel="Ver tu progreso"
          />
        </View>
        <View style={styles.halfButtonWrap}>
          {!premiumActive ? (
            <FloatingCrown
              size={homeLayout.premiumCrownSize}
              style={styles.premiumCrownBadge}
            />
          ) : null}
          <PrimaryButton
            title="Premium"
            variant="sky"
            size={secondaryBtnSize}
            fitTitle={secondaryFitTitle}
            onPress={() => navigation.navigate('AdultGate')}
            containerStyle={styles.halfButtonInner}
            style={styles.fullWidthButton}
            accessibilityLabel={premiumActive ? 'Premium activo' : 'Premium, desbloquea más niveles'}
            accessibilityHint={!premiumActive ? 'Abre la compra única de Premium' : undefined}
          />
        </View>
      </View>
    </View>
  );

  return (
    <ScreenLayout
      style={styles.layout}
      contentStyle={[styles.content, shouldScroll && styles.contentScroll]}
      scroll={shouldScroll}
    >
      <View style={styles.topRow}>
        <View style={styles.topPlaceholder} />
        {SettingsButton}
      </View>

      {useWideLayout ? (
        <View
          style={[
            styles.wideMain,
            isTablet && styles.wideMainTablet,
            shouldScroll && styles.wideMainScroll,
          ]}
        >
          <View style={[styles.wideLeft, isTablet && styles.wideLeftTablet]}>
            {brandBlock}
            {actionsBlock}
          </View>
          <View style={styles.wideRight}>{mascotBlock}</View>
        </View>
      ) : (
        <View
          style={[
            styles.main,
            { gap: sectionGap },
            isPortraitPhone && styles.mainPortraitPhone,
            isPortraitTablet && styles.mainPortraitTablet,
            shouldScroll && styles.mainScroll,
          ]}
        >
          {mascotBlock}
          {brandBlock}
          {actionsBlock}
        </View>
      )}

      <Text
        style={[
          styles.footer,
          rFonts.footer,
          isPortraitPhone && styles.footerPortraitPhone,
          isLandscape && styles.footerLandscape,
          isPortraitTablet && styles.footerPortraitTablet,
        ]}
        accessibilityRole="text"
        accessibilityLabel="Sin publicidad, funciona offline y sin registro"
      >
        Sin publicidad · Offline · Sin registro
      </Text>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  layout: {
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    paddingTop: spacing.md,
    maxWidth: '100%',
  },
  contentScroll: {
    flex: undefined,
    flexGrow: 1,
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  topPlaceholder: {
    width: iconButton.size,
    height: iconButton.size,
  },
  settingsCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  mainScroll: {
    flex: undefined,
    flexGrow: 1,
    paddingVertical: spacing.md,
  },
  mainPortraitPhone: {
    justifyContent: 'flex-start',
    paddingTop: spacing.xs,
  },
  /** Tablet portrait: centrado vertical sin space-evenly. */
  mainPortraitTablet: {
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    maxWidth: 480,
    alignSelf: 'center',
  },
  wideMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: homeLayout.wideBodyGap,
    paddingHorizontal: homeLayout.wideSideGap,
    width: '100%',
    alignSelf: 'center',
  },
  wideMainTablet: {
    maxWidth: 920,
    gap: spacing.md,
  },
  wideMainScroll: {
    flexGrow: 0,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  wideLeft: {
    flexGrow: 0,
    flexShrink: 1,
    width: '48%',
    maxWidth: 400,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  wideLeftTablet: {
    maxWidth: 420,
    gap: spacing.md,
  },
  wideRight: {
    flexGrow: 0,
    flexShrink: 1,
    width: '44%',
    maxWidth: 380,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotHomeHero: {
    marginBottom: 0,
  },
  brand: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: spacing.md,
    gap: homeLayout.brandBlockGap,
    overflow: 'visible',
  },
  wordAprende: {
    color: textColors.brandLight,
    textAlign: 'center',
    width: '100%',
    ...textShadows.brandTitle,
  },
  wordFonemas: {
    color: textColors.brandAccent,
    textAlign: 'center',
    width: '100%',
  },
  subtitle: {
    color: textColors.subtitle,
    textAlign: 'center',
    width: '100%',
    maxWidth: homeLayout.subtitleMaxWidth,
    marginTop: homeLayout.subtitleTop,
  },
  actions: {
    paddingHorizontal: 0,
    marginTop: homeLayout.actionsTop,
    width: '100%',
    gap: homeLayout.buttonStackGap,
  },
  actionsPortraitPhone: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: homeLayout.buttonStackGap,
  },
  actionsPortraitTablet: {
    marginTop: spacing.sm,
    maxWidth: 400,
    alignSelf: 'center',
    gap: homeLayout.buttonStackGap,
  },
  actionsLandscape: {
    marginTop: spacing.sm,
    gap: homeLayout.buttonStackGap,
  },
  fullWidthButton: {
    width: '100%',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: homeLayout.secondaryButtonGap,
    width: '100%',
    overflow: 'visible',
  },
  halfButtonWrap: {
    flex: 1,
    position: 'relative',
    overflow: 'visible',
  },
  halfButtonInner: {
    flex: 1,
    width: '100%',
  },
  premiumCrownBadge: {
    position: 'absolute',
    top: homeLayout.premiumCrownTop,
    right: homeLayout.premiumCrownRight,
    zIndex: 2,
  },
  footer: {
    color: textColors.footer,
    opacity: homeLayout.footerOpacity,
    textAlign: 'center',
    marginTop: homeLayout.footerTop,
    paddingBottom: spacing.sm,
  },
  footerPortraitPhone: {
    marginTop: spacing.md,
    paddingBottom: spacing.md,
  },
  footerLandscape: {
    marginTop: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  footerPortraitTablet: {
    marginTop: spacing.md,
    paddingBottom: spacing.md,
  },
});
