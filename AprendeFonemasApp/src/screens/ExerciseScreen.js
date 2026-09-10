
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';
import SessionProgress from '../components/SessionProgress';
import PrimaryButton from '../components/PrimaryButton';
import Mascot from '../components/Mascot';
import MascotImage from '../components/MascotImage';
import ExerciseTutorial from '../components/ExerciseTutorial';
import { getHintThreshold, TUTORIAL_STORAGE_KEY, TUTORIAL_VERSION, FINAL_CELEBRATION_STORAGE_KEY } from '../config/appConfig';
import {
  AssociationOptionCard,
  BlendPromptCard,
  LetterOptionCard,
  PromptSentenceCard,
  SyllableCountOptionCard,
  SyllableTextOptionCard,
  SentenceOptionCard,
  StimulusWordCard,
  WordOptionCard,
} from '../components/ExerciseCards';
import { useSettings } from '../context/SettingsContext';
import { pickRandomFeedback } from '../data/content';
import { useAudio } from '../hooks/useAudio';
import { useProgress, hasCompletedAllLevels } from '../hooks/useProgress';
import { useResponsive } from '../hooks/useResponsive';
import {
  buildExercises,
  getCorrectKey,
  getExerciseAudioOptions,
  getExerciseInstruction,
  getPlayableLevels,
  getSelectionKey,
  isExerciseCorrect,
} from '../utils/exerciseBuilder';
import { getExerciseLayout, getLayoutSpacing } from '../utils/exerciseLayout';
import { calculateStars } from '../utils/sessionScore';
import { hapticErrorSoft, hapticSuccess } from '../utils/haptics';
import { colors, fonts, spacing, textColors, typographyScale, exerciseUi, radius, shadows, assignDistinctLetterColors } from '../theme';
import { getRecentSeenKeys, recordSeenKeys, extractContentKeysFromExercises } from '../utils/recentSeen';

/** Pose de mascota según el tono del feedback de acierto (no siempre pulgares arriba). */
function successMascotVariant(feedbackKey) {
  const celebrate = new Set([
    'fantastico',
    'fantastico_trabajo',
    'excelente',
    'excelente_trabajo',
    'estupendo',
    'perfecto',
    'lo_has_conseguido',
  ]);
  const cheer = new Set([
    'sigue_asi',
    'estas_aprendiendo_muchisimo',
    'que_bien_lo_haces',
    'que_rapido',
    'lo_hiciste_genial',
    'muy_buena_respuesta',
    'muy_buena_eleccion',
  ]);
  if (celebrate.has(feedbackKey)) return 'celebrate';
  if (cheer.has(feedbackKey)) return 'cheer';
  return 'thumbsUp';
}

export default function ExerciseScreen({ route, navigation }) {
  const { level } = route.params;
  const { premiumActive } = useSettings();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selection, setSelection] = useState(null);
  const [firstTryCorrectCount, setFirstTryCorrectCount] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [exerciseMistakes, setExerciseMistakes] = useState(0);
  const [scaffoldPhase, setScaffoldPhase] = useState(false); // tras N fallos: solo la correcta es clicable
  const [hadErrorThisExercise, setHadErrorThisExercise] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialReady, setTutorialReady] = useState(level.id !== 1);
  const [recentSeenReady, setRecentSeenReady] = useState(false);
  const [seenKeysForLevel, setSeenKeysForLevel] = useState([]);
  const allowLeaveRef = useRef(false);
  const [showMascot, setShowMascot] = useState(false);
  const [mascotMessage, setMascotMessage] = useState('¡Muy bien!');
  const [mascotVariant, setMascotVariant] = useState('thumbsUp');
  const { playKey, playFeedback, isPlaying, stop } = useAudio();
  const playKeyRef = useRef(playKey);
  const stopRef = useRef(stop);
  const feedbackTimerRef = useRef(null);
  const feedbackActionRef = useRef(null);
  const feedbackBusyRef = useRef(false);
  const feedbackGenRef = useRef(0);
  const playbackGenRef = useRef(0);
  const { saveProgress, completedLevels } = useProgress(premiumActive);

  const layoutConfig = getExerciseLayout(level.type);
  const {
    fonts,
    letterCardWidth,
    letterCardHeight,
    letterGap,
    letterCols,
    visualGridCardWidth,
    visualGridCardHeight,
    visualGridGap,
    visualCols,
    innerWidth,
    isTablet,
    isLandscape,
    isPhone,
    isCompact,
    isPortraitPhone,
    needsPortraitScroll,
  } = useResponsive(layoutConfig.profile);
  const insets = useSafeAreaInsets();

  const layoutSpacing = getLayoutSpacing(layoutConfig.profile, {
    isLandscape,
    isCompact,
    isTablet,
    isPortraitPhone,
  });
  const compactStimulus = [
    'stimulus-listen-grid',
    'stimulus-listen-syllables',
    'stimulus-listen-letters',
    'sentence-listen-images',
    'blend-listen-grid',
  ].includes(layoutConfig.profile);

  // Landscape/tablet landscape: scroll. Portrait: flex para repartir altura.
  const exerciseScroll = isLandscape || needsPortraitScroll;
  // Tablet (y algunos niveles): contenido de interacción centrado.
  const centerInteraction =
    isTablet ||
    [
      'listen-letters',
      'listen-association-grid',
      'listen-word-grid',
      'listen-images',
    ].includes(layoutConfig.profile);

  playKeyRef.current = playKey;
  stopRef.current = stop;

  // Al salir de la pantalla (back, home, progreso): corta el audio
  useFocusEffect(
    useCallback(() => {
      return () => {
        playbackGenRef.current += 1;
        feedbackGenRef.current += 1;
        stopRef.current();
      };
    }, [])
  );

  const exercises = useMemo(
    () => {
      if (!recentSeenReady) return [];
      return buildExercises(level, { isPremium: premiumActive, seenKeys: seenKeysForLevel });
    },
    [level, premiumActive, recentSeenReady, seenKeysForLevel]
  );
  const exercise = exercises[currentExercise];
  const instruction = getExerciseInstruction(exercise, level);
  const letterColorMap = useMemo(
    () => assignDistinctLetterColors(exercise?.options ?? []),
    [exercise]
  );

  const playExerciseAudio = () => {
    if (!exercise?.playKey) return;
    playKey(exercise.playKey, getExerciseAudioOptions(exercise));
  };

  // Cargar palabras vistas recientemente para anti-repetición
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const keys = await getRecentSeenKeys(level.id);
        if (cancelled) return;
        setSeenKeysForLevel(keys ?? []);
      } catch {
        if (cancelled) return;
        setSeenKeysForLevel([]);
      } finally {
        if (!cancelled) setRecentSeenReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [level.id]);

  // Consigna (1.ª vez del nivel) → estímulo del ejercicio. Espera a que termine el audio.
  useEffect(() => {
    if (!tutorialReady || showTutorial || !recentSeenReady) return undefined;
    if (feedbackBusyRef.current) return undefined;

    let cancelled = false;
    const runId = ++playbackGenRef.current;

    const run = async () => {
      // Pequeña pausa para montar UI
      await new Promise((r) => setTimeout(r, 280));
      if (cancelled || runId !== playbackGenRef.current) return;

      if (currentExercise === 0 && level.instructionKey) {
        await playKeyRef.current(level.instructionKey, {
          speechMode: 'word',
          fallbackText: instruction,
        });
        if (cancelled || runId !== playbackGenRef.current) return;
        await new Promise((r) => setTimeout(r, 350));
      }

      if (cancelled || runId !== playbackGenRef.current) return;
      if (!exercise?.playKey || exercise.showText) return;

      await playKeyRef.current(exercise.playKey, getExerciseAudioOptions(exercise));
    };

    run();

    return () => {
      cancelled = true;
      playbackGenRef.current += 1;
      stopRef.current();
    };
  }, [currentExercise, exercise, tutorialReady, showTutorial, level.instructionKey, instruction]);

  useEffect(() => {
    setHadErrorThisExercise(false);
    setExerciseMistakes(0);
    setScaffoldPhase(false);
    setSelection(null);
  }, [currentExercise]);

  useEffect(() => {
    if (level.id !== 1) {
      setTutorialReady(true);
      return;
    }
    AsyncStorage.getItem(TUTORIAL_STORAGE_KEY).then((seen) => {
      if (!seen) {
        setShowTutorial(true);
        setTutorialReady(false);
      } else {
        setTutorialReady(true);
      }
    });
  }, [level.id]);

  const dismissTutorial = async () => {
    stop();
    setShowTutorial(false);
    setTutorialReady(true);
    await AsyncStorage.setItem(TUTORIAL_STORAGE_KEY, TUTORIAL_VERSION);
  };

  const leaveExercise = useCallback(() => {
    playbackGenRef.current += 1;
    feedbackGenRef.current += 1;
    stopRef.current();
    allowLeaveRef.current = true;
    navigation.goBack();
  }, [navigation]);

  const confirmLeave = useCallback(() => {
    if (allowLeaveRef.current) {
      leaveExercise();
      return;
    }
    Alert.alert('¿Salir del nivel?', 'Perderás el progreso de esta partida.', [
      { text: 'Seguir jugando', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: leaveExercise,
      },
    ]);
  }, [leaveExercise]);

  // Confirmación de salida: header + BackHandler (beforeRemove en native-stack es frágil).
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (allowLeaveRef.current) return false;
      confirmLeave();
      return true;
    });
    return () => sub.remove();
  }, [confirmLeave]);

  const finishLevel = async (firstTry, mistakes) => {
    // Sin audio aquí: CelebrationScreen dice «¡Genial! Tres estrellas.» (o 2 / sigue practicando).
    const stars = calculateStars(firstTry, exercises.length);
    await saveProgress(level.id, stars);

    try {
      const keys = extractContentKeysFromExercises(exercises);
      await recordSeenKeys(level.id, keys);
    } catch {
      // no romper la celebración por un fallo de persistencia
    }

    const mergedCompleted = [...new Set([...completedLevels, level.id])];
    let triggerFinalCelebration = false;
    if (hasCompletedAllLevels(mergedCompleted, premiumActive)) {
      const seen = await AsyncStorage.getItem(FINAL_CELEBRATION_STORAGE_KEY);
      triggerFinalCelebration = !seen;
    }

    const playableLevels = getPlayableLevels(premiumActive);
    const currentIndex = playableLevels.findIndex((item) => item.id === level.id);
    const nextLevel =
      currentIndex >= 0 && currentIndex < playableLevels.length - 1
        ? playableLevels[currentIndex + 1]
        : null;

    allowLeaveRef.current = true;
    navigation.replace('Celebration', {
      level,
      levelName: level.name,
      nextLevel,
      firstTryCorrect: firstTry,
      mistakeCount: mistakes,
      totalExercises: exercises.length,
      triggerFinalCelebration,
    });
  };

  const clearFeedbackTimer = () => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  };

  const resolveFeedback = async () => {
    if (!feedbackBusyRef.current) return;
    feedbackBusyRef.current = false;
    clearFeedbackTimer();
    setShowMascot(false);
    const action = feedbackActionRef.current;
    feedbackActionRef.current = null;
    if (action) await action();
  };

  /** Espera a que termine el audio real; luego cierra el modal (sin cortar la frase). */
  const showFeedback = ({ variant, message, key, action, holdAfterMs = 400 }) => {
    clearFeedbackTimer();
    const gen = ++feedbackGenRef.current;
    // Cancela autoplay del estímulo mientras suena el feedback
    playbackGenRef.current += 1;
    feedbackBusyRef.current = true;
    feedbackActionRef.current = action;
    setMascotVariant(variant);
    setMascotMessage(message);
    setShowMascot(true);

    (async () => {
      try {
        await playFeedback(key, message);
      } catch {
        // ignore
      }
      if (gen !== feedbackGenRef.current) return;
      feedbackTimerRef.current = setTimeout(() => {
        if (gen !== feedbackGenRef.current) return;
        resolveFeedback();
      }, holdAfterMs);
    })();
  };

  useEffect(
    () => () => {
      feedbackGenRef.current += 1;
      playbackGenRef.current += 1;
      clearFeedbackTimer();
      feedbackBusyRef.current = false;
      feedbackActionRef.current = null;
    },
    []
  );

  const handleSuccess = () => {
    const earnedFirstTry = !hadErrorThisExercise;
    const updatedFirstTry = firstTryCorrectCount + (earnedFirstTry ? 1 : 0);
    if (earnedFirstTry) {
      setFirstTryCorrectCount(updatedFirstTry);
    }
    const feedback = pickRandomFeedback('success');
    const exerciseIndex = currentExercise;
    const total = exercises.length;
    const isLastExercise = exerciseIndex >= total - 1;

    // Último ejercicio: no decir «¡Genial!» aquí; el cierre lo hace la celebración (estrellas).
    if (isLastExercise) {
      finishLevel(updatedFirstTry, mistakeCount);
      return;
    }

    showFeedback({
      variant: successMascotVariant(feedback.key),
      message: feedback.message,
      key: feedback.key,
      action: async () => {
        setCurrentExercise((prev) => prev + 1);
        setSelection(null);
      },
    });
  };

  const handleOptionPress = (option) => {
    if (!exercise) return;

    if (scaffoldPhase) {
      if (!isExerciseCorrect(exercise, option)) return;
      setSelection(option);
      hapticSuccess();
      handleSuccess();
      return;
    }

    if (selection || feedbackBusyRef.current) return;

    setSelection(option);
    const correct = isExerciseCorrect(exercise, option);

    if (correct) {
      hapticSuccess();
      handleSuccess();
      return;
    }

    hapticErrorSoft();
    const nextMistakes = exerciseMistakes + 1;
    setHadErrorThisExercise(true);
    setMistakeCount((count) => count + 1);
    setExerciseMistakes(nextMistakes);

    const threshold = getHintThreshold(exercise.options?.length ?? 4);

    if (nextMistakes >= threshold) {
      const scaffold = pickRandomFeedback('scaffold');
      showFeedback({
        variant: 'normal',
        message: scaffold.message,
        key: scaffold.key,
        action: async () => {
          setSelection(null);
          setScaffoldPhase(true);
          await playKey('ui/toca_la_tarjeta_verde', {
            speechMode: 'word',
            fallbackText: 'Toca la tarjeta verde.',
          });
        },
      });
    } else {
      const retry = pickRandomFeedback('retry');
      showFeedback({
        variant: 'cheer',
        message: retry.message,
        key: retry.key,
        action: () => {
          setSelection(null);
        },
      });
    }
  };

  const selectedKey = exercise ? getSelectionKey(exercise, selection) : null;
  const correctKey = exercise ? getCorrectKey(exercise) : null;

  const optionCardProps = (key) => ({
    isSelected: selectedKey === key,
    isCorrect: key === correctKey,
    isHint: scaffoldPhase && key === correctKey,
    pulseHint: scaffoldPhase,
    dimmed: scaffoldPhase && key !== correctKey,
    disabled: scaffoldPhase ? key !== correctKey : selection !== null,
  });

  const listenAccessibilityLabel = useMemo(() => {
    if (!exercise) return 'Escuchar';
    if (exercise.type === 'identify-phoneme' || exercise.type === 'choose-word') {
      return 'Escuchar el sonido';
    }
    if (exercise.word?.word) return `Escuchar ${exercise.word.word}`;
    if (exercise.sentence?.text) return `Escuchar ${exercise.sentence.text}`;
    return 'Escuchar';
  }, [exercise]);

  const listenWidth = Math.min(
    exerciseUi.listenMaxWidth,
    Math.max(240, innerWidth - spacing.md * 2)
  );
  const listenMinHeight = isPortraitPhone
    ? Math.min(exerciseUi.listenMinHeight, 58)
    : exerciseUi.listenMinHeight;

  const renderListenButton = (label = 'Escuchar') => (
    <View style={[styles.listenBlock, { marginBottom: layoutSpacing.listen }]}>
      <PrimaryButton
        title={label}
        variant="accent"
        size="lg"
        iconType="speaker"
        speaking={isPlaying}
        fitTitle={false}
        onPress={playExerciseAudio}
        accessibilityLabel={listenAccessibilityLabel}
        accessibilityHint={
          isPlaying ? 'Reproduciendo audio' : 'Reproduce el audio del ejercicio'
        }
        style={[
          styles.listenButton,
          {
            width: listenWidth,
            maxWidth: listenWidth,
            minHeight: listenMinHeight,
            paddingVertical: isPortraitPhone ? 10 : 14,
          },
        ]}
        textStyle={styles.listenButtonText}
      />
    </View>
  );

  const companionSize = isTablet
    ? exerciseUi.companionSizeTablet
    : isLandscape
      ? exerciseUi.companionSizeLandscape
      : isPortraitPhone
        ? Math.min(exerciseUi.companionSize, 78)
        : exerciseUi.companionSize;

  const companionBottomPad =
    isPortraitPhone || isTablet || (isLandscape && isPhone)
      ? companionSize + (isTablet ? 28 : 12) + Math.max(0, insets.bottom)
      : 0;

  const renderVisualGrid = (children) => (
    <View
      style={[
        styles.visualGrid,
        {
          gap: visualGridGap,
          width: visualGridCardWidth * visualCols + visualGridGap * Math.max(visualCols - 1, 0),
          maxWidth: '100%',
        },
      ]}
    >
      {React.Children.map(children, (child) =>
        child ? (
          <View
            style={{
              width: visualGridCardWidth,
              maxWidth: visualGridCardWidth,
              flexGrow: 0,
              flexShrink: 0,
            }}
          >
            {child}
          </View>
        ) : null
      )}
    </View>
  );

  const renderLetterOptionsRow = (children) => (
    <View
      style={[
        styles.letterOptionsRow,
        isLandscape && styles.letterOptionsRowLandscape,
        {
          gap: letterGap,
          width: letterCardWidth * letterCols + letterGap * Math.max(letterCols - 1, 0),
          maxWidth: '100%',
        },
      ]}
    >
      {React.Children.map(children, (child) =>
        child ? (
          <View
            style={{
              width: letterCardWidth,
              maxWidth: letterCardWidth,
              flexGrow: 0,
              flexShrink: 0,
            }}
          >
            {child}
          </View>
        ) : null
      )}
    </View>
  );

  const renderLetterOptions = () =>
    renderLetterOptionsRow(
      exercise.options.map((letter) => {
        const key = letter.id;
        const card = optionCardProps(key);
        const colorKey = String(key ?? letter.uppercase ?? '')
          .toLowerCase()
          .replace(/^letter_/, '');
        return (
          <LetterOptionCard
            key={key}
            letter={letter}
            color={letterColorMap[colorKey]}
            width={letterCardWidth}
            height={letterCardHeight}
            fonts={fonts}
            {...card}
            onPress={() => handleOptionPress(letter)}
          />
        );
      })
    );

  const renderAssociationOptions = () =>
    renderVisualGrid(
      exercise.options.map((option) => {
        const key = option.audioKey;
        const card = optionCardProps(key);
        return (
          <AssociationOptionCard
            key={key}
            option={option}
            width={visualGridCardWidth}
            height={visualGridCardHeight}
            fonts={fonts}
            {...card}
            onPress={() => handleOptionPress(option)}
          />
        );
      })
    );

  const renderWordOptions = (options = exercise.options, showLabel = true) =>
    renderVisualGrid(
      options.map((word) => {
        const key = word.audioKey;
        const card = optionCardProps(key);
        return (
          <WordOptionCard
            key={key}
            word={word}
            width={visualGridCardWidth}
            height={visualGridCardHeight}
            fonts={fonts}
            showLabel={showLabel}
            {...card}
            onPress={() => handleOptionPress(word)}
          />
        );
      })
    );

  const renderSentenceOptions = () =>
    renderVisualGrid(
      exercise.options.map((sentence) => {
        const key = sentence.id;
        const card = optionCardProps(key);
        return (
          <SentenceOptionCard
            key={key}
            sentence={sentence}
            width={visualGridCardWidth}
            height={visualGridCardHeight}
            fonts={fonts}
            imageOnly
            {...card}
            onPress={() => handleOptionPress(sentence)}
          />
        );
      })
    );

  const renderSyllableOptions = () =>
    renderLetterOptionsRow(
      exercise.options.map((count, index) => {
        const card = optionCardProps(count);
        return (
          <SyllableCountOptionCard
            key={`syllable-${count}-${index}`}
            count={count}
            width={letterCardWidth}
            height={letterCardHeight}
            fonts={fonts}
            {...card}
            onPress={() => handleOptionPress(count)}
          />
        );
      })
    );

  const renderSyllableTextOptions = () =>
    renderLetterOptionsRow(
      exercise.options.map((syllable, index) => {
        const card = optionCardProps(syllable);
        const colorKey = String(syllable ?? '')
          .toLowerCase()
          .replace(/^letter_/, '');
        return (
          <SyllableTextOptionCard
            key={`syl-text-${syllable}-${index}`}
            syllable={syllable}
            color={letterColorMap[colorKey]}
            width={letterCardWidth}
            height={letterCardHeight}
            fonts={fonts}
            {...card}
            onPress={() => handleOptionPress(syllable)}
          />
        );
      })
    );

  const renderExerciseBody = () => {
    if (!exercise) {
      return (
        <Text style={[styles.fallback, fonts.body, { fontFamily: 'Nunito_600SemiBold' }]}>
          Este nivel estará disponible pronto.
        </Text>
      );
    }

    switch (exercise.type) {
      case 'identify-phoneme':
        return (
          <>
            {renderListenButton()}
            {renderLetterOptions()}
          </>
        );
      case 'associate-word':
        return (
          <>
            {renderListenButton()}
            {renderAssociationOptions()}
          </>
        );
      case 'choose-word':
        return (
          <>
            {renderListenButton()}
            {renderWordOptions(exercise.options, true)}
          </>
        );
      case 'identify-initial':
      case 'identify-final':
        return (
          <>
            <StimulusWordCard
              word={exercise.word}
              partialWord={exercise.partialWord}
              fonts={fonts}
              compact={compactStimulus}
              showWordText={false}
              style={{ marginBottom: layoutSpacing.stimulus }}
            />
            {renderListenButton('Escuchar')}
            {renderLetterOptions()}
          </>
        );
      case 'syllable-count':
        return (
          <>
            <StimulusWordCard
              word={exercise.word}
              fonts={fonts}
              compact={compactStimulus}
              showWordText={false}
              style={{ marginBottom: layoutSpacing.stimulus }}
            />
            {renderListenButton('Escuchar')}
            {renderSyllableOptions()}
          </>
        );
      case 'identify-initial-syllable':
        return (
          <>
            <StimulusWordCard
              word={exercise.word}
              fonts={fonts}
              compact={compactStimulus}
              showWordText={false}
              style={{ marginBottom: layoutSpacing.stimulus }}
            />
            {renderListenButton('Escuchar')}
            {renderSyllableTextOptions()}
          </>
        );
      case 'complete-word':
      case 'complete-word-final':
      case 'complete-word-middle':
        return (
          <>
            <StimulusWordCard
              word={exercise.word}
              partialWord={exercise.partialWord}
              fonts={fonts}
              compact={compactStimulus}
              style={{ marginBottom: layoutSpacing.stimulus }}
            />
            {renderListenButton('Escuchar')}
            {renderLetterOptions()}
          </>
        );
      case 'alliteration':
      case 'same-sound':
        return (
          <>
            <StimulusWordCard
              word={exercise.anchor}
              fonts={fonts}
              compact={compactStimulus}
              showWordText={false}
              style={{ marginBottom: layoutSpacing.stimulus }}
            />
            {renderListenButton('Escuchar')}
            {renderWordOptions(exercise.options, false)}
          </>
        );
      case 'rhyme':
        return (
          <>
            <StimulusWordCard
              word={exercise.anchor}
              fonts={fonts}
              compact={compactStimulus}
              showWordText={false}
              style={{ marginBottom: layoutSpacing.stimulus }}
            />
            {renderListenButton('Escuchar')}
            {renderWordOptions(exercise.options, true)}
          </>
        );
      case 'phoneme-blend':
        return (
          <>
            <View style={{ marginBottom: layoutSpacing.stimulus, width: '100%' }}>
              <BlendPromptCard blendLabel={exercise.blendLabel} fonts={fonts} />
            </View>
            {renderListenButton('Escuchar')}
            {renderWordOptions(exercise.options, false)}
          </>
        );
      case 'short-sentences':
        return (
          <>
            {renderListenButton('Escuchar')}
            {renderSentenceOptions()}
          </>
        );
      case 'read-sentence':
        return (
          <>
            <View style={{ marginBottom: layoutSpacing.stimulus, width: '100%' }}>
              <PromptSentenceCard
                sentence={exercise.sentence}
                fonts={fonts}
                compact={compactStimulus}
              />
            </View>
            {renderListenButton('Escuchar')}
            {renderSentenceOptions()}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ScreenLayout
      edges={['top', 'right', 'bottom', 'left']}
      scroll={exerciseScroll}
      overlay={
        !showMascot ? (
          <View
            style={[
              styles.companionWrap,
              {
                right: Math.max(8, insets.right + (isTablet ? 16 : isLandscape ? 12 : 8)),
                bottom: Math.max(8, insets.bottom + (isTablet ? 16 : isLandscape ? 10 : 8)),
              },
            ]}
            pointerEvents="none"
            accessible
            accessibilityLabel="Mascota compañera"
            accessibilityRole="image"
          >
            <MascotImage variant="listen" size={companionSize} />
          </View>
        ) : null
      }
      contentStyle={!exerciseScroll ? styles.contentPortraitFit : undefined}
    >
      <AppHeader title={level.name} onBack={confirmLeave} mutedTitle />

      <SessionProgress
        current={currentExercise + 1}
        total={exercises.length || 1}
        style={[styles.sessionProgress, { marginBottom: layoutSpacing.progress }]}
        accessibilityLabel={`Ejercicio ${currentExercise + 1} de ${exercises.length || 1}`}
      />

      <View style={[styles.stage, exerciseScroll && styles.stageScroll]}>
        <View
          style={[
            styles.stageInner,
            isLandscape && styles.stageInnerLandscape,
            isTablet && styles.stageInnerTablet,
            // Solo tablet portrait: reparte altura. Móvil vertical se deja como estaba (OK).
            !exerciseScroll && isTablet && styles.stageInnerDistribute,
            exerciseScroll && styles.stageInnerScroll,
            companionBottomPad > 0 && { paddingBottom: companionBottomPad },
          ]}
        >
          <View
            style={[
              styles.prompt,
              {
                marginBottom: layoutSpacing.prompt,
                marginTop: spacing.xs,
                maxWidth: isLandscape ? innerWidth : Math.min(520, innerWidth),
              },
              isTablet && styles.promptTablet,
              shadows.soft,
            ]}
            accessible
            accessibilityRole="summary"
            accessibilityLabel={instruction}
          >
            <View style={styles.promptAccent} />
            <Text style={styles.promptEyebrow} accessibilityElementsHidden>
              Tu reto
            </Text>
            <Text style={styles.instruction} accessibilityRole="header">
              {instruction}
            </Text>
            {scaffoldPhase ? (
              <Text style={styles.scaffoldCue} accessibilityLiveRegion="polite">
                Toca la tarjeta verde
              </Text>
            ) : null}
          </View>

          <View
            style={[
              styles.interaction,
              centerInteraction && styles.interactionCentered,
              isLandscape && styles.interactionLandscape,
              isTablet && styles.interactionTablet,
            ]}
          >
            {renderExerciseBody()}
          </View>
        </View>
      </View>

      <Mascot
        visible={showMascot}
        message={mascotMessage}
        variant={mascotVariant}
        onDismiss={resolveFeedback}
      />
      <ExerciseTutorial visible={showTutorial} onFinish={dismissTutorial} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
  },
  stageScroll: {
    flexGrow: 1,
  },
  stageInner: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingBottom: spacing.sm,
  },
  stageInnerDistribute: {
    justifyContent: 'space-evenly',
  },
  stageInnerLandscape: {
    justifyContent: 'center',
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  stageInnerTablet: {
    maxWidth: '100%',
    alignSelf: 'center',
    paddingBottom: spacing.xl + 16,
    gap: spacing.md,
  },
  stageInnerScroll: {
    flex: undefined,
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  prompt: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: exerciseUi.promptPadH,
    paddingTop: exerciseUi.promptPadTop,
    paddingBottom: exerciseUi.promptPadBottom,
    backgroundColor: exerciseUi.instructionPanelBg,
    borderRadius: radius.xl,
    borderWidth: 2.5,
    borderColor: exerciseUi.instructionPanelBorder,
    overflow: 'hidden',
  },
  promptTablet: {
    maxWidth: '100%',
  },
  promptAccent: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: exerciseUi.promptAccentWidth,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: exerciseUi.instructionAccent,
  },
  promptEyebrow: {
    fontFamily: fonts.kidsSemi,
    fontSize: exerciseUi.eyebrowSize,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: exerciseUi.instructionEyebrow,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  instruction: {
    ...typographyScale.instruction,
    fontFamily: fonts.kidsSemi,
    color: textColors.heading,
    textAlign: 'center',
  },
  scaffoldCue: {
    color: colors.success,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontFamily: fonts.kids,
    fontSize: 16,
  },
  listenBlock: {
    width: '100%',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  sessionProgress: {
    marginTop: spacing.xs,
  },
  listenButton: {
    alignSelf: 'center',
  },
  listenButtonText: {
    fontSize: exerciseUi.listenFontSize,
    lineHeight: exerciseUi.listenFontSize + 4,
    letterSpacing: 0.2,
  },
  interaction: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: spacing.sm,
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  interactionCentered: {
    justifyContent: 'center',
    paddingTop: 0,
  },
  interactionLandscape: {
    flexGrow: 0,
  },
  interactionTablet: {
    width: '100%',
    maxWidth: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  companionWrap: {
    position: 'absolute',
    zIndex: 8,
    opacity: 1,
  },
  letterOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    alignSelf: 'center',
  },
  letterOptionsRowLandscape: {
    flexWrap: 'nowrap',
  },
  visualGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  fallback: {
    color: colors.navy,
    textAlign: 'center',
    fontFamily: fonts.kidsSemi,
  },
  contentPortraitFit: {
    paddingBottom: spacing.sm,
  },
});
