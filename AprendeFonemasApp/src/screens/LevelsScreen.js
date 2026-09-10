import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';
import LevelCard from '../components/LevelCard';
import MascotImage from '../components/MascotImage';
import ProgressRing from '../components/ProgressRing';
import FloatingCrown from '../components/icons/FloatingCrown';
import PressableScale from '../components/PressableScale';
import { LEVELS } from '../data/content';
import { useSettings } from '../context/SettingsContext';
import { useProgress } from '../hooks/useProgress';
import { useResponsive } from '../hooks/useResponsive';
import { getLevelJustCompleted, clearLevelJustCompleted } from '../utils/recentCompletion';
import {
  colors,
  fonts,
  getButtonTokens,
  levelsLayout,
  radius,
  spacing,
  textColors,
} from '../theme';

/** Pose de mascota según cuántos niveles llevas */
function getLevelsMascotVariant(completedCount, total) {
  if (total > 0 && completedCount >= total) return 'celebrate';
  if (completedCount <= 0) return 'normal';
  if (completedCount >= Math.ceil(total * 0.5)) return 'cheer';
  return 'thumbsUp';
}

function UnlockBanner({ onPress }) {
  const tokens = getButtonTokens('premium', 'md');
  return (
    <View style={styles.unlockWrap}>
      <FloatingCrown
        size={levelsLayout.unlockCrownSize}
        style={styles.unlockCrownBadge}
      />
      <PressableScale
        contentStyle={[
          styles.unlockBanner,
          tokens.shadow,
          {
            backgroundColor: tokens.backgroundColor,
            borderColor: tokens.borderColor,
            borderWidth: tokens.borderWidth,
          },
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Desbloquear todos los niveles premium"
        accessibilityHint="Abre la pantalla de suscripción"
      >
        <Text style={styles.unlockText} numberOfLines={2}>
          Desbloquea todos los niveles y aprende sin límites
        </Text>
      </PressableScale>
    </View>
  );
}

/** Mismo estilo premium, solo informativo (ya desbloqueado). */
function PremiumOpenBanner() {
  const tokens = getButtonTokens('premium', 'md');
  return (
    <View style={styles.unlockWrap}>
      <FloatingCrown
        size={levelsLayout.unlockCrownSize}
        style={styles.unlockCrownBadge}
      />
      <View
        style={[
          styles.unlockBanner,
          tokens.shadow,
          {
            backgroundColor: tokens.backgroundColor,
            borderColor: tokens.borderColor,
            borderWidth: tokens.borderWidth,
          },
        ]}
        accessible
        accessibilityRole="text"
        accessibilityLabel="Premium abierto, niveles desbloqueados"
      >
        <Text style={styles.unlockText} numberOfLines={2}>
          Premium abierto · niveles desbloqueados
        </Text>
      </View>
    </View>
  );
}

export default function LevelsScreen({ navigation }) {
  const { premiumActive } = useSettings();
  const {
    loading,
    getStatus,
    freeCompletedCount,
    premiumCompletedCount,
    playableLevels,
    reloadProgress,
  } = useProgress(premiumActive);
  const {
    levelCardWidth,
    levelGap,
    levelColumns,
    innerWidth,
    isTablet,
    isLandscape,
    isPhone,
  } = useResponsive();

  const [celebrateLevelId, setCelebrateLevelId] = useState(null);

  /** Ancho fijo floor(inner/cols) — nunca wrap a menos columnas al rotar. */
  const gridCardWidth = levelCardWidth;

  useFocusEffect(
    useCallback(() => {
      reloadProgress();
      const recent = getLevelJustCompleted();
      if (recent?.levelId) {
        setCelebrateLevelId(recent.levelId);
      }
    }, [reloadProgress])
  );

  useEffect(() => {
    if (!celebrateLevelId) return undefined;
    const timer = setTimeout(() => {
      setCelebrateLevelId(null);
      clearLevelJustCompleted();
    }, 1400);
    return () => clearTimeout(timer);
  }, [celebrateLevelId]);

  const goPremium = () => navigation.navigate('AdultGate');

  const handleLevelPress = (level) => {
    const status = getStatus(level);
    if (status === 'premium') {
      goPremium();
      return;
    }
    if (status === 'available' || status === 'completed') {
      navigation.navigate('Exercise', { level });
    }
  };

  const completedInView = premiumActive ? premiumCompletedCount : freeCompletedCount;
  const totalInView = premiumActive ? playableLevels.length : LEVELS.filter((l) => l.free).length;
  const progress = totalInView > 0 ? completedInView / totalInView : 0;
  const mascotVariant = celebrateLevelId
    ? 'celebrate'
    : getLevelsMascotVariant(completedInView, totalInView);

  const sizes = useMemo(() => {
    if (isTablet) {
      return { mascot: levelsLayout.mascotTablet, ring: levelsLayout.ringSizeTablet };
    }
    if (isPhone && isLandscape) {
      return { mascot: levelsLayout.mascotLandscape, ring: levelsLayout.ringSizeLandscape };
    }
    return { mascot: levelsLayout.mascotPhone, ring: levelsLayout.ringSizePhone };
  }, [isTablet, isPhone, isLandscape]);

  if (loading) {
    return (
      <ScreenLayout>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenLayout>
    );
  }

  const freeLevels = LEVELS.filter((l) => l.free);
  const premiumLevels = LEVELS.filter((l) => !l.free);
  const showUnlock = !premiumActive;

  const heroIntro = (
    <View style={[styles.heroIntro, isLandscape && styles.heroIntroLandscape]}>
      <MascotImage
        variant={mascotVariant}
        size={sizes.mascot}
        accessibilityLabel="Mascota animada"
      />
      <View
        style={[
          styles.heroPanel,
          isTablet && styles.heroPanelTablet,
          isLandscape && styles.heroPanelLandscape,
        ]}
        accessible
        accessibilityRole="summary"
        accessibilityLabel={`${completedInView} de ${totalInView} niveles completados, ${Math.round(progress * 100)} por ciento`}
      >
        <View style={styles.heroText}>
          <Text
            style={[
              styles.heroTitle,
              isTablet && {
                fontSize: levelsLayout.heroTitleSizeTablet,
                lineHeight: levelsLayout.heroTitleSizeTablet + 4,
              },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            accessibilityRole="header"
          >
            ¡Sigue aprendiendo!
          </Text>
          <Text
            style={[
              styles.heroSub,
              isTablet && {
                fontSize: levelsLayout.heroSubSizeTablet,
                lineHeight: levelsLayout.heroSubSizeTablet + 4,
              },
            ]}
            numberOfLines={2}
          >
            Has completado {completedInView} de {totalInView} niveles
          </Text>
        </View>
        <ProgressRing
          progress={progress}
          size={sizes.ring}
          showPanel={false}
          fillColor={levelsLayout.ringFill}
          trackColor={levelsLayout.ringTrack}
          textColor={levelsLayout.ringText}
          thickness={9}
        />
      </View>
    </View>
  );

  const renderGrid = (items, sectionKey, extraStyle) => (
    <View
      key={`levels-grid-${sectionKey}-${isLandscape ? 'land' : 'port'}-${levelColumns}`}
      style={[
        styles.grid,
        { gap: levelGap, width: innerWidth, maxWidth: innerWidth },
        extraStyle,
      ]}
    >
      {items.map((item) => (
        <View
          key={`${sectionKey}-${item.id}`}
          style={[
            styles.gridItem,
            {
              width: gridCardWidth,
              maxWidth: gridCardWidth,
              flexGrow: 0,
              flexShrink: 0,
            },
          ]}
        >
          <LevelCard
            level={item}
            status={getStatus(item)}
            onPress={() => handleLevelPress(item)}
            width={gridCardWidth}
            premiumOwned={premiumActive}
            celebrate={celebrateLevelId === Number(item.id)}
          />
        </View>
      ))}
    </View>
  );

  const unlockBlock = showUnlock ? (
    <View style={styles.unlockBlock}>
      <UnlockBanner onPress={goPremium} />
    </View>
  ) : (
    <View style={styles.unlockBlock}>
      <PremiumOpenBanner />
    </View>
  );

  const gridsBlock = (
    <View key={`levels-grids-${isLandscape ? 'land' : 'port'}-${levelColumns}`}>
      {renderGrid(freeLevels, 'free')}
      {unlockBlock}
      {renderGrid(premiumLevels, 'premium', { marginTop: spacing.sm })}
    </View>
  );

  return (
    <ScreenLayout
      scroll
      header={<AppHeader title="Niveles" onBack={() => navigation.goBack()} compact largeTitle />}
      contentStyle={isTablet ? styles.tabletBody : undefined}
    >
      <View
        style={[
          styles.stackFill,
          isTablet && styles.stackFillTablet,
          isLandscape && styles.stackFillLandscape,
        ]}
      >
        {heroIntro}
        {gridsBlock}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabletBody: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingVertical: spacing.lg,
  },
  stackFill: {
    width: '100%',
    flexGrow: 1,
    gap: levelsLayout.heroToGridGap,
  },
  stackFillTablet: {
    justifyContent: 'flex-start',
    gap: spacing.lg,
  },
  stackFillLandscape: {
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  heroIntro: {
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: 0,
    gap: spacing.sm,
    width: '100%',
    alignSelf: 'center',
  },
  heroIntroLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  heroPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: levelsLayout.heroPanelBg,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: levelsLayout.heroPanelBorder,
    elevation: 0,
  },
  heroPanelTablet: {
    maxWidth: 720,
    alignSelf: 'center',
    paddingVertical: spacing.lg,
  },
  heroPanelLandscape: {
    flex: 1,
    width: undefined,
    maxWidth: 560,
    alignSelf: 'center',
  },
  heroText: {
    flex: 1,
    minWidth: 0,
    gap: 6,
    justifyContent: 'center',
    paddingRight: spacing.xs,
  },
  heroTitle: {
    fontFamily: fonts.kids,
    fontSize: levelsLayout.heroTitleSize,
    lineHeight: 30,
    color: colors.navy,
  },
  heroSub: {
    fontFamily: fonts.kidsMed,
    fontSize: levelsLayout.heroSubSize,
    color: colors.navySoft,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
    width: '100%',
    // Centrado: la última fila incompleta (1 gratis / 2 premium con 3 columnas)
    // queda equilibrada en vez de colgar a la izquierda.
    justifyContent: 'center',
    alignSelf: 'center',
  },
  gridItem: {
    marginBottom: 0,
  },
  unlockBlock: {
    width: '100%',
    alignSelf: 'center',
  },
  unlockWrap: {
    position: 'relative',
    width: '100%',
    maxWidth: '100%',
    overflow: 'visible',
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
    alignSelf: 'center',
  },
  unlockCrownBadge: {
    position: 'absolute',
    top: levelsLayout.unlockCrownTop,
    right: levelsLayout.unlockCrownRight,
    zIndex: 3,
  },
  unlockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.xl,
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.lg,
    paddingRight: spacing.xl + 20,
    width: '100%',
  },
  unlockText: {
    flex: 1,
    fontFamily: fonts.kidsSemi,
    fontSize: 15,
    color: textColors.onPrimary,
    lineHeight: 20,
  },
});
