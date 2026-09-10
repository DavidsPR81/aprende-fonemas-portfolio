# Guía landing web + Netlify — Aprende Fonemas

Sitio estático en la carpeta `landing/`. Mismo estilo visual que la app (colores Nunito, mascota, logo).

**Email del proyecto:** aprendefonemas@gmail.com  
**URL prevista:** `https://aprendefonemas.netlify.app` (puedes cambiar el subdominio en Netlify)

---

## Qué hay ya hecho

| Archivo | Qué hace |
|---------|----------|
| `landing/index.html` | Página principal: hero, beneficios, demo, niveles, Premium, contacto |
| `landing/privacidad.html` | Política de privacidad (Play Store) |
| `landing/css/main.css` | Estilos |
| `landing/assets/…` | Logo, mascotas, **vídeo** `videos/demo.mp4` |
| `landing/netlify.toml` | Deploy |
| `landing/robots.txt` + `sitemap.xml` | SEO |

### Vídeo demo

El MP4 ya está en `landing/assets/videos/demo.mp4` e incrustado en `index.html`.  
Para actualizarlo: sustituye el archivo y redeploy.  
Para Play Store: misma pieza en YouTube (público o no listado).

---

## Paso 1 — Probar en local

```bash
cd landing
npx serve .
```

Abre `http://localhost:3000` y revisa móvil (F12 → vista responsive).

---

## Paso 2 — Cuenta Netlify

1. Entra en [netlify.com](https://www.netlify.com) con **aprendefonemas@gmail.com** (o tu cuenta y añade el email del proyecto después).  
2. Verifica el email.

---

## Paso 3 — Publicar (primera vez)

### Opción A — Arrastrar carpeta (rápido)

1. Netlify → **Add new site** → **Deploy manually**  
2. Arrastra la carpeta `landing/` completa  
3. Netlify te da una URL tipo `random-name-123.netlify.app`  
4. **Site configuration** → **Domain management** → **Options** → cambia a `aprendefonemas` si está libre  

### Opción B — Conectar GitHub (recomendado)

1. Sube el repo a GitHub si no está  
2. Netlify → **Add new site** → **Import from Git**  
3. Repo `aprende-fonemas`  
4. Configuración de build:
   - **Base directory:** `landing`
   - **Build command:** *(vacío)*
   - **Publish directory:** `.` (o `landing` si base es raíz del repo — ver nota abajo)

Si el repo es la raíz `Aprende Fonemas/`:

| Campo | Valor |
|-------|--------|
| Base directory | `landing` |
| Build command | *(dejar vacío)* |
| Publish directory | `landing` |

Cada push a `main` (o la rama que elijas) redespliega solo.

---

## Paso 4 — Dominio propio (opcional, más adelante)

Si compras `aprendefonemas.com`:

1. Netlify → Domain management → Add custom domain  
2. En tu registrador (Cloudflare, Namecheap…): CNAME `www` → `tu-sitio.netlify.app`  
3. Activa HTTPS (Netlify lo hace solo con Let’s Encrypt)  
4. Actualiza `LANDING_URL` en la app y `sitemap.xml` / `robots.txt`

---

## Paso 5 — Enlazar la app y Play Store

Cuando la URL esté viva:

1. Edita `AprendeFonemasApp/src/config/appConfig.js`:

```javascript
export const LANDING_URL = 'https://aprendefonemas.netlify.app';
export const PRIVACY_POLICY_URL = `${LANDING_URL}/privacidad.html`;
```

2. **Google Play Console** → Ficha de la app → Política de privacidad → misma URL  
3. **Data safety:** sin recopilación de datos (coherente con `privacidad.html`)  
4. Email de contacto del desarrollador: **aprendefonemas@gmail.com**

---

## Paso 6 — Añadir vídeos (cuando tengas dibujos)

### Grabación en el móvil

- Android: grabación de pantalla nativa (vertical 9:16)  
- Graba en **1080×1920** o 720×1280, sin notificaciones  
- **40–50 s** en un solo clip, sin música de fondo (la app ya tiene audio)

### Subir a la landing

**Opción simple (archivos locales):**

```
landing/assets/videos/demo.mp4
landing/assets/videos/demo-poster.jpg   ← primer frame o pantallazo (opcional)
```

En `index.html`, dentro de `.phone-frame`, borra `.video-placeholder` y descomenta el `<video>`:

```html
<video
  class="demo-video"
  controls
  playsinline
  preload="metadata"
  poster="assets/videos/demo-poster.jpg"
  aria-label="Demo de Aprende Fonemas"
>
  <source src="assets/videos/demo.mp4" type="video/mp4" />
</video>
```

**Opción YouTube (menos peso en Netlify):**

1. Sube como **no listado**  
2. Sustituye el contenido de `.phone-frame` por un iframe vertical (o enlace “Ver demo” si el embed 9:16 te complica).

---

## Paso 7 — Contenido que aún puedes mejorar

| Elemento | Estado | Cuándo |
|----------|--------|--------|
| Vídeo demo (1× vertical) | Placeholder | Tras grabación pantalla |
| Botón Google Play | “Próximamente” | Al publicar AAB |
| Capturas Play Store | No en landing | 6–8 screenshots en consola (puedes reutilizar frames del vídeo) |
| Open Graph / Twitter card | Falta | Antes de compartir en redes — añadir `og:image` con logo |
| Analytics | No instalado | Opcional: Plausible o Netlify Analytics (respeta privacidad infantil) |
| Dominio `.com` | Opcional | Cuando quieras marca propia |

---

## Paso 8 — Checklist antes de “anunciar” la web

- [ ] `index.html` y `privacidad.html` se ven bien en móvil  
- [ ] Enlaces `mailto:aprendefonemas@gmail.com` funcionan  
- [ ] URL final en `appConfig.js` y Play Console  
- [ ] `sitemap.xml` y `robots.txt` con la URL real (si cambias subdominio)  
- [ ] Vídeo demo `demo.mp4` en `assets/videos/` (o dejar placeholder hasta grabar)  
- [ ] Favicon carga (ya usa `assets/icon.png`)

---

## Qué publicar cuándo

| Momento | Publicar en Netlify |
|---------|---------------------|
| **Ahora (borrador)** | Sí — solo tú y Play Console (URL privacidad). Los vídeos pueden quedarse en placeholder. |
| **Con dibujos listos** | Sustituir vídeos + opcional capturas en hero |
| **App en Play Store** | Cambiar botón a enlace Play + badge oficial |

No hace falta esperar a tener todo perfecto para el **primer deploy**: Play Store solo exige URL de privacidad válida y email de contacto.

---

## Estructura de carpetas

```
landing/
├── index.html
├── privacidad.html
├── css/main.css
├── js/main.js
├── assets/
│   ├── icon.png
│   ├── mascot-normal.png
│   ├── mascot-premium.png
│   └── videos/          ← demo.mp4 aquí
├── netlify.toml
├── robots.txt
└── sitemap.xml
```

---

## Problemas frecuentes

**La política no abre desde la app**  
→ `PRIVACY_POLICY_URL` debe ser HTTPS y la página debe responder 200.

**Netlify no encuentra la carpeta**  
→ Revisa Base directory = `landing` en settings del sitio.

**Vídeo muy pesado**  
→ Comprime con HandBrake (H.264, 720p) o usa YouTube no listado.

**Quiero ocultar la web hasta el lanzamiento**  
→ Netlify → Password protection (plan Pro) o no enlaces públicos hasta que estés listo; Play Console sí necesita la URL de privacidad accesible (puede ser sin promocionar la home).

---

## Resumen: qué falta para “estar OK todo”

1. **Crear cuenta Gmail** aprendefonemas@gmail.com si no existe  
2. **Deploy Netlify** → URL fija  
3. **Actualizar** `LANDING_URL` en `appConfig.js`  
4. **Terminar assets app** (dibujos, audios) — ver README principal  
5. **Grabar 2–3 vídeos** y sustituir placeholders  
6. **Play Store** — checklist en `docs/PLAY_STORE_CHECKLIST.md`  
7. **(Opcional)** Dominio propio + redes sociales con el mismo email

Cuando quieras, el siguiente paso técnico puede ser: embed de vídeos, badge de Google Play o página `/soporte`.
