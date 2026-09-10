# Guía de lanzamiento

Checklist para publicar Aprende Fonemas en Google Play (primera app). Orden recomendado abajo.

Detalle técnico: [`PLAY_STORE_CHECKLIST.md`](PLAY_STORE_CHECKLIST.md)  
Landing: [`GUIA_LANDING_NETLIFY.md`](GUIA_LANDING_NETLIFY.md)  
Imágenes / audios: [`GUIA_CREACION_IMAGENES.md`](GUIA_CREACION_IMAGENES.md) · [`LISTADO_IMAGENES.md`](LISTADO_IMAGENES.md)

Contacto: aprendefonemas@gmail.com

---

## Orden (estado real julio 2026)

```
HECHO   App jugable + audios + imágenes + landing + privacidad
HECHO   Play Console (capturas; formularios en curso)
HECHO   Prueba interna — pausada (última útil: v8)
HECHO   Prueba cerrada Alpha — versionCode 11 (perfil testing)
AHORA   1  Testers opted-in (≥12) × 14 días + recoger feedback
LUEGO   2  Solo bloqueantes → solicitar producción
DESPUÉS 3  AAB production (sin beta) + publicar
DESPUÉS 4  Repo público sin assets (REPO_PUBLICO_PORTFOLIO.md)
```

No pases a producción sin la regla 12×14 si tu cuenta personal lo exige. La pista interna no se reabre para este ciclo.

---

## FASE 1 — Terminar la app

### ¿Qué significa “terminada”?

Marca esto cuando sea verdad en **un móvil real** (no solo en el ordenador):

- [ ] **App jugable** — los 12 niveles funcionan de principio a fin  
- [ ] **Audios finales** — se oye tu voz/archivos, no voz robótica del móvil  
- [ ] **Imágenes finales** — dibujos en lugar de emojis (al menos niveles gratis)  
- [ ] **Premium funcionando** — se puede comprar y restaurar la compra  
- [ ] **Build Android lista** — archivo instalable generado para subir a Google  
- [ ] **Probada sin internet** — juega bien en modo avión (niveles gratis)  
- [ ] **Sin crashes** — nada se cierra solo al usarla 15–20 minutos  

### Freemium (para que lo recuerdes)

| Gratis | Premium (3,99 €, pago único) |
|--------|--------------------------------|
| Niveles 1–4 (letra, imagen, rima, sílabas) | Niveles 5–12 (sílaba inicial → lectura) |
| 10 letras: A E I O U + P M L S T | Las 27 letras del abecedario |

### ¿Necesitas ayuda técnica aquí?

Abre [`PLAY_STORE_CHECKLIST.md`](PLAY_STORE_CHECKLIST.md) — ahí están los comandos, archivos y pasos de programación.

---

## FASE 2 — Landing pública

Google **obliga** a tener una página de privacidad con URL pública. Tres cosas:

1. **Web publicada** en Netlify (carpeta `landing/`)  
2. **Política de privacidad** accesible (`…/privacidad.html`)  
3. **Email visible:** aprendefonemas@gmail.com  

### Casillas

- [ ] Abres la web en el móvil y se ve bien  
- [ ] El enlace de privacidad funciona  
- [ ] El email de contacto funciona  

No hace falta que la web esté “perfecta”. Debe estar **pública y legal**.  
Cómo subirla: [`GUIA_LANDING_NETLIFY.md`](GUIA_LANDING_NETLIFY.md)

---

## FASE 3 — Google Play (primera vez)

### 3.1 Cuenta de desarrollador

1. Entra en [Google Play Console](https://play.google.com/console)  
2. Paga la cuota única de desarrollador (~25 USD, una sola vez en la vida)  
3. Crea la app: nombre **Aprende Fonemas**, categoría **Educación**

**Tiempo:** 1–2 horas el primer día (cuenta + crear app).

---

### 3.2 Formularios que Google te pedirá

#### Política de privacidad

| | |
|---|---|
| **Qué es** | Enlace a tu página legal |
| **Por qué** | Obligatorio para todas las apps |
| **Qué poner** | `https://aprendefonemas.netlify.app/privacidad.html` |
| **Dónde** | Play Console → Ficha → Política de privacidad |

---

#### Data safety (Seguridad de los datos)

| | |
|---|---|
| **Qué es** | Formulario donde declaras qué datos recoge la app |
| **Por qué** | Google lo muestra en la ficha; obligatorio |
| **Qué responder en Aprende Fonemas** | **No recopilamos datos personales.** El progreso se guarda solo en el móvil. Sin anuncios. Sin registro. |
| **Cuánto tarda** | 15–30 minutos la primera vez |
| **Dónde** | Play Console → **Política** → **Seguridad de los datos** |

---

#### Familias (app para niños)

| | |
|---|---|
| **Qué es** | Cuestionario extra porque tu app es para niños de 3–7 años |
| **Por qué** | Google exige más control en apps infantiles |
| **Qué responder** | App educativa · uso con un adulto · sin recopilar datos del niño · sin anuncios · sin enlaces raros |
| **Cuánto tarda** | 20–40 minutos (muchas preguntas sí/no) |
| **Dónde** | Play Console → **Política** → **Contenido de la app** → **Público objetivo y contenido** |

Si te bloquean: revisa que la privacidad esté publicada y que el email de contacto sea correcto.

---

#### Clasificación de contenido

| | |
|---|---|
| **Qué es** | Cuestionario sobre violencia, miedo, etc. |
| **Tu app** | Educativa, sin violencia → clasificación infantil adecuada |
| **Dónde** | Play Console → **Política** → **Clasificación de contenido** |

---

#### Producto Premium (compra dentro de la app)

| | |
|---|---|
| **Qué es** | El desbloqueo de pago único (3,99 €) |
| **Por qué** | Sin esto, Premium no se puede vender |
| **Dónde** | Play Console → **Monetización** → **Productos** → crear compra única |

Detalle técnico del ID de producto: [`PLAY_STORE_CHECKLIST.md`](PLAY_STORE_CHECKLIST.md)

---

### 3.3 Subir la app (primera versión de prueba)

- [ ] Build Android generada (ver checklist técnico)  
- [ ] Subida a **Prueba cerrada** (no a Producción todavía)  
- [ ] Google procesa el archivo (desde minutos hasta unas horas)  

---

## FASE 4 — Prueba cerrada (10–20 testers)

### ¿Para qué?

Probar la app **como la verá un usuario real**: instalación desde Play Store, compra Premium, audios, ejercicios.

### Cómo

1. Play Console → **Prueba cerrada** → lista de testers (emails Gmail)  
2. Copias el **enlace de invitación** y se lo envías (WhatsApp, email…)  
3. Cada persona acepta, instala desde Play Store y juega un rato  

**Importante:** no envíes un APK suelto. Debe ser desde Play Store.

### A quién pedir

Familia, amigos con niños de 3–7, algún docente de infantil si conoces. Con **10–20 personas** basta.

### Qué preguntar (solo 3 — con esto tienes el 90 % útil)

1. ¿El niño entiende qué hacer?  
2. ¿Hay algún sonido raro o ejercicio confuso?  
3. ¿Qué cambiarías?  

Puedes usar WhatsApp o un Google Forms de 3 preguntas. No hace falta más.

### Casillas

- [ ] 10–20 testers invitados  
- [ ] Al menos 5 han instalado y probado  
- [ ] Alguien ha probado **comprar Premium** y **restaurar compra**  
- [ ] Has anotado los problemas en una lista simple  

---

## FASE 5 — Corregir

### Corregir SÍ

- La app se cierra sola  
- Un ejercicio da respuesta incorrecta  
- Audio que no se oye  
- Premium que no desbloquea  
- Texto ilegible o botón que no responde  

### Corregir NO (ahora)

- Nuevos niveles  
- Rediseño completo  
- Cambiar el precio sin motivo  
- Añadir funciones “porque mola”  

### Casillas

- [ ] Lista de problemas (críticos primero)  
- [ ] Críticos arreglados  
- [ ] Nueva versión subida a la misma prueba cerrada  
- [ ] Un tester confirma que ya va bien  

---

## FASE 6 — Preparar el lanzamiento

Haz esto **después** de corregir, **antes** del día D.

### 6.1 Ficha de Google Play (la “vitrina”)

- [ ] **Título:** Aprende Fonemas — Sonidos y letras  
- [ ] **Descripción corta** (1 línea para padres)  
- [ ] **Descripción larga** (qué hace, 4 niveles gratis, sin anuncios, offline)  
- [ ] **6–8 capturas de pantalla** (puedes sacarlas del móvil o del vídeo demo)  
- [ ] **Icono** 512×512  

Escribe para **padres y docentes**, no solo para el niño.

---

### 6.2 Landing pública (actualizar, no “definitiva”)

La web **siempre se puede mejorar**. Para el lanzamiento:

- [ ] Vídeo demo (~45 s) en la sección Demo  
- [ ] Botón **“Próximamente en Google Play”** → el día D cambias a **“Descargar”**  
- [ ] **Contador** (opcional pero queda profesional) — activar **10–14 días antes** del lanzamiento  
- [ ] Formulario o email “Avísame” si aún no hay enlace de descarga  

---

### 6.3 Redes sociales (simple)

No hace falta estar en todas. Con **una cuenta** (Instagram o TikTok) basta.

**Crear perfil** → aprendefonemas@gmail.com en la bio.

**Publicar solo esto:**

| # | Contenido |
|---|-----------|
| 1 | Presentación (“Estoy creando una app para aprender sonidos…”) |
| 2 | Vídeo demo corto |
| 3 | Cuenta atrás (si usas contador en la web) |
| 4 | “¡Ya disponible!” el día del lanzamiento |

---

### 6.4 SEO de la landing (sin blog)

No necesitas artículos. Solo esto en la web:

- [ ] Título de página claro (`<title>`)  
- [ ] Meta descripción (frase para Google)  
- [ ] Un H1 con el nombre de la app  
- [ ] Palabras clave naturales: conciencia fonológica, niños 3–7, aprender letras  
- [ ] `sitemap.xml` y `robots.txt` (ya están en `landing/`)  
- [ ] Open Graph / imagen al compartir enlace (opcional, mejora mucho)  
- [ ] Favicon (icono de la pestaña)  
- [ ] Registrar la web en [Google Search Console](https://search.google.com/search-console) (gratis)  

---

### Casillas Fase 6

- [ ] Ficha Play Store completa  
- [ ] Capturas subidas  
- [ ] Landing con vídeo  
- [ ] Contador activado (si lo usas)  
- [ ] 1–2 posts en redes preparados  
- [ ] Search Console configurado  

---

## FASE 7 — DÍA DEL LANZAMIENTO

Bloque completo. Hazlo en **un solo día** con esta lista:

### Mañana (Google)

- [ ] Play Console → **Promocionar a producción** (revisión Google: 1–7 días; a veces la app ya está “en revisión” antes)  
- [ ] Comprobar que el email y la privacidad en la ficha son correctos  

### Cuando Google aprueba (“Disponible”)

- [ ] **Probar tú mismo:** descargar desde Play Store, jugar, comprar Premium  
- [ ] **Landing:** cambiar botón a “Descargar en Google Play” con enlace real  
- [ ] **Contador:** quitar o poner “¡Ya disponible!”  
- [ ] **Reel / historia:** publicar “Ya está en Google Play”  
- [ ] **Avisar a testers:** “Gracias por probar; ya está publicada”  
- [ ] **Pedir reseña** solo a quien la haya usado de verdad (mensaje honesto, sin presión)  
- [ ] **Compartir enlace** de la ficha en grupos donde tengas permiso  

### Mensaje tipo para testers

> Hola, gracias por probar Aprende Fonemas. Ya está publicada en Google Play: [enlace]. Si os ha servido, una reseña honesta ayuda mucho. ¡Gracias!

### Casillas fin del día

- [ ] App descargable desde Play Store  
- [ ] Premium comprable  
- [ ] Landing actualizada  
- [ ] Redes publicadas  
- [ ] Testers avisados  

---

## FASE 8 — Primer mes

Tras el lanzamiento, **no añadir features grandes de golpe**. Roadmap por versiones en **[`PLAN_MEJORAS_FUTURAS.md`](PLAN_MEJORAS_FUTURAS.md)** (v1.0.x bugs → v1.1 contenido → v1.2 padres/logopedas).

### Semana 1 — Primera actualización

Casi siempre aparece **algún bug** que no viste.

- [ ] Revisar reseñas y mensajes de testers  
- [ ] Corregir errores importantes  
- [ ] Subir versión **1.0.1** (mismo proceso: build → Play Console)  
- [ ] Nota breve en la ficha: “Correcciones menores”  

### Semanas 2–4

- [ ] Mirar **instalaciones** y **caídas** en Play Console (pestaña Estadísticas / Calidad)  
- [ ] Responder reseñas (con educación, aunque sean negativas)  
- [ ] 2–3 posts en redes si te apetece (no obligatorio)  

### Publicidad (solo si quieres, después del launch)

**Primero publica. Luego decide.**

Cuando la app lleve 1–2 semanas estable, sin crashes, y con capturas bonitas:

- Prueba una **campaña pequeña** (5–10 €/día, 1–2 semanas)  
- Si un Reel funcionó bien solo, promociónalo unos días  

No inviertas antes de tener la ficha pulida.

### Cuándo planificar v1.1

Cuando v1.0 lleve **2–4 semanas estables** (sin crashes, audios OK), abrir el plan y priorizar ítems **C1–C5** (contenido pedagógico) según feedback real.

---

## Checklist maestro (imprimible)

### App
- [ ] Terminada y probada en móvil real  
- [ ] Audios e imágenes finales (mínimo parte gratis)  
- [ ] Premium compra + restaurar OK  
- [ ] Build Android lista  

### Web
- [ ] Landing pública + privacidad  
- [ ] Email aprendefonemas@gmail.com  

### Google Play
- [ ] Cuenta desarrollador  
- [ ] Data safety + Familias + clasificación  
- [ ] Producto Premium creado  
- [ ] Prueba cerrada con testers  
- [ ] Errores corregidos  

### Lanzamiento
- [ ] Ficha + capturas  
- [ ] Vídeo en landing  
- [ ] Contador (opcional)  
- [ ] DÍA D completado  
- [ ] Versión 1.0.1 en semana 1 si hace falta  

---

## ¿Y mañana qué hago?

Si estás perdido, empieza por **una sola casilla**:

| Si estás en… | Siguiente paso |
|--------------|----------------|
| Creando dibujos/audios | Sigue [`LISTADO_IMAGENES.md`](LISTADO_IMAGENES.md) — categoría Animales |
| App casi lista | Probar 12 niveles en móvil 20 minutos |
| App probada | Subir landing a Netlify |
| Landing online | Crear app en Play Console |
| Play Console creada | Subir build a prueba cerrada |
| Testers probando | Lista de 3 preguntas y corregir |
| Todo corregido | Ficha + capturas + preparar día D |

---

## Documentos del proyecto

| Documento | Cuándo abrirlo |
|-----------|----------------|
| [`PLAY_STORE_CHECKLIST.md`](PLAY_STORE_CHECKLIST.md) | Builds, código, IAP técnico |
| [`FICHA_PLAY_STORE.md`](FICHA_PLAY_STORE.md) | Textos y gráficos de la ficha (copiar/pegar) |
| [`GUIA_LANDING_NETLIFY.md`](GUIA_LANDING_NETLIFY.md) | Subir la web |
| [`GUIA_CREACION_IMAGENES.md`](GUIA_CREACION_IMAGENES.md) | Crear dibujos |
| [`LISTADO_IMAGENES.md`](LISTADO_IMAGENES.md) | Qué dibujos faltan |
| [`archivo/INTEGRACION_ASSETS.md`](archivo/INTEGRACION_ASSETS.md) | Nota histórica (assets ya en app) |
| [`PLAN_MEJORAS_FUTURAS.md`](PLAN_MEJORAS_FUTURAS.md) | **Después del lanzamiento:** roadmap v1.1, v1.2, escuela… (solo planificación) |
| [`PRIVACY_POLICY.md`](PRIVACY_POLICY.md) | Texto legal (copia) |

---

*Guía de lanzamiento — Aprende Fonemas · julio 2026 · Primera publicación en Google Play*
