import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from './PrimaryButton';
import PressableScale from './PressableScale';
import MascotImage from './MascotImage';
import { colors, fonts, radius, shadows, spacing, textColors } from '../theme';
import { useResponsive } from '../hooks/useResponsive';
import { useAudio } from '../hooks/useAudio';

const STEPS = [
  {
    title: '1. Escucha',
    body: 'Pulsa el botón naranja para oír el sonido o la palabra.',
    mascot: 'listen',
    audioKey: 'tutorial/escucha',
    spoken: 'Escucha. Pulsa el botón naranja para oír el sonido o la palabra.',
  },
  {
    title: '2. Elige',
    body: 'Elige la tarjeta con la respuesta correcta.',
    mascot: 'thumbsUp',
    audioKey: 'tutorial/elige',
    spoken: 'Elige. Toca la tarjeta con la respuesta correcta.',
  },
  {
    title: '3. Estrellas',
    body: 'Si aciertas a la primera, ganarás más estrellas.',
    mascot: 'celebrate',
    audioKey: 'tutorial/estrellas',
    spoken: 'Estrellas. Si aciertas a la primera, ganarás más estrellas.',
  },
];

export default function ExerciseTutorial({ visible, onFinish }) {
  const { modalMaxWidth, isTablet, isLandscape, isCompact } = useResponsive();
  const insets = useSafeAreaInsets();
  const { height: windowH } = useWindowDimensions();
  const { playKey, stop } = useAudio({ stopOnUnmount: false });
  const [step, setStep] = React.useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const dense = isLandscape || isCompact;
  const mascotSize = isTablet ? (dense ? 96 : 128) : dense ? 72 : 112;
  const maxCardHeight = Math.max(
    220,
    windowH - insets.top - insets.bottom - spacing.md * 2
  );

  const close = React.useCallback(() => {
    stop();
    onFinish();
  }, [onFinish, stop]);

  // Reset al abrir (antes del paint) para no reproducir un paso viejo
  React.useLayoutEffect(() => {
    if (visible) setStep(0);
    else stop();
  }, [visible, stop]);

  React.useEffect(() => {
    if (!visible) return undefined;

    let cancelled = false;
    const key = STEPS[step]?.audioKey;
    const spoken = STEPS[step]?.spoken;

    const timer = setTimeout(() => {
      if (cancelled || !key) return;
      stop().then(() => {
        if (cancelled) return;
        playKey(key, { speechMode: 'word', fallbackText: spoken });
      });
    }, 60);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      stop();
    };
  }, [visible, step, playKey, stop]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
      onRequestClose={close}
    >
      <View
        style={[
          styles.backdrop,
          {
            paddingTop: Math.max(spacing.md, insets.top + spacing.sm),
            paddingBottom: Math.max(spacing.md, insets.bottom + spacing.sm),
            paddingLeft: Math.max(spacing.md, insets.left + spacing.sm),
            paddingRight: Math.max(spacing.md, insets.right + spacing.sm),
          },
        ]}
      >
        <View
          style={[
            styles.cardShell,
            {
              maxWidth: dense ? Math.min(modalMaxWidth, 520) : modalMaxWidth,
              maxHeight: maxCardHeight,
            },
            dense && styles.cardShellLandscape,
          ]}
        >
          <LinearGradient
            colors={[colors.skyLight, colors.surface, colors.backgroundBottom]}
            locations={[0, 0.45, 1]}
            style={styles.cardGradient}
          >
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollInner,
                dense && styles.scrollInnerLandscape,
              ]}
              keyboardShouldPersistTaps="handled"
            >
              <View style={dense ? styles.landscapeRow : null}>
                <MascotImage
                  variant={current.mascot}
                  size={mascotSize}
                  style={[styles.mascot, dense && styles.mascotLandscape]}
                  accessibilityLabel="Mascota del tutorial"
                />

                <View style={dense ? styles.landscapeCopy : styles.portraitCopy}>
                  <Text
                    style={[styles.title, dense && styles.titleDense]}
                    accessibilityRole="header"
                  >
                    {current.title}
                  </Text>
                  <Text style={[styles.body, dense && styles.bodyDense]}>{current.body}</Text>

                  <View
                    style={[styles.dots, dense && styles.dotsDense]}
                    accessible
                    accessibilityRole="adjustable"
                    accessibilityLabel={`Paso ${step + 1} de ${STEPS.length}`}
                  >
                    {STEPS.map((_, index) => (
                      <View
                        key={index}
                        style={[styles.dot, index === step && styles.dotActive]}
                        importantForAccessibility="no"
                      />
                    ))}
                  </View>
                </View>
              </View>

              <View style={[styles.actions, dense && styles.actionsLandscape]}>
                {isLast ? (
                  <PrimaryButton
                    title="¡Vamos!"
                    variant="accent"
                    onPress={close}
                    style={styles.button}
                    accessibilityLabel="Empezar a jugar"
                    accessibilityHint="Cierra el tutorial"
                  />
                ) : (
                  <PrimaryButton
                    title="Siguiente"
                    variant="sky"
                    onPress={() => setStep((s) => s + 1)}
                    style={styles.button}
                    accessibilityLabel="Siguiente paso del tutorial"
                  />
                )}
                {!isLast ? (
                  <PressableScale
                    onPress={close}
                    contentStyle={styles.skip}
                    accessibilityRole="button"
                    accessibilityLabel="Saltar tutorial"
                    accessibilityHint="Cierra el tutorial"
                    hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
                  >
                    <Text style={styles.skipText}>Saltar</Text>
                  </PressableScale>
                ) : null}
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlayHeavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardShell: {
    width: '100%',
    borderRadius: radius.xl,
    borderWidth: 2.5,
    borderColor: colors.borderSky,
    overflow: 'hidden',
    ...shadows.card,
  },
  cardShellLandscape: {
    width: '92%',
  },
  cardGradient: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollInner: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'stretch',
  },
  scrollInnerLandscape: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  landscapeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  portraitCopy: {
    alignItems: 'stretch',
  },
  landscapeCopy: {
    flex: 1,
    minWidth: 0,
    alignItems: 'stretch',
  },
  mascot: {
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  mascotLandscape: {
    alignSelf: 'center',
    marginBottom: 0,
  },
  title: {
    fontFamily: fonts.kids,
    fontSize: 24,
    lineHeight: 30,
    color: textColors.heading,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  titleDense: {
    fontSize: 20,
    lineHeight: 24,
    marginBottom: spacing.xs,
    textAlign: 'left',
  },
  body: {
    fontFamily: fonts.kidsMed,
    fontSize: 17,
    lineHeight: 25,
    color: textColors.subheading,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  bodyDense: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: spacing.sm,
    textAlign: 'left',
    paddingHorizontal: 0,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dotsDense: {
    justifyContent: 'flex-start',
    marginBottom: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryLight,
  },
  dotActive: {
    backgroundColor: colors.primaryDark,
    width: 22,
  },
  actions: {
    width: '100%',
    alignItems: 'stretch',
  },
  actionsLandscape: {
    maxWidth: 320,
    alignSelf: 'center',
  },
  button: {
    width: '100%',
    alignSelf: 'stretch',
  },
  skip: {
    marginTop: spacing.md,
    padding: spacing.sm,
    alignSelf: 'center',
  },
  skipText: {
    fontFamily: fonts.kidsSemi,
    color: textColors.muted,
    fontSize: 15,
    textAlign: 'center',
  },
});
