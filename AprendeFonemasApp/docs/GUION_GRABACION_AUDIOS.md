# Guía + guion ElevenLabs — Aprende Fonemas (español de España)

> **Documento único** para generar todos los MP3 con Text to Speech (ElevenLabs v3).
> Incluye: cómo trabajar · configuración · entonación · catálogo completo fila a fila.
>
> **PDF para imprimir / tablet:** [GUION_GRABACION_AUDIOS.pdf](GUION_GRABACION_AUDIOS.pdf) · CSV: [ELEVENLABS_IMPORT.csv](ELEVENLABS_IMPORT.csv)
>
> Regenerar: `npm run audio:guion` · `npm run audio:guion:pdf`

**Idioma fijo: español de España (Castilla / ceceo).** No uses seseo.

> **Total clips: 243** · Gratis: 101 · Premium: 142

Cada fila del catálogo = **un MP3**. El nombre de archivo debe coincidir exactamente (ruta relativa bajo assets/audio/).

---

## Cómo usar este documento en ElevenLabs

```
Misma voz (profesora)  →  pegar texto de la fila  →  Eleven v3 TTS  →  escuchar  →  MP3  →  assets/audio/...
```

1. Abre Text to Speech con tu **voz fija** + modelo **eleven_v3**.
2. Trabaja **por bloques** (ver orden más abajo): no mezcles fonemas con celebraciones.
3. Copia el **texto exacto** de cada fila.
4. Ajusta solo entrega (estabilidad, emoción, pausas) según el tipo.
5. Revisa la checklist → exporta MP3 con el nombre indicado.

Licencia: **comercial** (app de pago en Play Store).

---

## Flujo real (Text to Speech)

Este proyecto **no** usa Voice Design, Voice Cloning ni creación de una voz nueva.

Vas a repetir este ciclo para cada fila del guion:

1. Elegir **siempre la misma voz** (profesora infantil ya seleccionada).
2. Pegar el **texto exacto** de la columna.
3. Ajustar solo controles de entrega (estabilidad, emoción/etiquetas, pausas) según el tipo de clip.
4. Generar con **ElevenLabs v3** (`eleven_v3`) → Text to Speech.
5. Escuchar → exportar MP3 → guardar con el nombre de archivo indicado.

---

## Qué NO hacemos

- ❌ Voice Design / diseñar una voz con prompt
- ❌ Voice Cloning / entrenar o clonar una voz nueva
- ❌ Cambiar de voz entre clips
- ❌ Grabar con iPhone + Audacity (flujo antiguo; obsoleto para v1)

---

## Voz seleccionada

| Campo | Valor |
|-------|--------|
| Voz | La misma profesora infantil ya elegida (biblioteca / cuenta) |
| Modelo | Eleven v3 (`eleven_v3`) en todos los clips |
| Idioma | Español de España |
| Personaje (comportamiento) | Profesora cálida, clara, paciente, 3–7 años |
| Edad percibida | 30–40 años |
| Estilo | Aula / cuento: amable, lenta, sin gritar |
| Formato salida | MP3 mono 128–192 kbps |

**Reglas:**

- No cambiar de voz a mitad de proyecto.
- No modificar la identidad de la voz entre bloques.
- El texto de cada fila es el **script hablado**, no un “prompt para diseñar voz”.

> Si en el futuro ElevenLabs muestra un campo tipo *Character Prompt* para esa voz, úsalo solo para el **comportamiento** (cálida, infantil, paciente). Nunca para inventar otra voz.

---

## Configuración fija de ElevenLabs

Antes de cada sesión de generación, deja fijos:

- ✔ Mismo **modelo** (v3)
- ✔ Misma **voz**
- ✔ Mismo **idioma** (es-ES)
- ✔ Mismo **volumen** / loudness percibido
- ✔ Misma **calidad** / bitrate de exportación
- ✔ Mismo **formato** (MP3)
- ✔ Misma **estabilidad** base (recomendado: Natural; Creativo solo si una celebración lo necesita y suena bien)

**Nunca** cambies configuración entre bloques del mismo día sin anotarlo. Si cambias, regenera el bloque entero.

---

## Configuración por tipo de audio

| Tipo | Objetivo de entrega | Controles / etiquetas (v3) |
|------|---------------------|----------------------------|
| Fonemas | Neutral, solo sonido | Sin dramatizar; sin risas; estabilidad Natural/Robusto |
| Palabras | Natural | Sin etiquetas emocionales fuertes |
| Frases | Conversacional | Puntuación natural; preguntas con ¿? |
| Instrucciones | Profesora clara | Lento; preguntas con final ascendente |
| Tutorial | Profesora paciente | Claro, explicativo, sin prisas |
| Feedback acierto / UI celebración de nivel | Alegría **moderada** | `[excited]` suave o mayúsculas puntuales; nunca gritar |
| Feedback error / pista | Calma | Suave; nunca enfado; sin sarcasmo |
| **Gran final** (12 niveles) | Alegría especial, orgullo | Más energía que un acierto normal, sin chillar |

---

## Entonación (reglas)

No reescribas el texto del catálogo salvo correcciones de pronunciación documentadas abajo.

| Tipo | Regla |
|------|--------|
| Fonemas | Solo el sonido. **Nunca** añadir vocales de apoyo («ja», «pe», «eme»). |
| Palabras | Natural. Sin dramatizar. |
| Frases | Conversación normal de aula. |
| Preguntas (`¿…?`) | Final **siempre ascendente**. Nunca plano. |
| Celebraciones de nivel | Alegría moderada. Nunca exagerada ni chillona. |
| Gran final | Orgullo y alegría; más emotivo que un «¡Muy bien!», sin gritar. |
| Correcciones / pistas | Muy tranquilizadoras. Nunca enfadada. |

### Pausas (Eleven v3)

- Preferir puntuación natural (…, —, comas).
- Si hace falta pausa explícita: etiqueta break de Eleven (máx. ~3 s). **No abusar** (inestabilidad / artefactos).
- En fonemas y palabras cortas: **no** uses breaks.

### Emoción (Eleven v3)

- Etiquetas de audio (`[excited]`, `[curious]`, …) solo en celebraciones/tutorial/gran final si mejoran el resultado.
- Si la etiqueta se oye dicha en voz alta, regenera **sin** etiqueta.
- No uses efectos (`[applause]`, etc.) en este proyecto.

### Pronunciación avanzada (opcional)

- En **v3** usa IPA nativo: `"/transcripción/"` (NO etiquetas XML `<phoneme>` ni CMU Arpabet: eso es de v2).
- En **fonemas sostenidos** (aaaa, mmm…) suele funcionar **mejor** repetir letras que el IPA.
- Validar siempre a oído con **esta** voz (el IPA no es 100 % estable).

---

## Pronunciación de fonemas (cómo hacerlo en Eleven v3)

### Qué NO uses

- ❌ `<phoneme alphabet="cmu-arpabet" …>` → **no aplica a v3** (es de modelos v2 / flash_v2).
- ❌ Decir «a de avión», «pe», «eme», «jota».
- ❌ Estabilidad **Creativo** + etiquetas `[excited]` en fonemas (entonación rara).

### Receta para vocales largas (a, e, i, o, u) — app de fonemas

Objetivo: tono **plano**, sonido **sostenido ~1–1,5 s**, como en clase.

1. **Texto:** `aaaaaa` (6–10 letras iguales). Empieza con 8: `aaaaaaaa`.
2. **Velocidad (Speed):** baja a **0,75–0,85** (más lento = más largo y claro).
3. **Estabilidad:** **Robusto** o **Natural** (nunca Creativo en este bloque).
4. **Sin** etiquetas de emoción ni breaks.
5. Genera **3–5 veces** y quédate con la más plana y limpia.
6. Si sigue corta: sube a 10–12 letras (`aaaaaaaaaaaa`) o baja un poco más la velocidad.

| Vocal | Texto a probar primero | IPA v3 (solo si falla) |
|-------|------------------------|-------------------------|
| A | `aaaaaaaa` | `"/aː/"` o `"/aaaa/"` |
| E | `eeeeeeee` | `"/eː/"` |
| I | `iiiiiiii` | `"/iː/"` |
| O | `oooooooo` | `"/oː/"` |
| U | `uuuuuuuu` | `"/uː/"` |

> Tip: el IPA alarga con `ː` (dos puntos triangulares). Si Eleven “canta” la vocal, vuelve al texto con letras repetidas + velocidad baja.

### Consonantes

| Tipo | Ejemplo texto | Nota |
|------|---------------|------|
| Sostenidas (m, s, f, l, n, ñ, r…) | `mmmm`, `ssss`, `ffff` | Misma receta: velocidad baja, tono plano |
| Explosivas (p, t, k, b, d, g) | una sola letra: `p`, `t`, `k` | Cortas a propósito; NO «pe» |
| J (/x/) | `jjjj` | Si dice «ja», anota en Casos validados la cadena que sí funcione |

1. El niño debe oír el **fonema**, no el nombre de la letra.
2. Si Eleven convierte el fonema en sílaba → **incorrecto** (ja / pe / eme).
3. Valida **cada** fonema a oído; no copies ciegamente el IPA de otro idioma.

---

## Casos validados para este proyecto

> Rellena esta tabla con lo que confirmes al generar. Es la sección más útil a medio plazo.

| Clip / caso | Texto / ajustes que SÍ funcionan en Eleven v3 | Evitar | Notas |
|-------------|-----------------------------------------------|--------|-------|
| Vocales `a e i o u` | Letras ×8–12 + Speed ~0,8 + estabilidad Robusto/Natural | `<phoneme>` Arpabet; Creativo | Anotar el texto exacto que uses |
| `phonemes/j` | *(probar `jjjj`; si dice «ja», probar IPA o la sintaxis que valides)* | «ja», «jota» | Documentar cadena exacta |
| `phonemes/h` | silencio 0,3–0,5 s (o archivo silencioso) | aspiración inglesa | No usar H en niveles 1–3 |
| `phonemes/v` | mismo resultado que `b` | /v/ labiodental inglesa | V = B en es-ES |
| `phonemes/z` | ceceo /θ/ sostenido (`zzzz` o IPA) | /s/ (seseo) | |
| `words/una` | «Uña» | «Una» | El archivo se llama `una.mp3` |

---

## Reglas obligatorias (español de España)

1. **Misma voz** en los 243 clips.
2. Fonemas = solo el **sonido**, nunca el nombre de la letra.
3. **H muda**: `phonemes/h.mp3` = silencio 0,3–0,5 s. En Hada, Helado, etc. **no** aspirar la H.
4. **V = B** (/b/). Vaca suena como si empezara por B.
5. **Z = /θ/** (ceceo). Zapato, Zorro, Zumo, Zoo, Lápiz, Nariz, Arroz, Manzana, Erizo…
6. **C/K/Q** = mismo /k/ duro (Casa). No hay Ce/Ci en el catálogo.
7. **G** = /g/ duro (Gato). Guitarra con u muda.
8. **R** al inicio (Rana, Ratón) = vibrante múltiple. **RR** = múltiples en Torre, Perro…
9. Archivo `words/una.mp3` → decir **«Uña»**.
10. **Sí generar** tutorial, pista, celebraciones de nivel y **gran final**.
11. **No generar** fusiones «p, a, t, o», nombres de letra, ni botones de menú.

---

## Revisión antes de exportar

Cada MP3:

- □ Misma voz
- □ Mismo ritmo / energía percibida que el resto del bloque
- □ Pronunciación correcta (es-ES)
- □ Sin respiraciones raras, clics ni cortes
- □ Fonema correcto (si aplica) — sin sílaba inventada
- □ Preguntas con final ascendente (si aplica)
- □ Celebración alegre / corrección calmada / gran final con orgullo
- □ Nombre de archivo exacto

---

## Resumen por tipo

| Tipo | Cantidad | Orden de generación |
|------|----------|---------------------|
| Fonemas (gratis+premium) | 28 | 1 |
| Palabras (gratis+premium) | 141 | 2 |
| Feedback | 27 | 3 |
| Tutorial | 3 | 4 |
| UI (pista / nivel / gran final) | 11 | 5 |
| Frases | 20 | 6 |
| Instrucciones | 13 | 7 |
| **TOTAL** | **243** | — |

- Refuerzos de alegría (feedback acierto): **19** frases.
- Gran final (12 niveles): **5** frases (la app elige una al azar).

---

## Orden de generación (por bloques)

**No** generes los clips mezclados. Mantén el estilo dentro de cada bloque:

1. **Fonemas** (gratis → premium; cuidado H/V/Z/J)
2. **Palabras** (gratis → premium)
3. **Feedback** (aciertos, errores, pistas)
4. **Tutorial**
5. **UI** (pista → celebraciones de nivel → **gran final**)
6. **Frases** (nivel 12)
7. Instrucciones / consignas

Luego: sustituir archivos en `assets/audio/` manteniendo el nombre → `USE_SPEECH_PREVIEW = false`.

---

# Catálogo de clips (fila = un MP3)

## 1. Fonemas gratis

| # | Archivo | Texto exacto (ElevenLabs) | Notas de pronunciación | Acceso |
|---|---------|---------------------------|------------------------|--------|
| 1 | `phonemes/a.mp3` | aaaaaaaa | Vocal abierta sostenida ~1–1,5 s. Speed 0,75–0,85 · estabilidad Robusto/Natural. NO <phoneme> Arpabet. NO "a de avión". | GRATIS |
| 2 | `phonemes/e.mp3` | eeeeeeee | Vocal clara sostenida. Speed baja · tono plano. NO "e de elefante". | GRATIS |
| 3 | `phonemes/i.mp3` | iiiiiiii | Vocal alta sostenida. Speed baja · tono plano. NO "i de iglú". | GRATIS |
| 4 | `phonemes/o.mp3` | oooooooo | Vocal redondeada sostenida. Speed baja · tono plano. NO "o de oso". | GRATIS |
| 5 | `phonemes/u.mp3` | uuuuuuuu | Vocal posterior sostenida. Speed baja · tono plano. NO "u de uva". | GRATIS |
| 6 | `phonemes/p.mp3` | p | Explosiva seca. Labios juntos y suelta. NO decir "pe". | GRATIS |
| 7 | `phonemes/m.mp3` | mmm | Labios cerrados, sonido nasal sostenido. | GRATIS |
| 8 | `phonemes/l.mp3` | llll | Lengua arriba, sonido líquido sostenido. | GRATIS |
| 9 | `phonemes/s.mp3` | ssss | Como serpiente, sin vocal después. NO "ese". | GRATIS |
| 10 | `phonemes/t.mp3` | t | Explosiva seca con la lengua. NO decir "te". | GRATIS |

## 2. Fonemas premium

| # | Archivo | Texto exacto (ElevenLabs) | Notas de pronunciación | Acceso |
|---|---------|---------------------------|------------------------|--------|
| 1 | `phonemes/b.mp3` | b | Explosiva suave /b/. NO "be". Igual que V en español de España. | PREMIUM |
| 2 | `phonemes/c.mp3` | k | Sonido duro /k/ como en "casa". NO "ce". | PREMIUM |
| 3 | `phonemes/d.mp3` | d | Explosiva seca. NO "de". | PREMIUM |
| 4 | `phonemes/f.mp3` | ffff | Soplar suavemente, sostenido. | PREMIUM |
| 5 | `phonemes/g.mp3` | g | Como en "gato" (/g/ duro). NO "ge". | PREMIUM |
| 6 | `phonemes/h.mp3` | (silencio / no usar) | H muda en español: NO grabar aliento tipo inglés. Generar 0,3–0,5 s de silencio o omitir en producción (la app ya no usa H en niveles 1–3). | PREMIUM |
| 7 | `phonemes/j.mp3` | jjjj | Como en "jardín" (/x/). Si dice «ja», probar texto validado (ver guion: Casos validados). NO "jota". | PREMIUM |
| 8 | `phonemes/k.mp3` | k | Explosiva /k/ (mismo sonido que C y Q). | PREMIUM |
| 9 | `phonemes/n.mp3` | nnn | Sonido nasal sostenido. NO "ene". | PREMIUM |
| 10 | `phonemes/enie.mp3` | ñññ | Como en "niño". NO "eñe". | PREMIUM |
| 11 | `phonemes/q.mp3` | k | Siempre /k/ (qu…). NO "cu". | PREMIUM |
| 12 | `phonemes/r.mp3` | rrr | Para letra R: vibrante múltiple clara (como inicio de Rana). NO decir "erre". | PREMIUM |
| 13 | `phonemes/rr.mp3` | rrrr | Vibrante múltiple fuerte (como en "perro" / "torre"). | PREMIUM |
| 14 | `phonemes/v.mp3` | b | Español de España: V = B (/b/). NO labiodental inglesa. Igual que phonemes/b. | PREMIUM |
| 15 | `phonemes/w.mp3` | w | Como inicio de «Waterpolo» (aprox. /gu/ o /w/). NO deletrear. | PREMIUM |
| 16 | `phonemes/x.mp3` | ks | Como en "taxi": k+s rápido (grafema X). | PREMIUM |
| 17 | `phonemes/y.mp3` | yyyy | Como en "yogur" (/ʝ/). | PREMIUM |
| 18 | `phonemes/z.mp3` | zzzz (ceceo /θ/) | Español de España: /θ/ como en «zapato» (ceceo). NO /s/. NO decir «zeta». | PREMIUM |

## 3. Palabras gratis

| # | Archivo | Texto exacto (ElevenLabs) | Notas de pronunciación | Acceso |
|---|---------|---------------------------|------------------------|--------|
| 1 | `words/avion.mp3` | Avión | Palabra natural, pausada, tono amable. NO deletrear. · V=/b/ | GRATIS |
| 2 | `words/arbol.mp3` | Árbol | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 3 | `words/abeja.mp3` | Abeja | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 4 | `words/arana.mp3` | Araña | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 5 | `words/agua.mp3` | Agua | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 6 | `words/elefante.mp3` | Elefante | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 7 | `words/estrella.mp3` | Estrella | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 8 | `words/escuela.mp3` | Escuela | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 9 | `words/espejo.mp3` | Espejo | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 10 | `words/erizo.mp3` | Erizo | Palabra natural, pausada, tono amable. NO deletrear. · ceceo /θ/ (España) | GRATIS |
| 11 | `words/iglu.mp3` | Iglú | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 12 | `words/isla.mp3` | Isla | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 13 | `words/invierno.mp3` | Invierno | Palabra natural, pausada, tono amable. NO deletrear. · V=/b/ | GRATIS |
| 14 | `words/insecto.mp3` | Insecto | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 15 | `words/iguana.mp3` | Iguana | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 16 | `words/oso.mp3` | Oso | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 17 | `words/ojo.mp3` | Ojo | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 18 | `words/oruga.mp3` | Oruga | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 19 | `words/ola.mp3` | Ola | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 20 | `words/oreja.mp3` | Oreja | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 21 | `words/uva.mp3` | Uva | Palabra natural, pausada, tono amable. NO deletrear. · V=/b/ | GRATIS |
| 22 | `words/unicornio.mp3` | Unicornio | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 23 | `words/uniforme.mp3` | Uniforme | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 24 | `words/uvas.mp3` | Uvas | Palabra natural, pausada, tono amable. NO deletrear. · V=/b/ | GRATIS |
| 25 | `words/una.mp3` | Uña | Palabra natural, pausada, tono amable. NO deletrear. · decir «Uña», no «Una» | GRATIS |
| 26 | `words/pato.mp3` | Pato | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 27 | `words/pelota.mp3` | Pelota | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 28 | `words/perro.mp3` | Perro | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 29 | `words/pajaro.mp3` | Pájaro | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 30 | `words/pizarra.mp3` | Pizarra | Palabra natural, pausada, tono amable. NO deletrear. · ceceo /θ/ (España) | GRATIS |
| 31 | `words/manzana.mp3` | Manzana | Palabra natural, pausada, tono amable. NO deletrear. · ceceo /θ/ (España) | GRATIS |
| 32 | `words/mono.mp3` | Mono | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 33 | `words/musica.mp3` | Música | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 34 | `words/mama.mp3` | Mamá | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 35 | `words/mariposa.mp3` | Mariposa | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 36 | `words/mosquito.mp3` | Mosquito | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 37 | `words/leon.mp3` | León | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 38 | `words/luna.mp3` | Luna | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 39 | `words/libro.mp3` | Libro | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 40 | `words/lapiz.mp3` | Lápiz | Palabra natural, pausada, tono amable. NO deletrear. · ceceo /θ/ (España) | GRATIS |
| 41 | `words/loro.mp3` | Loro | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 42 | `words/sol.mp3` | Sol | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 43 | `words/silla.mp3` | Silla | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 44 | `words/sapo.mp3` | Sapo | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 45 | `words/sandia.mp3` | Sandía | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 46 | `words/sopa.mp3` | Sopa | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 47 | `words/toro.mp3` | Toro | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 48 | `words/tren.mp3` | Tren | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 49 | `words/tomate.mp3` | Tomate | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 50 | `words/tambor.mp3` | Tambor | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |
| 51 | `words/tortuga.mp3` | Tortuga | Palabra natural, pausada, tono amable. NO deletrear. | GRATIS |

## 4. Palabras premium

| # | Archivo | Texto exacto (ElevenLabs) | Notas de pronunciación | Acceso |
|---|---------|---------------------------|------------------------|--------|
| 1 | `words/barco.mp3` | Barco | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 2 | `words/boca.mp3` | Boca | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 3 | `words/bicicleta.mp3` | Bicicleta | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 4 | `words/bota.mp3` | Bota | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 5 | `words/boton.mp3` | Botón | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 6 | `words/casa.mp3` | Casa | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 7 | `words/coche.mp3` | Coche | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 8 | `words/conejo.mp3` | Conejo | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 9 | `words/camion.mp3` | Camión | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 10 | `words/cuna.mp3` | Cuna | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 11 | `words/dado.mp3` | Dado | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 12 | `words/delfin.mp3` | Delfín | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 13 | `words/diente.mp3` | Diente | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 14 | `words/dedo.mp3` | Dedo | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 15 | `words/dulce.mp3` | Dulce | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 16 | `words/flor.mp3` | Flor | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 17 | `words/familia.mp3` | Familia | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 18 | `words/fresa.mp3` | Fresa | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 19 | `words/foca.mp3` | Foca | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 20 | `words/fuego.mp3` | Fuego | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 21 | `words/gato.mp3` | Gato | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 22 | `words/globo.mp3` | Globo | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 23 | `words/guitarra.mp3` | Guitarra | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 24 | `words/gusano.mp3` | Gusano | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 25 | `words/galleta.mp3` | Galleta | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 26 | `words/hada.mp3` | Hada | Palabra natural, pausada. Misma voz que el resto. · H muda (sin aspirar) | PREMIUM |
| 27 | `words/helado.mp3` | Helado | Palabra natural, pausada. Misma voz que el resto. · H muda (sin aspirar) | PREMIUM |
| 28 | `words/hilo.mp3` | Hilo | Palabra natural, pausada. Misma voz que el resto. · H muda (sin aspirar) | PREMIUM |
| 29 | `words/hueso.mp3` | Hueso | Palabra natural, pausada. Misma voz que el resto. · H muda (sin aspirar) | PREMIUM |
| 30 | `words/hoja.mp3` | Hoja | Palabra natural, pausada. Misma voz que el resto. · H muda (sin aspirar) | PREMIUM |
| 31 | `words/jirafa.mp3` | Jirafa | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 32 | `words/juguete.mp3` | Juguete | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 33 | `words/jardin.mp3` | Jardín | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 34 | `words/jabon.mp3` | Jabón | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 35 | `words/jamon.mp3` | Jamón | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 36 | `words/koala.mp3` | Koala | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 37 | `words/kiwi.mp3` | Kiwi | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 38 | `words/karate.mp3` | Karate | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 39 | `words/ketchup.mp3` | Ketchup | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 40 | `words/kimono.mp3` | Kimono | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 41 | `words/nube.mp3` | Nube | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 42 | `words/nariz.mp3` | Nariz | Palabra natural, pausada. Misma voz que el resto. · ceceo /θ/ (España) | PREMIUM |
| 43 | `words/noche.mp3` | Noche | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 44 | `words/naranja.mp3` | Naranja | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 45 | `words/nido.mp3` | Nido | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 46 | `words/nino.mp3` | Niño | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 47 | `words/nina.mp3` | Niña | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 48 | `words/muneca.mp3` | Muñeca | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 49 | `words/pinata.mp3` | Piñata | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 50 | `words/manana.mp3` | Mañana | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 51 | `words/queso.mp3` | Queso | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 52 | `words/quince.mp3` | Quince | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 53 | `words/quiosco.mp3` | Quiosco | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 54 | `words/quesadilla.mp3` | Quesadilla | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 55 | `words/rana.mp3` | Rana | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 56 | `words/raton.mp3` | Ratón | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 57 | `words/rosa.mp3` | Rosa | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 58 | `words/reloj.mp3` | Reloj | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 59 | `words/rio.mp3` | Río | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 60 | `words/raqueta.mp3` | Raqueta | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 61 | `words/torre.mp3` | Torre | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 62 | `words/barro.mp3` | Barro | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 63 | `words/tierra.mp3` | Tierra | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 64 | `words/burro.mp3` | Burro | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 65 | `words/arroz.mp3` | Arroz | Palabra natural, pausada. Misma voz que el resto. · ceceo /θ/ (España) | PREMIUM |
| 66 | `words/vaca.mp3` | Vaca | Palabra natural, pausada. Misma voz que el resto. · V=/b/ | PREMIUM |
| 67 | `words/vela.mp3` | Vela | Palabra natural, pausada. Misma voz que el resto. · V=/b/ | PREMIUM |
| 68 | `words/ventana.mp3` | Ventana | Palabra natural, pausada. Misma voz que el resto. · V=/b/ | PREMIUM |
| 69 | `words/violeta.mp3` | Violeta | Palabra natural, pausada. Misma voz que el resto. · V=/b/ | PREMIUM |
| 70 | `words/vaso.mp3` | Vaso | Palabra natural, pausada. Misma voz que el resto. · V=/b/ | PREMIUM |
| 71 | `words/waterpolo.mp3` | Waterpolo | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 72 | `words/wifi.mp3` | Wifi | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 73 | `words/walkie.mp3` | Walkie | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 74 | `words/xilofono.mp3` | Xilófono | Palabra natural, pausada. Misma voz que el resto. · X inicial natural es-ES | PREMIUM |
| 75 | `words/taxi.mp3` | Taxi | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 76 | `words/extraterrestre.mp3` | Extraterrestre | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 77 | `words/yogur.mp3` | Yogur | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 78 | `words/yoyo.mp3` | Yoyo | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 79 | `words/yate.mp3` | Yate | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 80 | `words/yema.mp3` | Yema | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 81 | `words/yegua.mp3` | Yegua | Palabra natural, pausada. Misma voz que el resto. | PREMIUM |
| 82 | `words/zapato.mp3` | Zapato | Palabra natural, pausada. Misma voz que el resto. · ceceo /θ/ (España) | PREMIUM |
| 83 | `words/zorro.mp3` | Zorro | Palabra natural, pausada. Misma voz que el resto. · ceceo /θ/ (España) | PREMIUM |
| 84 | `words/zanahoria.mp3` | Zanahoria | Palabra natural, pausada. Misma voz que el resto. · ceceo /θ/ (España) | PREMIUM |
| 85 | `words/zumo.mp3` | Zumo | Palabra natural, pausada. Misma voz que el resto. · ceceo /θ/ (España) | PREMIUM |
| 86 | `words/zoo.mp3` | Zoo | Palabra natural, pausada. Misma voz que el resto. · ceceo /θ/ (España) | PREMIUM |
| 87 | `words/masa.mp3` | Masa | Palabra natural, pausada. Usada en rimas (nivel 8). Misma voz. | PREMIUM |
| 88 | `words/lana.mp3` | Lana | Palabra natural, pausada. Usada en rimas (nivel 8). Misma voz. | PREMIUM |
| 89 | `words/color.mp3` | Color | Palabra natural, pausada. Usada en rimas (nivel 8). Misma voz. | PREMIUM |
| 90 | `words/marco.mp3` | Marco | Palabra natural, pausada. Usada en rimas (nivel 8). Misma voz. | PREMIUM |

## 5. Frases (nivel 12)

| # | Archivo | Texto exacto (ElevenLabs) | Notas de pronunciación | Acceso |
|---|---------|---------------------------|------------------------|--------|
| 1 | `sentences/el_pato_nada.mp3` | El pato nada. | Pausado, claro, tono amable. | PREMIUM |
| 2 | `sentences/el_sapo_salta.mp3` | El sapo salta. | Frase corta, ritmo lento. | PREMIUM |
| 3 | `sentences/el_tren_llega.mp3` | El tren llega. | Leer «El tren llega.» Clara y pausada. | PREMIUM |
| 4 | `sentences/el_perro_corre.mp3` | El perro corre. | Énfasis suave en el verbo. | PREMIUM |
| 5 | `sentences/el_gato_duerme.mp3` | El gato duerme. | Natural, suave. | PREMIUM |
| 6 | `sentences/el_leon_ruge.mp3` | El león ruge. | Natural, claro. | PREMIUM |
| 7 | `sentences/la_nina_canta.mp3` | La niña canta. | Natural, alegre. | PREMIUM |
| 8 | `sentences/el_nino_juega.mp3` | El niño juega. | Natural, alegre. | PREMIUM |
| 9 | `sentences/tengo_una_manzana.mp3` | Tengo una manzana. | Pausado en «manzana». Ceceo /θ/ en «manzana». | PREMIUM |
| 10 | `sentences/leo_un_libro.mp3` | Leo un libro. | Primera persona, claro. | PREMIUM |
| 11 | `sentences/la_mesa_es_grande.mp3` | La mesa es grande. | Énfasis suave en palabras clave. | PREMIUM |
| 12 | `sentences/la_casa_es_azul.mp3` | La casa es azul. | Color al final, pausado. Ceceo /θ/ en «azul». | PREMIUM |
| 13 | `sentences/mi_mama_cocina.mp3` | Mi mamá cocina. | Natural, cariñoso. | PREMIUM |
| 14 | `sentences/mi_perro_es_grande.mp3` | Mi perro es grande. | Natural, cariñoso. | PREMIUM |
| 15 | `sentences/la_mariposa_vuela.mp3` | La mariposa vuela. | Ritmo fluido. | PREMIUM |
| 16 | `sentences/una_estrella_brilla.mp3` | Una estrella brilla. | Ritmo fluido. | PREMIUM |
| 17 | `sentences/la_luna_brilla.mp3` | La luna brilla. | Frase corta, clara. | PREMIUM |
| 18 | `sentences/el_sol_brilla.mp3` | El sol brilla. | Frase corta, clara. | PREMIUM |
| 19 | `sentences/la_mama_lee.mp3` | La mamá lee. | Natural, suave. | PREMIUM |
| 20 | `sentences/el_nino_come.mp3` | El niño come. | Natural, claro. | PREMIUM |

## 6. Feedback

| # | Archivo | Texto exacto (ElevenLabs) | Notas de pronunciación | Acceso |
|---|---------|---------------------------|------------------------|--------|
| 1 | `feedback/muy_bien.mp3` | ¡Muy bien! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 2 | `feedback/estupendo.mp3` | ¡Estupendo! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 3 | `feedback/genial.mp3` | ¡Genial! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 4 | `feedback/excelente.mp3` | ¡Excelente! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 5 | `feedback/fantastico.mp3` | ¡Fantástico! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 6 | `feedback/bravo.mp3` | ¡Bravo! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 7 | `feedback/perfecto.mp3` | ¡Perfecto! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 8 | `feedback/sigue_asi.mp3` | ¡Sigue así! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 9 | `feedback/lo_has_conseguido.mp3` | ¡Lo has conseguido! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 10 | `feedback/muy_buena_respuesta.mp3` | ¡Muy buena respuesta! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 11 | `feedback/que_bien_lo_haces.mp3` | ¡Qué bien lo haces! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 12 | `feedback/estas_aprendiendo_muchisimo.mp3` | ¡Estás aprendiendo muchísimo! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 13 | `feedback/muy_buena_eleccion.mp3` | ¡Muy buena elección! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 14 | `feedback/excelente_trabajo.mp3` | ¡Excelente trabajo! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 15 | `feedback/que_rapido.mp3` | ¡Qué rápido! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 16 | `feedback/lo_hiciste_genial.mp3` | ¡Lo hiciste genial! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 17 | `feedback/fantastico_trabajo.mp3` | ¡Fantástico trabajo! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 18 | `feedback/intentalo_otra_vez.mp3` | Inténtalo otra vez. | Calma, tranquilizadora, sin enfado. Breve. | GRATIS |
| 19 | `feedback/casi_lo_tienes.mp3` | Casi lo tienes. | Calma, tranquilizadora, sin enfado. Breve. | GRATIS |
| 20 | `feedback/vamos_otra_vez.mp3` | Vamos, otra vez. | Calma, tranquilizadora, sin enfado. Breve. | GRATIS |
| 21 | `feedback/prueba_otra_vez.mp3` | Prueba otra vez. | Calma, tranquilizadora, sin enfado. Breve. | GRATIS |
| 22 | `feedback/has_terminado_el_nivel.mp3` | ¡Has terminado el nivel! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 23 | `feedback/felicidades.mp3` | ¡Felicidades! | Alegría moderada, cálida, sin gritar. Breve. | GRATIS |
| 24 | `feedback/es_esta_eligela.mp3` | ¡Es esta! Elígela. | Calma, tranquilizadora, sin enfado. Breve. | GRATIS |
| 25 | `feedback/mira_es_esta.mp3` | ¡Mira! Es esta. | Calma, tranquilizadora, sin enfado. Breve. | GRATIS |
| 26 | `feedback/aqui_esta_eligela.mp3` | ¡Aquí está! Elígela. | Calma, tranquilizadora, sin enfado. Breve. | GRATIS |
| 27 | `feedback/casi_mira_es_esta.mp3` | ¡Casi! Mira, es esta. | Calma, tranquilizadora, sin enfado. Breve. | GRATIS |

## 7. Instrucciones (consignas)

| # | Archivo | Texto exacto (ElevenLabs) | Notas de pronunciación | Acceso |
|---|---------|---------------------------|------------------------|--------|
| 1 | `instructions/escucha_y_elige_la_letra.mp3` | Escucha y elige la letra. | Claro, lento, tono de maestra. Conversacional. | GRATIS |
| 2 | `instructions/escucha_y_elige_el_dibujo.mp3` | Escucha y elige el dibujo. | Claro, lento, tono de maestra. Conversacional. | GRATIS |
| 3 | `instructions/escucha_y_elige_la_palabra.mp3` | Escucha y elige la palabra. | Claro, lento, tono de maestra. Conversacional. | GRATIS |
| 4 | `instructions/con_que_letra_empieza.mp3` | ¿Con qué letra empieza? | Claro, lento, tono de maestra. Pregunta: final SIEMPRE ascendente. | GRATIS |
| 5 | `instructions/cuantas_silabas_tiene.mp3` | ¿Cuántas sílabas tiene? | Claro, lento, tono de maestra. Pregunta: final SIEMPRE ascendente. | PREMIUM |
| 6 | `instructions/con_que_silaba_empieza.mp3` | ¿Con qué sílaba empieza? | Claro, lento, tono de maestra. Pregunta: final SIEMPRE ascendente. | PREMIUM |
| 7 | `instructions/con_que_letra_termina.mp3` | ¿Con qué letra termina? | Claro, lento, tono de maestra. Pregunta: final SIEMPRE ascendente. | PREMIUM |
| 8 | `instructions/elige_la_que_rima.mp3` | Elige la que rima. | Claro, lento, tono de maestra. Conversacional. | PREMIUM |
| 9 | `instructions/junta_los_sonidos_y_elige_la_palabra.mp3` | Junta los sonidos y elige la palabra. | Claro, lento, tono de maestra. Conversacional. | PREMIUM |
| 10 | `instructions/que_letra_falta_al_final.mp3` | ¿Qué letra falta al final? | Claro, lento, tono de maestra. Pregunta: final SIEMPRE ascendente. | PREMIUM |
| 11 | `instructions/que_letra_falta_en_medio.mp3` | ¿Qué letra falta en medio? | Claro, lento, tono de maestra. Pregunta: final SIEMPRE ascendente. | PREMIUM |
| 12 | `instructions/lee_la_frase_y_elige_el_dibujo.mp3` | Lee la frase y elige el dibujo. | Claro, lento, tono de maestra. Conversacional. | PREMIUM |
| 13 | `instructions/elige_la_que_empieza_igual.mp3` | Elige la que empieza igual. | Claro, lento, tono de maestra. Conversacional. | PREMIUM |

## 8. Tutorial

| # | Archivo | Texto exacto (ElevenLabs) | Notas de pronunciación | Acceso |
|---|---------|---------------------------|------------------------|--------|
| 1 | `tutorial/escucha.mp3` | Escucha. Pulsa el botón naranja para oír el sonido o la palabra. | Claro, lento, tono de maestra. Tutorial para niños. | GRATIS |
| 2 | `tutorial/elige.mp3` | Elige. Toca la tarjeta con la respuesta correcta. | Claro, lento, tono de maestra. Tutorial para niños. | GRATIS |
| 3 | `tutorial/estrellas.mp3` | Estrellas. Si aciertas a la primera, ganarás más estrellas. | Claro, lento, tono de maestra. Tutorial para niños. | GRATIS |

## 9. UI (pista, nivel y gran final)

| # | Archivo | Texto exacto (ElevenLabs) | Notas de pronunciación | Acceso |
|---|---------|---------------------------|------------------------|--------|
| 1 | `ui/toca_la_tarjeta_verde.mp3` | Toca la tarjeta verde. | Cálido, breve, tono de maestra. | GRATIS |
| 2 | `ui/increible.mp3` | ¡Increíble! | Cálido, breve, tono de maestra. | GRATIS |
| 3 | `ui/bien_hecho.mp3` | ¡Bien hecho! | Cálido, breve, tono de maestra. | GRATIS |
| 4 | `ui/genial_tres_estrellas.mp3` | ¡Genial! Tres estrellas. | Cálido, breve, tono de maestra. | GRATIS |
| 5 | `ui/muy_bien_dos_estrellas.mp3` | ¡Muy bien! Dos estrellas. | Cálido, breve, tono de maestra. | GRATIS |
| 6 | `ui/bien_hecho_sigue_practicando.mp3` | ¡Bien hecho! Sigue practicando. | Cálido, breve, tono de maestra. | GRATIS |
| 7 | `ui/campeon.mp3` | ¡Campeón! | Cálido, breve, tono de maestra. | PREMIUM |
| 8 | `ui/lo_has_logrado.mp3` | ¡Lo has logrado! | Cálido, breve, tono de maestra. | PREMIUM |
| 9 | `ui/has_completado_todos_los_niveles.mp3` | ¡Has completado todos los niveles! | Cálido, breve, tono de maestra. | PREMIUM |
| 10 | `ui/eres_un_campeon_de_los_fonemas.mp3` | ¡Eres un campeón de los fonemas! | Cálido, breve, tono de maestra. | PREMIUM |
| 11 | `ui/que_orgullo.mp3` | ¡Qué orgullo! | Cálido, breve, tono de maestra. | PREMIUM |

---

*Generado desde `src/data/audioManifest.js` — regenerar con `npm run audio:guion` y `npm run audio:guion:pdf`.*
