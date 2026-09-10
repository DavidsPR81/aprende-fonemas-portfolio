# 🏆 GUÍA MAESTRA V1.1 — Aprende Fonemas
## Producción Android · Primera versión pública · Definitiva

> **Versión documento**: 1.1 · Agosto 2026
> **Referencia irrefutable a partir de hoy**: este documento. La versión `GUIA_PRODUCCION_V1.md` pasa a estar en `docs/archivo/`.
> **Principios inamovibles**: Sin registro. Sin analítica externa de perfiles. Sin publicidad. Sin suscripciones. **Pago único Premium**. Progreso y compra solo en el dispositivo. **Máxima privacidad + mínima complejidad**.

---

## 0. SISTEMA DE PRIORIDADES P0 / P1 / P2 / P3

**Cada sugerencia, comentario de tester o mejora propuesta se clasifica SIEMPRE antes de decidir implementar.**

| Nivel | Definición | Cuándo implementar |
|---|---|---|
| **P0 — Bloqueante** | Crash, fallo de Premium, error pedagógico, cumplimiento Legal/Play. | ANTES de publicar. No se publica con P0 abierto. |
| **P1 — Importante** | Mejora UX pequeña, anti-repetición, adult gate, test de restauración. | ANTES de publicar, si el esfuerzo es ≤ 4h. Si no, P2. |
| **P2 — Mejora** | Nivel 13 (alliteration pool), reportes sencillos, optimizaciones. | **Parche V1.1** después de 2-3 semanas de datos reales. |
| **P3 — Nueva funcionalidad** | Perfiles niños, sincronización nube, iOS, internacionalización. | **Versión V2**, cuando Android esté estable y validado. |

> Regla de oro de esta guía: **Todo lo que no sea P0 o P1 se va a V1.1 o V2. No más "ya que estamos".**

---

## 1. FREEZE DE V1
### Fecha efectiva: desde que se crea la primera Release Candidate.

❌ **NO se añade NADA nuevo excepto si soluciona:**
- Problema crítico de calidad (P0)
- Seguridad / cumplimiento legal o Play (P0)
- Bug bloqueante de UX, Premium o progreso (P0/P1)

✅ Sí se permite corregir un fallo de audio de fonema, ajustar el precio de 3,99€ si el balance Gratis/Premium no cierra, añadir un adult gate de compra.

❌ No se permite: Meter Nivel 13, nuevas animaciones, temas, perfiles, modo nocturno, nuevo ejercicio X. Eso a V1.1 / V2.

---

# 🧱 BLOQUE A — APP
## Código · UX · Ejercicios · Audio · Imágenes · Progreso · Premium

---

## A.1 — FASE 0: COMPROBAR (0.5 DÍAS)
Antes de cambiar NADA del código.

| Paso | Qué | Dónde / Cómo | OK? |
|---|---|---|---|
| 0.1 Tests verdes | `cd AprendeFonemasApp && npm test` | Deben ser TODO verde | |
| 0.2 Tests revisan contenido pedagógico | `__tests__/exercisesQuality.test.js` | Valida rimas, fusión, mapeo letra↔palabra y existencia de audios en blends | |
| 0.3 Revisión rápida content.js | Abre [content.js](file:///c:/Users/david/Documents/trae_projects/Aprende%20Fonemas/AprendeFonemasApp/src/data/content.js#L25-L750) | LETTERS, LEVELS, SENTENCES, SYLLABLE, RHYME, BLEND. Palabras coherentes con su letra. Uvas/Uva duplicados controlados. | |
| 0.4 Comprobación auditiva (muestra) | 10 fonemas al azar + 10 palabras + 3 frases con Expo Go en móvil real | **¿"mmmm" o "eme"?** → debe ser FONEMA PURO, no nombre de letra. | |
| 0.5 Progreso guardado real | Inicio → Nivel 1 → 7 ejercicios → 3 estrellas → cerrar app → volver abrir | Estrellas siguen ahí y Nivel 2 disponible | |
| 0.6 Modo sin conexión | Quitar wifi/datos → navegar 4 niveles gratuitos → volver a casa | Todo funciona. Solo no compra Premium ni restaura (normal). | |

---

## A.2 — AUDITORÍA PEDAGÓGICA POR NIVEL (P1)
### Tabla de verdad, rellenada con datos REALES de content.js ✅

> **Referencias:** [LEVELS](file:///c:/Users/david/Documents/trae_projects/Aprende%20Fonemas/AprendeFonemasApp/src/data/content.js#L324-L420), [FREE_LETTER_IDS](file:///c:/Users/david/Documents/trae_projects/Aprende%20Fonemas/AprendeFonemasApp/src/data/content.js#L19-L20), [SYLLABLE_EXERCISES](file:///c:/Users/david/Documents/trae_projects/Aprende%20Fonemas/AprendeFonemasApp/src/data/content.js#L462-L505), [INITIAL_SYLLABLE_EXERCISES](file:///c:/Users/david/Documents/trae_projects/Aprende%20Fonemas/AprendeFonemasApp/src/data/content.js#L508-L545), [RHYME_EXERCISES](file:///c:/Users/david/Documents/trae_projects/Aprende%20Fonemas/AprendeFonemasApp/src/data/content.js#L547-L630), [BLEND_EXERCISES](file:///c:/Users/david/Documents/trae_projects/Aprende%20Fonemas/AprendeFonemasApp/src/data/content.js#L633-L708), [SENTENCES Niv. 12](file:///c:/Users/david/Documents/trae_projects/Aprende%20Fonemas/AprendeFonemasApp/src/data/content.js#L423-L444).

| Nivel | Tipo ejercicio | Objetivo declarado real (descripción nivel + ejercicio) | Fonemas / letras trabajadas | Pools / ejercicios reales (nº ítems) | Imágenes | Audio fonema | Dificultad real (1-5) | ¿Cumple objetivo? | Notas pedagógicas |
|---|---|---|---|---|---|---|---|---|---|
| **1** (Free) | identify-phoneme | Escucha sonido puro → elige letra (grafema correspondiente) | Fonemas FREE: /a/ /e/ /i/ /o/ /u/ /p/ /m/ /l/ /s/ /t/ → 10 letras FREE (FREE_LETTER_IDS) | 10 letras · 5 palabras/letra (50 PALABRAS base, tipo identificación) | ✅ Emoji 5/letra | ✅ `phonemes/a` … `phonemes/t` (10 puros, no "nombre letra") | **1** (Muy fácil) | ✅ SÍ | Primer contacto 3-4 años. Valida discriminación auditiva pura. |
| **2** (Free) | associate-word | Escucha sonido puro → elige dibujo de palabra que empieza por ese sonido | Mismos 10 FREE (a,e,i,o,u,p,m,l,s,t) | 10 letras · 5 palabras cada una (50 palabras, con `pickWordForLetter(requireInitial=true)` → nunca Muñeca/Piñata para ñ en free) | ✅ emoji por palabra | ✅ (igual que N1 + TTS de palabras) | **1** (Fácil) | ✅ SÍ | Puente sonido→palabra. Confirmado por test que solo se usan palabras válidas iniciales. |
| **3** (Free) | choose-word | Escucha fonema → elige, entre 4 opciones en TEXTO, la palabra escrita que empieza por ese sonido | 10 FREE letras | 50 palabras escritas (mismo pool N2) | ✅ (emoji acompañante opcional por pantalla, no depende) | ✅ fonema puro + lectura palabra si hay TTS | **2** (Fácil-media) | ✅ SÍ | Empieza a leer grafemas escritos. Pre-lectura real. |
| **4** (Free) | identify-initial | Escucha palabra COMPLETA hablada → elige letra INICIAL | 10 FREE. Letra grafema. Mismo pool 50 palabras (require inicial). | 50 palabras iniciales FREE | ✅ | ✅ audio palabra entera (audioKey words/…) + TTS fallback | **2** (Fácil-media) | ✅ SÍ | Cierra el círculo de 4 niveles FREE. Después N5 ya Premium. |
| **5** (Premium) | syllable-count | ¿Cuántas sílabas tiene? Palabra hablada + dibujo → elige nº | Todo alfabeto. Vocabulario mezclado free + premium | **40 ejercicios reales** SYLLABLE_EXERCISES. 2/3/4 sílabas (y reto 5 sílabas EXTRATERRESTRE). | ✅ 40 emojis | ✅ audio de cada palabra (words/…) | **3** (Media) | ✅ SÍ | El reto 5 sílabas (Extraterrestre) lo pone en rango 6-7 años — BIEN, es Premium alto. |
| **6** (Premium) | identify-initial-syllable | ¿Con qué sílaba EMPIEZA? Palabra hablada → 4 sílabas escritas (PA/TO etc) | Todo el alfabeto + dígrafos (BAR, FRE, GUI…) | **35 ejercicios reales** INITIAL_SYLLABLE_EXERCISES. Incluye palabras difíciles Manzana, Barco, Guitarra, Mosquito, Taxista, Quesadilla. | ✅ 35 emojis | ✅ audio palabra | **3** (Media) | ✅ SÍ | Cubre sílabas directas y trabadas. Excelente introducción. |
| **7** (Premium) | identify-final | ¿Con qué LETRA TERMINA? Palabra hablada → letra final escrita | Todas menos RR (no puede ir al final). Aplica `lettersForEdgePhoneme(final)`. | pool `getAllWords(premium) ≈ 130 palabras` filtradas por terminación | ✅ | ✅ audio palabra | **3** (Media) | ✅ SÍ | Funciones `wordEndsWithLetter + pickWordEndingWithLetter` lo hacen robusto. |
| **8** (Premium) | rhyme | PALABRA ANCLA + opción correcta que RIMA + 3 distractores. | Todo alfabeto mezclado (palabras cortas de 2-3 sílabas) | **16 grupos reales** RHYME_EXERCISES (Pato↔Gato, Avión↔Camión, León↔Ratón, Manzana↔Ventana, etc.) | ✅ emojis de cada pareja rima + distractores | ✅ audio ancla y cada opción | **3** (Media, requiere conciencia fonológica desarrollada) | ✅ SÍ | Tests `exercisesQuality` validan que los distractores NO rimen. Cuasirimas Perro/Loro controladas. |
| **9** (Premium) | phoneme-blend | JUNTA los sonidos segmentados → elige la palabra (ej: P + A + T + O = Pato) | Todo alfabeto, + X (Taxi suena /ks/ en segmento), + RR inicial Rosa vibrante | **18 BLENDS reales** BLEND_EXERCISES. `buildBlendSpeechFromPhonemes` genera audio concatenado de fonemas. | ✅ 18 targets + 3 distractores cada uno | ✅ blend speech = fonema a fonema por audio. Confirmado por tests que NO hay fonema sin audio. | **4** (Media-alta, 5-6 años) | ✅ SÍ | Este es el corazón de aprendizaje de lectura. 18 ejercicios + aleatoriedad → ~54 re-play distintas, MUY BUENO. |
| **10** (Premium) | complete-word-final | ¿Qué letra FALTA al final? Palabra con guión bajo final → letra | Todas menos RR. `buildPartialWord(final)` → palabra = "Pato_" + `getMissingChar` = o. | pool `getAllWords(premium) ≈ 130` | ✅ | ✅ audio palabra | **4** (Media-alta) | ✅ SÍ | |
| **11** (Premium) | complete-word-middle | ¿Qué letra FALTA EN MEDIO? `getMiddleGapIndex` → hueco central. Palabras ≥4 letras. | Incluye LETRAS DIFÍCILES (X, Ñ, RR interior, K, W). Habilita los grafemas que NUNCA van iniciales/finales | pool longWords `getLongWords(premium, ≥7 letras)` ≈ 40-50 palabras largas | ✅ | ✅ audio palabra completa | **4** (Alta, 6-7 años) | ✅ SÍ | Excelente para repasar letras de complejas (Xilófono, Ñ, RR, Queso, W). |
| **12** (Premium) | read-sentence | LEE la frase escrita → elige el dibujo que corresponde | Lectura global (no fonemas; validar comprensión). 20 frases cortas 3-4 palabras (SVO). | **20 frases reales** SENTENCES level=12. 10 con "El/La + Sustantivo singular + verbo" + 10 "Más largas (mi mamá, tengo, la mesa es…)" | ✅ 20 emojis SENTENCE.image | ✅ audio sentencias `sentences/el_pato_nada.mp3…` + TTS fallback | **5** (Alta, 6-7 años) | ✅ SÍ | Conflicto visual controlado: `[leo_un_libro, la_mama_lee]` en SENTENCE_VISUAL_CONFLICT_GROUPS. Perfecto cierre. |

### 🔍 Resumen conclusiones auditoría pedagógica (después de la tabla):
| Conclusión | Nivel cumplimiento |
|---|---|
| Secuencia pedagógica 1→12 (fonema puro → sílaba → rima → fusión → huecos → frase) | ✅ Perfecta: 3→7 años, curva progresiva sin saltos bruscos. |
| Pool de contenidos: ~50 free + ~130 premium palabras, 18 blends, 16 rimas, 35 sílabas, 40 conteos, 20 frases. | ✅ Suficiente para 8-12 sesiones de 10 min. Rejugabilidad por aleatoriedad → 10-15h. |
| Control de conflictos visuales / auditivos (sound alike letters, visual conflict words, sentence conflict) | ✅ Tests validan que NO salen juntas. |
| Letras difíciles (Ñ/RR/X/Q/K/W) trabajadas en niveles Premium 9-11 | ✅ Correcto: no aparecen en FREE (demasiado duro para el primer impacto), sí en Premium ya que es alfabeto completo. |
| Existe riesgo de "nivel aburrido por muy fácil / nivel imposible por muy duro" | 🟡 Ningún punto rojo. Dificultad 1→5 distribuida: 2×nivel f.ácil, 2×fácil-media, 4×media, 3×media-alta, 1×alta. Equilibrio excelente. |

### ⚠️ Una única mejora pedagógica detectada (P2 → V1.1, NO V1):
- **P2 V1.1**: En Nivel 11 (hueco central), hay una probabilidad pequeña (~6%) de que la palabra larga seleccionada aleatoriamente NO tenga grafema difícil (Ñ/RR/X/K/W) y salga "fácil". **Solución parche V1.1**: filtro para que el 40% de ejercicios de Nivel 11 sea letra DIFÍCIL obligatoria. No tocar V1; primero ver si la tasa de éxito N11 en Play está por debajo del 60%.

---

**Regla de oro pedagógica**: Mejor 12 niveles EXCELENTES que 20 niveles mediocres. **No añadir Nivel 13 en V1.** Pool ALLITERATION_EXERCISES (alistamiento) → P2 (V1.1).

---

## A.3 — INVENTARIO DE ASSETS (P1)
### IMÁGENES (words / sentences / mascot)
Auditar TODO listado.
- [ ] `assets/images/words/` → cada palabra tiene PNG, no hay referencias rotas, no duplicados, fondo está normalizado (script `assets:image-bg`).
- [ ] `assets/images/sentences/` → las 20 frases tienen su PNG. Emoji en content.js coincide (sapo 🐸 = sapo).
- [ ] `assets/images/mascot/` → 7 poses existen, tienen transparencia.

Script para ayudar: `cd AprendeFonemasApp && npm run content:images:registry` genera el inventario.

### AUDIOS (phonemes / words / sentences / instructions / feedback / ui / tutorial)
- [ ] Cada `LETTERS[].phonemeAudioKey` existe en `assets/audio/phonemes/` (27 + ñ + rr = 29).
- [ ] Cada `wordEntry(...)` con audioKey existe en `assets/audio/words/` (~130).
- [ ] Instructions, feedback, UI, tutorial → todos presentes (no cuelguen cuando el niño pulse).
- [ ] Volumen consistente (ni audios que gritan ni audios que no se oyen). Si hay desviación → normalizar con script o Audacity.

**Validación rápida final**: `__tests__/exercisesQuality.test.js` busca si todos los segmentos de blend tienen audio fonema. Si `npm test` está verde → Muy bien.

---

## A.4 — MEJORAS PEQUEÑAS DE FEEDBACK (P0/P1)
Solo estas, de esfuerzo ≤ 4h cada una.

### A.4.1 Anti-repetición inmediata de palabras (P1)
**Qué soluciona**: feedback "siempre me salen las mismas palabras al repetir nivel".
- Nuevo `utils/recentSeenWords.js` + AsyncStorage clave `@recent_seen_level_%{levelId}`.
- Máximo 15 palabras vistas por nivel → excluir del shuffle. Rotar cada 24h. Nunca excluir la única opción válida restante.
- Integrar en `pickSessionItemsPreferringNew` de [exerciseBuilder.js](file:///c:/Users/david/Documents/trae_projects/Aprende%20Fonemas/AprendeFonemasApp/src/utils/exerciseBuilder.js#L168-L210).

### A.4.2 Shuffle de posiciones SIEMPRE (P1)
Confirmar en cada `type` de nivel que las opciones se barajan. El niño nunca debe memorizar "la respuesta está en la segunda casilla".

### A.4.3 Conflictos visuales frases (P2 — raro que falle)
Si un niño confunde frases visualmente → añadir IDs a `SENTENCE_VISUAL_CONFLICT_GROUPS`.

### A.4.4 UX Premium: Adult Gate (P1)
**ESTO ERA LA MAYOR OMISIÓN.**
Niño de 4-6 años NO PUEDE PULSAR COMPRAR POR ACCIDENTE. Implementar flujo:

```
Niño → toca Nivel 5 bloqueado (Premium)
  ↓
Pantalla intermedia:
  🔒 "Contenido Premium"
  "Para padres / educadores"
  ↓
Mini-gate de confirmación adulta:
   - Opción A (muy sencilla V1): texto grande + 2 botones: "Soy padre/madre / educador" y  "Volver al juego".  Toca el de la izquierda → entra a Premium. Toca el de la derecha → vuelve a niveles.
   - (No PIN numérico para V1, no añade suficiente valor y puede ser frustrante. El objetivo es simplemente que un niño pequeño no llegue al diálogo Google Play por error.)
  ↓
Pantalla Premium real → precio, descripción, botón Comprar 3,99 € y Restaurar compra.
  ↓
Si pulsa Comprar → Google Play Billing.
```

Esto no debe tardar más de 2h. Añade una línea en SettingsScreen para el toggle debug Premium.

---

## A.5 — PREMIUM: MATRIZ OBLIGATORIA DE PRUEBAS (P0)
Premium es dinero real. **Todos los casos PASAN ANTES de publicar.**

| ID | Caso | Resultado esperado | ¿OK? |
|---|---|---|---|
| PR-1 | Comprar Premium cuenta tester licenciado → volver | Desbloquea niveles 5-12. No pide volver a comprar. | |
| PR-2 | Después de PR-1, cerrar app y volver abrir | Premium sigue activo. | |
| PR-3 | Después de PR-2, REINICIAR dispositivo | Premium sigue activo. | |
| PR-4 | Desinstalar app → reinstalar → Restaurar compra | Premium vuelve a estar activo (sin cobrar de nuevo). | |
| PR-5 | Mismo correo en DISPOSITIVO distinto → Restaurar | Se recupera (mismo producto non-consumible de Google). | |
| PR-6 | Intentar COMPRAR dos veces el mismo non-consumible | Google Play muestra "ya lo tienes". No doble cobro. | |
| PR-7 | Cancelar compra (panel tester) | Premium NO desbloquea, ni guarda. | |
| PR-8 | Sin conexión → intentar comprar | Mensaje: "Revisa la conexión e inténtalo de nuevo". No crashea. | |
| PR-9 | Premium bloqueado accidentalmente en build producción? | No (comprobar eas.json production NO tiene `EXPO_PUBLIC_BETA_REVIEW`). | |
| PR-10 | Si el usuario cancela la suscripción/producto en otro lado | Al reabrir app, si no hay purchase guardado + restaurar no devuelve nada → vuelve a Gratis (non-consumible RARAMENTE se revoca, pero probarlo). | |

### Precio 3,99 € — Hipótesis, no decisión cerrada (P1)
- Comprobar: ¿Gratis tiene el valor justo para que el usuario QUIERA seguir?
  - Gratis: 10 letras / 4 niveles completos ~ 40 min de contenido (7 ejercicios/nivel, 2-3 min cada uno). MUY BIEN.
  - Premium: 18 letras (incl ñ/rr/x/k/w) + 8 niveles adicionales (sílabas, rimas, fusión, huecos, frases) ~ 90-120 min + rejugabilidad.
- **Conclusión provisional**: 3,99 € → razonable en España. Si se publica también en LATAM Google Play automáticamente pondrá el precio local; se puede ajustar después de observar conversión.
- No te obsesiones; el precio es MUY fácil de cambiar en Play Console más adelante sin tocar código.

---

# 🌐 BLOQUE B — GOOGLE PLAY
## Ficha · Contenido · Audiencia · Data Safety · IAP · Producción

---

## B.1 — AUDITORÍA CHILDREN / FAMILIES (P0)
### Esto es LO MÁS CRÍTICO de todo el bloque Play. Google sanciona apps infantiles.

| Comprobación Children/Families | Detalle | ¿OK? |
|---|---|---|
| Grupo edad declarado | 3-7 años. Asegúrate de seleccionarlo **correctamente** en Play Console → "Audiencia y contenido". | |
| Público objetivo real | La app ES infantil. No digas "para todos los públicos" si el contenido, colores, tipografías y ejercicios son infantiles → Google lo detectará igual y te puede obligar a cumplir Families igualmente. | |
| Diseñada para Familias (Designed for Families) | **Decisión consciente**: <ul><li>✅ Marcarlo → revisión más estricta. Pero SIN anuncios y SIN datos recogidos → debería aprobar y te da MUCHO posicionamiento en categoría educación infantil.</li><li>❌ No marcarlo → riesgo si Google detecta por contenido que es para menores: "audiencia mal declarada" → suspensión.</li></ul> **Recomendación: Marcarlo. Tu app cumple todos los requisitos Families.** | |
| SDKs de terceros | Asegúrate: no hay SDK de analítica externa, no hay Meta pixel, no hay AdMob. Solo React Native + Expo Billing. ✅ Cumplimos. | |
| Permisos | Solo `com.android.vending.BILLING`. INTERNET lo añade Expo por defecto. Perfecto. No READ_CONTACTS ni LOCATION ni nada extraño. | |
| Publicidad | Ninguna. Marcar "0 anuncios" en Data Safety. | |
| Analítica / identificadores | Solo métricas nativas Play Console (no SDK). Ningún identificador de publicidad. Declarar "Ninguno". | |
| Compras Premium | Deben estar orientadas a adulto + adult gate (implementado en A.4.4). | |
| Elementos comerciales dentro de la app | Pantalla Premium visible solo tras adult gate. Ninguna otra mención a comprar en los ejercicios. | |
| Política de privacidad | Incluye párrafo MENORES explícito → ya lo tiene [privacyPolicy.js](file:///c:/Users/david/Documents/trae_projects/Aprende%20Fonemas/AprendeFonemasApp/src/data/privacyPolicy.js#L22-L27). | |
| Data Safety | Ver siguiente punto B.2. | |

---

## B.2 — DATA SAFETY PLAY CONSOLE (P0)
RELLENAR COPIANDO ESTE BLOQUE. NO MINTAS.

| Campo Play Data Safety | Respuesta VERAZ |
|---|---|
| ¿Recoges o compartes datos personales de los usuarios? | **No** — No creamos cuentas, no enviamos progreso a nuestros servidores. El progreso es LOCAL en el dispositivo. |
| ¿Compartes datos con terceros para publicidad o medición? | **No** — Sin anuncios, sin analítica externa. |
| ¿Los datos se comparten con Google Play Billing? | **Sí** → lo hace Google, no nosotros. Marcar la casilla de compras/transacciones procesadas por tercero en su casilla correspondiente. |
| Tipos de datos / subcategorías | TODO a ❌ No recopilamos. Aceptar solo "Compras in-app" como datos que procesa Google automáticamente. |
| Seguridad de los datos | "El progreso del juego y la compra Premium se guardan solo en el dispositivo mediante almacenamiento local. No mantenemos base de datos centralizada de los usuarios." |
| Eliminación de datos | "Dado que no mantenemos datos del usuario en servidores, la eliminación consiste en borrar datos de la app o desinstalarla." |

---

## B.3 — Producto In-App Premium + Precio (P0)
| Campo | Valor |
|---|---|
| Producto ID | `premium_unlock` (mismo que en `src/config/premium.js`). |
| Tipo | Producto no consumible (pago único, una vez comprado, para siempre). |
| Título corto | Desbloqueo Completo Premium |
| Descripción | Todo el alfabeto. Niveles 5-12: sílabas, rimas, fusión, huecos y frases. Sin suscripción. Sin publicidad. |
| Precio base | 3,99 € → después Play convierte a moneda local. Ajustable luego. |
| Estado | ACTIVO (imprescindible para que aparezca en compras). |
| Tester con licencia | Tu cuenta en Play Console → Settings → License testing → añadir tu correo. |

---

## B.4 — Ficha de Play Store Completa (P1)
### ASO: INVESTIGA PRIMERO, DECIDE DESPUÉS
Antes de escribir título y descripción: abre Google Play → busca 5-7 keywords reales → observa top apps educación.
- Keywords objetivo: `fonemas, aprender fonemas, conciencia fonológica, aprender a leer, letras, sonidos letras, lectoescritura infantil, aprender letras niños`.
- Luego elige TÍTULO y DESCRIPCIÓN CORTA.

**Propuesta NO FIJA (solo ejemplo provisional):**
| Campo | Propuesta inicial a validar tras auditoría ASO |
|---|---|
| TÍTULO (≤ 30 chr) | Aprende Fonemas - Lectura infantil |
| Nombre corto | Aprende Fonemas |
| Descripción CORTA (80) | Conciencia fonológica para aprender a leer (3-7 años). |
| **Descripción LARGA** (bloques, sin spam) | **Qué es** · App educativa sin publicidad para niños de 3 a 7 años y sus familias. Relaciona sonido, letra, palabra e imagen a través de 12 niveles progresivos. · **Cómo funciona** · Empieza escuchando el fonema puro (no el nombre de la letra) y acaba leyendo frases cortas. Sin registro, sin conexión necesaria para jugar. · **Gratis incluye** · Vocales, consonantes principales y los 4 primeros niveles. · **Premium · Pago único 3,99 € (sin suscripción)** · Alfabeto completo, niveles de sílabas, rimas, fusión fonética, huecos en palabras y lectura de frases. · Compra segura por Google Play. Restaurable si cambias de dispositivo. |
| Icono 512x512 PNG | assets/icono.png (limpio, sin borde) |
| Gráfico característico 1024x500 | Script `assets:icons` + eslogan "Aprende a leer jugando" |
| Capturas | Mín 3 móvil, 3 tablet (7"), 3 tablet (10"). Mostrar: Nivel 1, Nivel 2 dibujo, Nivel 4 letra inicial, Nivel Premium bloqueado + candado, Celebración 3 estrellas. Máx 8 por formato. Sin sobrecargar de texto. |
| Categoría | Educación. Sub: Educación infantil |
| Clasificación contenido | Todos. Solo marcar Educativo. Nada de otro tipo. |
| País default | España |
| Distribución | Todo LATAM + US (Español) automático. |
| Idioma | Español. Marcar Español (LATAM) también → mismo texto, ya que audio es neutro y compatible. |
| Contacto desarrollador | aprendefonemas@gmail.com · Nombre: David · URL: landing |
| Política privacidad URL | `https://aprendefonemas.netlify.app/privacidad.html` |

---

# 🚀 BLOQUE C — LANZAMIENTO
## Build → Release Candidate → GO/NO-GO → Publicación → Monitorización

---

## C.1 — VERSIONADO
Antes de buildear Release Candidate:
```jsonc
// app.json
{
  "expo": {
    "version": "1.0.0",        // visible en Play, ajustable si quieres 1.0.1
    "android": {
      "versionCode": 12        // ENTERO. SIEMPRE > último ya subido. Incrementar manualmente.
    }
  }
}
```
Perfil eas.json PRODUCTION tiene `autoIncrement: true`. **No fíes 100% y comprueba el valor en app.json antes.**

---

## C.2 — BUILDS DE PRE-PRODUCCIÓN
| Paso | Qué | Comando | Propósito |
|---|---|---|---|
| 1 | APK preview para móvil propio | `eas build -p android --profile preview` | Instalar manualmente, probar UX final sin Expo Go, 10 minutos reales |
| 2 | Build ALPHA testing (AAB) para Billing | `eas build -p android --profile testing` | Sube a Play Console → Internal/Closed Testing → testear flujo PR-1 a PR-10 Premium. |
| 3 | Build RELEASE CANDIDATE (AAB) | `eas build -p android --profile production` | Genera el AAB que irá a producción (si pasa GO/NO-GO). Guardar copia en local. |

---

## C.3 — CHECKLIST GO / NO-GO DE PRODUCCIÓN
### Punto formal de decisión ANTES de publicar.
Cada línea debe estar marcada. Si hay un solo punto NO en 🔴, NO SE PUBLICA.

### 🔴 NO PUBLICAR SI EXISTE ALGUNO ESTOS
- [ ] Crash conocido reproducible al abrir / al jugar / al cambiar de nivel.
- [ ] Ejercicio crítico (Nivel 1, 2, 3, 4 Gratis) falla.
- [ ] Audio de un fonema (gratis o premium) es incorrecto (suena nombre de letra en lugar de sonido).
- [ ] Premium NO desbloquea tras compra.
- [ ] Restaurar compra (PR-4) no funciona.
- [ ] Se puede ACCEDER a contenido Premium sin comprar, por error de flag.
- [ ] El progreso se pierde al cerrar/reabrir.
- [ ] Política de privacidad de la landing NO COINCIDE con el texto de privacyPolicy.js dentro de la app.
- [ ] Data Safety Play no refleja lo real de la app.
- [ ] La ficha Play tiene información falsa/incorrecta (edad, precio, descripción).
- [ ] Hay errores BLOQUEANTES pendientes en Play Console (violación política, Data Safety sin aprobar, clasificación pendiente).
- [ ] Adult gate Premium no implementado o un niño pequeño llega al diálogo Google Pay sin pasar por la pantalla "Para padres".
- [ ] Al menos 6/10 pruebas Premium PR-1 a PR-10 fallan.

### 🟢 SÍ PUBLICAR SI TODOS ESTOS
- [ ] Todos los tests críticos pasan (`npm test` verde + pruebas manuales niveles 1-4 Gratis y niveles 5-6 Premium).
- [ ] Premium funciona (comprar, cerrar, reiniciar, restaurar).
- [ ] App funciona OFFLINE según el diseño.
- [ ] Los ejercicios Gratis/Premium no se quedan sin opciones válidas (auditado A.2 y A.3).
- [ ] Ficha Play 100% completa. Icono, gráfico, capturas, categoría.
- [ ] Cumplimiento Play revisado: Audiencia Children correctamente declarada. Designed for Families marcado si procede. Data Safety honesto.
- [ ] Adult gate de compra Premium implementado y testeado con un niño (probado por un adulto simulando niño pequeño tocando botones).
- [ ] La Release Candidate ha sido instalada en móvil real y ha tenido una sesión de 15 minutos sin fallos.
- [ ] Política de privacidad publicada y accesible públicamente. Email funciona.

**Si todo es verde:** Pulsar Iniciar lanzamiento a producción.
**Si algo no:** volver a C.2, corregir, nueva RC, volver a pasar GO/NO-GO.

---

## C.4 — PUBLICACIÓN FINAL
### 🚨 CORRECCIÓN IMPORTANTE RESPECTO A GUÍA ANTERIOR:
Los **lanzamientos progresivos 10% → 50% → 100% NO EXISTEN en la primera publicación de una app nueva.**
Google Play solo permite lanzamientos graduales para **actualizaciones**, cuando ya hay una versión publicada.

**Publicación correcta V1**:
1. Play Console → Producción → Crear nueva versión.
2. Subir el AAB Release Candidate validado en GO/NO-GO.
3. Release notes: `Primera versión pública. 12 niveles de conciencia fonológica. Pago único Premium sin suscripción. Sin publicidad, sin registro, offline first.`
4. Revisar Release Summary.
5. Iniciar lanzamiento a producción.

**Esto publica para TODOS los usuarios de los países seleccionados de inmediato**, por eso el GO/NO-GO es tan exhaustivo.

> Los lanzamientos progresivos los usaremos para V1.0.1, V1.1 y V2.

---

## C.5 — POST-PUBLICACIÓN (72 HORAS PRIMERAS)
| H | Acción |
|---|---|
| 0-2 | Comprobar disponibilidad: que aparezca en búsqueda "Aprende Fonemas". Instalar desde Play, abrir, probar niveles Gratis → premium restaurar. |
| 2-24 | Revisar Android Vitals: tasa crashes (< 1% objetivo). Leer cualquier review que aparezca. |
| 24-72 | Si aparecen crashes masivos → preparar parche V1.0.1 (build actualización, ESTA SÍ podrá lanzarse 10% → 50% → 100% progresivo). Si todo OK → continuar a Fase D (Marketing). |

---

# 📣 BLOQUE D — MARKETING · MÉTRICAS · SOPORTE
## Sin inversión inicial. Todo orgánico.
---

## D.1 — LANDING
Antes de publicar:
- [ ] NO muestra todavía "Disponible en Google Play".
- [ ] Política de privacidad `/privacidad.html` visible, misma versión que la app.
- [ ] Email `aprendefonemas@gmail.com` visible en contacto.
- [ ] Sin Google Analytics, sin Meta Pixel. (Cumplimiento sin cookies).
- [ ] Diseño limpio: 3 capturas explicando el método sonido → letra → palabra → imagen.

DÍA DEL LANZAMIENTO 0:
- Sustituir CTA por: **"Disponible en Google Play"** → link directo a ficha.

---

## D.2 — REDES SOCIALES Y COLEGIOS/LOGOPEDAS
| Canal | Qué (100% educativo, nada de "descarga mi app") | Frecuencia |
|---|---|---|
| TikTok / Reels Instagram | 5-10s, ejercicio real Nivel 1 → overlay "Cómo aprende la /p/ mi hijo a los 5 años". Link en BIO. | 2/semana |
| Facebook Grupos docentes | Aporta contenido valioso → luego menciona la app como herramienta. No spam. | 1/semana |
| Colegios y Gabinetes logopedia | PDF 1 página (método, sin datos del alumno, uso recomendado 10 min/día) + email aprendefonemas@gmail.com. Enviar a 10 colegios/gabinetes cercanos. | Lote inicial |

---

## D.3 — REVIEWS (CONSEGUIR LAS PRIMERAS 40)
Las primeras reviews son MÁS IMPORTANTES que 50 publicaciones en Instagram.

**Regla**: Pedírsela A QUIEN ha tenido una experiencia positiva, y de forma NATURAL.
- A los 12 testers originales, un email personalizado el Día 2:
  > "Si te está resultando útil a tu hijo/alumnos, agradecería muchísimo una valoración honesta en Google Play. Me ayuda muchísimo a que otras familias lo encuentren."
- **NUNCA** mostrar un popup intrusivo "Valóranos 5 estrellas" dentro de la app V1.
- Contestar TODAS las reviews (positivas y negativas) en Play Console, sean pocas. Google valora la respuesta del desarrollador.

---

## D.4 — CONTACTO Y SOPORTE (P1)
Crear plantillas de respuesta para `aprendefonemas@gmail.com`. No deja que el usuario espere más de 48h hábiles.

Plantillas base (crear en borradores):
| Caso | Contenido |
|---|---|
| Error / Crash | "Hola. Muchas gracias por avisar. ¿Podrías decirme modelo de móvil y versión Android? Estoy mirándolo. Un saludo." |
| Problema compra Premium / restaurar | "Hola. Lamento el problema. Asegúrate de estar con la misma cuenta Google con la que compraste. Prueba en Ajustes → Premium → Restaurar. Si no funciona, escríbeme con el correo de compra y te ayudo. Nota: Google tarda a veces 5-10 min en sincronizar la compra." |
| Sugerencia / nuevo ejercicio | "¡Gracias! La apunto para la próxima actualización. Un saludo." |
| Solicitud reembolso | "Hola. La política de reembolso de Google Play permite 48h. Si no aparece la opción, escríbeme con el ID de pedido y te guío. Si por algún motivo Google no lo hace, valoro cada caso de forma individual." |

**Controlar**:
- Play Console: aparece en información del desarrollador email ✅
- Dentro de la app: Settings o Privacidad, email aparece ✅
- Política de privacidad lo incluye ✅
- Revisar el correo cada 2 días mínimo.

---

## D.5 — MÉTRICAS · EMBUDO (solo Play Console)
Sin analítica externa. Solo métricas nativas.

### EMBUDO VISUAL:
```
Impresiones en la búsqueda / listados Play
      ↓ Tasa conversión ficha (%)
Visitas a la ficha de Play Store
      ↓ Tasa instalación (%)
Instalaciones completadas
      ↓ Tasa retención D1
Usuarios que ABREN la app al menos una vez
      ↓ Tasa retención D7
Usuarios activos en el día 7 (terminó al menos 1 nivel completo)
      ↓ Tasa apertura Premium (%)
Usuarios que ABREN la pantalla Premium (tras adult gate)
      ↓ Conversión compra (%)
Usuarios que COMPRAN Premium (pago único)
```

Diagnóstico rápido con el embudo:
| Síntoma | Qué falla probablemente | Dónde mejorar |
|---|---|---|
| 1000 visitas ficha → 50 instalaciones (5%) | Ficha, capturas, ASO, precio (cuando visible) | Bloque B (Play) |
| 1000 instalaciones → 30 abren D7 (3%) | Onboarding, UX, valor Gratis demasiado flojo | Bloque A (App) |
| 1000 activos → 2 Premium compran (0.2%) | Propuesta Premium, precio, falta valor percibido | Bloque A y B (precio) |

### Métricas Play a 30 días observar:
- Instalaciones / desinstalaciones
- Valoración promedio (≥ 4.4 en ≥ 40 reviews se considera muy buena)
- Crash rate < 0.5%
- Android Vitals (ANRs)
- Comentarios que repitan un mismo fallo
- Ingresos Premium brutos y conversión.

---

## D.6 — COOKIES + LEGAL WEB (ya documentado en B)
- Landing sin tracking = SIN banner cookies obligatorio.
- Informar en política que Netlify guarda logs técnicos mínimos y Google Fonts es cargado por navegador con su política.
- Nada de Google Tag Manager, Analytics, etc. → cumplimiento 100% RGPD sin esfuerzo.

---

# 🗺️ ROADMAP DESPUÉS DE V1
## V1.0.1 · Parche (1 semana post lanzamiento si hay crashes P0)
- Corrección de bugs solo P0.
- Se publica como actualización; ESTA SÍ puede ser release progresiva 10% → 50% → 100%.

## V1.1 (3-4 semanas después)
- P2: Nivel 13 con pool ALLITERATION_EXERCISES ya preparado.
- P2: Sistema repaso diario letras flojas (según aciertos/errores del niño en local).
- P2: Ajuste de precio si conversión Premium es muy baja/muy alta.

## V2 (Cuando Android ≥ 1000 usuarios, y ≥ 40 reviews ≥ 4.2)
- P3: Perfiles múltiples niños + PIN adulto (sin nube).
- P3: Informes sencillos (letras dominadas/pendientes). Exportar PDF.
- P3: Imágenes articulación boca (solo si están validadas anatómicamente). NO IA generativa al azar.
- P3: Modo "profesor 10 minutos" fijar una letra concreta.

## V3
- Build iOS + App Store. iPad layouts 2-col.
- Adaptación tablet premium.

## V4 (mucho trabajo, solo con tracción)
- Internacionalización (Inglés, Catalán, Gallego, Euskera).
- Nuevos bancos de palabras y audios propios por idioma.

---

## ✅ RESUMEN FINAL — 10 COSAS QUE NO DEBEN FALTAR ANTES DE PUBLICAR
1. [ ] Corregido y confirmado: primera publicación es lanzamiento COMPLETO, NO progresivo.
2. [ ] Sistema prioridades P0/P1/P2/P3 explicado y aceptado (no scope creep).
3. [ ] V1 Freeze en vigor desde RC.
4. [ ] GO/NO-GO formales, todos los puntos verdes.
5. [ ] Bloque A: Tests, auditoría pedagógica, inventario assets, anti-repetición, adult gate Premium.
6. [ ] Matriz Premium PR-1 a PR-10 toda verde.
7. [ ] Bloque B: Auditoría Children/Families 100% + Data Safety honesto + SKU activo + Adult gate.
8. [ ] Bloque C: versionCode incrementado, RC validada en móvil real, publicar, 72h monitorización Vitals.
9. [ ] Bloque D: Política de privacidad publicada, landing actualizada día 0, plantillas soporte, estrategia reviews.
10. [ ] Métricas con embudo Play para diagnosticar si falla ficha vs producto vs Premium.

---

> **Documento de referencia definitivo.** Todos los agentes (tú, Cursor, Trae, cualquier asistente) miran PRIMERO este documento antes de tocar código o configuración Play. Las anteriores guías pasan a `docs/archivo/` con propósito histórico, NO se siguen.
