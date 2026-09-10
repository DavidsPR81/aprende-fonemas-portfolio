import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import StarMascot from '../components/StarMascot';
import PrimaryButton from '../components/PrimaryButton';
import CelebrationEffects from '../components/CelebrationEffects';
import {
  colors,
  celebrationLayout as CL,
  fonts,
  motionLayout,
  radius,
  shadows,
  spacing,
  textColors,
  textShadows,
} from '../theme';
import { useResponsive } from '../hooks/useResponsive';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { calculateStars, starsMessage, scoreSummary } from '../utils/sessionScore';
import { LEVELS } from '../data/content';
import { hapticSuccess } from '../utils/haptics';
import { useAudio } from '../hooks/useAudio';

function mascotForStars(stars) {
  if (stars >= 3) return 'celebrate';
  if (stars >= 2) return 'cheer';
  return 'thumbsUp';
}

function headlineForStars(stars) {
  if (stars >= 3) return '¡Increíble!';
  if (stars >= 2) return '¡Muy bien!';
  return '¡Bien hecho!';
}

function celebrationAudio(stars) {
  if (stars >= 3) {
    return { key: 'ui/genial_tres_estrellas', text: '¡Genial! Tres estrellas.' };
  }
  if (stars >= 2) {
    return { key: 'ui/muy_bien_dos_estrellas', text: '¡Muy bien! Dos estrellas.' };
  }
  return { key: 'ui/bien_hecho_sigue_practicando', text: '¡Bien hecho! Sigue practicando.' };
}

export default function CelebrationScreen({ route, navigation }) {
  const {
    level,
    levelName,
    nextLevel,
    firstTryCorrect = 0,
    mistakeCount = 0,
    totalExercises = 5,
    triggerFinalCelebration = false,
  } = route.params;
  const { buttonMaxWidth, isTablet, isLandscape, scale, needsPortraitScroll, usableHeight } =
    useResponsive();
  const reduceMotion = useReduceMotion();
  const { playKey } = useAudio();
  const stars = calculateStars(firstTryCorrect, totalExercises);
  const mascotVariant = mascotForStars(stars);
  const starSize = isTablet ? 56 : isLandscape ? 44 : 48;

  const starAnims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  const enter = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const audio = celebrationAudio(stars);
    playKey(audio.key, { speechMode: 'word', fallbackText: audio.text });
    // Solo una vez al entrar; no repetir si el efecto se re-ejecuta
    // eslint-disable-next-line react-hooks/exhaustive-deps -- montaje único de celebración
  }, []);

  useEffect(() => {
    hapticSuccess();
    if (reduceMotion) {
      enter.setValue(1);
      bounce.setValue(1);
      starAnims.forEach((a) => a.setValue(1));
      return undefined;
    }
    enter.setValue(0);
    bounce.setValue(0);
    starAnims.forEach((a) => a.setValue(0));

    Animated.parallel([
      Animated.spring(enter, {
        toValue: 1,
        ...motionLayout.celebrateSpring,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.spring(bounce, {
          toValue: 1,
          friction: 3,
          tension: 130,
          useNativeDriver: true,
        }),
        Animated.spring(bounce, {
          toValue: 0.92,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.spring(bounce, {
          toValue: 1,
          friction: 4,
          tension: 120,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(
        motionLayout.starStaggerMs,
        starAnims.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            ...motionLayout.celebrateSpring,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, [starAnims, enter, bounce, reduceMotion, stars]);

  const goToFinalCelebration = () => navigation.replace('FinalCelebration');
  const goToLevels = () => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'Home' }, { name: 'Levels' }],
    });
  };
  const goToNextLevel = () => {
    if (!nextLevel) {
      goToLevels();
      return;
    }
    navigation.replace('Exercise', { level: nextLevel });
  };
  const repeatLevel = () => {
    if (!level) {
      goToLevels();
      return;
    }
    navigation.replace('Exercise', { level });
  };

  const isPortraitPhone = !isLandscape && !isTablet;
  const useWideLayout = isLandscape;
  const shouldScroll = isLandscape || needsPortraitScroll;

  const panelBlock = (
    <View
      style={[
        styles.panel,
        shadows.soft,
        {
          backgroundColor: CL.panelBg,
          borderColor: CL.panelBorder,
          borderWidth: CL.panelBorderWidth,
          paddingVertical: CL.panelPaddingV,
          paddingHorizontal: CL.panelPaddingH,
          maxWidth: useWideLayout ? CL.panelMaxWidthLandscape : CL.panelMaxWidth,
        },
        useWideLayout && styles.panelWide,
      ]}
    >
      <Text style={[styles.kicker, { fontSize: Math.round(14 * Math.min(scale(1), 1.15)) }]}>
        Nivel completado
      </Text>
      <Text
        style={styles.headline}
        accessibilityRole="header"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {headlineForStars(stars)}
      </Text>
      <Text style={styles.levelName} accessibilityLabel={`Nivel ${levelName}`}>
        {levelName}
      </Text>

      <View style={styles.stars} accessibilityLabel={`${stars} de 3 estrellas`}>
        {[1, 2, 3].map((index) => {
          const anim = starAnims[index - 1];
          const filled = index <= stars;
          return (
            <Animated.Text
              key={index}
              style={[
                styles.star,
                { fontSize: starSize, lineHeight: starSize + 8 },
                !filled && styles.starEmpty,
                filled && styles.starFilled,
                {
                  opacity: anim,
                  transform: [
                    {
                      scale: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.2, 1],
                      }),
                    },
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [16, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              ★
            </Animated.Text>
          );
        })}
      </View>

      <Text style={styles.message}>{starsMessage(stars)}</Text>
      <Text style={styles.score}>
        {scoreSummary(firstTryCorrect, totalExercises, mistakeCount)}
      </Text>
    </View>
  );

  const actionsBlock = (
    <View
      style={[
        styles.actions,
        {
          gap: CL.actionsGap,
          marginTop: CL.panelToActions,
        },
        buttonMaxWidth && { maxWidth: buttonMaxWidth, alignSelf: 'center', width: '100%' },
        useWideLayout && styles.actionsWide,
      ]}
    >
      {triggerFinalCelebration ? (
        <>
          <Text style={styles.finalCue}>¡Has terminado los {LEVELS.length} niveles!</Text>
          <PrimaryButton
            title="¡Gran final!"
            variant="premium"
            size={CL.buttonSize}
            onPress={goToFinalCelebration}
            style={styles.button}
            accessibilityLabel="Ver gran final"
          />
        </>
      ) : null}
      {nextLevel ? (
        <PrimaryButton
          title={`Continuar · ${nextLevel.name}`}
          variant={CL.primaryVariant}
          size={CL.buttonSize}
          onPress={goToNextLevel}
          style={styles.button}
          accessibilityLabel={`Continuar con ${nextLevel.name}`}
        />
      ) : null}
      {level ? (
        <PrimaryButton
          title={stars < 3 ? 'Repetir nivel · más estrellas' : 'Repetir nivel'}
          variant={CL.secondaryVariant}
          size={CL.buttonSize}
          onPress={repeatLevel}
          style={styles.button}
          accessibilityLabel="Repetir este nivel"
          accessibilityHint="Vuelve a jugar el mismo nivel para mejorar las estrellas"
        />
      ) : null}
      <PrimaryButton
        title="Volver a niveles"
        variant="soft"
        size={CL.buttonSize}
        onPress={goToLevels}
        style={styles.button}
        accessibilityLabel="Volver a la lista de niveles"
      />
    </View>
  );

  const mascotBlock = (
    <Animated.View
      style={[
        styles.hero,
        {
          opacity: enter,
          transform: [
            {
              translateY: enter.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
              }),
            },
            {
              scale: bounce.interpolate({
                inputRange: [0.9, 1],
                outputRange: [0.92, 1],
              }),
            },
          ],
        },
      ]}
    >
      <StarMascot
        size={isPortraitPhone ? 'large' : 'hero'}
        variant={mascotVariant}
        showTagline={false}
      />
    </Animated.View>
  );

  return (
    <ScreenLayout scroll={shouldScroll}>
      <View style={[styles.stage, shouldScroll && styles.stageScroll]}>
        <CelebrationEffects active intensity={stars >= 3 ? 'strong' : 'normal'} />

        <View
          style={[
            styles.body,
            {
              gap: CL.bodyGap,
              paddingHorizontal: CL.bodyPaddingH,
              paddingBottom: CL.bodyPaddingBottom,
            },
            useWideLayout && styles.bodyWide,
            shouldScroll && styles.bodyScroll,
            useWideLayout && usableHeight > 0 && { minHeight: Math.max(usableHeight - 24, 360) },
          ]}
        >
          {useWideLayout ? (
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
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    minHeight: 360,
  },
  bodyWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: CL.wideGap,
    paddingHorizontal: CL.wideSidePad,
    maxWidth: 980,
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
    maxWidth: 460,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
  },
  panel: {
    borderRadius: radius.xl,
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  panelWide: {
    maxWidth: '100%',
  },
  kicker: {
    fontFamily: fonts.kidsSemi,
    color: textColors.subheading,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  headline: {
    fontFamily: fonts.kids,
    fontSize: 36,
    lineHeight: 42,
    color: textColors.screenTitle,
    textAlign: 'center',
    ...textShadows.screenTitle,
  },
  levelName: {
    fontFamily: fonts.kidsSemi,
    fontSize: 22,
    lineHeight: 28,
    color: textColors.heading,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  stars: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  star: {
    textAlign: 'center',
  },
  starFilled: {
    color: colors.star,
    textShadowColor: colors.starGlow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  starEmpty: {
    color: colors.starEmpty,
  },
  message: {
    fontFamily: fonts.kidsSemi,
    fontSize: 18,
    lineHeight: 24,
    color: textColors.heading,
    textAlign: 'center',
  },
  score: {
    fontFamily: fonts.kidsMed,
    fontSize: 13,
    lineHeight: 18,
    color: textColors.muted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  actions: {
    width: '100%',
  },
  actionsWide: {
    width: '100%',
    maxWidth: '100%',
  },
  finalCue: {
    fontFamily: fonts.kidsSemi,
    fontSize: 16,
    color: colors.premiumDark,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  button: {
    width: '100%',
  },
});
