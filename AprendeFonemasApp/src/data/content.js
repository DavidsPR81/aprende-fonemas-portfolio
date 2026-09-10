// Niveles, palabras y pools de ejercicios. Tras tocar: npm run content:inventory

import { slugify } from '../utils/slugify';
import {
  buildBlendLabelFromPhonemes,
  buildBlendSpeechFromPhonemes,
  getMiddleGapIndex,
} from '../utils/spanishPhonemes';

function wordEntry(word, image) {
  return {
    word,
    image,
    imageKey: slugify(word),
    audioKey: `words/${slugify(word)}`,
  };
}

// Vocales + m,p,l,s,t — letras freemium de niveles 1–4
export const FREE_LETTER_IDS = ['a', 'e', 'i', 'o', 'u', 'p', 'm', 'l', 's', 't'];

/** Abecedario RAE (a–z + ñ). RR/LL/CH son dígrafos, no letras extra. */
export const RAE_ALPHABET_LETTER_COUNT = 27;

export const LETTERS = [
  {
    id: 'a',
    uppercase: 'A',
    lowercase: 'a',
    phonemeAudioKey: 'phonemes/a',
    words: [
      wordEntry('Avión', '✈️'),
      wordEntry('Árbol', '🌳'),
      wordEntry('Abeja', '🐝'),
      wordEntry('Araña', '🕷️'),
      wordEntry('Agua', '💧'),
    ],
    free: true,
  },
  {
    id: 'e',
    uppercase: 'E',
    lowercase: 'e',
    phonemeAudioKey: 'phonemes/e',
    words: [
      wordEntry('Elefante', '🐘'),
      wordEntry('Estrella', '⭐'),
      wordEntry('Escuela', '🏫'),
      wordEntry('Espejo', '🪞'),
      wordEntry('Erizo', '🦔'),
    ],
    free: true,
  },
  {
    id: 'i',
    uppercase: 'I',
    lowercase: 'i',
    phonemeAudioKey: 'phonemes/i',
    words: [
      wordEntry('Iglú', '🧊'),
      wordEntry('Isla', '🏝️'),
      wordEntry('Invierno', '❄️'),
      wordEntry('Insecto', '🪲'),
      wordEntry('Iguana', '🦎'),
    ],
    free: true,
  },
  {
    id: 'o',
    uppercase: 'O',
    lowercase: 'o',
    phonemeAudioKey: 'phonemes/o',
    words: [
      wordEntry('Oso', '🐻'),
      wordEntry('Ojo', '👁️'),
      wordEntry('Oruga', '🐛'),
      wordEntry('Ola', '🌊'),
      wordEntry('Oreja', '👂'),
    ],
    free: true,
  },
  {
    id: 'u',
    uppercase: 'U',
    lowercase: 'u',
    phonemeAudioKey: 'phonemes/u',
    words: [
      wordEntry('Uva', '🍇'),
      wordEntry('Unicornio', '🦄'),
      wordEntry('Uniforme', '👕'),
      wordEntry('Uvas', '🍇'),
      wordEntry('Uña', '💅'),
    ],
    free: true,
  },
  {
    id: 'p',
    uppercase: 'P',
    lowercase: 'p',
    phonemeAudioKey: 'phonemes/p',
    words: [
      wordEntry('Pato', '🦆'),
      wordEntry('Pelota', '⚽'),
      wordEntry('Perro', '🐕'),
      wordEntry('Pájaro', '🐦'),
      wordEntry('Pizarra', '📝'),
    ],
    free: true,
  },
  {
    id: 'm',
    uppercase: 'M',
    lowercase: 'm',
    phonemeAudioKey: 'phonemes/m',
    words: [
      wordEntry('Manzana', '🍎'),
      wordEntry('Mono', '🐒'),
      wordEntry('Música', '🎵'),
      wordEntry('Mamá', '👩'),
      wordEntry('Mariposa', '🦋'),
      // Además refuerza el grafema "qu" interior (mos-QUI-to)
      wordEntry('Mosquito', '🦟'),
    ],
    free: true,
  },
  {
    id: 'l',
    uppercase: 'L',
    lowercase: 'l',
    phonemeAudioKey: 'phonemes/l',
    words: [
      wordEntry('León', '🦁'),
      wordEntry('Luna', '🌙'),
      wordEntry('Libro', '📖'),
      wordEntry('Lápiz', '✏️'),
      wordEntry('Loro', '🦜'),
    ],
    free: true,
  },
  {
    id: 's',
    uppercase: 'S',
    lowercase: 's',
    phonemeAudioKey: 'phonemes/s',
    words: [
      wordEntry('Sol', '☀️'),
      wordEntry('Silla', '🪑'),
      wordEntry('Sapo', '🐸'),
      wordEntry('Sandía', '🍉'),
      wordEntry('Sopa', '🍲'),
    ],
    free: true,
  },
  {
    id: 't',
    uppercase: 'T',
    lowercase: 't',
    phonemeAudioKey: 'phonemes/t',
    words: [
      wordEntry('Toro', '🐂'),
      wordEntry('Tren', '🚂'),
      wordEntry('Tomate', '🍅'),
      wordEntry('Tambor', '🥁'),
      wordEntry('Tortuga', '🐢'),
    ],
    free: true,
  },
  // --- premium (B–K) ---
  {
    id: 'b',
    uppercase: 'B',
    lowercase: 'b',
    phonemeAudioKey: 'phonemes/b',
    words: [wordEntry('Barco', '🚢'), wordEntry('Boca', '👄'), wordEntry('Bicicleta', '🚲'), wordEntry('Bota', '👢'), wordEntry('Botón', '🔘')],
    free: false,
  },
  {
    id: 'c',
    uppercase: 'C',
    lowercase: 'c',
    phonemeAudioKey: 'phonemes/c',
    words: [wordEntry('Casa', '🏠'), wordEntry('Coche', '🚗'), wordEntry('Conejo', '🐰'), wordEntry('Camión', '🚚'), wordEntry('Cuna', '🛏️')],
    free: false,
  },
  {
    id: 'd',
    uppercase: 'D',
    lowercase: 'd',
    phonemeAudioKey: 'phonemes/d',
    words: [wordEntry('Dado', '🎲'), wordEntry('Delfín', '🐬'), wordEntry('Diente', '🦷'), wordEntry('Dedo', '👆'), wordEntry('Dulce', '🍬')],
    free: false,
  },
  {
    id: 'f',
    uppercase: 'F',
    lowercase: 'f',
    phonemeAudioKey: 'phonemes/f',
    words: [wordEntry('Flor', '🌸'), wordEntry('Familia', '👨‍👩‍👧'), wordEntry('Fresa', '🍓'), wordEntry('Foca', '🦭'), wordEntry('Fuego', '🔥')],
    free: false,
  },
  {
    id: 'g',
    uppercase: 'G',
    lowercase: 'g',
    phonemeAudioKey: 'phonemes/g',
    words: [wordEntry('Gato', '🐱'), wordEntry('Globo', '🎈'), wordEntry('Guitarra', '🎸'), wordEntry('Gusano', '🪱'), wordEntry('Galleta', '🍪')],
    free: false,
  },
  {
    id: 'h',
    uppercase: 'H',
    lowercase: 'h',
    phonemeAudioKey: 'phonemes/h',
    words: [wordEntry('Hada', '🧚'), wordEntry('Helado', '🍦'), wordEntry('Hilo', '🧵'), wordEntry('Hueso', '🦴'), wordEntry('Hoja', '🍃')],
    free: false,
  },
  {
    id: 'j',
    uppercase: 'J',
    lowercase: 'j',
    phonemeAudioKey: 'phonemes/j',
    words: [wordEntry('Jirafa', '🦒'), wordEntry('Juguete', '🧸'), wordEntry('Jardín', '🌳'), wordEntry('Jabón', '🧼'), wordEntry('Jamón', '🍖')],
    free: false,
  },
  {
    id: 'k',
    uppercase: 'K',
    lowercase: 'k',
    phonemeAudioKey: 'phonemes/k',
    words: [wordEntry('Koala', '🐨'), wordEntry('Kiwi', '🥝'), wordEntry('Karate', '🥋'), wordEntry('Ketchup', '🍅'), wordEntry('Kimono', '👘')],
    free: false,
  },
  {
    id: 'n',
    uppercase: 'N',
    lowercase: 'n',
    phonemeAudioKey: 'phonemes/n',
    words: [wordEntry('Nube', '☁️'), wordEntry('Nariz', '👃'), wordEntry('Noche', '🌃'), wordEntry('Naranja', '🍊'), wordEntry('Nido', '🪺')],
    free: false,
  },
  {
    id: 'enie',
    uppercase: 'Ñ',
    lowercase: 'ñ',
    phonemeAudioKey: 'phonemes/enie',
    // Contienen ñ (casi ninguna palabra infantil empieza por ñ). Niv. 2–3 las excluyen.
    words: [wordEntry('Niño', '👦'), wordEntry('Niña', '👧'), wordEntry('Muñeca', '🪆'), wordEntry('Piñata', '🪅'), wordEntry('Mañana', '🌅')],
    free: false,
  },
  {
    id: 'q',
    uppercase: 'Q',
    lowercase: 'q',
    phonemeAudioKey: 'phonemes/q',
    words: [wordEntry('Queso', '🧀'), wordEntry('Quince', '🔢'), wordEntry('Quiosco', '🏪'), wordEntry('Quesadilla', '🫓')],
    free: false,
  },
  {
    id: 'r',
    uppercase: 'R',
    lowercase: 'r',
    phonemeAudioKey: 'phonemes/r',
    words: [wordEntry('Rana', '🐸'), wordEntry('Ratón', '🐭'), wordEntry('Rosa', '🌹'), wordEntry('Reloj', '⏰'), wordEntry('Río', '🏞️'), wordEntry('Raqueta', '🏸')],
    free: false,
  },
  {
    id: 'rr',
    // Dígrafo (no es letra extra del abecedario RAE = 27). Se enseña como sonido.
    uppercase: 'RR',
    lowercase: 'rr',
    phonemeAudioKey: 'phonemes/rr',
    words: [wordEntry('Torre', '🗼'), wordEntry('Barro', '🟤'), wordEntry('Tierra', '🌍'), wordEntry('Burro', '🫏'), wordEntry('Arroz', '🍚')],
    free: false,
  },
  {
    id: 'v',
    uppercase: 'V',
    lowercase: 'v',
    phonemeAudioKey: 'phonemes/v',
    words: [wordEntry('Vaca', '🐄'), wordEntry('Vela', '🕯️'), wordEntry('Ventana', '🪟'), wordEntry('Violeta', '💜'), wordEntry('Vaso', '🥤')],
    free: false,
  },
  {
    id: 'w',
    uppercase: 'W',
    lowercase: 'w',
    phonemeAudioKey: 'phonemes/w',
    words: [wordEntry('Waterpolo', '🤽'), wordEntry('Wifi', '📶'), wordEntry('Walkie', '📻')],
    free: false,
  },
  {
    id: 'x',
    uppercase: 'X',
    lowercase: 'x',
    phonemeAudioKey: 'phonemes/x',
    // X casi nunca es inicial en español: Taxi y Extraterrestre la practican
    // como grafema interior (igual que Ñ/RR). Niveles 2-3 solo usan Xilófono.
    words: [wordEntry('Xilófono', '🎵'), wordEntry('Taxi', '🚕'), wordEntry('Extraterrestre', '👽')],
    free: false,
  },
  {
    id: 'y',
    uppercase: 'Y',
    lowercase: 'y',
    phonemeAudioKey: 'phonemes/y',
    words: [wordEntry('Yogur', '🥛'), wordEntry('Yoyo', '🪀'), wordEntry('Yate', '⛵'), wordEntry('Yema', '🥚'), wordEntry('Yegua', '🐴')],
    free: false,
  },
  {
    id: 'z',
    uppercase: 'Z',
    lowercase: 'z',
    phonemeAudioKey: 'phonemes/z',
    words: [wordEntry('Zapato', '👟'), wordEntry('Zorro', '🦊'), wordEntry('Zanahoria', '🥕'), wordEntry('Zumo', '🧃'), wordEntry('Zoo', '🦁')],
    free: false,
  },
];

/**
 * Los 12 niveles (1–4 gratis, 5–12 premium).
 * Escalera 3–7 años: fonema→letra → asociación → palabra → letra inicial
 * → sílabas → sílaba inicial → letra final → rima → fusión → huecos → frase.
 */
export const LEVELS = [
  {
    id: 1,
    name: 'Nivel 1',
    description: 'Escucha y elige la letra',
    type: 'identify-phoneme',
    instructionKey: 'instructions/escucha_y_elige_la_letra',
    free: true,
  },
  {
    id: 2,
    name: 'Nivel 2',
    description: 'Escucha y elige el dibujo',
    type: 'associate-word',
    instructionKey: 'instructions/escucha_y_elige_el_dibujo',
    free: true,
  },
  {
    id: 3,
    name: 'Nivel 3',
    description: 'Escucha y elige la palabra',
    type: 'choose-word',
    instructionKey: 'instructions/escucha_y_elige_la_palabra',
    free: true,
  },
  {
    id: 4,
    name: 'Nivel 4',
    description: '¿Con qué letra empieza?',
    type: 'identify-initial',
    instructionKey: 'instructions/con_que_letra_empieza',
    free: true,
  },
  {
    id: 5,
    name: 'Nivel 5',
    description: '¿Cuántas sílabas tiene?',
    type: 'syllable-count',
    instructionKey: 'instructions/cuantas_silabas_tiene',
    free: false,
  },
  {
    id: 6,
    name: 'Nivel 6',
    description: '¿Con qué sílaba empieza?',
    type: 'identify-initial-syllable',
    instructionKey: 'instructions/con_que_silaba_empieza',
    free: false,
  },
  {
    id: 7,
    name: 'Nivel 7',
    description: '¿Con qué letra termina?',
    type: 'identify-final',
    instructionKey: 'instructions/con_que_letra_termina',
    free: false,
  },
  {
    id: 8,
    name: 'Nivel 8',
    description: 'Palabras que riman',
    type: 'rhyme',
    instructionKey: 'instructions/elige_la_que_rima',
    free: false,
  },
  {
    id: 9,
    name: 'Nivel 9',
    description: 'Junta los sonidos',
    type: 'phoneme-blend',
    instructionKey: 'instructions/junta_los_sonidos_y_elige_la_palabra',
    free: false,
  },
  {
    id: 10,
    name: 'Nivel 10',
    description: '¿Qué letra falta al final?',
    type: 'complete-word-final',
    instructionKey: 'instructions/que_letra_falta_al_final',
    free: false,
  },
  {
    id: 11,
    name: 'Nivel 11',
    description: '¿Qué letra falta en medio?',
    type: 'complete-word-middle',
    instructionKey: 'instructions/que_letra_falta_en_medio',
    free: false,
  },
  {
    id: 12,
    name: 'Nivel 12',
    description: 'Lee la frase y elige el dibujo',
    type: 'read-sentence',
    instructionKey: 'instructions/lee_la_frase_y_elige_el_dibujo',
    free: false,
  },
];

export const SENTENCES = [
  { id: 'el_pato_nada', text: 'El pato nada.', image: '🦆', audioKey: 'sentences/el_pato_nada', level: 12, free: false },
  { id: 'el_sapo_salta', text: 'El sapo salta.', image: '🐸', audioKey: 'sentences/el_sapo_salta', level: 12, free: false },
  { id: 'el_tren_llega', text: 'El tren llega.', image: '🚂', audioKey: 'sentences/el_tren_llega', level: 12, free: false },
  { id: 'el_perro_corre', text: 'El perro corre.', image: '🐕', audioKey: 'sentences/el_perro_corre', level: 12, free: false },
  { id: 'el_gato_duerme', text: 'El gato duerme.', image: '🐱', audioKey: 'sentences/el_gato_duerme', level: 12, free: false },
  { id: 'el_leon_ruge', text: 'El león ruge.', image: '🦁', audioKey: 'sentences/el_leon_ruge', level: 12, free: false },
  { id: 'la_nina_canta', text: 'La niña canta.', image: '👧', audioKey: 'sentences/la_nina_canta', level: 12, free: false },
  { id: 'el_nino_juega', text: 'El niño juega.', image: '👦', audioKey: 'sentences/el_nino_juega', level: 12, free: false },
  { id: 'tengo_una_manzana', text: 'Tengo una manzana.', image: '🍎', audioKey: 'sentences/tengo_una_manzana', level: 12, free: false },
  { id: 'leo_un_libro', text: 'Leo un libro.', image: '📖', audioKey: 'sentences/leo_un_libro', level: 12, free: false },
  { id: 'la_mesa_es_grande', text: 'La mesa es grande.', image: '🪑', audioKey: 'sentences/la_mesa_es_grande', level: 12, free: false },
  { id: 'la_casa_es_azul', text: 'La casa es azul.', image: '🏠', audioKey: 'sentences/la_casa_es_azul', level: 12, free: false },
  { id: 'mi_mama_cocina', text: 'Mi mamá cocina.', image: '👩‍🍳', audioKey: 'sentences/mi_mama_cocina', level: 12, free: false },
  { id: 'mi_perro_es_grande', text: 'Mi perro es grande.', image: '🐕', audioKey: 'sentences/mi_perro_es_grande', level: 12, free: false },
  { id: 'la_mariposa_vuela', text: 'La mariposa vuela.', image: '🦋', audioKey: 'sentences/la_mariposa_vuela', level: 12, free: false },
  { id: 'una_estrella_brilla', text: 'Una estrella brilla.', image: '⭐', audioKey: 'sentences/una_estrella_brilla', level: 12, free: false },
  { id: 'la_luna_brilla', text: 'La luna brilla.', image: '🌙', audioKey: 'sentences/la_luna_brilla', level: 12, free: false },
  { id: 'el_sol_brilla', text: 'El sol brilla.', image: '☀️', audioKey: 'sentences/el_sol_brilla', level: 12, free: false },
  { id: 'la_mama_lee', text: 'La mamá lee.', image: '📚', audioKey: 'sentences/la_mama_lee', level: 12, free: false },
  { id: 'el_nino_come', text: 'El niño come.', image: '🍽️', audioKey: 'sentences/el_nino_come', level: 12, free: false },
];

/**
 * Frases que no deben salir juntas como opciones: misma acción visual
 * (p. ej. niño leyendo vs mamá leyendo) confunde aunque el emoji sea distinto.
 */
export const SENTENCE_VISUAL_CONFLICT_GROUPS = [
  ['leo_un_libro', 'la_mama_lee'],
];

export function sentencesConflictVisually(aId, bId) {
  if (!aId || !bId || aId === bId) return false;
  return SENTENCE_VISUAL_CONFLICT_GROUPS.some(
    (group) => group.includes(aId) && group.includes(bId)
  );
}

// Pool conteo silábico
export const SYLLABLE_EXERCISES = [
  { word: wordEntry('Pato', '🦆'), syllables: 2 },
  { word: wordEntry('Agua', '💧'), syllables: 2 },
  { word: wordEntry('Mamá', '👩'), syllables: 2 },
  { word: wordEntry('Oreja', '👂'), syllables: 3 },
  { word: wordEntry('Luna', '🌙'), syllables: 2 },
  { word: wordEntry('Avión', '✈️'), syllables: 2 },
  { word: wordEntry('Camión', '🚚'), syllables: 2 },
  { word: wordEntry('Manzana', '🍎'), syllables: 3 },
  { word: wordEntry('Mariposa', '🦋'), syllables: 4 },
  { word: wordEntry('Elefante', '🐘'), syllables: 4 },
  { word: wordEntry('Tomate', '🍅'), syllables: 3 },
  { word: wordEntry('Pelota', '⚽'), syllables: 3 },
  { word: wordEntry('Guitarra', '🎸'), syllables: 3 },
  { word: wordEntry('Casa', '🏠'), syllables: 2 },
  { word: wordEntry('Mono', '🐒'), syllables: 2 },
  { word: wordEntry('Perro', '🐕'), syllables: 2 },
  { word: wordEntry('Gato', '🐱'), syllables: 2 },
  { word: wordEntry('Toro', '🐂'), syllables: 2 },
  { word: wordEntry('Sapo', '🐸'), syllables: 2 },
  { word: wordEntry('León', '🦁'), syllables: 2 },
  { word: wordEntry('Libro', '📖'), syllables: 2 },
  { word: wordEntry('Silla', '🪑'), syllables: 2 },
  { word: wordEntry('Rana', '🐸'), syllables: 2 },
  { word: wordEntry('Barco', '🚢'), syllables: 2 },
  { word: wordEntry('Conejo', '🐰'), syllables: 3 },
  { word: wordEntry('Tortuga', '🐢'), syllables: 3 },
  { word: wordEntry('Fresa', '🍓'), syllables: 2 },
  { word: wordEntry('Nube', '☁️'), syllables: 2 },
  { word: wordEntry('Niño', '👦'), syllables: 2 },
  { word: wordEntry('Piñata', '🪅'), syllables: 3 },
  { word: wordEntry('Muñeca', '🪆'), syllables: 3 },
  { word: wordEntry('Torre', '🗼'), syllables: 2 },
  { word: wordEntry('Burro', '🫏'), syllables: 2 },
  { word: wordEntry('Mosquito', '🦟'), syllables: 3 },
  { word: wordEntry('Kimono', '👘'), syllables: 3 },
  { word: wordEntry('Raqueta', '🏸'), syllables: 3 },
  { word: wordEntry('Taxi', '🚕'), syllables: 2 },
  { word: wordEntry('Wifi', '📶'), syllables: 2 },
  { word: wordEntry('Walkie', '📻'), syllables: 2 },
  { word: wordEntry('Quesadilla', '🫓'), syllables: 4 },
  // ex-tra-te-rres-tre: reto de 5 sílabas para el tramo alto (6-7 años)
  { word: wordEntry('Extraterrestre', '👽'), syllables: 5 },
];

// Sílaba inicial (solo palabras de 2+ sílabas)
export const INITIAL_SYLLABLE_EXERCISES = [
  { word: wordEntry('Pato', '🦆'), correct: 'PA', distractors: ['TO', 'MA', 'PE'] },
  { word: wordEntry('Casa', '🏠'), correct: 'CA', distractors: ['SA', 'CO', 'MA'] },
  { word: wordEntry('Luna', '🌙'), correct: 'LU', distractors: ['NA', 'LA', 'MU'] },
  { word: wordEntry('Tortuga', '🐢'), correct: 'TOR', distractors: ['TU', 'GA', 'TA'] },
  { word: wordEntry('Gato', '🐱'), correct: 'GA', distractors: ['TO', 'GO', 'PA'] },
  { word: wordEntry('Mono', '🐒'), correct: 'MO', distractors: ['NO', 'MA', 'TO'] },
  { word: wordEntry('Sapo', '🐸'), correct: 'SA', distractors: ['PO', 'SO', 'PA'] },
  { word: wordEntry('Toro', '🐂'), correct: 'TO', distractors: ['RO', 'TA', 'MO'] },
  { word: wordEntry('Perro', '🐕'), correct: 'PE', distractors: ['RO', 'PA', 'TO'] },
  { word: wordEntry('Nube', '☁️'), correct: 'NU', distractors: ['BE', 'NA', 'MU'] },
  { word: wordEntry('Fresa', '🍓'), correct: 'FRE', distractors: ['SA', 'FA', 'RE'] },
  { word: wordEntry('Pelota', '⚽'), correct: 'PE', distractors: ['LO', 'TA', 'PA'] },
  { word: wordEntry('Tomate', '🍅'), correct: 'TO', distractors: ['MA', 'TE', 'TA'] },
  // Sin 'MA': es el arranque de MAN y confunde al discriminar la sílaba
  { word: wordEntry('Manzana', '🍎'), correct: 'MAN', distractors: ['ZA', 'NA', 'PA'] },
  { word: wordEntry('Conejo', '🐰'), correct: 'CO', distractors: ['NE', 'JO', 'CA'] },
  // Sin 'BA': es el arranque de BAR y confunde al discriminar la sílaba
  { word: wordEntry('Barco', '🚢'), correct: 'BAR', distractors: ['CO', 'PO', 'MAR'] },
  { word: wordEntry('Libro', '📖'), correct: 'LI', distractors: ['BRO', 'LA', 'MI'] },
  { word: wordEntry('Silla', '🪑'), correct: 'SI', distractors: ['LLA', 'SA', 'MI'] },
  { word: wordEntry('Rana', '🐸'), correct: 'RA', distractors: ['NA', 'RO', 'MA'] },
  { word: wordEntry('Agua', '💧'), correct: 'A', distractors: ['GUA', 'O', 'U'] },
  { word: wordEntry('Mamá', '👩'), correct: 'MA', distractors: ['MO', 'ME', 'PA'] },
  { word: wordEntry('Oreja', '👂'), correct: 'O', distractors: ['RE', 'JA', 'A'] },
  { word: wordEntry('Avión', '✈️'), correct: 'A', distractors: ['VIÓN', 'O', 'E'] },
  { word: wordEntry('Guitarra', '🎸'), correct: 'GUI', distractors: ['TA', 'RRA', 'GA'] },
  { word: wordEntry('Piñata', '🪅'), correct: 'PI', distractors: ['ÑA', 'TA', 'PA'] },
  { word: wordEntry('Muñeca', '🪆'), correct: 'MU', distractors: ['ÑE', 'CA', 'MA'] },
  { word: wordEntry('Torre', '🗼'), correct: 'TO', distractors: ['RRE', 'TA', 'MO'] },
  { word: wordEntry('Burro', '🫏'), correct: 'BU', distractors: ['RRO', 'BA', 'MU'] },
  { word: wordEntry('Mosquito', '🦟'), correct: 'MOS', distractors: ['QUI', 'TO', 'MA'] },
  { word: wordEntry('Kimono', '👘'), correct: 'KI', distractors: ['MO', 'NO', 'KA'] },
  { word: wordEntry('Raqueta', '🏸'), correct: 'RA', distractors: ['QUE', 'TA', 'RO'] },
  { word: wordEntry('Taxi', '🚕'), correct: 'TA', distractors: ['XI', 'TO', 'PA'] },
  { word: wordEntry('Walkie', '📻'), correct: 'WA', distractors: ['KIE', 'WI', 'PA'] },
  { word: wordEntry('Quesadilla', '🫓'), correct: 'QUE', distractors: ['SA', 'DI', 'PA'] },
];

export const RHYME_EXERCISES = [
  {
    anchor: wordEntry('Pato', '🦆'),
    rhyme: wordEntry('Gato', '🐱'),
    distractors: [wordEntry('Perro', '🐕'), wordEntry('Silla', '🪑'), wordEntry('Sol', '☀️')],
  },
  {
    anchor: wordEntry('Gato', '🐱'),
    rhyme: wordEntry('Pato', '🦆'),
    distractors: [wordEntry('Mono', '🐒'), wordEntry('Perro', '🐕'), wordEntry('Tren', '🚂')],
  },
  {
    anchor: wordEntry('Avión', '✈️'),
    rhyme: wordEntry('Camión', '🚚'),
    distractors: [wordEntry('Perro', '🐕'), wordEntry('Nube', '☁️'), wordEntry('Pato', '🦆')],
  },
  {
    anchor: wordEntry('Camión', '🚚'),
    rhyme: wordEntry('Avión', '✈️'),
    distractors: [wordEntry('Casa', '🏠'), wordEntry('Luna', '🌙'), wordEntry('Sapo', '🐸')],
  },
  {
    anchor: wordEntry('León', '🦁'),
    rhyme: wordEntry('Ratón', '🐭'),
    distractors: [wordEntry('Luna', '🌙'), wordEntry('Gato', '🐱'), wordEntry('Silla', '🪑')],
  },
  {
    anchor: wordEntry('Ratón', '🐭'),
    rhyme: wordEntry('León', '🦁'),
    distractors: [wordEntry('Nube', '☁️'), wordEntry('Pato', '🦆'), wordEntry('Luna', '🌙')],
  },
  {
    anchor: wordEntry('Toro', '🐂'),
    rhyme: wordEntry('Loro', '🦜'),
    // Sin 'Perro': -rro suena casi como -oro y es un cuasi-rima confusa
    distractors: [wordEntry('Nube', '☁️'), wordEntry('Tren', '🚂'), wordEntry('Sapo', '🐸')],
  },
  {
    anchor: wordEntry('Casa', '🏠'),
    rhyme: wordEntry('Masa', '🫓'),
    distractors: [wordEntry('Pelota', '⚽'), wordEntry('Pato', '🦆'), wordEntry('Luna', '🌙')],
  },
  {
    anchor: wordEntry('Manzana', '🍎'),
    rhyme: wordEntry('Ventana', '🪟'),
    distractors: [wordEntry('Mariposa', '🦋'), wordEntry('Silla', '🪑'), wordEntry('Pato', '🦆')],
  },
  {
    anchor: wordEntry('Luna', '🌙'),
    rhyme: wordEntry('Cuna', '🛏️'),
    distractors: [wordEntry('Sol', '☀️'), wordEntry('Gato', '🐱'), wordEntry('Pato', '🦆')],
  },
  {
    anchor: wordEntry('Rana', '🐸'),
    rhyme: wordEntry('Lana', '🧶'),
    distractors: [wordEntry('Pato', '🦆'), wordEntry('Mono', '🐒'), wordEntry('Luna', '🌙')],
  },
  {
    anchor: wordEntry('Pelota', '⚽'),
    rhyme: wordEntry('Bota', '👢'),
    distractors: [wordEntry('Perro', '🐕'), wordEntry('Silla', '🪑'), wordEntry('Sol', '☀️')],
  },
  {
    anchor: wordEntry('Flor', '🌸'),
    rhyme: wordEntry('Color', '🎨'),
    // Sin 'Sol': -ol suena casi como -or (confusión l/r típica a estas edades)
    distractors: [wordEntry('Gato', '🐱'), wordEntry('Pato', '🦆'), wordEntry('Luna', '🌙')],
  },
  {
    anchor: wordEntry('Barco', '🚢'),
    rhyme: wordEntry('Marco', '🖼️'),
    distractors: [wordEntry('Casa', '🏠'), wordEntry('Nube', '☁️'), wordEntry('Pato', '🦆')],
  },
  {
    anchor: wordEntry('Botón', '🔘'),
    rhyme: wordEntry('Ratón', '🐭'),
    distractors: [wordEntry('Silla', '🪑'), wordEntry('Pato', '🦆'), wordEntry('Luna', '🌙')],
  },
  {
    anchor: wordEntry('Raqueta', '🏸'),
    rhyme: wordEntry('Galleta', '🍪'),
    distractors: [wordEntry('Pato', '🦆'), wordEntry('Luna', '🌙'), wordEntry('Sol', '☀️')],
  },
];

// Fusión: segmentos sueltos → palabra objetivo
export const BLEND_EXERCISES = [
  {
    target: wordEntry('Pato', '🦆'),
    distractors: [wordEntry('Sapo', '🐸'), wordEntry('Mono', '🐒'), wordEntry('Sol', '☀️')],
  },
  {
    target: wordEntry('Mamá', '👩'),
    distractors: [wordEntry('Nube', '☁️'), wordEntry('Pato', '🦆'), wordEntry('Luna', '🌙')],
  },
  {
    target: wordEntry('Sol', '☀️'),
    distractors: [wordEntry('Casa', '🏠'), wordEntry('Nube', '☁️'), wordEntry('Pato', '🦆')],
  },
  {
    // Rosa: r inicial fuerte /rr/; más clara que Oreja (r suave intervocálica)
    target: wordEntry('Rosa', '🌹'),
    distractors: [wordEntry('Nube', '☁️'), wordEntry('Mono', '🐒'), wordEntry('Pato', '🦆')],
  },
  {
    target: wordEntry('Luna', '🌙'),
    distractors: [wordEntry('Casa', '🏠'), wordEntry('Pato', '🦆'), wordEntry('Mono', '🐒')],
  },
  {
    target: wordEntry('Sapo', '🐸'),
    distractors: [wordEntry('Pelota', '⚽'), wordEntry('Casa', '🏠'), wordEntry('Mono', '🐒')],
  },
  {
    target: wordEntry('Perro', '🐕'),
    distractors: [wordEntry('Nube', '☁️'), wordEntry('Casa', '🏠'), wordEntry('Mono', '🐒')],
  },
  {
    target: wordEntry('Gato', '🐱'),
    distractors: [wordEntry('Silla', '🪑'), wordEntry('Sol', '☀️'), wordEntry('Perro', '🐕')],
  },
  {
    target: wordEntry('Casa', '🏠'),
    distractors: [wordEntry('Nube', '☁️'), wordEntry('Mono', '🐒'), wordEntry('Pato', '🦆')],
  },
  {
    target: wordEntry('Tren', '🚂'),
    distractors: [wordEntry('Silla', '🪑'), wordEntry('Nube', '☁️'), wordEntry('Pato', '🦆')],
  },
  {
    target: wordEntry('Mono', '🐒'),
    distractors: [wordEntry('Pelota', '⚽'), wordEntry('Casa', '🏠'), wordEntry('Pato', '🦆')],
  },
  {
    target: wordEntry('León', '🦁'),
    distractors: [wordEntry('Nube', '☁️'), wordEntry('Casa', '🏠'), wordEntry('Pato', '🦆')],
  },
  {
    target: wordEntry('Pelota', '⚽'),
    distractors: [wordEntry('Silla', '🪑'), wordEntry('Nube', '☁️'), wordEntry('Mono', '🐒')],
  },
  {
    target: wordEntry('Tomate', '🍅'),
    distractors: [wordEntry('Pato', '🦆'), wordEntry('Mamá', '👩'), wordEntry('Luna', '🌙')],
  },
  {
    target: wordEntry('Avión', '✈️'),
    distractors: [wordEntry('Nube', '☁️'), wordEntry('Pato', '🦆'), wordEntry('Perro', '🐕')],
  },
  {
    target: wordEntry('Elefante', '🐘'),
    distractors: [wordEntry('Silla', '🪑'), wordEntry('Mamá', '👩'), wordEntry('Pato', '🦆')],
  },
  {
    target: wordEntry('Rana', '🐸'),
    distractors: [wordEntry('Nube', '☁️'), wordEntry('Mono', '🐒'), wordEntry('Pato', '🦆')],
  },
  {
    // t-a-x-i: la X suena /ks/ (phonemes/x) y la fusión da "taxi" exacta
    target: wordEntry('Taxi', '🚕'),
    distractors: [wordEntry('Nube', '☁️'), wordEntry('Pelota', '⚽'), wordEntry('Mono', '🐒')],
  },
];

export function buildBlendLabel(wordText) {
  return buildBlendLabelFromPhonemes(wordText);
}

export function buildBlendSpeech(wordText) {
  return buildBlendSpeechFromPhonemes(wordText);
}

// Mismo sonido inicial; reservado (sin nivel asignado aún)
export const ALLITERATION_EXERCISES = [
  {
    anchor: wordEntry('Pato', '🦆'),
    match: wordEntry('Pelota', '⚽'),
    distractors: [wordEntry('Silla', '🪑'), wordEntry('Sol', '☀️'), wordEntry('Gato', '🐱')],
  },
  {
    anchor: wordEntry('Mamá', '👩'),
    match: wordEntry('Mono', '🐒'),
    distractors: [wordEntry('Pato', '🦆'), wordEntry('Luna', '🌙'), wordEntry('Sapo', '🐸')],
  },
  {
    anchor: wordEntry('Sol', '☀️'),
    match: wordEntry('Sapo', '🐸'),
    distractors: [wordEntry('Nube', '☁️'), wordEntry('Pato', '🦆'), wordEntry('Luna', '🌙')],
  },
  {
    anchor: wordEntry('Mono', '🐒'),
    match: wordEntry('Manzana', '🍎'),
    distractors: [wordEntry('Perro', '🐕'), wordEntry('Tren', '🚂'), wordEntry('Luna', '🌙')],
  },
  {
    anchor: wordEntry('Tren', '🚂'),
    match: wordEntry('Toro', '🐂'),
    distractors: [wordEntry('Casa', '🏠'), wordEntry('Pato', '🦆'), wordEntry('Luna', '🌙')],
  },
  {
    anchor: wordEntry('Luna', '🌙'),
    match: wordEntry('León', '🦁'),
    distractors: [wordEntry('Pato', '🦆'), wordEntry('Nube', '☁️'), wordEntry('Sol', '☀️')],
  },
  {
    anchor: wordEntry('Perro', '🐕'),
    match: wordEntry('Pelota', '⚽'),
    distractors: [wordEntry('Silla', '🪑'), wordEntry('Gato', '🐱'), wordEntry('Sol', '☀️')],
  },
  {
    anchor: wordEntry('Libro', '📖'),
    match: wordEntry('Luna', '🌙'),
    distractors: [wordEntry('Nube', '☁️'), wordEntry('Pato', '🦆'), wordEntry('Sol', '☀️')],
  },
  {
    anchor: wordEntry('Casa', '🏠'),
    match: wordEntry('Camión', '🚚'),
    distractors: [wordEntry('Silla', '🪑'), wordEntry('Pato', '🦆'), wordEntry('Sol', '☀️')],
  },
  {
    anchor: wordEntry('Gato', '🐱'),
    match: wordEntry('Globo', '🎈'),
    distractors: [wordEntry('Pato', '🦆'), wordEntry('Nube', '☁️'), wordEntry('Luna', '🌙')],
  },
  {
    anchor: wordEntry('Rana', '🐸'),
    match: wordEntry('Rosa', '🌹'),
    distractors: [wordEntry('Pato', '🦆'), wordEntry('Silla', '🪑'), wordEntry('Luna', '🌙')],
  },
  {
    anchor: wordEntry('Flor', '🌸'),
    match: wordEntry('Fresa', '🍓'),
    distractors: [wordEntry('Nube', '☁️'), wordEntry('Pato', '🦆'), wordEntry('Sol', '☀️')],
  },
  {
    anchor: wordEntry('Nube', '☁️'),
    match: wordEntry('Naranja', '🍊'),
    distractors: [wordEntry('Luna', '🌙'), wordEntry('Silla', '🪑'), wordEntry('Pato', '🦆')],
  },
  {
    anchor: wordEntry('Dado', '🎲'),
    match: wordEntry('Delfín', '🐬'),
    distractors: [wordEntry('Nube', '☁️'), wordEntry('Pato', '🦆'), wordEntry('Sol', '☀️')],
  },
  {
    anchor: wordEntry('Barco', '🚢'),
    match: wordEntry('Boca', '👄'),
    distractors: [wordEntry('Silla', '🪑'), wordEntry('Pato', '🦆'), wordEntry('Luna', '🌙')],
  },
];

/**
 * Dibujos que un niño puede nombrar igual aunque la palabra sea otra
 * (oruga/gusano, luna/noche, barco/yate, uña/dedo, agua/ola/río/vaso…).
 * No deben salir juntos como opciones del mismo ejercicio.
 */
export const WORD_VISUAL_CONFLICT_GROUPS = [
  ['oruga', 'gusano'],
  ['noche', 'luna'],
  ['yate', 'barco'],
  ['una', 'dedo'],
  ['agua', 'ola', 'rio', 'vaso'],
  ['insecto', 'mosquito'],
  ['taxi', 'coche'],
  ['karate', 'kimono'],
  ['queso', 'quesadilla'],
];

export function wordImagesConflict(entryA, entryB) {
  const a = entryA?.imageKey ?? (entryA?.word ? slugify(entryA.word) : null);
  const b = entryB?.imageKey ?? (entryB?.word ? slugify(entryB.word) : null);
  if (!a || !b || a === b) return false;
  return WORD_VISUAL_CONFLICT_GROUPS.some((group) => group.includes(a) && group.includes(b));
}

/**
 * Pares de letras cuyo audio es igual o confusable para 3–7 años
 * (según guion de grabación: C=K=Q="k", V=B, R inicial=RR vibrante,
 * X="ks" se confunde con S/K/C/Q, W≈/gu/ como G).
 * Nunca deben aparecer juntas como opciones del mismo ejercicio.
 */
const SOUND_ALIKE_LETTER_PAIRS = [
  ['c', 'k'],
  ['c', 'q'],
  ['k', 'q'],
  ['b', 'v'],
  ['r', 'rr'],
  ['x', 's'],
  ['x', 'k'],
  ['x', 'c'],
  ['x', 'q'],
  ['w', 'g'],
];

export function lettersSoundAlike(aId, bId) {
  if (!aId || !bId || aId === bId) {
    return false;
  }
  return SOUND_ALIKE_LETTER_PAIRS.some(
    ([x, y]) => (x === aId && y === bId) || (x === bId && y === aId)
  );
}

export function getFreeLetters() {
  return LETTERS.filter((letter) => letter.free);
}

const PREMIUM_EXTRA_WORDS = [
  wordEntry('Masa', '🫓'),
  wordEntry('Color', '🎨'),
  wordEntry('Marco', '🖼️'),
  wordEntry('Lana', '🧶'),
];

export function getAllWords(isPremium = false) {
  const fromLetters = LETTERS.filter((letter) => isPremium || letter.free).flatMap((letter) =>
    letter.words.map((word) => ({ ...word, letter }))
  );

  if (!isPremium) {
    return fromLetters;
  }

  return [
    ...fromLetters,
    ...PREMIUM_EXTRA_WORDS.map((word) => ({
      ...word,
      letter: LETTERS.find((entry) => wordStartsWithLetter(word.word, entry)) ?? null,
    })),
  ];
}

export function getLongWords(isPremium = false, minLength = 7) {
  return getAllWords(isPremium).filter((entry) => entry.word.length >= minLength);
}

export function wordStartsWithLetter(wordText, letter) {
  const raw = wordText.trim().toLowerCase();
  const normalized = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Posición inicial real (no “aparece en cualquier sitio”)
  if (letter.id === 'enie') {
    return raw.startsWith('ñ');
  }
  if (letter.id === 'rr') {
    return normalized.startsWith('rr');
  }

  const initial = normalized[0];
  if (!initial) return false;
  if (initial === letter.lowercase || initial === letter.id) {
    return true;
  }
  if (letter.id === 'q' && raw.startsWith('qu')) {
    return true;
  }
  if (letter.id === 'x' && initial === 'x') {
    return true;
  }
  // H muda: se trata como grafema inicial, no como sonido /h/
  if (letter.id === 'h' && (initial === 'h' || raw.startsWith('h'))) {
    return true;
  }
  return false;
}

export function wordEndsWithLetter(wordText, letter) {
  const raw = wordText.trim().toLowerCase();
  const normalized = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (!normalized) return false;

  if (letter.id === 'enie') {
    return raw.endsWith('ñ');
  }
  if (letter.id === 'rr') {
    return normalized.endsWith('rr');
  }

  const last = normalized[normalized.length - 1];
  return last === letter.lowercase || last === letter.id;
}

export function pickWordForLetter(letter, options = {}) {
  const { requireInitial = false } = options;
  const valid = letter.words.filter((entry) => wordStartsWithLetter(entry.word, letter));
  if (valid.length) {
    return valid[Math.floor(Math.random() * valid.length)];
  }
  // Niveles 2–3: oír fonema → dibujo/palabra debe EMPEZAR por ese sonido (nunca Piñata para ñ).
  if (requireInitial) {
    return null;
  }
  return letter.words[Math.floor(Math.random() * letter.words.length)];
}

/** Letras con al menos una palabra que empieza por ese grafema/fonema (válidas en niv. 2–3). */
export function lettersWithInitialWord(allLetters) {
  return allLetters.filter((letter) =>
    letter.words.some((entry) => wordStartsWithLetter(entry.word, letter))
  );
}

/** Palabra que termina en esa letra (free/premium según isPremium) */
export function pickWordEndingWithLetter(letter, isPremium = false) {
  const fromGlobal = getAllWords(isPremium).filter((entry) =>
    wordEndsWithLetter(entry.word, letter)
  );
  if (fromGlobal.length) {
    return fromGlobal[Math.floor(Math.random() * fromGlobal.length)];
  }
  const fromLetter = letter.words.filter((entry) => wordEndsWithLetter(entry.word, letter));
  if (fromLetter.length) {
    return { ...fromLetter[Math.floor(Math.random() * fromLetter.length)], letter };
  }
  return { ...pickWordForLetter(letter), letter };
}

/** Letras para inicial/final (sin dígrafos que no van ahí) */
export function lettersForEdgePhoneme(allLetters, position = 'initial', isPremium = false) {
  return allLetters.filter((letter) => {
    if (letter.id === 'rr') return false;
    if (position === 'initial') {
      return letter.words.some((w) => wordStartsWithLetter(w.word, letter));
    }
    return getAllWords(isPremium).some((w) => wordEndsWithLetter(w.word, letter));
  });
}

export function getSentencesForLevel(levelId) {
  return SENTENCES.filter((sentence) => sentence.level === levelId);
}

export function buildPartialWord(wordText, position = 'initial') {
  const word = wordText.trim();
  if (position === 'final') {
    return `${word.slice(0, -1)}_`;
  }
  if (position === 'middle') {
    const index = getMiddleGapIndex(word);
    return `${word.slice(0, index)}_${word.slice(index + 1)}`;
  }
  return `_${word.slice(1)}`;
}

export function getMissingCharForGap(wordText, position = 'initial') {
  const word = wordText.trim();
  if (position === 'final') {
    return word[word.length - 1];
  }
  if (position === 'middle') {
    const index = getMiddleGapIndex(word);
    return word[index];
  }
  return word[0];
}

export function findLetterForChar(char, letters) {
  if (!char) return null;
  const raw = String(char).toLowerCase();
  // ñ no debe normalizarse a n (NFD + quitar tilde)
  if (raw === 'ñ') {
    return letters.find((letter) => letter.id === 'enie') ?? null;
  }
  const normalized = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return (
    letters.find((letter) => letter.id === normalized || letter.lowercase === normalized) ?? null
  );
}

// message y key van juntos en el audio de feedback (tono de maestra, infantil)
export const FEEDBACK_UI = {
  success: [
    { key: 'muy_bien', message: '¡Muy bien!' },
    { key: 'estupendo', message: '¡Estupendo!' },
    { key: 'genial', message: '¡Genial!' },
    { key: 'excelente', message: '¡Excelente!' },
    { key: 'fantastico', message: '¡Fantástico!' },
    { key: 'bravo', message: '¡Bravo!' },
    { key: 'perfecto', message: '¡Perfecto!' },
    { key: 'sigue_asi', message: '¡Sigue así!' },
    { key: 'lo_has_conseguido', message: '¡Lo has conseguido!' },
    { key: 'muy_buena_respuesta', message: '¡Muy buena respuesta!' },
    { key: 'que_bien_lo_haces', message: '¡Qué bien lo haces!' },
    { key: 'estas_aprendiendo_muchisimo', message: '¡Estás aprendiendo muchísimo!' },
    { key: 'muy_buena_eleccion', message: '¡Muy buena elección!' },
    { key: 'excelente_trabajo', message: '¡Excelente trabajo!' },
    { key: 'que_rapido', message: '¡Qué rápido!' },
    { key: 'lo_hiciste_genial', message: '¡Lo hiciste genial!' },
    { key: 'fantastico_trabajo', message: '¡Fantástico trabajo!' },
  ],
  retry: [
    { key: 'intentalo_otra_vez', message: 'Inténtalo otra vez.' },
    { key: 'casi_lo_tienes', message: 'Casi lo tienes.' },
    { key: 'vamos_otra_vez', message: 'Vamos, otra vez.' },
    { key: 'prueba_otra_vez', message: 'Prueba otra vez.' },
  ],
  levelComplete: [
    { key: 'has_terminado_el_nivel', message: '¡Has terminado el nivel!' },
    { key: 'felicidades', message: '¡Felicidades!' },
    { key: 'genial', message: '¡Genial!' },
    { key: 'excelente', message: '¡Excelente!' },
    { key: 'lo_has_conseguido', message: '¡Lo has conseguido!' },
  ],
  scaffold: [
    { key: 'es_esta_eligela', message: '¡Es esta! Elígela.' },
    { key: 'mira_es_esta', message: '¡Mira! Es esta.' },
    { key: 'aqui_esta_eligela', message: '¡Aquí está! Elígela.' },
    { key: 'casi_mira_es_esta', message: '¡Casi! Mira, es esta.' },
  ],
};

export function pickRandomFeedback(category) {
  const pool = FEEDBACK_UI[category];
  return pool[Math.floor(Math.random() * pool.length)];
}
