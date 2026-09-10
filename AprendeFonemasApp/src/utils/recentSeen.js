import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_PREFIX = '@recent_seen_level_';
const MAX_PER_LEVEL = 15;
const ROTATE_AFTER_MS = 24 * 60 * 60 * 1000;

function storageKeyForLevel(levelId) {
    return `${STORAGE_PREFIX}${levelId}`;
}

async function readBucket(levelId) {
    try {
        const raw = await AsyncStorage.getItem(storageKeyForLevel(levelId));
        if (!raw) return { items: [], recordedAt: 0 };
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.items)) return { items: [], recordedAt: 0 };
        return {
            items: parsed.items.filter((k) => typeof k === 'string'),
            recordedAt: typeof parsed.recordedAt === 'number' ? parsed.recordedAt : 0,
        };
    } catch {
        return { items: [], recordedAt: 0 };
    }
}

async function writeBucket(levelId, items, recordedAt = Date.now()) {
    try {
        const normalized = Array.from(new Set(items.filter((k) => typeof k === 'string' && k.length))).slice(
            -MAX_PER_LEVEL
        );
        await AsyncStorage.setItem(
            storageKeyForLevel(levelId),
            JSON.stringify({ items: normalized, recordedAt })
        );
        return normalized;
    } catch {
        return [];
    }
}

function expired(recordedAt) {
    if (!recordedAt) return false;
    return Date.now() - recordedAt > ROTATE_AFTER_MS;
}

export async function getRecentSeenKeys(levelId) {
    const { items, recordedAt } = await readBucket(levelId);
    if (expired(recordedAt)) return [];
    return items;
}

export async function recordSeenKeys(levelId, newKeys) {
    if (!Array.isArray(newKeys) || !newKeys.length) {
        return [];
    }
    const { items, recordedAt } = await readBucket(levelId);
    const reset = expired(recordedAt);
    const base = reset ? [] : items;
    const merged = [...base, ...newKeys.filter((k) => typeof k === 'string' && k.length)];
    return writeBucket(levelId, merged, reset ? Date.now() : recordedAt);
}

export async function clearRecentSeen(levelId) {
    try {
        await AsyncStorage.removeItem(storageKeyForLevel(levelId));
    } catch {
    }
}

export function extractContentKeysFromExercises(exercises) {
    const seen = new Set();
    for (const exercise of exercises) {
        if (!exercise) continue;
        const candidates = [
            exercise.word?.audioKey,
            exercise.correctWord?.audioKey,
            exercise.anchor?.audioKey,
            exercise.target?.audioKey,
            exercise.sentence?.id,
            exercise.correctSyllable,
            exercise.correctCount ? `count:${exercise.correctCount}:${exercise.word?.audioKey}` : null,
            exercise.correctLetter?.id ? `letter:${exercise.correctLetter.id}` : null,
        ];
        for (const c of candidates) {
            if (c) seen.add(String(c));
        }
    }
    return Array.from(seen);
}
