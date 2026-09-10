# Plan de mejoras futuras — Aprende Fonemas

> **Propósito:** recoger mejoras identificadas en la auditoría de calidad (julio 2026), ordenarlas por fases y dejar claro **qué**, **por qué**, **para quién** y **cuándo** abordarlas.  
> **Este documento no implica implementación inmediata.** Primero v1.0 en Play Store; después iterar con versiones pequeñas.

**Documentos relacionados**

| Documento | Relación |
|-----------|----------|
| [`GUIA_PUBLICACION_COMPLETA.md`](GUIA_PUBLICACION_COMPLETA.md) | Fases 0–8 hasta el lanzamiento (bloqueantes v1.0) |
| [`PLAY_STORE_CHECKLIST.md`](PLAY_STORE_CHECKLIST.md) | Checklist técnico pre-build |
| [`PLAN_MEJORAS_FUTURAS.md`](PLAN_MEJORAS_FUTURAS.md) | Roadmap v1.1+ (no bloquea publicar) |
| [`archivo/ROADMAP_ANIMACIONES_UX_PREMIUM.md`](archivo/ROADMAP_ANIMACIONES_UX_PREMIUM.md) | Motion/UX cerrado en v1 |
| [`archivo/BACKLOG_PRUEBA_CERRADA_POST_V8.md`](archivo/BACKLOG_PRUEBA_CERRADA_POST_V8.md) | Parche post-v8 (ya en builds 9–11) |

---

## Criterios para priorizar

1. **Sin features nuevas durante la prueba cerrada** — solo bugs y assets faltantes (regla de la guía de publicación).
2. **Audio humano antes que contenido extra** — el valor logopédico depende de la voz, no de más niveles.
3. **Cambios pequeños y publicables** — preferir v1.0.1, v1.1, v1.2… frente a un “v2 enorme”.
4. **Mantener el foco** — conciencia fonológica / fonemas; no convertir la app en lectoescritura completa de golpe.
5. **Privacidad infantil** — cualquier dato nuevo (informes, perfiles, nube) exige revisar Data Safety y política de privacidad.

---

## Mapa de fases (visión general)

```
v1.0  ──► Lanzamiento Play Store (bloqueantes: audios, build, testers)
   │
v1.0.x ──► Estabilización (2–4 semanas): bugs, reseñas, accesibilidad
   │
v1.1  ──► Contenido pedagógico: aliteración, más frases, modo fonemas
   │
v1.2  ──► Padres y logopedas: informes, guía en app, segundo perfil niño
   │
v1.3  ──► Contexto escolar (opcional): modo aula, exportación, licencia
   │
v2.0  ──► Expansión mayor (solo si v1 vende y hay demanda): trazo, iOS, más idiomas
```

**Leyenda de esfuerzo:** S = días · M = 1–2 semanas · L = 3+ semanas  
**Leyenda de impacto:** ★ bajo · ★★ medio · ★★★ alto (pedagogía o retención)

---

## Fase 0 — v1.0 (obligatorio antes de producción pública)

> No son “mejoras opcionales”: son requisitos del producto mínimo viable en tienda. Detalle paso a paso en [`GUIA_PUBLICACION_COMPLETA.md`](GUIA_PUBLICACION_COMPLETA.md).

| ID | Mejora / entregable | Por qué | Esfuerzo | Estado |
|----|---------------------|---------|----------|--------|
| P0-A | **Audios MP3 definitivos** (fonemas, palabras, instrucciones, frases, feedback) | Sin esto la app no modela bien los fonemas; TTS confunde al niño | L | Hecho |
| P0-B | `USE_SPEECH_PREVIEW = false` | Forzar solo assets locales en release | S | Hecho |
| P0-C | **Build EAS AAB** + dispositivo real | Expo Go ≠ icono, splash, IAP, audio real | M | **Hecho** (cerrada v11) |
| P0-D | **IAP** `premium_unlock` (compra + restaurar) | Modelo freemium | M | Código listo; validar en prod / compra real |
| P0-E | **Prueba cerrada** ≥12 opted-in × 14 días | Feedback real | S | **En curso** |
| P0-E2 | Parche post-v8 (tablet, Premium wide, confeti, contenido, UI) | Ver `archivo/BACKLOG_…` | M | **Hecho** (v11) |
| P0-F | Ficha Play + capturas + Familias + Data Safety | Publicación | M | En curso |
| P0-G | Imágenes finales | `imageRegistry` | — | **Hecho** |

### Criterios de aceptación v1.0

- [ ] 12 niveles jugables en móvil real sin TTS en ejercicios principales  
- [ ] Premium compra y restaura en build de prueba cerrada  
- [ ] `npm test` en verde antes de cada build de release  
- [ ] Landing + `privacidad.html` publicadas y URL en consola  

---

## Fase 1 — v1.0.x Estabilización (post-lanzamiento, 2–4 semanas)

Objetivo: corregir fricción detectada en reseñas y testers **sin añadir niveles nuevos**.

| ID | Mejora | Descripción | Beneficia a | Impacto | Esfuerzo | Dependencias |
|----|--------|-------------|-------------|---------|----------|--------------|
| S1 | **Informe de bugs de prueba cerrada** | Plantilla: dispositivo, nivel, qué esperaba el niño, captura | Dev | ★★ | S | P0-E |
| S2 | **Accesibilidad TalkBack / VoiceOver** | Revisión manual de ExerciseScreen, tarjetas y botón Escuchar | A11y, colegios | ★★ | M | — |
| S3 | **Pulido tipografía** | Verificar Fredoka estable tras carga (ya corregido en código); regresión en tablet | Todos | ★★ | S | — |
| S4 | **Ajuste scaffold / intentos** | Valorar si 2 fallos con 3 opciones es demasiado rápido para 4 años; A/B con padres | Niños | ★★ | S | Feedback testers |
| S5 | **Limpieza assets huérfanos** | MP3/PNG en disco que ya no usa `content.js` (western, windsurf…) | Mantenimiento | ★ | S | — |
| S6 | **Versión 1.0.1** | Publicar parche rápido si hay crash o audio roto | Todos | ★★★ | S | S1 |

### Notas de implementación (cuando toque)

- Archivos probables: `ExerciseScreen.js`, `SettingsScreen.js`, `theme/index.js`, `appConfig.js` (`getHintThreshold`).  
- No tocar pools de ejercicios salvo error pedagógico demostrado.

---

## Fase 2 — v1.1 Contenido pedagógico

Objetivo: reforzar el **nicho fonemas / conciencia fonológica** sin competir aún con Leo con Grin en volumen.

| ID | Mejora | Descripción | Beneficia a | Impacto | Esfuerzo | Dependencias |
|----|--------|-------------|-------------|---------|----------|--------------|
| C1 | **Nivel de aliteración** | Activar pool `ALLITERATION_EXERCISES` (código ya existe) como nivel 13 o reemplazar nivel 9 si se prefiere no inflar lista | Logopedas | ★★★ | M | P0-A (audios), decisión de slot en `LEVELS` |
| C2 | **Más frases nivel 12** | Ampliar `SENTENCES` (+10–15 frases cortas, PNG + audio + tests) | Lectura emergente | ★★ | M | Dibujos + grabación |
| C3 | **Modo “solo fonemas”** | Sesión corta: solo identificar fonema, sin mezclar tipos (útil en logopedia) | Logopedas, padres | ★★★ | M | — |
| C4 | **Repetición espaciada ligera** | Priorizar letras/fonemas con más fallos en sesiones siguientes (local, sin nube) | Aprendizaje | ★★ | M | `useProgress` ampliado |
| C5 | **Variedad de sesión** | Reducir repetición de mismas palabras en 5 ejercicios seguidos (builder) | Niños | ★★ | M | `exerciseBuilder.js` |

### Decisión pendiente C1

| Opción | Pros | Contras |
|--------|------|---------|
| A) Nivel 13 Premium | No rompe progresión actual | Lista de niveles más larga |
| B) Insertar como 5b y renumerar | Progresión más lineal | Migración progreso otra vez |
| C) Modo extra en menú | Flexible | Menos visible para padres |

**Recomendación documentada:** opción **A** o **modo extra** (C) para no migrar IDs otra vez.

### Criterios de aceptación v1.1

- [ ] Nuevo contenido con tests en `exercisesQuality.test.js`  
- [ ] Guion de audio actualizado (`npm run audio:guion`)  
- [ ] Inventario regenerado (`npm run content:inventory`)  

---

## Fase 3 — v1.2 Padres y logopedas

Objetivo: diferenciarse de apps genéricas con **seguimiento comprensible** sin convertirse en LMS.

| ID | Mejora | Descripción | Beneficia a | Impacto | Esfuerzo | Dependencias |
|----|--------|-------------|-------------|---------|----------|--------------|
| F1 | **Resumen para padres** | Pantalla o PDF: niveles completados, estrellas, letras más falladas | Padres | ★★★ | M | Más datos en progreso |
| F2 | **Exportar informe** | Compartir por email/WhatsApp resumen semanal (sin cuenta en servidor) | Padres, logopedas | ★★★ | M | F1 |
| F3 | **Segundo perfil niño** | Dos progresos en el mismo dispositivo (hermanos) | Familias | ★★ | M | Refactor storage |
| F4 | **Guía “Cómo ayudar en casa”** | Sección en Ajustes o PDF enlazado: 1 página, lenguaje no técnico | Padres | ★★ | S | Contenido redacción |
| F5 | **Consejos contextuales** | Tras fallar 3 veces mismo fonema, tip breve para el adulto (opcional) | Padres | ★★ | M | F1 |

### Privacidad (importante)

- F1–F2 deben funcionar **on-device** o exportación explícita iniciada por el adulto.  
- Si en el futuro hay cuenta/nube → actualizar [`PRIVACY_POLICY.md`](PRIVACY_POLICY.md) y Data Safety.

### Criterios de aceptación v1.2

- [ ] Informe no contiene datos identificables del niño (solo progreso de juego)  
- [ ] Política de privacidad sigue siendo veraz  
- [ ] Probar con 2–3 logopedas reales (feedback cualitativo)  

---

## Fase 4 — v1.3 Contexto escolar (opcional)

Objetivo: explorar **B2B suave** (colegios, gabinetes) solo si hay demanda tras v1.2.

| ID | Mejora | Descripción | Beneficia a | Impacto | Esfuerzo | Dependencias |
|----|--------|-------------|-------------|---------|----------|--------------|
| E1 | **Modo aula / quiosco** | PIN adulto para salir; bloqueo de compras | Profesores | ★★ | M | — |
| E2 | **Selección libre de nivel** | Docente salta a nivel 6 sin completar 1–5 | Profesores | ★★ | S | E1 opcional |
| E3 | **Licencia centro** | SKU distinto o código de activación grupal | Colegios | ★★★ | L | Modelo negocio, legal |
| E4 | **Informe por sesión CSV** | Para registro pedagógico (fecha, nivel, aciertos) | Logopedas | ★★ | M | F1 |

**Riesgo:** dispersión del producto. **Gate:** implementar E1–E2 solo si ≥10 solicitudes de docentes o centros.

---

## Fase 5 — v2.0 Expansión (visión largo plazo)

> Solo planificar en detalle cuando v1.x tenga tracción (descargas, retención, reseñas).

| ID | Mejora | Descripción | Notas |
|----|--------|-------------|-------|
| X1 | **Trazo de letras** | Escribir vocales/consonantes (como ABC Dinos) | Es otro producto parcial; mucho arte + UX |
| X2 | **App iOS** | Mismo código Expo; revisión App Store + IAP Apple | Mismo binario posible con EAS |
| X3 | **Más idiomas** | Catalán, euskera, gallego | Requiere locución e imágenes adaptadas |
| X4 | **Suscripción opcional** | Contenido mensual | Cambio de modelo; estudiar con calma |
| X5 | **Integración con currículo LOMLOE** | Etiquetas competencia lectora | Marketing escolar |

---

## Matriz resumen (prioridad recomendada)

| Prioridad | IDs | Versión orientativa |
|-----------|-----|---------------------|
| **Crítica** | P0-A … P0-G | v1.0 |
| **Alta** | S1–S6 | v1.0.1 |
| **Media-alta** | C1, C3, F1, F2 | v1.1 – v1.2 |
| **Media** | C2, C4, C5, F3–F5 | v1.1 – v1.2 |
| **Baja / condicional** | E1–E4 | v1.3 si hay demanda |
| **Exploratoria** | X1–X5 | v2.0+ |

---

## Comparativa estratégica (recordatorio)

Posicionamiento en tienda recomendado:

> **“Fonemas y conciencia fonológica para niños de 3–7 años — el paso antes de leer sílabas.”**

| Competidor | Ellos ganan en… | Nosotros ganamos en… |
|------------|-----------------|----------------------|
| Leo con Grin | Volumen, caligrafía, informes email | Foco fonemas, sin anuncios, diseño actual |
| Aprender con Sílabas | Sílabas masivas | Progresión CF completa + fusión |
| ABC Dinos | Trazo, voces ES | Profundidad fonológica |
| Leer y Contar | Variedad (números, etc.) | Especialización y claridad |

Las fases C (contenido) y F (familias) cierran las brechas más citadas por padres y logopedas **sin copiar** el catálogo entero de Leo con Grin.

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Publicar con TTS | No pasar P0-B hasta grabación mínima (fonemas + instrucciones + palabras free) |
| Feature creep en prueba cerrada | Regla escrita: solo bugs en fase de testers |
| Segundo perfil rompe progreso | Diseñar schema v3 antes de codificar F3 |
| Informes y privacidad infantil | Export local; sin analytics de menores |
| Aliteración confunde con nivel 6 | Textos de nivel e instrucción audio distintos; tutorial corto |

---

## Checklist “¿tocar código o no?”

Antes de implementar cualquier ítem de este plan:

- [ ] ¿Está la fase anterior cerrada? (no mezclar v1.1 con prueba cerrada)  
- [ ] ¿Hay issue/tarea con ID (P0-A, C1, F1…)?  
- [ ] ¿Tests nuevos o actualizados?  
- [ ] ¿Inventario / guion de audio / listado imágenes actualizados si hay contenido?  
- [ ] ¿Changelog para Play Store preparado?  

---

## Historial del documento

| Fecha | Cambio |
|-------|--------|
| Jul 2026 | Creación tras auditoría de calidad, ejercicios, diseño y comparativa de mercado |

---

*Plan de mejoras futuras — Aprende Fonemas · Solo documentación · Implementar según fases acordadas*
