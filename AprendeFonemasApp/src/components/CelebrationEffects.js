import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { confettiPalette, motionLayout, spacing } from '../theme';
import { useReduceMotion } from '../hooks/useReduceMotion';

function fallCountFor(intensity, screenW, screenH) {
  const shortSide = Math.min(screenW, screenH);
  // Pantallas chicas: menos partículas
  const lowEnd = shortSide < 360;
  if (intensity === 'grand') return lowEnd ? 32 : 48;
  if (intensity === 'strong') return lowEnd ? 24 : 36;
  return lowEnd ? 18 : 28;
}

function makeFallPieces(count, screenW) {
  const min = motionLayout.confettiPieceMin;
  const max = motionLayout.confettiPieceMax;
  const span = Math.max(max - min, 1);
  const stagger = motionLayout.confettiStaggerMs;
  return Array.from({ length: count }, (_, i) => {
    const lane = i / Math.max(count - 1, 1);
    return {
      id: `f-${i}`,
      color: confettiPalette[i % confettiPalette.length],
      size: min + (i % (span + 1)),
      startX: screenW * (0.04 + lane * 0.92) + ((i % 5) - 2) * spacing.sm,
      drift: ((i % 9) - 4) * (spacing.xl + spacing.xs),
      // Salida escalonada a lo largo de todo el stagger: lluvia continua, no bloque.
      delayMs: ((i * 7) % 12) * (stagger / 12),
      // Cada pieza cae a su ritmo (±15 %): más natural, menos "cortina".
      pieceMs: motionLayout.confettiDurationMs * (0.85 + ((i * 5) % 4) * 0.1),
      spin: i % 2 === 0 ? 1 : -1,
      round: i % 4 !== 0,
      tall: i % 3 === 0,
    };
  });
}

function makeBurstPieces(burstIndex, screenW, screenH) {
  const count = motionLayout.fireworksPiecesPerBurst;
  const originX = screenW * (0.22 + (burstIndex % 3) * 0.28);
  const originY = screenH * (0.28 + (burstIndex % 2) * 0.18);
  const spreadMin = motionLayout.fireworksSpreadMin;
  const spreadMax = motionLayout.fireworksSpreadMax;
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + burstIndex * 0.4;
    const dist = spreadMin + (i % 5) * ((spreadMax - spreadMin) / 4);
    return {
      id: `b-${burstIndex}-${i}`,
      burstIndex,
      color: confettiPalette[(i + burstIndex * 3) % confettiPalette.length],
      size: motionLayout.confettiPieceMin + (i % 5) * 2,
      originX,
      originY,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist - spreadMin * 0.35,
      spin: i % 2 === 0 ? 1 : -1,
      round: i % 3 !== 0,
    };
  });
}

function fireworksTotalMs() {
  return (
    motionLayout.fireworksDurationMs +
    (motionLayout.fireworksBurstCount - 1) * motionLayout.fireworksBurstStaggerMs
  );
}

function FallPiece({ piece, progress, totalMs, screenH }) {
  const fall = screenH * motionLayout.confettiFallRatio;
  // Ventana propia dentro del ciclo total: [salida, aterrizaje] por pieza.
  const start = Math.min(piece.delayMs / Math.max(totalMs, 1), 0.6);
  const end = Math.min((piece.delayMs + piece.pieceMs) / Math.max(totalMs, 1), 1);
  const local = progress.interpolate({
    inputRange: [0, start, end, 1],
    outputRange: [0, 0, 1, 1],
    extrapolate: 'clamp',
  });
  const translateY = local.interpolate({
    inputRange: [0, 1],
    outputRange: [-spacing.xxl, fall],
  });
  // Balanceo en S (vaivén), no deriva recta: caída de confeti real.
  const translateX = local.interpolate({
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: [0, piece.drift * 0.6, piece.drift * 0.3, piece.drift],
  });
  const opacity = local.interpolate({
    inputRange: [0, 0.06, 0.85, 1],
    outputRange: [0, 1, 1, 0],
  });
  const rotate = local.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${piece.spin * 420}deg`],
  });
  const scale = local.interpolate({
    inputRange: [0, 0.12, 0.55, 1],
    outputRange: [0.35, 1.1, 1.02, 0.85],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.piece,
        {
          left: piece.startX,
          top: spacing.xs,
          width: piece.size,
          height: piece.tall ? piece.size * 1.55 : piece.round ? piece.size : piece.size * 1.35,
          borderRadius: piece.round ? piece.size / 2 : piece.size / 5,
          backgroundColor: piece.color,
          opacity,
          transform: [{ translateY }, { translateX }, { rotate }, { scale }],
        },
      ]}
    />
  );
}

function BurstPiece({ piece, progress, totalMs }) {
  const windowStart =
    (piece.burstIndex * motionLayout.fireworksBurstStaggerMs) / Math.max(totalMs, 1);
  const windowEnd = Math.min(
    windowStart + motionLayout.fireworksDurationMs / Math.max(totalMs, 1),
    1
  );
  const local = progress.interpolate({
    inputRange: [0, windowStart, windowEnd, 1],
    outputRange: [0, 0, 1, 1],
    extrapolate: 'clamp',
  });
  const translateX = local.interpolate({
    inputRange: [0, 1],
    outputRange: [0, piece.dx],
  });
  const translateY = local.interpolate({
    inputRange: [0, 1],
    outputRange: [0, piece.dy],
  });
  const opacity = local.interpolate({
    inputRange: [0, 0.12, 0.55, 1],
    outputRange: [0, 1, 1, 0],
  });
  const scale = local.interpolate({
    inputRange: [0, 0.2, 0.7, 1],
    outputRange: [0.3, 1.15, 1.0, 0.4],
  });
  const rotate = local.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${piece.spin * 320}deg`],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.piece,
        {
          left: piece.originX,
          top: piece.originY,
          width: piece.size,
          height: piece.round ? piece.size : piece.size * 1.4,
          borderRadius: piece.round ? piece.size / 2 : piece.size / 5,
          backgroundColor: piece.color,
          opacity,
          transform: [{ translateX }, { translateY }, { scale }, { rotate }],
        },
      ]}
    />
  );
}

/** Confeti en caída; fuegos solo con intensity="grand". */
export default function CelebrationEffects({
  active = true,
  intensity = 'normal',
  style,
}) {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const reduceMotion = useReduceMotion();
  const fallProgress = useRef(new Animated.Value(0)).current;
  const burstProgress = useRef(new Animated.Value(0)).current;
  const [showBursts, setShowBursts] = useState(false);
  const withFireworks = intensity === 'grand';
  const totalBurstMs = fireworksTotalMs();
  const lightMode = reduceMotion;

  const fallPieces = useMemo(
    () => {
      const count = lightMode
        ? Math.max(8, Math.floor(fallCountFor(intensity, screenW, screenH) * 0.35))
        : fallCountFor(intensity, screenW, screenH);
      return makeFallPieces(count, screenW);
    },
    [intensity, screenW, screenH, lightMode]
  );
  const burstPieces = useMemo(() => {
    if (!withFireworks) return [];
    const bursts = [];
    for (let b = 0; b < motionLayout.fireworksBurstCount; b += 1) {
      bursts.push(...makeBurstPieces(b, screenW, screenH));
    }
    return bursts;
  }, [withFireworks, screenW, screenH]);

  useEffect(() => {
    if (!active) {
      fallProgress.setValue(0);
      burstProgress.setValue(0);
      setShowBursts(false);
      return undefined;
    }

    let cancelled = false;
    fallProgress.setValue(0);
    burstProgress.setValue(0);
    setShowBursts(false);

    // lightMode: menos piezas; duración y fuegos se mantienen.
    const fallDuration = motionLayout.confettiDurationMs + motionLayout.confettiStaggerMs;

    const fall = Animated.timing(fallProgress, {
      toValue: 1,
      duration: fallDuration,
      useNativeDriver: true,
    });
    fall.start();

    // Gran final: fuegos solapados con el confeti (también con reduce motion).
    let burstTimer = null;
    if (withFireworks) {
      burstTimer = setTimeout(() => {
        if (cancelled) return;
        setShowBursts(true);
        burstProgress.setValue(0);
        Animated.timing(burstProgress, {
          toValue: 1,
          duration: totalBurstMs,
          useNativeDriver: true,
        }).start();
      }, Math.round(fallDuration * 0.45));
    }

    return () => {
      cancelled = true;
      fall.stop();
      if (burstTimer) clearTimeout(burstTimer);
      burstProgress.stopAnimation();
    };
  }, [active, fallProgress, burstProgress, lightMode, withFireworks, totalBurstMs]);

  if (!active) return null;

  return (
    <View style={[styles.layer, style]} pointerEvents="none" importantForAccessibility="no">
      {fallPieces.map((piece) => (
        <FallPiece
          key={piece.id}
          piece={piece}
          progress={fallProgress}
          totalMs={motionLayout.confettiDurationMs + motionLayout.confettiStaggerMs}
          screenH={screenH}
        />
      ))}
      {showBursts
        ? burstPieces.map((piece) => (
            <BurstPiece
              key={piece.id}
              piece={piece}
              progress={burstProgress}
              totalMs={totalBurstMs}
            />
          ))
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 4,
  },
  piece: {
    position: 'absolute',
  },
});
