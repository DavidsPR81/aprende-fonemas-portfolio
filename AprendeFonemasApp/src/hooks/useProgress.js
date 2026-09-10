import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LEVELS } from '../data/content';
import { UNLOCK_ALL_LEVELS_FOR_REVIEW } from '../config/review';
import { FINAL_CELEBRATION_STORAGE_KEY } from '../config/appConfig';
import { markLevelJustCompleted } from '../utils/recentCompletion';
import {
  PROGRESS_SCHEMA_KEY,
  PROGRESS_SCHEMA_VERSION,
  migrateCompletedLevelIds,
  migrateLevelStarsMap,
} from '../utils/progressMigration';

const STORAGE_KEY = '@aprende_fonemas_progress';
const STARS_KEY = '@aprende_fonemas_level_stars';

export function hasCompletedAllLevels(completedLevels, isPremium = false) {
  if (!isPremium) return false;
  return LEVELS.every((level) => completedLevels.includes(level.id));
}

export function getTotalStars(levelStars, levels = LEVELS) {
  return levels.reduce((sum, level) => sum + (levelStars[level.id] ?? 0), 0);
}

export function getPlayableLevels(isPremium = false) {
  return LEVELS.filter((level) => level.free || isPremium);
}

export function getLevelStatus(level, completedLevels, isPremium = false) {
  const levelId = Number(level.id);
  const doneIds = completedLevels.map((id) => Number(id));

  if (!level.free && !isPremium) return 'premium';
  if (doneIds.includes(levelId)) return 'completed';

  // Niveles 1–4 gratis: siempre jugables (sin cadena de bloqueo)
  if (level.free) return 'available';

  if (UNLOCK_ALL_LEVELS_FOR_REVIEW && isPremium) {
    return 'available';
  }

  const premiumLevels = LEVELS.filter((item) => !item.free);
  const index = premiumLevels.findIndex((item) => Number(item.id) === levelId);

  if (index <= 0) return 'available';

  const previousLevel = premiumLevels[index - 1];
  if (previousLevel && doneIds.includes(Number(previousLevel.id))) {
    return 'available';
  }

  return 'locked';
}

export const useProgress = (premiumActive = false) => {
  const isPremium = Boolean(premiumActive);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [levelStars, setLevelStars] = useState({});
  const [finalCelebrationSeen, setFinalCelebrationSeen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    try {
      const [savedProgress, savedStars, finalSeen, schemaRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(STARS_KEY),
        AsyncStorage.getItem(FINAL_CELEBRATION_STORAGE_KEY),
        AsyncStorage.getItem(PROGRESS_SCHEMA_KEY),
      ]);

      const fromVersion = schemaRaw ? Number(schemaRaw) || 1 : 1;
      let completed = [];
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        completed = Array.isArray(parsed)
          ? parsed.map((id) => Number(id)).filter((id) => !Number.isNaN(id))
          : [];
      }
      let stars = {};
      if (savedStars) {
        stars = JSON.parse(savedStars) || {};
      }

      if (fromVersion < PROGRESS_SCHEMA_VERSION) {
        completed = migrateCompletedLevelIds(completed, fromVersion);
        stars = migrateLevelStarsMap(stars, fromVersion);
        await AsyncStorage.multiSet([
          [STORAGE_KEY, JSON.stringify(completed)],
          [STARS_KEY, JSON.stringify(stars)],
          [PROGRESS_SCHEMA_KEY, String(PROGRESS_SCHEMA_VERSION)],
        ]);
      }

      setCompletedLevels(completed);
      setLevelStars(stars);
      setFinalCelebrationSeen(finalSeen === '1');
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const saveProgress = async (levelId, stars = 3) => {
    try {
      const savedProgress = await AsyncStorage.getItem(STORAGE_KEY);
      const current = savedProgress ? JSON.parse(savedProgress) : [];
      const newCompletedLevels = [...new Set([...current, levelId])];
      setCompletedLevels(newCompletedLevels);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCompletedLevels));

      const savedStars = await AsyncStorage.getItem(STARS_KEY);
      const starsMap = savedStars ? JSON.parse(savedStars) : {};
      const prev = starsMap[levelId] ?? 0;
      starsMap[levelId] = Math.max(prev, stars);
      setLevelStars(starsMap);
      await AsyncStorage.setItem(STARS_KEY, JSON.stringify(starsMap));
      await AsyncStorage.setItem(PROGRESS_SCHEMA_KEY, String(PROGRESS_SCHEMA_VERSION));
      markLevelJustCompleted(levelId, Math.max(prev, stars));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const resetProgress = async () => {
    try {
      setCompletedLevels([]);
      setLevelStars({});
      setFinalCelebrationSeen(false);
      await AsyncStorage.multiRemove([
        STORAGE_KEY,
        STARS_KEY,
        FINAL_CELEBRATION_STORAGE_KEY,
        PROGRESS_SCHEMA_KEY,
      ]);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  const markFinalCelebrationSeen = useCallback(async () => {
    try {
      await AsyncStorage.setItem(FINAL_CELEBRATION_STORAGE_KEY, '1');
      setFinalCelebrationSeen(true);
    } catch (error) {
      console.error('Error saving final celebration flag:', error);
    }
  }, []);

  const getStatus = (level) => getLevelStatus(level, completedLevels, isPremium);
  const getStars = (levelId) => levelStars[levelId] ?? 0;

  const completedCount = completedLevels.length;
  const playableLevels = getPlayableLevels(isPremium);
  const freeCompletedCount = LEVELS.filter(
    (level) => level.free && completedLevels.includes(level.id)
  ).length;
  const premiumCompletedCount = playableLevels.filter((level) =>
    completedLevels.includes(level.id)
  ).length;
  const allLevelsComplete = hasCompletedAllLevels(completedLevels, isPremium);
  const grandFinaleAchieved = allLevelsComplete && finalCelebrationSeen;

  return {
    completedLevels,
    levelStars,
    loading,
    saveProgress,
    resetProgress,
    reloadProgress: loadProgress,
    markFinalCelebrationSeen,
    getStatus,
    getStars,
    completedCount,
    freeCompletedCount,
    premiumCompletedCount,
    playableLevels,
    allLevelsComplete,
    finalCelebrationSeen,
    grandFinaleAchieved,
  };
};
