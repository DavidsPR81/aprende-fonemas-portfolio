import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenLayout from '../components/ScreenLayout';
import StarMascot from '../components/StarMascot';
import PrimaryButton from '../components/PrimaryButton';
import CelebrationEffects from '../components/CelebrationEffects';
import AnimatedStatNumber from '../components/AnimatedStatNumber';
import FloatingCrown from '../components/icons/FloatingCrown';
import { LEVELS } from '../data/content';
import { useSettings } from '../context/SettingsContext';
import { useProgress, getTotalStars } from '../hooks/useProgress';
import { useResponsive } from '../hooks/useResponsive';
import { useReduceMotion } from '../hooks/useReduceMotion';
import {
  finalCelebrationLayout as L,
  fonts,
  motionLayout,
  radius,
  shadows,
  spacing,
  typographyScale,
} from '../theme';
import { hapticSuccess } from '../utils/haptics';
import { useAudio } from '../hooks/useAudio';

// Frases del gran final (audioManifest UI_VOICE use: 'Gran final')
const FINAL_CELEBRATION_LINES = [
  { key: 'ui/campeon', text: '¡Campeón!' },
  { key: 'ui/lo_has_logrado', text: '¡Lo has logrado!' },
  { key: 'ui/has_completado_todos_los_niveles', text: '¡Has completado todos los niveles!' },
  { key: 'ui/eres_un_campeon_de_los_fonemas', text: '¡Eres un campeón de los fonemas!' },
  { key: 'ui/que_orgullo', text: '¡Qué orgullo!' },
];

function pickFinalCelebrationLine() {
  return FINAL_CELEBRATION_LINES[Math.floor(Math.random() * FINAL_CELEBRATION_LINES.length)];
}

const MAX_STARS = LEVELS.length * 3;

export default function FinalCelebrationScreen({ navigation }) {
  const { premiumActive } = useSettings();
  const { levelStars, markFinalCelebrationSeen } = useProgress(premiumActive);
  const { buttonMaxWidth, isTablet, isLandscape, scale, needsPortraitScroll, usableHeight } =
    useResponsive();
  const reduceMotion = useReduceMotion();
  const { playKey } = useAudio();
  const totalStars = getTotalStars(levelStars, LEVELS);
  const isPortraitPhone = !isLandscape && !isTablet;
  const shouldScroll = isLandscape || needsPortraitScroll;

  const enter = useRef(new Animated.Value(0)).current;
  const crown = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    markFinalCelebrationSeen();
    hapticSuccess();
    const line = pickFinalCelebrationLine();
    playKey(line.key, { speechMode: 'word', fallbackText: line.text });
    if (reduceMotion) {
      enter.setValue(1);
      crown.setValue(1);
      return undefined;
    }
    enter.setValue(0);
    crown.setValue(0);
    Animated.sequence([
      Animated.spring(crown, {
        toValue: 1,
        friction: 4,
        tension: 110,
        useNativeDriver: true,
      }),
      Animated.spring(enter, {
        toValue: 1,
        ...motionLayout.celebrateSpring,
        useNativeDriver: true,
      }),
    ]).start();
    // Audio + animación solo al montar la pantalla
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToLevels = () => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'Home' }, { name: 'Levels' }],
    });
  };

  const goToProgress = () => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'Home' }, { name: 'Progress' }],
    });
  };

  const mascotPx = isTablet
    ? L.mascotTablet
    : isLandscape
      ? L.mascotLandscape
      : L.mascotPortrait;
  const crownSize = isTablet
    ? L.crownTablet
    : isLandscape
      ? L.crownLandscape
      : L.crownPortrait;

  const titleStyle = typographyScale[L.titleKey];
  const subtitleStyle = typographyScale[L.subtitleKey];
  const labelStyle = typographyScale[L.statLabelKey];

  const mascotBlock = (
    <Animated.View
      style={[
        styles.mascotBlock,
        {
          opacity: crown,
          transform: [
            {
              translateY: crown.interpolate({
                inputRange: [0, 1],
                outputRange: [L.crownEnterOffsetY, 0],
              }),
            },
            {
              scale: crown.interpolate({
                inputRange: [0, 1],
                outputRange: [0.82, 1],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[styles.mascotStack, { gap: L.crownToMascotGap }]}>
        <FloatingCrown size={crownSize} animate={false} />
        <StarMascot
          pixelSize={mascotPx}
          variant="celebrate"
          showTagline={false}
        />
      </View>
    </Animated.View>
  );

  const panelBlock = (
    <Animated.View
      style={[
        styles.panelWrap,
        shadows.card,
        {
          maxWidth: isLandscape ? L.panelMaxWidthLandscape : L.panelMaxWidth,
          opacity: enter,
          transform: [
            {
              translateY: enter.interpolate({
                inputRange: [0, 1],
                outputRange: [L.enterOffsetY, 0],
              }),
            },
          ],
        },
      ]}
    >
            <LinearGradient
              colors={L.panelGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.panel,
                {
                  borderColor: L.panelBorder,
                  borderWidth: L.panelBorderWidth,
                  borderRadius: radius.xl,
                  paddingVertical: L.panelPaddingV,
                  paddingHorizontal: L.panelPaddingH,
                  gap: L.panelInnerGap,
                },
              ]}
            >
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: L.badgeBg,
                    borderColor: L.badgeBorder,
                    paddingHorizontal: L.badgePaddingH,
                    paddingVertical: L.badgePaddingV,
                  },
                ]}
              >
                <Text style={[styles.badgeText, { color: L.badgeText }]}>GRAN FINAL</Text>
              </View>

              <Text
                style={[
                  styles.title,
                  {
                    color: L.titleColor,
                    fontSize: scale(titleStyle.fontSize),
                    lineHeight: scale(titleStyle.lineHeight),
                  },
                  isPortraitPhone && {
                    fontSize: scale(titleStyle.fontSize - 2),
                    lineHeight: scale(titleStyle.lineHeight - 2),
                  },
                ]}
                accessibilityRole="header"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                ¡Campeón!
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  {
                    color: L.subtitleColor,
                    fontSize: scale(subtitleStyle.fontSize),
                    lineHeight: scale(subtitleStyle.lineHeight),
                  },
                ]}
              >
                Has ganado la aventura de los fonemas
              </Text>

              <View style={styles.statsRow}>
                <View
                  style={[
                    styles.statChip,
                    {
                      backgroundColor: L.statChipBg,
                      borderColor: L.statChipBorder,
                      paddingVertical: L.statChipPaddingV,
                    },
                  ]}
                >
                  <AnimatedStatNumber
                    value={LEVELS.length}
                    style={[
                      styles.statNumber,
                      {
                        fontSize: L.statNumberSize,
                        lineHeight: L.statNumberSize + 4,
                        color: L.statChipText,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statLabel,
                      {
                        fontSize: labelStyle.fontSize,
                        lineHeight: labelStyle.lineHeight,
                        color: L.statChipText,
                      },
                    ]}
                  >
                    niveles
                  </Text>
                </View>

                <View
                  style={[
                    styles.statChipGold,
                    {
                      backgroundColor: L.statChipGoldBg,
                      borderColor: L.statChipGoldBorder,
                      paddingVertical: L.statChipPaddingV,
                    },
                  ]}
                >
                  <View style={styles.starsInline}>
                    <AnimatedStatNumber
                      value={totalStars}
                      style={[
                        styles.statNumber,
                        {
                          fontSize: L.statNumberSize,
                          lineHeight: L.statNumberSize + 4,
                          color: L.statChipGoldText,
                        },
                      ]}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.kidsSemi,
                        fontSize: L.statOfSize,
                        color: L.statChipGoldText,
                      }}
                    >
                      /{MAX_STARS}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.statLabel,
                      {
                        fontSize: labelStyle.fontSize,
                        lineHeight: labelStyle.lineHeight,
                        color: L.statChipGoldText,
                      },
                    ]}
                  >
                    estrellas ★
                  </Text>
                </View>
              </View>
            </LinearGradient>
    </Animated.View>
  );

  const actionsBlock = (
    <View
      style={[
        styles.actions,
        {
          gap: L.actionsGap,
          marginTop: L.actionsTop,
        },
        buttonMaxWidth && { maxWidth: buttonMaxWidth, width: '100%', alignSelf: 'center' },
      ]}
    >
      <PrimaryButton
        title="Ver mi progreso"
        variant={L.primaryVariant}
        size={L.buttonSize}
        onPress={goToProgress}
        style={styles.button}
      />
      <PrimaryButton
        title="Volver a niveles"
        variant={L.secondaryVariant}
        size={L.buttonSize}
        onPress={goToLevels}
        style={styles.button}
      />
    </View>
  );

  return (
    <ScreenLayout scroll={shouldScroll}>
      <View style={[styles.stage, shouldScroll && styles.stageScroll]}>
        <CelebrationEffects active intensity="grand" />

        <View
          style={[
            styles.body,
            {
              gap: L.bodyGap,
              paddingHorizontal: L.bodyPaddingH,
              paddingBottom: L.bodyPaddingBottom,
            },
            isLandscape && styles.bodyWide,
            shouldScroll && styles.bodyScroll,
            isLandscape && usableHeight > 0 && { minHeight: Math.max(usableHeight - 24, 360) },
          ]}
        >
          {isLandscape ? (
            <>
              <View style={styles.wideLeft}>{mascotBlock}</View>
              <View style={styles.wideRight}>
                {panelBlock}
                {actionsBlock}
              </View>
            </>
          ) : (
            <>
              {mascotBlock}
              {panelBlock}
              {actionsBlock}
            </>
          )}
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
  },
  stageScroll: {
    flexGrow: 1,
    flex: undefined,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  bodyScroll: {
    flex: undefined,
    flexGrow: 1,
    // Con scroll el contenido queda centrado en la viewport, no pegado arriba.
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    minHeight: 360,
  },
  /** Landscape: mascota+corona | panel+botones (mismo patrón que Celebration) */
  bodyWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: L.wideGap,
    paddingHorizontal: L.wideSidePad,
    maxWidth: L.wideMaxWidth,
    width: '100%',
  },
  wideLeft: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wideRight: {
    flex: 1.15,
    minWidth: 0,
    maxWidth: L.panelMaxWidthLandscape,
    justifyContent: 'center',
  },
  mascotBlock: {
    alignItems: 'center',
  },
  mascotStack: {
    alignItems: 'center',
  },
  panelWrap: {
    width: '100%',
    alignSelf: 'center',
  },
  panel: {
    alignItems: 'center',
    width: '100%',
  },
  badge: {
    borderRadius: radius.full,
    borderWidth: 2,
  },
  badgeText: {
    fontFamily: fonts.kids,
    fontSize: typographyScale.caption.fontSize,
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: fonts.kids,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontFamily: fonts.kidsSemi,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: L.bodyGap,
    width: '100%',
  },
  statChip: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  statChipGold: {
    flex: 1.15,
    borderRadius: radius.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  starsInline: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statNumber: {
    fontFamily: fonts.kids,
  },
  statLabel: {
    fontFamily: fonts.kidsMed,
  },
  actions: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
});
