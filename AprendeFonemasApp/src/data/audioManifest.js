
// Lista para grabar / placeholders / audioRegistry (npm run audio:placeholders)
// Campos: key, file, text, how, free, category, level

const FREE_PHONEMES = [
  { id: 'a', text: 'aaaaaaaa', how: 'Vocal abierta sostenida ~1–1,5 s. Speed 0,75–0,85 · estabilidad Robusto/Natural. NO <phoneme> Arpabet. NO "a de avión".' },
  { id: 'e', text: 'eeeeeeee', how: 'Vocal clara sostenida. Speed baja · tono plano. NO "e de elefante".' },
  { id: 'i', text: 'iiiiiiii', how: 'Vocal alta sostenida. Speed baja · tono plano. NO "i de iglú".' },
  { id: 'o', text: 'oooooooo', how: 'Vocal redondeada sostenida. Speed baja · tono plano. NO "o de oso".' },
  { id: 'u', text: 'uuuuuuuu', how: 'Vocal posterior sostenida. Speed baja · tono plano. NO "u de uva".' },
  { id: 'p', text: 'p', how: 'Explosiva seca. Labios juntos y suelta. NO decir "pe".' },
  { id: 'm', text: 'mmm', how: 'Labios cerrados, sonido nasal sostenido.' },
  { id: 'l', text: 'llll', how: 'Lengua arriba, sonido líquido sostenido.' },
  { id: 's', text: 'ssss', how: 'Como serpiente, sin vocal después. NO "ese".' },
  { id: 't', text: 't', how: 'Explosiva seca con la lengua. NO decir "te".' },
];

const PREMIUM_PHONEMES = [
  { id: 'b', text: 'b', how: 'Explosiva suave /b/. NO "be". Igual que V en español de España.' },
  { id: 'c', text: 'k', how: 'Sonido duro /k/ como en "casa". NO "ce".' },
  { id: 'd', text: 'd', how: 'Explosiva seca. NO "de".' },
  { id: 'f', text: 'ffff', how: 'Soplar suavemente, sostenido.' },
  { id: 'g', text: 'g', how: 'Como en "gato" (/g/ duro). NO "ge".' },
  {
    id: 'h',
    text: '(silencio / no usar)',
    how: 'H muda en español: NO grabar aliento tipo inglés. Generar 0,3–0,5 s de silencio o omitir en producción (la app ya no usa H en niveles 1–3).',
  },
  { id: 'j', text: 'jjjj', how: 'Como en "jardín" (/x/). Si dice «ja», probar texto validado (ver guion: Casos validados). NO "jota".' },
  { id: 'k', text: 'k', how: 'Explosiva /k/ (mismo sonido que C y Q).' },
  { id: 'n', text: 'nnn', how: 'Sonido nasal sostenido. NO "ene".' },
  { id: 'enie', text: 'ñññ', how: 'Como en "niño". NO "eñe".' },
  { id: 'q', text: 'k', how: 'Siempre /k/ (qu…). NO "cu".' },
  {
    id: 'r',
    text: 'rrr',
    how: 'Para letra R: vibrante múltiple clara (como inicio de Rana). NO decir "erre".',
  },
  { id: 'rr', text: 'rrrr', how: 'Vibrante múltiple fuerte (como en "perro" / "torre").' },
  {
    id: 'v',
    text: 'b',
    how: 'Español de España: V = B (/b/). NO labiodental inglesa. Igual que phonemes/b.',
  },
  { id: 'w', text: 'w', how: 'Como inicio de «Waterpolo» (aprox. /gu/ o /w/). NO deletrear.' },
  { id: 'x', text: 'ks', how: 'Como en "taxi": k+s rápido (grafema X).' },
  { id: 'y', text: 'yyyy', how: 'Como en "yogur" (/ʝ/).' },
  {
    id: 'z',
    text: 'zzzz (ceceo /θ/)',
    how: 'Español de España: /θ/ como en «zapato» (ceceo). NO /s/. NO decir «zeta».',
  },
];

const FREE_WORDS = {
  a: ['Avión', 'Árbol', 'Abeja', 'Araña', 'Agua'],
  e: ['Elefante', 'Estrella', 'Escuela', 'Espejo', 'Erizo'],
  i: ['Iglú', 'Isla', 'Invierno', 'Insecto', 'Iguana'],
  o: ['Oso', 'Ojo', 'Oruga', 'Ola', 'Oreja'],
  u: ['Uva', 'Unicornio', 'Uniforme', 'Uvas', 'Uña'],
  p: ['Pato', 'Pelota', 'Perro', 'Pájaro', 'Pizarra'],
  m: ['Manzana', 'Mono', 'Música', 'Mamá', 'Mariposa', 'Mosquito'],
  l: ['León', 'Luna', 'Libro', 'Lápiz', 'Loro'],
  s: ['Sol', 'Silla', 'Sapo', 'Sandía', 'Sopa'],
  t: ['Toro', 'Tren', 'Tomate', 'Tambor', 'Tortuga'],
};

const PREMIUM_WORDS = {
  b: ['Barco', 'Boca', 'Bicicleta', 'Bota', 'Botón'],
  c: ['Casa', 'Coche', 'Conejo', 'Camión', 'Cuna'],
  d: ['Dado', 'Delfín', 'Diente', 'Dedo', 'Dulce'],
  f: ['Flor', 'Familia', 'Fresa', 'Foca', 'Fuego'],
  g: ['Gato', 'Globo', 'Guitarra', 'Gusano', 'Galleta'],
  h: ['Hada', 'Helado', 'Hilo', 'Hueso', 'Hoja'],
  j: ['Jirafa', 'Juguete', 'Jardín', 'Jabón', 'Jamón'],
  k: ['Koala', 'Kiwi', 'Karate', 'Ketchup', 'Kimono'],
  n: ['Nube', 'Nariz', 'Noche', 'Naranja', 'Nido'],
  enie: ['Niño', 'Niña', 'Muñeca', 'Piñata', 'Mañana'],
  q: ['Queso', 'Quince', 'Quiosco', 'Quesadilla'],
  r: ['Rana', 'Ratón', 'Rosa', 'Reloj', 'Río', 'Raqueta'],
  rr: ['Torre', 'Barro', 'Tierra', 'Burro', 'Arroz'],
  v: ['Vaca', 'Vela', 'Ventana', 'Violeta', 'Vaso'],
  w: ['Waterpolo', 'Wifi', 'Walkie'],
  x: ['Xilófono', 'Taxi', 'Extraterrestre'],
  y: ['Yogur', 'Yoyo', 'Yate', 'Yema', 'Yegua'],
  z: ['Zapato', 'Zorro', 'Zanahoria', 'Zumo', 'Zoo'],
};

/** Rimas / extras en content.js que no están en el pool por letra */
const EXTRA_WORDS = ['Masa', 'Lana', 'Color', 'Marco'];

const PREMIUM_SENTENCES = [
  { id: 'el_pato_nada', text: 'El pato nada.', level: '12', how: 'Pausado, claro, tono amable.' },
  { id: 'el_sapo_salta', text: 'El sapo salta.', level: '12', how: 'Frase corta, ritmo lento.' },
  { id: 'el_tren_llega', text: 'El tren llega.', level: '12', how: 'Leer «El tren llega.» Clara y pausada.' },
  { id: 'el_perro_corre', text: 'El perro corre.', level: '12', how: 'Énfasis suave en el verbo.' },
  { id: 'el_gato_duerme', text: 'El gato duerme.', level: '12', how: 'Natural, suave.' },
  { id: 'el_leon_ruge', text: 'El león ruge.', level: '12', how: 'Natural, claro.' },
  { id: 'la_nina_canta', text: 'La niña canta.', level: '12', how: 'Natural, alegre.' },
  { id: 'el_nino_juega', text: 'El niño juega.', level: '12', how: 'Natural, alegre.' },
  { id: 'tengo_una_manzana', text: 'Tengo una manzana.', level: '12', how: 'Pausado en «manzana». Ceceo /θ/ en «manzana».' },
  { id: 'leo_un_libro', text: 'Leo un libro.', level: '12', how: 'Primera persona, claro.' },
  { id: 'la_mesa_es_grande', text: 'La mesa es grande.', level: '12', how: 'Énfasis suave en palabras clave.' },
  { id: 'la_casa_es_azul', text: 'La casa es azul.', level: '12', how: 'Color al final, pausado. Ceceo /θ/ en «azul».' },
  { id: 'mi_mama_cocina', text: 'Mi mamá cocina.', level: '12', how: 'Natural, cariñoso.' },
  { id: 'mi_perro_es_grande', text: 'Mi perro es grande.', level: '12', how: 'Natural, cariñoso.' },
  { id: 'la_mariposa_vuela', text: 'La mariposa vuela.', level: '12', how: 'Ritmo fluido.' },
  { id: 'una_estrella_brilla', text: 'Una estrella brilla.', level: '12', how: 'Ritmo fluido.' },
  { id: 'la_luna_brilla', text: 'La luna brilla.', level: '12', how: 'Frase corta, clara.' },
  { id: 'el_sol_brilla', text: 'El sol brilla.', level: '12', how: 'Frase corta, clara.' },
  { id: 'la_mama_lee', text: 'La mamá lee.', level: '12', how: 'Natural, suave.' },
  { id: 'el_nino_come', text: 'El niño come.', level: '12', how: 'Natural, claro.' },
];

const FEEDBACK = [
  { id: 'muy_bien', text: '¡Muy bien!', free: true, use: 'Acierto normal', tone: 'alegria' },
  { id: 'estupendo', text: '¡Estupendo!', free: true, use: 'Acierto destacado', tone: 'alegria' },
  { id: 'genial', text: '¡Genial!', free: true, use: 'Acierto con entusiasmo', tone: 'alegria' },
  { id: 'excelente', text: '¡Excelente!', free: true, use: 'Racha de aciertos', tone: 'alegria' },
  { id: 'fantastico', text: '¡Fantástico!', free: true, use: 'Acierto difícil', tone: 'alegria' },
  { id: 'bravo', text: '¡Bravo!', free: true, use: 'Alternativa de refuerzo', tone: 'alegria' },
  { id: 'perfecto', text: '¡Perfecto!', free: true, use: 'Sin errores en el ejercicio', tone: 'alegria' },
  { id: 'sigue_asi', text: '¡Sigue así!', free: true, use: 'Entre ejercicios', tone: 'alegria' },
  { id: 'lo_has_conseguido', text: '¡Lo has conseguido!', free: true, use: 'Acierto / celebración', tone: 'alegria' },
  { id: 'muy_buena_respuesta', text: '¡Muy buena respuesta!', free: true, use: 'Acierto', tone: 'alegria' },
  { id: 'que_bien_lo_haces', text: '¡Qué bien lo haces!', free: true, use: 'Acierto', tone: 'alegria' },
  { id: 'estas_aprendiendo_muchisimo', text: '¡Estás aprendiendo muchísimo!', free: true, use: 'Acierto / motivación', tone: 'alegria' },
  { id: 'muy_buena_eleccion', text: '¡Muy buena elección!', free: true, use: 'Acierto', tone: 'alegria' },
  { id: 'excelente_trabajo', text: '¡Excelente trabajo!', free: true, use: 'Acierto destacado', tone: 'alegria' },
  { id: 'que_rapido', text: '¡Qué rápido!', free: true, use: 'Acierto rápido', tone: 'alegria' },
  { id: 'lo_hiciste_genial', text: '¡Lo hiciste genial!', free: true, use: 'Acierto', tone: 'alegria' },
  { id: 'fantastico_trabajo', text: '¡Fantástico trabajo!', free: true, use: 'Acierto destacado', tone: 'alegria' },
  { id: 'intentalo_otra_vez', text: 'Inténtalo otra vez.', free: true, use: 'Error suave', tone: 'calma' },
  { id: 'casi_lo_tienes', text: 'Casi lo tienes.', free: true, use: 'Error cercano', tone: 'calma' },
  { id: 'vamos_otra_vez', text: 'Vamos, otra vez.', free: true, use: 'Animar tras error', tone: 'calma' },
  { id: 'prueba_otra_vez', text: 'Prueba otra vez.', free: true, use: 'Segundo intento', tone: 'calma' },
  { id: 'has_terminado_el_nivel', text: '¡Has terminado el nivel!', free: true, use: 'Fin de nivel', tone: 'alegria' },
  { id: 'felicidades', text: '¡Felicidades!', free: true, use: 'Fin de nivel / logro', tone: 'alegria' },
  { id: 'es_esta_eligela', text: '¡Es esta! Elígela.', free: true, use: 'Tras revelar pista', tone: 'calma' },
  { id: 'mira_es_esta', text: '¡Mira! Es esta.', free: true, use: 'Tras revelar pista', tone: 'calma' },
  { id: 'aqui_esta_eligela', text: '¡Aquí está! Elígela.', free: true, use: 'Tras revelar pista', tone: 'calma' },
  { id: 'casi_mira_es_esta', text: '¡Casi! Mira, es esta.', free: true, use: 'Tras revelar pista', tone: 'calma' },
];

const INSTRUCTIONS = [
  // Ids = slug del texto grabado (lo grabado manda)
  { id: 'escucha_y_elige_la_letra', text: 'Escucha y elige la letra.', free: true, level: '1' },
  { id: 'escucha_y_elige_el_dibujo', text: 'Escucha y elige el dibujo.', free: true, level: '2' },
  { id: 'escucha_y_elige_la_palabra', text: 'Escucha y elige la palabra.', free: true, level: '3' },
  { id: 'con_que_letra_empieza', text: '¿Con qué letra empieza?', free: true, level: '4' },
  { id: 'cuantas_silabas_tiene', text: '¿Cuántas sílabas tiene?', free: false, level: '5' },
  { id: 'con_que_silaba_empieza', text: '¿Con qué sílaba empieza?', free: false, level: '6' },
  { id: 'con_que_letra_termina', text: '¿Con qué letra termina?', free: false, level: '7' },
  { id: 'elige_la_que_rima', text: 'Elige la que rima.', free: false, level: '8' },
  { id: 'junta_los_sonidos_y_elige_la_palabra', text: 'Junta los sonidos y elige la palabra.', free: false, level: '9' },
  { id: 'que_letra_falta_al_final', text: '¿Qué letra falta al final?', free: false, level: '10' },
  { id: 'que_letra_falta_en_medio', text: '¿Qué letra falta en medio?', free: false, level: '11' },
  { id: 'lee_la_frase_y_elige_el_dibujo', text: 'Lee la frase y elige el dibujo.', free: false, level: '12' },
  { id: 'elige_la_que_empieza_igual', text: 'Elige la que empieza igual.', free: false, level: 'legacy' },
];

/** Tutorial primer uso (niños 3–7: debe oírse, no solo leerse) */
const TUTORIAL = [
  {
    id: 'escucha',
    text: 'Escucha. Pulsa el botón naranja para oír el sonido o la palabra.',
    free: true,
  },
  {
    id: 'elige',
    text: 'Elige. Toca la tarjeta con la respuesta correcta.',
    free: true,
  },
  {
    id: 'estrellas',
    text: 'Estrellas. Si aciertas a la primera, ganarás más estrellas.',
    free: true,
  },
];

/** Pistas / celebración de nivel / gran final (UI hablada) */
const UI_VOICE = [
  { id: 'toca_la_tarjeta_verde', text: 'Toca la tarjeta verde.', free: true, use: 'Pista scaffold' },
  { id: 'increible', text: '¡Increíble!', free: true, use: 'Celebración 3 estrellas' },
  { id: 'bien_hecho', text: '¡Bien hecho!', free: true, use: 'Celebración 1 estrella' },
  { id: 'genial_tres_estrellas', text: '¡Genial! Tres estrellas.', free: true, use: 'Mensaje tras nivel' },
  { id: 'muy_bien_dos_estrellas', text: '¡Muy bien! Dos estrellas.', free: true, use: 'Mensaje tras nivel' },
  { id: 'bien_hecho_sigue_practicando', text: '¡Bien hecho! Sigue practicando.', free: true, use: 'Mensaje tras nivel' },
  // Gran final (12 niveles) — varias frases para no oír siempre lo mismo
  { id: 'campeon', text: '¡Campeón!', free: false, use: 'Gran final' },
  { id: 'lo_has_logrado', text: '¡Lo has logrado!', free: false, use: 'Gran final' },
  { id: 'has_completado_todos_los_niveles', text: '¡Has completado todos los niveles!', free: false, use: 'Gran final' },
  { id: 'eres_un_campeon_de_los_fonemas', text: '¡Eres un campeón de los fonemas!', free: false, use: 'Gran final' },
  { id: 'que_orgullo', text: '¡Qué orgullo!', free: false, use: 'Gran final' },
];

/** Frases de audio del gran final (misma voz, elegir al azar en pantalla) */
const FINAL_CELEBRATION_VOICE = UI_VOICE.filter((item) => item.use === 'Gran final');

function slugify(word) {
  return word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

/** Notas de pronunciación español de España para ElevenLabs */
function wordHow(word, base) {
  const tips = [];
  const ascii = word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (word === 'Uña') {
    tips.push('decir «Uña», no «Una»');
  }
  if (/z/i.test(word)) {
    tips.push('ceceo /θ/ (España)');
  }
  if (/v/i.test(word)) {
    tips.push('V=/b/');
  }
  if (/^h/i.test(ascii)) {
    tips.push('H muda (sin aspirar)');
  }
  if (/^x/i.test(ascii)) {
    tips.push('X inicial natural es-ES');
  }

  if (!tips.length) return base;
  return `${base} · ${tips.join(' · ')}`;
}

function buildManifest() {
  const manifest = [];

  for (const p of FREE_PHONEMES) {
    manifest.push({
      key: `phonemes/${p.id}`,
      file: `phonemes/${p.id}.mp3`,
      text: p.text,
      how: p.how,
      free: true,
      category: 'phoneme',
      level: '1,2,3,4',
    });
  }

  for (const p of PREMIUM_PHONEMES) {
    manifest.push({
      key: `phonemes/${p.id}`,
      file: `phonemes/${p.id}.mp3`,
      text: p.text,
      how: p.how,
      free: false,
      category: 'phoneme',
      level: '1,2,3,4 (premium)',
    });
  }

  for (const [letterId, words] of Object.entries(FREE_WORDS)) {
    for (const word of words) {
      const slug = slugify(word);
      manifest.push({
        key: `words/${slug}`,
        file: `words/${slug}.mp3`,
        text: word,
        how: wordHow(word, 'Palabra natural, pausada, tono amable. NO deletrear.'),
        free: true,
        category: 'word',
        letter: letterId,
        level: '2,3,4,5',
      });
    }
  }

  for (const [letterId, words] of Object.entries(PREMIUM_WORDS)) {
    for (const word of words) {
      const slug = slugify(word);
      manifest.push({
        key: `words/${slug}`,
        file: `words/${slug}.mp3`,
        text: word,
        how: wordHow(word, 'Palabra natural, pausada. Misma voz que el resto.'),
        free: false,
        category: 'word',
        letter: letterId,
        level: '2,3,4,5 (premium)',
      });
    }
  }

  for (const word of EXTRA_WORDS) {
    const slug = slugify(word);
    manifest.push({
      key: `words/${slug}`,
      file: `words/${slug}.mp3`,
      text: word,
      how: wordHow(word, 'Palabra natural, pausada. Usada en rimas (nivel 8). Misma voz.'),
      free: false,
      category: 'word',
      letter: 'extra-rhyme',
      level: '8',
    });
  }

  for (const s of PREMIUM_SENTENCES) {
    manifest.push({
      key: `sentences/${s.id}`,
      file: `sentences/${s.id}.mp3`,
      text: s.text,
      how: s.how,
      free: false,
      category: 'sentence',
      level: s.level,
    });
  }

  for (const f of FEEDBACK) {
    const howByTone =
      f.tone === 'calma'
        ? 'Calma, tranquilizadora, sin enfado. Breve.'
        : 'Alegría moderada, cálida, sin gritar. Breve.';
    manifest.push({
      key: `feedback/${f.id}`,
      file: `feedback/${f.id}.mp3`,
      text: f.text,
      how: howByTone,
      free: f.free,
      category: 'feedback',
      use: f.use,
    });
  }

  for (const i of INSTRUCTIONS) {
    const isQuestion = i.text.trim().startsWith('¿');
    manifest.push({
      key: `instructions/${i.id}`,
      file: `instructions/${i.id}.mp3`,
      text: i.text,
      how: isQuestion
        ? 'Claro, lento, tono de maestra. Pregunta: final SIEMPRE ascendente.'
        : 'Claro, lento, tono de maestra. Conversacional.',
      free: i.free,
      category: 'instruction',
      level: i.level,
    });
  }

  for (const t of TUTORIAL) {
    manifest.push({
      key: `tutorial/${t.id}`,
      file: `tutorial/${t.id}.mp3`,
      text: t.text,
      how: 'Claro, lento, tono de maestra. Tutorial para niños.',
      free: t.free,
      category: 'tutorial',
    });
  }

  for (const u of UI_VOICE) {
    manifest.push({
      key: `ui/${u.id}`,
      file: `ui/${u.id}.mp3`,
      text: u.text,
      how: 'Cálido, breve, tono de maestra.',
      free: u.free,
      category: 'ui',
      use: u.use,
    });
  }

  return manifest;
}

const AUDIO_MANIFEST = buildManifest();

module.exports = {
  AUDIO_MANIFEST,
  FREE_PHONEMES,
  PREMIUM_PHONEMES,
  FREE_WORDS,
  PREMIUM_WORDS,
  EXTRA_WORDS,
  PREMIUM_SENTENCES,
  FEEDBACK,
  INSTRUCTIONS,
  TUTORIAL,
  UI_VOICE,
  FINAL_CELEBRATION_VOICE,
  slugify,
};
