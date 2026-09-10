import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import * as Speech from 'expo-speech';
import { USE_SPEECH_PREVIEW } from '../config/audio';
import { getRuntimeSettings } from '../context/SettingsContext';
import { getAudioSource } from '../data/audioRegistry';

const { AUDIO_MANIFEST } = require('../data/audioManifest');

const PLACEHOLDER_MAX_MS = 500;
const metaByKey = Object.fromEntries(AUDIO_MANIFEST.map((entry) => [entry.key, entry]));

function isVoiceKey(key) {
  const meta = getAudioMeta(key);
  if (!meta) return true;
  return ['phoneme', 'word', 'sentence', 'instruction', 'tutorial', 'ui'].includes(meta.category);
}

function isFeedbackKey(key) {
  return key.startsWith('feedback/');
}

let audioReady = false;
let speaking = false;
let soundRef = null;
let isPlaying = false;
/** Sube en cada stop: cancela bucles de fusión / colas pendientes. */
let audioEpoch = 0;
const playingListeners = new Set();

export function getAudioMeta(key) {
  return metaByKey[key] ?? null;
}

/** Suscripción a «está sonando» (onda del botón Escuchar). */
export function subscribeAudioPlaying(listener) {
  playingListeners.add(listener);
  listener(isPlaying);
  return () => playingListeners.delete(listener);
}

export function getAudioPlaying() {
  return isPlaying;
}

function setAudioPlaying(next) {
  if (isPlaying === next) return;
  isPlaying = next;
  playingListeners.forEach((cb) => {
    try {
      cb(isPlaying);
    } catch (_) {
      // listener roto: ignorar
    }
  });
}

async function ensureAudioMode() {
  if (audioReady) return;
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
    interruptionModeIOS: InterruptionModeIOS.DuckOthers,
    interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
  });
  audioReady = true;
}

// Fallback TTS cuando USE_SPEECH_PREVIEW o falta el MP3
export function getSpeechText(key, fallbackText, options = {}) {
  const { speechMode = 'phoneme' } = options;
  const meta = getAudioMeta(key);
  const text = fallbackText ?? meta?.text;
  if (!text && !meta) return '';

  if (speechMode === 'blend' && fallbackText) {
    return fallbackText;
  }

  if (meta?.category === 'phoneme') {
    if (speechMode === 'word' && fallbackText) {
      return fallbackText;
    }
    return meta.text || text;
  }

  return text ?? meta?.text ?? '';
}

async function stopSound() {
  if (soundRef) {
    try {
      soundRef.setOnPlaybackStatusUpdate(null);
      await soundRef.stopAsync();
      await soundRef.unloadAsync();
    } catch (_) {
      // unload a veces falla si el sonido ya terminó
    }
    soundRef = null;
  }
}

export async function stopAllAudio() {
  audioEpoch += 1;
  await stopSound();
  if (speaking) {
    Speech.stop();
    speaking = false;
  }
  setAudioPlaying(false);
}

export async function speakText(key, fallbackText, options = {}) {
  const text = getSpeechText(key, fallbackText, options);
  if (!text) return;

  await ensureAudioMode();
  await stopSound();

  if (speaking) {
    Speech.stop();
    speaking = false;
    setAudioPlaying(false);
    await new Promise((r) => setTimeout(r, 80));
  }

  speaking = true;
  setAudioPlaying(true);

  return new Promise((resolve) => {
    const finish = () => {
      speaking = false;
      setAudioPlaying(false);
      resolve();
    };
    Speech.speak(text, {
      language: 'es',
      pitch: 1.0,
      rate: options.rate ?? (options.speechMode === 'blend' ? 0.55 : 0.82),
      onDone: finish,
      onStopped: finish,
      onError: (error) => {
        console.warn('Speech error:', error);
        finish();
      },
    });
  });
}

function isPlaceholderDuration(durationMs) {
  if (durationMs == null || durationMs === 0) return true;
  return durationMs <= PLACEHOLDER_MAX_MS;
}

function playLoadedSound(sound, durationMs) {
  return new Promise(async (resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(watchdog);
      setAudioPlaying(false);
      resolve();
    };

    const watchdogMs = Math.max((durationMs || 2500) + 900, 2200);
    const watchdog = setTimeout(async () => {
      try {
        sound.setOnPlaybackStatusUpdate(null);
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (_) {
        // ignore
      }
      if (soundRef === sound) soundRef = null;
      finish();
    }, watchdogMs);

    soundRef = sound;
    setAudioPlaying(true);
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      if (status.didJustFinish) {
        sound.setOnPlaybackStatusUpdate(null);
        sound.unloadAsync().catch(() => {});
        if (soundRef === sound) soundRef = null;
        finish();
      }
    });
    try {
      await sound.playAsync();
    } catch (error) {
      console.warn('playAsync error:', error);
      try {
        await sound.unloadAsync();
      } catch (_) {
        // ignore
      }
      if (soundRef === sound) soundRef = null;
      finish();
    }
  });
}

/** Mapea segmento de fusión → clave de audio de fonema. */
function phonemeKeyForSegment(segment) {
  const map = { ñ: 'enie', ll: 'y', ch: 'ch' };
  const id = map[segment] || segment;
  return `phonemes/${id}`;
}

/** Reproduce s · a · p · o con los MP3 de fonemas (misma voz que el resto). */
export async function playPhonemeBlendSequence(segments, options = {}) {
  const gapMs = options.gapMs ?? 300;
  const list = (segments || []).filter(Boolean);
  if (!list.length) return;

  await ensureAudioMode();
  await stopAllAudio();
  const epoch = audioEpoch;

  for (let i = 0; i < list.length; i += 1) {
    if (epoch !== audioEpoch) return;
    const seg = list[i];
    await playAudioKey(phonemeKeyForSegment(seg), {
      useSpeechFallback: true,
      speechMode: 'phoneme',
      fallbackText: seg,
      continueSession: true,
    });
    if (epoch !== audioEpoch) return;
    if (i < list.length - 1) {
      await new Promise((r) => setTimeout(r, gapMs));
    }
  }
}

export async function playAudioKey(key, options = {}) {
  const {
    fallbackText,
    useSpeechFallback = true,
    speechMode,
    blendSegments,
    continueSession = false,
    ...rest
  } = options;
  const speechOptions = { speechMode, ...rest };
  const { soundEnabled, voiceEnabled } = getRuntimeSettings();

  if (isFeedbackKey(key) && !soundEnabled) return;
  if (isVoiceKey(key) && !voiceEnabled) return;

  const meta = getAudioMeta(key);
  const source = getAudioSource(key);

  await ensureAudioMode();

  // Nivel 9: secuencia de fonemas, no la palabra completa
  if (speechMode === 'blend') {
    if (blendSegments?.length) {
      await playPhonemeBlendSequence(blendSegments, rest);
      return;
    }
    if (useSpeechFallback) {
      await speakText(key, fallbackText, speechOptions);
    }
    return;
  }

  if (USE_SPEECH_PREVIEW && useSpeechFallback) {
    await speakText(key, fallbackText, speechOptions);
    return;
  }

  if (continueSession) {
    await stopSound();
  } else {
    await stopAllAudio();
  }

  if (source) {
    try {
      const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: false });
      const status = await sound.getStatusAsync();
      const durationMs = status.isLoaded ? status.durationMillis : null;

      if (isPlaceholderDuration(durationMs)) {
        await sound.unloadAsync();
        if (useSpeechFallback) {
          await speakText(key, fallbackText, speechOptions);
        }
        return;
      }

      await playLoadedSound(sound, durationMs);
      return;
    } catch (error) {
      console.warn(`No se pudo reproducir ${key}:`, error);
    }
  }

  if (useSpeechFallback) {
    await speakText(key, fallbackText ?? meta?.text, speechOptions);
  }
}

export async function playFeedback(type = 'muy_bien', fallbackText) {
  await playAudioKey(`feedback/${type}`, { useSpeechFallback: true, fallbackText });
}
