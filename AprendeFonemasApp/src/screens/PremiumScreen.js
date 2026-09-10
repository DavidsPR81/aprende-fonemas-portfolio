import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
import { useSettings } from '../context/SettingsContext';
import {
  purchasePremium,
  restorePurchases,
  getPremiumProductInfo,
} from '../services/premiumService';
import { ALLOW_SIMULATED_PURCHASE, PREMIUM_PRICE_LABEL } from '../config/premium';
import { AUTO_UNLOCK_PREMIUM_FOR_REVIEW } from '../config/review';
import { LEVELS, RAE_ALPHABET_LETTER_COUNT } from '../data/content';

const PREMIUM_LEVELS = LEVELS.filter((level) => !level.free);
const PREMIUM_LEVEL_RANGE = `${PREMIUM_LEVELS[0]?.id ?? 5}–${PREMIUM_LEVELS[PREMIUM_LEVELS.length - 1]?.id ?? 12}`;

const FEATURES = [
  { icon: '★', text: `Las ${RAE_ALPHABET_LETTER_COUNT} letras del abecedario español (RAE)` },
  { icon: '★', text: `Niveles ${PREMIUM_LEVEL_RANGE}: sílaba, fonemas, fusión, huecos y frases` },
  { icon: '★', text: 'Más letras y retos de lectoescritura' },
  { icon: '★', text: 'Sin publicidad · Pago único' },
];

export default function PremiumScreen({ navigation }) {
  const { buttonMaxWidth, isTablet, isLandscape } = useResponsive();
  const { premiumActive, refreshPremiumStatus } = useSettings();
  const [loading, setLoading] = useState(false);
  const [productReady, setProductReady] = useState(false);
  const [storePrice, setStorePrice] = useState(PREMIUM_PRICE_LABEL);
  const [productDebug, setProductDebug] = useState(null);
  const betaUnlocked = AUTO_UNLOCK_PREMIUM_FOR_REVIEW;
  const showAsActive = premiumActive || betaUnlocked;

  useFocusEffect(
    useCallback(() => {
      refreshPremiumStatus().catch(() => {});
    }, [refreshPremiumStatus])
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (ALLOW_SIMULATED_PURCHASE || betaUnlocked) {
        setProductReady(true);
        return;
      }
      try {
        const info = await getPremiumProductInfo();
        if (cancelled) return;
        if (info && info.localizedPrice) {
          setStorePrice(info.localizedPrice);
          setProductReady(true);
          setProductDebug({
            productId: info.productId,
            localizedPrice: info.localizedPrice,
            currency: info.currency,
            price: info.price,
          });
        } else {
          setProductDebug({ notFound: true });
        }
      } catch (err) {
        if (cancelled) return;
        console.warn('PremiumScreen getProducts failed:', err);
        setProductDebug({ loadError: String(err?.message || err) });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [betaUnlocked]);

  // Landscape = 2 columnas (móvil y tablet). Portrait = stack.
  const isWide = isLandscape;
  const mascotSize = isLandscape
    ? isTablet
      ? premiumLayout.mascotTabletLandscape
      : premiumLayout.mascotPhoneLandscape
    : isTablet
      ? premiumLayout.mascotTablet
      : premiumLayout.mascotPhone;

  const handlePurchase = () => {
    if (showAsActive) {
      Alert.alert('Premium activo', 'Ya tienes todo el contenido desbloqueado.');
      return;
    }
    if (!ALLOW_SIMULATED_PURCHASE && !productReady) {
      Alert.alert(
        'Cargando…',
        'El precio de Google Play todavía no se ha cargado. Espera 5 segundos y vuelve a intentarlo.' +
        (productDebug
          ? `\n\nInfo técnica: ${JSON.stringify(productDebug)}`
          : '')
      );
      return;
    }

    const confirmMessage = ALLOW_SIMULATED_PURCHASE
      ? 'Compra de prueba (desarrollo). En Play Store será una compra real.'
      : `Se abrirá Google Play para completar la compra (${storePrice}).`;

    Alert.alert('Desbloquear Premium', confirmMessage, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Continuar',
        onPress: async () => {
          setLoading(true);
          try {
            const result = await purchasePremium();
            if (result.success) {
              await refreshPremiumStatus();
              Alert.alert(
                '¡Premium desbloqueado!',
                result.simulated
                  ? 'Compra de prueba activada. Todo el contenido está disponible.'
                  : result.restored
                    ? 'Tu compra ya estaba en Google Play. Premium activado.'
                    : 'Gracias por tu compra.',
                [{ text: 'Empezar', onPress: () => navigation.navigate('Levels') }]
              );
            } else if (result.error === 'pending' || result.debugCode === 'E_PENDING') {
              Alert.alert(
                'Compra pendiente',
                'Google Play espera la aprobación de un adulto (Family Link).\n\nPremium NO se activa todavía. Cuando el adulto apruebe, vuelve a abrir la app o pulsa «Restaurar compra».'
              );
            } else {
              Alert.alert(
                'Compra no disponible',
                (result.message ?? 'Inténtalo más tarde.') +
                (result.debugCode ? `\n\nCódigo: ${result.debugCode}` : '') +
                (result.debugResponse ? `\nDetalle: ${String(result.debugResponse)}` : '')
              );
            }
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const result = await restorePurchases();
      if (result.success) {
        await refreshPremiumStatus();
        Alert.alert('Compra restaurada', 'Premium activado en este dispositivo.');
      } else if (result.error === 'pending' || result.debugCode === 'E_PENDING') {
        await refreshPremiumStatus();
        Alert.alert(
          'Compra pendiente',
          result.message ??
            'Hay una compra pendiente de aprobación. Premium no se activa hasta que Google Play la complete.'
        );
      } else {
        Alert.alert('Sin compras', result.message ?? 'No hay compras que restaurar.');
      }
    } finally {
      setLoading(false);
    }
  };

  const heroBlock = (
    <View style={[styles.hero, isWide && styles.heroWide]}>
      <MascotImage
        variant={showAsActive ? 'celebrate' : 'premium'}
        size={mascotSize}
        accessibilityLabel={showAsActive ? 'Mascota celebrando premium activo' : 'Mascota premium'}
      />
      <Text
        style={[
          styles.title,
          isTablet && { fontSize: premiumLayout.titleSizeTablet },
        ]}
        accessibilityRole="header"
      >
        {showAsActive ? '¡Premium activo!' : 'Desbloquea Premium'}
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
        {betaUnlocked
          ? 'Versión de prueba: Premium incluido gratis'
          : showAsActive
            ? 'Acceso completo en este dispositivo'
            : 'Todos los niveles, letras y progreso del niño'}
      </Text>
    </View>
  );

  const priceBlock = !showAsActive ? (
    <View
      style={[styles.pricePanel]}
      accessible
      accessibilityLabel={`Precio ${storePrice}, pago único`}
    >
      <FloatingCrown size={premiumLayout.priceCrownSize} style={styles.priceCrown} />
      {!ALLOW_SIMULATED_PURCHASE && !productReady ? (
        <View style={styles.priceLoading}>
          <ActivityIndicator color={colors.premium} size="large" />
          <Text style={[styles.priceNote, { marginTop: spacing.sm }]}>
            Cargando precio desde Google Play…
          </Text>
          {productDebug && productDebug.loadError ? (
            <Text style={[styles.priceNote, { marginTop: spacing.xs, color: colors.error }]}>
              {String(productDebug.loadError)}
            </Text>
          ) : null}
          {productDebug && productDebug.notFound ? (
            <Text style={[styles.priceNote, { marginTop: spacing.xs, color: colors.error }]}>
              Producto premium_unlock no encontrado en Play (debe ser in-app, no suscripción).
            </Text>
          ) : null}
        </View>
      ) : (
        <>
          <Text style={styles.priceAmount}>{storePrice}</Text>
          <Text style={styles.priceNote}>Pago único · Sin suscripción</Text>
        </>
      )}
    </View>
  ) : (
    <View
      style={[styles.activePanel]}
      accessible
      accessibilityLabel="Premium desbloqueado, todo el contenido disponible"
    >
      <FloatingCrown size={premiumLayout.priceCrownSize} style={styles.priceCrown} />
      <Text style={styles.activeTitle}>Todo desbloqueado</Text>
      <Text style={styles.activeNote}>
        {betaUnlocked
          ? 'Prueba interna / cerrada · sin compra'
          : 'Premium activo en este dispositivo'}
      </Text>
    </View>
  );

  const featuresBlock = (
    <View
      style={[styles.featuresPanel]}
      accessibilityRole="summary"
      accessibilityLabel="Incluye premium"
    >
      <Text style={styles.featuresTitle}>Incluye</Text>
      {FEATURES.map((feature) => (
        <View key={feature.text} style={styles.featureRow}>
          <Text style={styles.bullet} importantForAccessibility="no">
            {feature.icon}
          </Text>
          <Text style={styles.featureText}>{feature.text}</Text>
        </View>
      ))}
    </View>
  );

  const actionsBlock = (
    <View style={styles.actions}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.premium} style={styles.loader} />
      ) : (
        <>
          {!showAsActive ? (
            <View
              style={[
                styles.buyWrap,
                buttonMaxWidth && { maxWidth: buttonMaxWidth, alignSelf: 'center' },
              ]}
            >
              <FloatingCrown
                size={premiumLayout.buyCrownSize}
                style={styles.buyCrown}
              />
              <PrimaryButton
                title={`Comprar · ${storePrice}`}
                variant="premium"
                shimmer
                fitTitle={false}
                onPress={handlePurchase}
                containerStyle={styles.buyBtnInner}
                style={styles.button}
                accessibilityLabel={`Comprar premium por ${storePrice}`}
                accessibilityHint="Abre la compra en Google Play"
              />
            </View>
          ) : (
            <PrimaryButton
              title="Ir a niveles"
              variant="premium"
              fitTitle={false}
              onPress={() => navigation.navigate('Levels')}
              style={[styles.button, buttonMaxWidth && { maxWidth: buttonMaxWidth, alignSelf: 'center' }]}
              accessibilityLabel="Ir a la lista de niveles"
            />
          )}
          {!betaUnlocked ? (
            <>
              <PrimaryButton
                title="Restaurar compra"
                variant="sky"
                fitTitle={false}
                numberOfLines={2}
                minimumFontScale={1}
                onPress={handleRestore}
                style={[
                  styles.button,
                  styles.restoreButton,
                  buttonMaxWidth && { maxWidth: buttonMaxWidth, alignSelf: 'center' },
                ]}
                accessibilityLabel="Restaurar compra premium"
                accessibilityHint="Si cambiaste de móvil o reinstalaste la app"
              />
              <Text style={styles.restoreHint}>Si cambiaste de móvil o reinstalaste la app</Text>
            </>
          ) : null}
        </>
      )}

      {betaUnlocked ? (
        <Text style={styles.devNote} accessibilityLabel="Versión de prueba, premium gratis">
          Versión de prueba: Premium gratis. La compra real solo en la versión publicada.
        </Text>
      ) : ALLOW_SIMULATED_PURCHASE && !showAsActive ? (
        <Text style={styles.devNote} accessibilityLabel="Modo desarrollo, compra simulada">
          Modo desarrollo: compra simulada hasta publicar en Play Store.
        </Text>
      ) : null}

      <Text style={styles.disclaimer}>
        Actividades de conciencia fonológica para niños de 3 a 7 años.
      </Text>
    </View>
  );

  return (
    <ScreenLayout
      scroll
      header={<AppHeader title="Premium" onBack={() => navigation.goBack()} compact largeTitle />}
      contentStyle={[
        isTablet && !isLandscape && styles.tabletPortraitBody,
        // Landscape: flex-start (center en ScrollView recorta el top).
        isLandscape && styles.landscapeBody,
      ]}
    >
      {isWide ? (
        <View style={[styles.widePage, isTablet && styles.widePageTablet]}>
          <View style={[styles.wideCol, styles.wideLeft, isTablet && styles.wideColTablet]}>
            {heroBlock}
            {priceBlock}
          </View>
          <View style={[styles.wideCol, styles.wideRight, isTablet && styles.wideColTablet]}>
            {featuresBlock}
            {actionsBlock}
          </View>
        </View>
      ) : (
        <View style={[styles.stackFill, isTablet && styles.stackFillTablet]}>
          {heroBlock}
          {priceBlock}
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
    // Los bloques ya traen margins (8+8 / 16): gap corto = ritmo uniforme de ~24.
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
  // Row: flex reparte ancho; la altura viene del contenido.
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
  wideLeft: {},
  wideRight: {},
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
  pricePanel: {
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
    elevation: 0,
  },
  priceCrown: {
    position: 'absolute',
    top: premiumLayout.priceCrownTop,
    alignSelf: 'center',
    zIndex: 2,
  },
  priceAmount: {
    fontFamily: fonts.kids,
    fontSize: premiumLayout.priceSize,
    color: colors.premiumDark,
    textAlign: 'center',
    lineHeight: premiumLayout.priceSize + 6,
    marginTop: spacing.md + 4,
  },
  priceLoading: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  priceNote: {
    fontFamily: fonts.kidsMed,
    fontSize: 14,
    color: colors.navySoft,
    marginTop: spacing.xs,
  },
  activePanel: {
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
  activeTitle: {
    fontFamily: fonts.kids,
    fontSize: 22,
    lineHeight: 28,
    color: premiumLayout.activeStatusText,
    textAlign: 'center',
    marginTop: spacing.md + 4,
  },
  activeNote: {
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
  buyWrap: {
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
  restoreButton: {
    minHeight: 56,
    paddingVertical: 14,
  },
  loader: {
    marginVertical: spacing.lg,
  },
  restoreHint: {
    fontFamily: fonts.kidsMed,
    fontSize: 13,
    color: colors.navySoft,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  devNote: {
    fontFamily: fonts.kidsMed,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.sm,
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
