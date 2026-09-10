import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import {
  colors,
  fonts as themeFonts,
  radius,
  shadows,
  spacing,
  getLetterColor,
  getOptionCardSurface,
  exerciseUi,
  motionLayout,
} from '../theme';
import { letterCardFonts } from '../theme/letterCardFonts';
import WordIllustration from './WordIllustration';
import { usePressAnimation } from '../hooks/usePressAnimation';

const OPTION_CARD = {
  backgroundColor: colors.surface,
  borderRadius: radius.xl,
  borderWidth: exerciseUi.optionBorderWidth,
  borderColor: exerciseUi.optionBorder,
};

const LETTER_TEXT = Platform.select({
  android: { includeFontPadding: false, textAlignVertical: 'center' },
  default: {},
});

function tightLine(fontSize) {
  return { fontSize, lineHeight: Math.round(fontSize * 1.12) };
}

/** Tamaños de tipografía en cards de letra; se adaptan un poco a la altura. */
function letterMetrics(cardHeight) {
  const scale =
    typeof cardHeight === 'number' && cardHeight < 140
      ? Math.max(0.82, cardHeight / 156)
      : 1;
  return {
    letterLarge: tightLine(Math.round(exerciseUi.letterUpperSize * scale)),
    letterSmall: tightLine(Math.round(exerciseUi.letterLowerSize * scale)),
    padY: scale < 1 ? 8 : 12,
    pairGap: scale < 1 ? 2 : 4,
  };
}

function visualMetrics({ imageOnly = false, cardHeight } = {}) {
  const base = imageOnly ? exerciseUi.illustrationOnly : exerciseUi.illustrationWithLabel;
  const padY = imageOnly ? 10 : 8;
  const gap = exerciseUi.visualContentGap;
  const labelH = imageOnly ? 0 : Math.round(exerciseUi.optionLabelSize * 1.2) + gap;
  const maxIllustration =
    typeof cardHeight === 'number'
      ? Math.max(72, cardHeight - padY * 2 - labelH - 4)
      : base;
  return {
    illustration: Math.min(base, maxIllustration),
    label: tightLine(exerciseUi.optionLabelSize),
    padY,
    gap,
  };
}

function LetterPair({ uppercase, lowercase, letterFonts, pairGap = 3, color }) {
  const letterColor = color ?? colors.primaryDark;
  return (
    <View style={styles.contentPair}>
      <Text
        style={[
          styles.letterUpper,
          letterFonts.letterLarge,
          LETTER_TEXT,
          { fontFamily: letterCardFonts.uppercase, color: letterColor },
        ]}
        numberOfLines={1}
      >
        {uppercase}
      </Text>
      <Text
        style={[
          styles.letterLower,
          letterFonts.letterSmall,
          LETTER_TEXT,
          {
            fontFamily: letterCardFonts.lowercase,
            marginTop: pairGap,
            color: letterColor,
            opacity: 0.78,
          },
        ]}
        numberOfLines={1}
      >
        {lowercase}
      </Text>
    </View>
  );
}

function OptionCardShell({
  width,
  height,
  isSelected,
  isCorrect,
  isHint,
  pulseHint = false,
  dimmed = false,
  onPress,
  disabled,
  children,
  accessibilityLabel,
}) {
  const pulse = useRef(new Animated.Value(1)).current;
  const feedback = useRef(new Animated.Value(0)).current;
  const { scale: pressScale, onPressIn, onPressOut, reduceMotion } = usePressAnimation({
    disabled,
    haptic: true,
  });

  const showSuccess = isSelected && isCorrect;
  const showError = isSelected && !isCorrect;
  const cardSurface = getOptionCardSurface(isSelected, isCorrect, isHint);

  useEffect(() => {
    if (!pulseHint || !isHint || reduceMotion) {
      pulse.setValue(1);
      return undefined;
    }

    const half = motionLayout.hintPulseMs;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: half, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: half, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseHint, isHint, pulse, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      feedback.setValue(0);
      return;
    }
    if (showSuccess) {
      feedback.setValue(0);
      Animated.sequence([
        Animated.timing(feedback, {
          toValue: 1,
          duration: motionLayout.successFlashMs,
          useNativeDriver: true,
        }),
        Animated.timing(feedback, {
          toValue: 0,
          duration: motionLayout.successFlashMs,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }
    if (showError) {
      feedback.setValue(0);
      const steps = [];
      for (let i = 0; i < motionLayout.errorShakeCount; i += 1) {
        steps.push(
          Animated.timing(feedback, {
            toValue: i % 2 === 0 ? 1 : -1,
            duration: motionLayout.errorShakeMs,
            useNativeDriver: true,
          })
        );
      }
      steps.push(
        Animated.timing(feedback, {
          toValue: 0,
          duration: motionLayout.errorShakeMs,
          useNativeDriver: true,
        })
      );
      Animated.sequence(steps).start();
    }
  }, [showSuccess, showError, feedback, reduceMotion]);

  const successScale = feedback.interpolate({
    inputRange: [0, 1],
    outputRange: [1, motionLayout.successPopScale],
  });
  const shakeX = feedback.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-motionLayout.errorShakePx, 0, motionLayout.errorShakePx],
  });
  const flashOpacity = showSuccess
    ? feedback.interpolate({ inputRange: [0, 1], outputRange: [0, 0.35] })
    : 0;

  const motionStyle = showError
    ? { transform: [{ translateX: shakeX }] }
    : showSuccess
      ? { transform: [{ scale: successScale }] }
      : undefined;

  return (
    <Animated.View style={{ transform: [{ scale: pressScale }] }}>
      <Animated.View style={{ transform: [{ scale: pulseHint && isHint && !reduceMotion ? pulse : 1 }] }}>
        <Animated.View style={motionStyle}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              shadows.soft,
              OPTION_CARD,
              { width, height, backgroundColor: cardSurface },
              dimmed && styles.dimmed,
              isHint && styles.hintReveal,
              showSuccess && styles.correctBorder,
              showError && styles.incorrectBorder,
            ]}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.92}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ disabled, selected: isSelected }}
          >
            {children}
            {showSuccess && !reduceMotion ? (
              <Animated.View
                pointerEvents="none"
                style={[styles.successFlash, { opacity: flashOpacity }]}
              />
            ) : null}
            {showSuccess ? (
              <View style={styles.successStar} pointerEvents="none">
                <Text style={styles.successStarText}>★</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

export function LetterOptionCard({
  letter,
  width,
  height,
  fonts,
  color,
  isSelected,
  isCorrect,
  isHint = false,
  pulseHint = false,
  dimmed = false,
  onPress,
  disabled,
}) {
  const scaled = letterMetrics(height);
  const letterColor = color ?? getLetterColor(letter?.id ?? letter?.uppercase);

  return (
    <OptionCardShell
      width={width}
      height={height}
      isSelected={isSelected}
      isCorrect={isCorrect}
      isHint={isHint}
      pulseHint={pulseHint}
      dimmed={dimmed}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={`Letra ${letter.uppercase}`}
    >
      <View style={[styles.cardInner, { paddingVertical: scaled.padY }]}>
        <View style={styles.centerZone}>
          <LetterPair
            uppercase={letter.uppercase}
            lowercase={letter.lowercase}
            letterFonts={scaled}
            pairGap={scaled.pairGap}
            color={letterColor}
          />
        </View>
      </View>
    </OptionCardShell>
  );
}

export function SyllableCountOptionCard({
  count,
  width,
  height,
  fonts,
  isSelected,
  isCorrect,
  isHint = false,
  pulseHint = false,
  dimmed = false,
  onPress,
  disabled,
}) {
  const dotSize = count >= 4 ? exerciseUi.syllableDotDense : exerciseUi.syllableDot;
  const dotGap = count >= 4 ? spacing.xs : spacing.sm;
  const padY = 14;
  const caption = `${count} ${count === 1 ? 'sílaba' : 'sílabas'}`;

  return (
    <OptionCardShell
      width={width}
      height={height}
      isSelected={isSelected}
      isCorrect={isCorrect}
      isHint={isHint}
      pulseHint={pulseHint}
      dimmed={dimmed}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={`${count} sílabas`}
    >
      <View style={[styles.cardInner, { paddingVertical: padY }]}>
        <View style={styles.centerZone}>
          <View style={styles.syllableDotsRow}>
            {Array.from({ length: count }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.syllableDot,
                  {
                    width: dotSize,
                    height: dotSize,
                    borderRadius: dotSize / 2,
                  },
                ]}
              />
            ))}
          </View>
            <Text
              style={[
                styles.syllableCaption,
                fonts.caption,
                { fontFamily: themeFonts.kidsSemi, marginTop: spacing.sm },
              ]}
            >
            {caption}
          </Text>
        </View>
      </View>
    </OptionCardShell>
  );
}

/** Card de sílaba escrita (PA, TO…) */
export function SyllableTextOptionCard({
  syllable,
  width,
  height,
  fonts,
  color,
  isSelected,
  isCorrect,
  isHint = false,
  pulseHint = false,
  dimmed = false,
  onPress,
  disabled,
}) {
  const scaled = letterMetrics(height);
  const label = String(syllable ?? '').toUpperCase();
  const accent = color ?? getLetterColor(label[0] ?? 'a');
  const baseSize = scaled.letterLarge.fontSize;
  const fontSize = label.length >= 3 ? Math.round(baseSize * 0.72) : baseSize;

  return (
    <OptionCardShell
      width={width}
      height={height}
      isSelected={isSelected}
      isCorrect={isCorrect}
      isHint={isHint}
      pulseHint={pulseHint}
      dimmed={dimmed}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={`Sílaba ${label}`}
    >
      <View style={[styles.cardInner, { paddingVertical: scaled.padY }]}>
        <View style={styles.centerZone}>
          <Text
            style={[
              styles.syllableTextLabel,
              {
                fontSize,
                lineHeight: fontSize * 1.1,
                color: accent,
                fontFamily: themeFonts.kids,
              },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.65}
          >
            {label}
          </Text>
        </View>
      </View>
    </OptionCardShell>
  );
}

export function WordOptionCard({
  word,
  width,
  height,
  fonts,
  isSelected,
  isCorrect,
  isHint = false,
  pulseHint = false,
  dimmed = false,
  onPress,
  disabled,
  showLabel = true,
}) {
  const scaled = visualMetrics({ imageOnly: !showLabel, cardHeight: height });
  const label = word.word ?? word;
  const cardSurface = getOptionCardSurface(isSelected, isCorrect, isHint);

  return (
    <OptionCardShell
      width={width}
      height={height}
      isSelected={isSelected}
      isCorrect={isCorrect}
      isHint={isHint}
      pulseHint={pulseHint}
      dimmed={dimmed}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={showLabel ? `Palabra ${label}` : `Dibujo de ${label}`}
    >
      <View style={[styles.cardInner, { paddingVertical: scaled.padY, backgroundColor: cardSurface }]}>
        <View style={styles.centerZone}>
          <View style={[styles.illustrationBox, !showLabel && styles.illustrationBoxImageOnly]}>
            <WordIllustration
              item={word}
              size={scaled.illustration}
              showLabel={false}
              imageBackground={cardSurface}
            />
          </View>
          {showLabel ? (
            <Text
              style={[
                styles.visualLabel,
                scaled.label,
                LETTER_TEXT,
                { fontFamily: themeFonts.kidsSemi, marginTop: scaled.gap },
              ]}
              numberOfLines={2}
            >
              {label}
            </Text>
          ) : null}
        </View>
      </View>
    </OptionCardShell>
  );
}

export function ImageChoiceCard({
  item,
  image,
  imageKey,
  width,
  height,
  fonts,
  isSelected,
  isCorrect,
  isHint = false,
  pulseHint = false,
  dimmed = false,
  onPress,
  disabled,
}) {
  const wordItem = item ?? { image, imageKey, word: '' };

  return (
    <WordOptionCard
      word={wordItem}
      width={width}
      height={height}
      fonts={fonts}
      isSelected={isSelected}
      isCorrect={isCorrect}
      isHint={isHint}
      pulseHint={pulseHint}
      dimmed={dimmed}
      onPress={onPress}
      disabled={disabled}
      showLabel={false}
    />
  );
}

export function SentenceOptionCard({
  sentence,
  width,
  height,
  fonts,
  imageOnly = true,
  isSelected,
  isCorrect,
  isHint = false,
  pulseHint = false,
  dimmed = false,
  onPress,
  disabled,
}) {
  if (imageOnly) {
    return (
      <ImageChoiceCard
        item={sentence}
        width={width}
        height={height}
        fonts={fonts}
        isSelected={isSelected}
        isCorrect={isCorrect}
        isHint={isHint}
        pulseHint={pulseHint}
        dimmed={dimmed}
        onPress={onPress}
        disabled={disabled}
      />
    );
  }

  return (
    <WordOptionCard
      word={sentence}
      width={width}
      height={height}
      fonts={fonts}
      isSelected={isSelected}
      isCorrect={isCorrect}
      isHint={isHint}
      pulseHint={pulseHint}
      dimmed={dimmed}
      onPress={onPress}
      disabled={disabled}
    />
  );
}

export function AssociationOptionCard({
  option,
  width,
  height,
  fonts,
  isSelected,
  isCorrect,
  isHint = false,
  pulseHint = false,
  dimmed = false,
  onPress,
  disabled,
}) {
  // Nivel 2: limpio — solo dibujo (la letra se trabaja en nivel 1 y 4)
  return (
    <WordOptionCard
      word={option}
      width={width}
      height={height}
      fonts={fonts}
      isSelected={isSelected}
      isCorrect={isCorrect}
      isHint={isHint}
      pulseHint={pulseHint}
      dimmed={dimmed}
      onPress={onPress}
      disabled={disabled}
      showLabel={false}
    />
  );
}

export function BlendPromptCard({ blendLabel, fonts }) {
  return (
    <View style={styles.stimulusBlock}>
      <View style={[styles.stimulusCard, styles.blendCard, shadows.soft]}>
        <Text style={[styles.blendLabel, fonts.title]}>
          {blendLabel}
        </Text>
      </View>
    </View>
  );
}

export function StimulusWordCard({
  word,
  fonts,
  partialWord,
  hint,
  compact = false,
  style,
  /** Si false, solo dibujo (evita spoilear sílaba/letra inicial) */
  showWordText = true,
}) {
  const label = partialWord ?? word.word;
  const text = showWordText || partialWord ? label : null;

  return (
    <View style={[styles.stimulusBlock, compact && styles.stimulusBlockCompact, style]}>
      <View style={[styles.stimulusCard, compact && styles.stimulusCardCompact, shadows.soft]}>
        <WordIllustration
          item={word}
          size={exerciseUi.illustrationSize}
          showLabel={false}
          imageBackground={colors.surface}
          style={compact && styles.stimulusEmojiCompact}
        />
        {text ? (
          <Text
            style={[
              styles.stimulusWord,
              fonts.title,
              compact && styles.stimulusWordCompact,
              partialWord && styles.stimulusPartial,
            ]}
            accessibilityLabel={partialWord ? `Palabra incompleta ${label}` : `Palabra ${label}`}
          >
            {text}
          </Text>
        ) : null}
      </View>
      {hint ? (
        <Text style={[styles.stimulusHint, fonts.caption]}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

export function PromptWordCard({ word, fonts, partialWord }) {
  return <StimulusWordCard word={word} partialWord={partialWord} fonts={fonts} />;
}

export function PromptSentenceCard({ sentence, fonts, compact = false }) {
  return (
    <View style={[styles.stimulusBlock, compact && styles.stimulusBlockCompact]}>
      <View style={[styles.stimulusCard, styles.stimulusWide, compact && styles.stimulusCardCompact, shadows.soft]}>
        <Text
          style={[
            styles.stimulusSentence,
            compact ? fonts.bodyLarge : fonts.title,
          ]}
        >
          {sentence.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  optionCard: {
    overflow: 'hidden',
    position: 'relative',
  },
  cardInner: {
    flex: 1,
    width: '100%',
    paddingHorizontal: spacing.sm,
  },
  centerZone: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 0,
  },
  illustrationBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexShrink: 0,
  },
  illustrationBoxImageOnly: {
    flex: 1,
    maxHeight: '100%',
    paddingHorizontal: 0,
  },
  contentPair: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  letterUpper: {
    maxWidth: '100%',
    textAlign: 'center',
    // Sombra ligera: se lee mejor el relleno en móvil
    textShadowColor: colors.navyFade,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  letterLower: {
    maxWidth: '100%',
    textAlign: 'center',
    textShadowColor: colors.navyFade,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  visualImage: {
    textAlign: 'center',
    width: '100%',
    lineHeight: undefined,
  },
  visualLabel: {
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: spacing.xs,
    maxWidth: '100%',
    width: '100%',
  },
  stimulusBlock: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stimulusBlockCompact: {
    marginBottom: spacing.xs,
  },
  stimulusCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 2.5,
    borderColor: exerciseUi.optionBorder,
    minWidth: 200,
    maxWidth: 300,
    width: '100%',
    alignSelf: 'center',
  },
  stimulusCardCompact: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    minWidth: 180,
    maxWidth: 280,
  },
  stimulusWide: {
    maxWidth: 380,
    minWidth: 240,
  },
  blendCard: {
    maxWidth: 340,
    minWidth: 220,
    paddingVertical: spacing.md,
  },
  blendLabel: {
    color: colors.primaryDark,
    textAlign: 'center',
    letterSpacing: 2,
    width: '100%',
    fontFamily: themeFonts.kids,
  },
  stimulusWord: {
    color: colors.navy,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontFamily: themeFonts.kids,
  },
  stimulusWordCompact: {
    marginTop: spacing.xs,
    fontSize: 22,
  },
  stimulusPartial: {
    letterSpacing: 3,
    fontFamily: themeFonts.kidsSemi,
  },
  stimulusSentence: {
    color: colors.navy,
    textAlign: 'center',
    lineHeight: 28,
    width: '100%',
    fontFamily: themeFonts.kidsSemi,
  },
  stimulusHint: {
    color: colors.navySoft,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontFamily: themeFonts.kidsMed,
  },
  stimulusEmojiCompact: {
    marginBottom: 0,
  },
  syllableDotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    maxWidth: '100%',
    paddingHorizontal: spacing.xs,
  },
  syllableDot: {
    backgroundColor: colors.primary,
  },
  syllableCaption: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  syllableTextLabel: {
    textAlign: 'center',
    width: '100%',
  },
  correctBorder: {
    borderColor: colors.success,
    borderWidth: 3,
  },
  incorrectBorder: {
    borderColor: colors.error,
    borderWidth: 3,
  },
  hintReveal: {
    borderColor: colors.success,
    borderWidth: 3.5,
  },
  dimmed: {
    opacity: 0.4,
  },
  successFlash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.success,
    borderRadius: radius.xl,
  },
  successStar: {
    position: 'absolute',
    top: 6,
    right: 8,
    zIndex: 2,
  },
  successStarText: {
    fontSize: 16,
    color: colors.star,
    fontFamily: themeFonts.kids,
  },
});