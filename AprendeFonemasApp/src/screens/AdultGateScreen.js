import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import MascotImage from '../components/MascotImage';
import FloatingCrown from '../components/icons/FloatingCrown';
import {
  colors,
  fonts,
  premiumLayout,
  radius,
  spacing,
} from '../theme';
import { useResponsive } from '../hooks/useResponsive';

const GATE_POINTS = [
  { icon: '★', text: 'Solo un adulto puede comprar o restaurar Premium' },
  { icon: '★', text: 'Pago único · Sin suscripción ni publicidad' },
  { icon: '★', text: 'Así cumplimos las reglas de Google Play para apps infantiles' },
];

export default function AdultGateScreen({ navigation }) {
  const { buttonMaxWidth, isTablet, isLandscape } = useResponsive();
  const isWide = isLandscape;

  const mascotSize = isLandscape
    ? isTablet
      ? premiumLayout.mascotTabletLandscape
      : premiumLayout.mascotPhoneLandscape
    : isTablet
      ? premiumLayout.mascotTablet
      : premiumLayout.mascotPhone;

  const onContinueAsAdult = () => {
    navigation.replace('Premium');
  };

  const onBackToPlay = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  const heroBlock = (
    <View style={[styles.hero, isWide && styles.heroWide]}>
      <MascotImage
        variant="premium"
        size={mascotSize}
        accessibilityLabel="Mascota con corona premium"
      />
      <Text
        style={[
          styles.title,
          isTablet && { fontSize: premiumLayout.titleSizeTablet },
        ]}
        accessibilityRole="header"
      >
        Zona para mayores
      </Text>
      <Text
        style={[
          styles.subtitle,
          isTablet && {
            fontSize: premiumLayout.subtitleSizeTablet,
            lineHeight: premiumLayout.subtitleSizeTablet + 6,
          },
        ]}
      >
        Esta pantalla es solo para padres, madres y educadores
      </Text>
    </View>
  );

  const infoBlock = (
    <View
      style={styles.infoPanel}
      accessible
      accessibilityLabel="Acceso para adultos, compra y restauración"
    >
      <FloatingCrown size={premiumLayout.priceCrownSize} style={styles.infoCrown} />
      <Text style={styles.infoTitle}>Acceso adulto</Text>
      <Text style={styles.infoNote}>Compra y restauración · Fuera del alcance del niño</Text>
    </View>
  );

  const featuresBlock = (
    <View
      style={styles.featuresPanel}
      accessibilityRole="summary"
      accessibilityLabel="Por qué pedimos confirmación"
    >
      <Text style={styles.featuresTitle}>¿Por qué te preguntamos?</Text>
      {GATE_POINTS.map((point) => (
        <View key={point.text} style={styles.featureRow}>
          <Text style={styles.bullet} importantForAccessibility="no">
            {point.icon}
          </Text>
          <Text style={styles.featureText}>{point.text}</Text>
        </View>
      ))}
    </View>
  );

  const actionsBlock = (
    <View style={styles.actions}>
      <View
        style={[
          styles.primaryWrap,
          buttonMaxWidth && { maxWidth: buttonMaxWidth, alignSelf: 'center' },
        ]}
      >
        <FloatingCrown size={premiumLayout.buyCrownSize} style={styles.buyCrown} />
        <PrimaryButton
          title="Soy padre, madre o educador"
          variant="premium"
          fitTitle={false}
          onPress={onContinueAsAdult}
          containerStyle={styles.buyBtnInner}
          style={styles.button}
          accessibilityLabel="Continuar como adulto a la pantalla Premium"
        />
      </View>
      <PrimaryButton
        title="Volver al juego"
        variant="sky"
        fitTitle={false}
        numberOfLines={2}
        minimumFontScale={1}
        onPress={onBackToPlay}
        style={[
          styles.button,
          styles.secondaryButton,
          buttonMaxWidth && { maxWidth: buttonMaxWidth, alignSelf: 'center' },
        ]}
        accessibilityLabel="Volver al juego"
      />
      <Text style={styles.hint}>Si eres un niño, pulsa «Volver al juego»</Text>
      <Text style={styles.disclaimer}>
        Actividades de conciencia fonológica para niños de 3 a 7 años.
      </Text>
    </View>
  );

  return (
    <ScreenLayout
      scroll
      header={<AppHeader title="Premium" onBack={onBackToPlay} compact largeTitle />}
      contentStyle={[
        isTablet && !isLandscape && styles.tabletPortraitBody,
        isLandscape && styles.landscapeBody,
      ]}
    >
      {isWide ? (
        <View style={[styles.widePage, isTablet && styles.widePageTablet]}>
          <View style={[styles.wideCol, isTablet && styles.wideColTablet]}>
            {heroBlock}
            {infoBlock}
          </View>
          <View style={[styles.wideCol, isTablet && styles.wideColTablet]}>
            {featuresBlock}
            {actionsBlock}
          </View>
        </View>
      ) : (
        <View style={[styles.stackFill, isTablet && styles.stackFillTablet]}>
          {heroBlock}
          {infoBlock}
          {featuresBlock}
          {actionsBlock}
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  tabletPortraitBody: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  landscapeBody: {
    flexGrow: 0,
    justifyContent: 'flex-start',
    paddingVertical: spacing.sm,
  },
  stackFill: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    gap: premiumLayout.stackGap,
  },
  stackFillTablet: {
    maxWidth: 520,
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  widePage: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: premiumLayout.wideSideGap,
    width: '100%',
    maxWidth: 920,
    alignSelf: 'center',
    paddingVertical: spacing.sm,
  },
  widePageTablet: {
    gap: premiumLayout.wideSideGapTablet,
    maxWidth: 980,
  },
  wideCol: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 200,
    maxWidth: 420,
    gap: premiumLayout.wideColumnGap,
  },
  wideColTablet: {
    maxWidth: 460,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xs,
    paddingTop: 0,
    gap: spacing.xs,
  },
  heroWide: {
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.kids,
    fontSize: premiumLayout.titleSize,
    color: colors.premiumDark,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.kidsMed,
    fontSize: premiumLayout.subtitleSize,
    color: colors.navySoft,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    lineHeight: 22,
  },
  infoPanel: {
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.xl + 4,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: premiumLayout.panelBg,
    borderRadius: radius.xl,
    borderWidth: 2.5,
    borderColor: premiumLayout.pricePanelBorder,
    position: 'relative',
    overflow: 'visible',
  },
  infoCrown: {
    position: 'absolute',
    top: premiumLayout.priceCrownTop,
    alignSelf: 'center',
    zIndex: 2,
  },
  infoTitle: {
    fontFamily: fonts.kids,
    fontSize: 22,
    lineHeight: 28,
    color: premiumLayout.activeStatusText,
    textAlign: 'center',
    marginTop: spacing.md + 4,
  },
  infoNote: {
    fontFamily: fonts.kidsMed,
    fontSize: 14,
    color: colors.navySoft,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  featuresPanel: {
    marginBottom: spacing.md,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: premiumLayout.panelBg,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: premiumLayout.panelBorder,
  },
  featuresTitle: {
    fontFamily: fonts.kids,
    fontSize: 18,
    color: colors.premiumDark,
    marginBottom: spacing.xs,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bullet: {
    fontFamily: fonts.kids,
    fontSize: 16,
    color: colors.star,
    lineHeight: 24,
  },
  featureText: {
    fontFamily: fonts.kidsMed,
    fontSize: 15,
    color: colors.navy,
    flex: 1,
    lineHeight: 22,
  },
  actions: {
    width: '100%',
    paddingBottom: spacing.md,
  },
  primaryWrap: {
    position: 'relative',
    width: '100%',
    overflow: 'visible',
    marginBottom: spacing.sm,
  },
  buyCrown: {
    position: 'absolute',
    top: premiumLayout.buyCrownTop,
    right: premiumLayout.buyCrownRight,
  },
  buyBtnInner: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  secondaryButton: {
    minHeight: 56,
    paddingVertical: 14,
  },
  hint: {
    fontFamily: fonts.kidsMed,
    fontSize: 13,
    color: colors.navySoft,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  disclaimer: {
    fontFamily: fonts.kidsMed,
    fontSize: 13,
    color: colors.navySoft,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },
});
