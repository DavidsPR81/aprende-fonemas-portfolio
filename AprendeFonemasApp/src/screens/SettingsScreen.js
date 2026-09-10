import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Linking, Pressable } from 'react-native';
import Constants from 'expo-constants';
import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';
import SettingsSwitch from '../components/SettingsSwitch';
import ExerciseTutorial from '../components/ExerciseTutorial';
import { useSettings } from '../context/SettingsContext';
import { useProgress } from '../hooks/useProgress';
import { restorePurchases } from '../services/premiumService';
import { CONTACT_EMAIL, PRIVACY_POLICY_URL, LANDING_URL } from '../config/appConfig';
import { PREMIUM_PRICE_LABEL } from '../config/premium';
import { hapticLight } from '../utils/haptics';
import {
  colors,
  fonts,
  radius,
  settingsLayout,
  shadows,
  spacing,
  textColors,
} from '../theme';
import { useResponsive } from '../hooks/useResponsive';

const PARENT_TIPS = [
  'Sesiones de unos 5 minutos: mejor poco y a menudo.',
  'Dejad que el niño lo intente otra vez; equivocarse también enseña.',
  'Acompañad sin decir la respuesta: podéis repetir la consigna en voz alta.',
];

function SectionTitle({ children }) {
  return (
    <Text style={styles.sectionTitle} accessibilityRole="header">
      {children}
    </Text>
  );
}

function Panel({ children, style, accessibilityLabel }) {
  return (
    <View
      style={[styles.panel, style]}
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
}

function LinkRow({
  label,
  hint,
  onPress,
  destructive = false,
  chevron = true,
  accessibilityHint,
}) {
  return (
    <Pressable
      onPressIn={hapticLight}
      onPress={onPress}
      style={({ pressed }) => [styles.linkRow, pressed && styles.linkRowPressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint ?? hint}
    >
      <View style={styles.linkTextWrap} importantForAccessibility="no-hide-descendants">
        <Text style={[styles.linkLabel, destructive && styles.linkDestructive]}>{label}</Text>
        {hint ? <Text style={styles.linkHint}>{hint}</Text> : null}
      </View>
      {chevron ? (
        <Text style={styles.chevron} importantForAccessibility="no">
          ›
        </Text>
      ) : null}
    </Pressable>
  );
}

function SettingRow({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
  accent = 'sky',
}) {
  return (
    <View
      style={styles.row}
      accessible={false}
    >
      <View style={styles.rowText} importantForAccessibility="no-hide-descendants">
        <Text style={styles.rowLabel}>{label}</Text>
        {description ? <Text style={styles.rowDescription}>{description}</Text> : null}
      </View>
      <SettingsSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        accent={accent}
        accessibilityLabel={label}
        accessibilityHint={description}
      />
    </View>
  );
}

export default function SettingsScreen({ navigation }) {
  const {
    soundEnabled,
    voiceEnabled,
    reduceMotionEnabled,
    premiumActive,
    showReviewBanner,
    premiumUnlocked,
    purchaseVerified,
    showDebugPremium,
    setSoundEnabled,
    setVoiceEnabled,
    setReduceMotionEnabled,
    setPremiumUnlocked,
    refreshPremiumStatus,
  } = useSettings();
  const { resetProgress } = useProgress(premiumActive);
  const { contentMaxWidth, isLandscape, isTablet } = useResponsive();
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const buildNumber =
    Constants.expoConfig?.android?.versionCode ??
    Constants.nativeBuildVersion ??
    null;
  const versionLabel = buildNumber ? `v${appVersion} (${buildNumber})` : `v${appVersion}`;
  const [showTutorialPreview, setShowTutorialPreview] = useState(false);

  const settingsCap = isTablet
    ? settingsLayout.contentMaxWidthTablet
    : settingsLayout.contentMaxWidth;
  const bodyWidth = {
    width: '100%',
    maxWidth: Math.min(settingsCap, contentMaxWidth),
    alignSelf: 'center',
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reiniciar progreso',
      '¿Borrar todo el progreso? El niño volverá a empezar en el Nivel 1.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reiniciar', style: 'destructive', onPress: () => resetProgress() },
      ]
    );
  };

  const handleRestorePurchase = async () => {
    const result = await restorePurchases();
    if (result.success) {
      await refreshPremiumStatus();
      Alert.alert('Compra restaurada', 'Premium activado en este dispositivo.');
    } else {
      Alert.alert('Sin compras', result.message ?? 'No hay compras que restaurar.');
    }
  };

  return (
    <ScreenLayout
      scroll
      header={<AppHeader title="Ajustes" onBack={() => navigation.goBack()} compact largeTitle />}
    >
      <View style={bodyWidth}>
        <View
          style={styles.introPanel}
          accessible
          accessibilityRole="summary"
          accessibilityLabel="Para familias, logopedas y docentes. Ajustes de sonido, premium y progreso del niño en este dispositivo."
        >
          <Text style={styles.intro} accessibilityElementsHidden>
            Para familias, logopedas y docentes
          </Text>
          <Text style={styles.introSub} accessibilityElementsHidden>
            Ajustes de sonido, premium y progreso del niño en este dispositivo.
          </Text>
        </View>

        {showReviewBanner ? (
          <View
            style={styles.devBanner}
            accessible
            accessibilityRole="text"
            accessibilityLabel="Modo revisión, solo desarrollo"
          >
            <Text style={styles.devBannerText}>Modo revisión · solo desarrollo</Text>
          </View>
        ) : null}

        <SectionTitle>CÓMO ACOMPAÑAR</SectionTitle>
        <Panel style={styles.tipsPanel} accessibilityLabel="Consejos para acompañar al niño">
          {PARENT_TIPS.map((tip) => (
            <Text key={tip} style={styles.tip} accessibilityRole="text">
              · {tip}
            </Text>
          ))}
        </Panel>

        <SectionTitle>SONIDO</SectionTitle>
        <Panel>
          <SettingRow
            label="Efectos"
            description="Sonidos de acierto y refuerzo"
            value={soundEnabled}
            onValueChange={setSoundEnabled}
          />
          <View style={styles.divider} importantForAccessibility="no" />
          <SettingRow
            label="Voz"
            description="Instrucciones y palabras habladas"
            value={voiceEnabled}
            onValueChange={setVoiceEnabled}
          />
        </Panel>

        <SectionTitle>ACCESIBILIDAD</SectionTitle>
        <Panel>
          <SettingRow
            label="Reducir movimiento"
            description="Menos animación: útil si el niño se distrae o es sensible"
            value={reduceMotionEnabled}
            onValueChange={setReduceMotionEnabled}
          />
        </Panel>

        <SectionTitle>PREMIUM</SectionTitle>
        <Panel>
          <View
            style={styles.statusRow}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`Estado: ${premiumActive ? 'Premium activo' : 'Gratis, niveles 1 a 4'}`}
          >
            <Text style={styles.statusLabel} accessibilityElementsHidden>
              Estado
            </Text>
            <Text
              style={[styles.statusValue, premiumActive ? styles.statusPremium : styles.statusFree]}
              accessibilityElementsHidden
            >
              {premiumActive ? 'Premium activo' : 'Gratis · niveles 1–4'}
            </Text>
          </View>
          <View style={styles.divider} importantForAccessibility="no" />
          {!premiumActive ? (
            <LinkRow
              label="Ver Premium"
              hint={`Desbloquear todo · ${PREMIUM_PRICE_LABEL} pago único`}
              accessibilityHint="Abre la pantalla para comprar Premium"
              onPress={() => navigation.navigate('AdultGate')}
            />
          ) : (
            <LinkRow
              label="Ir a niveles"
              hint="Todo el contenido desbloqueado"
              accessibilityHint="Vuelve a la lista de niveles"
              onPress={() => navigation.navigate('Levels')}
            />
          )}
          <View style={styles.divider} importantForAccessibility="no" />
          <LinkRow
            label="Restaurar compra"
            hint="Si reinstalaste la app o cambiaste de dispositivo"
            accessibilityHint="Busca compras Premium anteriores en esta cuenta"
            onPress={handleRestorePurchase}
          />
          {showDebugPremium ? (
            <>
              <View style={styles.divider} importantForAccessibility="no" />
              <SettingRow
                label="Premium de prueba"
                description={
                  purchaseVerified
                    ? 'Compra verificada — desactiva borrando datos de la app'
                    : 'Simula premium pagado ON / gratis OFF'
                }
                value={premiumUnlocked}
                onValueChange={setPremiumUnlocked}
                disabled={purchaseVerified}
                accent="premium"
              />
            </>
          ) : null}
        </Panel>

        <SectionTitle>AYUDA</SectionTitle>
        <Panel>
          <LinkRow
            label="Ver tutorial"
            hint="Escuchar, elegir y ganar estrellas"
            accessibilityHint="Muestra el tutorial de cómo jugar"
            onPress={() => setShowTutorialPreview(true)}
          />
          <View style={styles.divider} importantForAccessibility="no" />
          <LinkRow
            label="Enviar comentario"
            hint="Dudas o fallos · aprendefonemas@gmail.com"
            accessibilityHint="Abre el correo para escribir al desarrollador"
            onPress={() =>
              Linking.openURL(
                `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Aprende Fonemas — comentario')}`
              )
            }
          />
        </Panel>

        <SectionTitle>DATOS</SectionTitle>
        <Panel>
          <LinkRow
            label="Reiniciar progreso"
            hint="Borra niveles completados y estrellas"
            accessibilityHint="Pide confirmación antes de borrar el progreso"
            onPress={handleResetProgress}
            destructive
            chevron={false}
          />
        </Panel>

        <View style={[styles.footer, isLandscape && styles.footerLandscape]}>
          <Pressable
            onPressIn={hapticLight}
            onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
            accessibilityRole="link"
            accessibilityLabel="Política de privacidad"
            accessibilityHint="Abre la política de privacidad en el navegador"
            hitSlop={spacing.sm}
          >
            <Text style={styles.privacyLink}>Política de privacidad</Text>
          </Pressable>
          <Pressable
            onPressIn={hapticLight}
            onPress={() => Linking.openURL(LANDING_URL)}
            accessibilityRole="link"
            accessibilityLabel="Sitio web de Aprende Fonemas"
            accessibilityHint="Abre la página web de la app"
            hitSlop={spacing.sm}
          >
            <Text style={styles.footerLink}>{LANDING_URL.replace('https://', '')}</Text>
          </Pressable>
          <Pressable
            onPressIn={hapticLight}
            onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)}
            accessibilityRole="link"
            accessibilityLabel={`Enviar correo a ${CONTACT_EMAIL}`}
            accessibilityHint="Abre la aplicación de correo"
            hitSlop={spacing.sm}
          >
            <Text style={styles.footerLink}>{CONTACT_EMAIL}</Text>
          </Pressable>
          <Text
            style={styles.version}
            accessibilityRole="text"
            accessibilityLabel={`Aprende Fonemas versión ${versionLabel}`}
          >
            Aprende Fonemas · {versionLabel}
          </Text>
        </View>
      </View>

      <ExerciseTutorial visible={showTutorialPreview} onFinish={() => setShowTutorialPreview(false)} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  introPanel: {
    backgroundColor: settingsLayout.introSurface,
    borderRadius: settingsLayout.panelRadius,
    borderWidth: 2,
    borderColor: settingsLayout.panelBorder,
    padding: settingsLayout.panelPadding,
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  intro: {
    fontFamily: fonts.kidsSemi,
    fontSize: 18,
    lineHeight: 24,
    color: textColors.heading,
    marginBottom: spacing.xs,
  },
  introSub: {
    fontFamily: fonts.kidsMed,
    fontSize: 14,
    lineHeight: 20,
    color: textColors.subheading,
  },
  devBanner: {
    alignSelf: 'flex-start',
    backgroundColor: settingsLayout.devBannerBg,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: settingsLayout.devBannerBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  devBannerText: {
    fontFamily: fonts.kidsSemi,
    fontSize: 13,
    color: settingsLayout.devBannerText,
  },
  sectionTitle: {
    color: textColors.subheading,
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
    marginTop: settingsLayout.sectionGap,
    fontFamily: fonts.kidsSemi,
    fontSize: 13,
    textTransform: 'uppercase',
  },
  panel: {
    backgroundColor: settingsLayout.panelSurface,
    borderRadius: settingsLayout.panelRadius,
    borderWidth: 2,
    borderColor: settingsLayout.panelBorder,
    paddingHorizontal: settingsLayout.panelPadding,
    paddingVertical: spacing.xs,
    ...shadows.soft,
  },
  tipsPanel: {
    paddingVertical: settingsLayout.panelPadding,
    gap: spacing.sm,
  },
  tip: {
    fontFamily: fonts.kidsMed,
    fontSize: 14,
    color: textColors.body,
    lineHeight: 21,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: settingsLayout.rowMinHeight,
    paddingVertical: spacing.sm,
  },
  rowText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  rowLabel: {
    fontFamily: fonts.kidsSemi,
    fontSize: 16,
    color: textColors.heading,
    marginBottom: 2,
  },
  rowDescription: {
    fontFamily: fonts.kidsMed,
    fontSize: 13,
    color: textColors.subheading,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.primaryLight,
  },
  statusRow: {
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  statusLabel: {
    fontFamily: fonts.kidsMed,
    fontSize: 13,
    color: textColors.subheading,
  },
  statusValue: {
    fontFamily: fonts.kidsSemi,
    fontSize: 16,
  },
  statusPremium: {
    color: colors.premiumDark,
  },
  statusFree: {
    color: textColors.heading,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: settingsLayout.rowMinHeight,
    paddingVertical: spacing.sm,
  },
  linkRowPressed: {
    opacity: 0.72,
  },
  linkTextWrap: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  linkLabel: {
    fontFamily: fonts.kidsSemi,
    fontSize: 16,
    color: colors.primaryDark,
  },
  linkDestructive: {
    color: colors.error,
  },
  linkHint: {
    fontFamily: fonts.kidsMed,
    fontSize: 13,
    color: textColors.subheading,
    marginTop: 2,
    lineHeight: 18,
  },
  chevron: {
    fontFamily: fonts.kids,
    fontSize: 28,
    color: colors.primaryDark,
    lineHeight: 30,
    marginTop: -2,
  },
  footer: {
    marginTop: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  footerLandscape: {
    paddingBottom: spacing.xl,
  },
  privacyLink: {
    fontFamily: fonts.kidsSemi,
    fontSize: 16,
    color: colors.primaryDeep,
    textDecorationLine: 'underline',
  },
  footerLink: {
    fontFamily: fonts.kidsMed,
    fontSize: 14,
    color: textColors.subheading,
    textDecorationLine: 'underline',
  },
  version: {
    fontFamily: fonts.kidsMed,
    fontSize: 13,
    color: textColors.muted,
    marginTop: spacing.sm,
  },
});
