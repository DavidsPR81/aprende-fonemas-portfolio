// Play Console pide URL pública — actualizar LANDING_URL tras publicar en Netlify
export const LANDING_URL = 'https://aprendefonemas.netlify.app';

export const PRIVACY_POLICY_URL = `${LANDING_URL}/privacidad.html`;

// Contacto público (Play Console, landing, privacidad)
export const CONTACT_EMAIL = 'aprendefonemas@gmail.com';

export const APP_DISPLAY_NAME = 'Aprende Fonemas';
export const DEVELOPER_NAME = 'Aprende Fonemas';

export const TUTORIAL_STORAGE_KEY = '@aprende_fonemas_tutorial_seen';
export const FINAL_CELEBRATION_STORAGE_KEY = '@aprende_fonemas_final_celebration_seen';
export const TUTORIAL_VERSION = '2'; // subir → tutorial otra vez tras update

// Fallos permitidos = opciones - 1 (4 opciones → 3 intentos y luego pista)
export function getHintThreshold(optionCount = 4) {
  const options = Math.max(2, optionCount);
  return options - 1;
}
