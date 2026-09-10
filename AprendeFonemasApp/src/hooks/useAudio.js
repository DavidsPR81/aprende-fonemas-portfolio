import { useCallback, useEffect, useState } from 'react';
import {
  playAudioKey,
  playFeedback,
  stopAllAudio,
  speakText,
  getAudioMeta,
  getSpeechText,
  subscribeAudioPlaying,
} from '../services/audioPlayer';

export { getAudioMeta, getSpeechText };

/**
 * @param {{ stopOnUnmount?: boolean }} [options]
 * stopOnUnmount: false en modales cortos (tutorial) para no cortar el audio de la pantalla padre.
 */
export const useAudio = (options = {}) => {
  const { stopOnUnmount = true } = options;
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsub = subscribeAudioPlaying(setIsPlaying);
    return () => {
      unsub();
      if (stopOnUnmount) stopAllAudio();
    };
  }, [stopOnUnmount]);

  const playKey = useCallback((key, opts) => playAudioKey(key, opts), []);
  const stop = useCallback(() => stopAllAudio(), []);

  return {
    playKey,
    playFeedback,
    stop,
    speakFallback: speakText,
    isPlaying,
  };
};
