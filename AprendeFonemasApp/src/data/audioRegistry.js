// Portfolio: los MP3 no se publican (licencia comercial).
// En el repo privado este archivo se genera con scripts/generate-audio-placeholders.js

export const AUDIO_REGISTRY = {};

export function getAudioSource(key) {
  return AUDIO_REGISTRY[key] ?? null;
}
