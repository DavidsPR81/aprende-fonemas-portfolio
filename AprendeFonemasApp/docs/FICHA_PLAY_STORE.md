# Ficha de Play Store — Aprende Fonemas (es-ES)

Textos listos para copiar en Play Console. Revisado julio 2026.

**Idioma:** Español (España) · **Package:** `com.davidspr81.aprendefonemas`

---

## 1. Textos de la ficha

### Nombre de la aplicación (15/30)

```
Aprende Fonemas
```

### Descripción breve (máx. 80 caracteres)

Google avisa si usas guion `-` o doble guion `--` en rangos. Usa **«de 3 a 7»** o la **raya –** (no el guion del teclado).

**Opción recomendada (78 caracteres):**

```
Sonidos y letras para niños de 3 a 7 años. Sin anuncios. Funciona sin conexión.
```

**Alternativa con raya tipográfica (76 caracteres):**

```
Juegos de fonemas para niños de 3–7 años. Sin anuncios. Funciona sin conexión.
```

> Si pegas la segunda, asegúrate de que entre 3 y 7 va una **raya ene** (–), no un guion (-).

### Descripción completa (máx. 4000 caracteres)

```
Aprende Fonemas ayuda a niños de 3 a 7 años a trabajar la conciencia fonológica: escuchar sonidos, relacionar letras e imágenes, contar sílabas, rimar, fusionar fonemas y leer primeras frases.

Pensada para familias y educación infantil en España. Sesiones cortas (unos 5 minutos), interfaz amable y progreso con estrellas.

• 12 niveles progresivos
• 4 niveles gratis con 10 letras: A, E, I, O, U, P, M, L, S, T
• Premium (pago único 3,99 €): desbloquea las 27 letras del abecedario español y los niveles 5 a 12
• Sin publicidad y sin registro de cuenta
• Funciona sin conexión para jugar
• El progreso se guarda solo en el dispositivo

Ideal para acompañar el aprendizaje antes de la lectura, en casa o en el aula. No sustituye la valoración ni la intervención de un profesional o logopeda.

Contacto: aprendefonemas@gmail.com
Política de privacidad: https://aprendefonemas.netlify.app/privacidad.html
```

**Correcciones respecto al borrador anterior:**
- 11 niveles → **12 niveles**
- Premium niveles 5–11 → **5 a 12**
- «Offline» → **Funciona sin conexión** (mejor en es-ES)
- Guiones de marketing sustituidos por «de X a Y» donde aplica

---

## 2. Gráficos — qué subir y dónde está

| Recurso | Tamaño | Archivo en el repo | Notas |
|---------|--------|-------------------|--------|
| **Icono** | 512×512 PNG/JPEG ≤1 MB | `docs/play-store/icon-512.png` | También `assets/icon.png` (regenerar con `npm run assets:icons` si cambias logo) |
| **Gráfico de funciones** | 1024×500 PNG/JPEG ≤15 MB | `docs/play-store/feature-graphic-1024x500.png` | Banner horizontal de la ficha |
| **Capturas teléfono** | 2–8 · 9:16 o 16:9 · ≥1080 px | **Ya subidas a Play Console** | Mínimo **4**; no regenerar salvo cambio visual grande |
| **Capturas tablet 7"** | Hasta 8 | Opcional al inicio | Puedes usar las mismas en landscape o omitir si no tienes tablet |
| **Capturas tablet 10"** | Hasta 8 | Opcional al inicio | Idem |
| **Vídeo YouTube** | Opcional | — | Dejar vacío en v1.0 si no tienes |

Referencias de estilo (no son capturas finales): `docs/play-store/reference/`

### Capturas recomendadas (móvil, portrait)

Hazlas en **móvil real** o emulador Android con la app en build o Expo (mejor build EAS cuando tengas audios):

1. **Home** — logo «Fonemas», botón Empezar  
2. **Niveles** — rejilla de 12 niveles (que se vean candados premium)  
3. **Ejercicio nivel 1** — escuchar + letras  
4. **Ejercicio nivel 2** — dibujos con ilustraciones  
5. **Ejercicio nivel 3 o 4** — rima o sílabas  
6. **Progreso** — estrellas por nivel  
7. **Premium** — pantalla de compra (opcional)  
8. **Celebración** — nivel completado (opcional)

**Consejo:** modo avión o sin barra de notificaciones (modo presentación en Ajustes del móvil) para capturas limpias.

---

## 3. Otros formularios de Play Console (resumen)

Además de la ficha, necesitarás completar (ver `GUIA_PUBLICACION_COMPLETA.md`):

| Formulario | Qué poner |
|------------|-----------|
| **Clasificación de contenido** | Educación / +3 años |
| **Público objetivo** | Familias / niños |
| **Programa Familias** | Cuestionario app infantil |
| **Seguridad de los datos** | Sin recopilación de datos personales |
| **Política de privacidad** | `https://aprendefonemas.netlify.app/privacidad.html` |
| **Email** | aprendefonemas@gmail.com |
| **Categoría** | Educación |
| **Etiquetas** | educación, lectura, fonemas, niños, español (las que permita la consola) |

---

## 4. Orden recomendado ahora

1. Completar ficha (textos de este doc) si falta algo  
2. Icono + feature graphic (si no están)  
3. **Vídeo demo** → landing (MP4); opcional YouTube para el campo vídeo de Play  
4. Capturas: **ya enviadas** — no repetir  
5. Data Safety / Familias / clasificación si quedaron a medias  
6. AAB + prueba cerrada → luego producción  

La ficha puede quedarse en borrador. Google exige un **AAB** en una pista (prueba cerrada) para revisar.

---

## 5. Checklist ficha

- [ ] Nombre: Aprende Fonemas  
- [ ] Descripción breve sin guiones problemáticos  
- [ ] Descripción completa con **12 niveles** y premium **5–12**  
- [ ] Icono 512×512 subido  
- [ ] Feature graphic 1024×500 subido  
- [x] ≥4 capturas móvil (ya en Play Console)  
- [ ] Vídeo YouTube (opcional; landing usa MP4)  
- [ ] URL privacidad en descripción larga  
- [ ] Email contacto en descripción y en consola  

---

*Ficha Play Store — Aprende Fonemas · julio 2026*
