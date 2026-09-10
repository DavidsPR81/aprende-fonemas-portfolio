# Aprende Fonemas

App educativa de **conciencia fonológica** para niños de 3–7 años (español de España).

Sesiones cortas: fonemas, letras, dibujos, sílabas, rimas, fusión de sonidos y primeras frases. Pensada para casa y aula.

| | |
|---|---|
| Modelo | Freemium · niveles 1–4 gratis · 5–12 Premium (pago único) |
| Privacidad | Sin publicidad · Offline · Sin registro de cuenta |
| Stack | React Native · Expo SDK 54 · Android (móvil, tablet, landscape) |
| Tienda | [Google Play](https://play.google.com/store/apps/details?id=com.davidspr81.aprendefonemas) |
| Web | [aprendefonemas.netlify.app](https://aprendefonemas.netlify.app) |

---

## Sobre este repositorio

Copia **pública de código** para portfolio y revisión técnica (recruiters / hiring).

El desarrollo, builds EAS y assets de producto viven en un **repositorio privado**. Clonar esto **no** da un build jugable completo.

### Política de assets y secretos

| Publicado aquí | No publicado (a propósito) |
|----------------|----------------------------|
| Código fuente, tests, docs de producto | Audios `.mp3` (voz / contenido comercial) |
| Landing HTML/CSS | Ilustraciones de palabras, frases y mascota |
| Icono / splash de marca | Keystores, `.env`, credenciales EAS / Play |
| LICENSE | Historial del repo privado de producción |

Los registries (`audioRegistry`, `imageRegistry`, `mascotRegistry`) son **stubs vacíos**. El `.gitignore` bloquea MP3/MP4 y carpetas de contenido si alguien intenta añadirlos por error.

---

## Qué mirar en el código

- `AprendeFonemasApp/src/` — pantallas, motor de ejercicios, progreso, IAP Premium
- `AprendeFonemasApp/__tests__/` — tests de contenido y calidad pedagógica
- `landing/` — web de producto
- `docs/` — notas de lanzamiento

```bash
cd AprendeFonemasApp
npm install
npm test
```

`npx expo start` arranca el proyecto, pero sin los assets de contenido la experiencia no es la de Play Store.

---

## Niveles

| Nivel | Contenido | Acceso |
|------:|-----------|--------|
| 1 | Escucha y elige la letra | Gratis |
| 2 | Escucha y elige el dibujo | Gratis |
| 3 | Escucha y elige la palabra | Gratis |
| 4 | ¿Con qué letra empieza? | Gratis |
| 5 | ¿Cuántas sílabas tiene? | Premium |
| 6 | ¿Con qué sílaba empieza? | Premium |
| 7 | ¿Con qué letra termina? | Premium |
| 8 | Palabras que riman | Premium |
| 9 | Junta los sonidos | Premium |
| 10 | ¿Qué letra falta al final? | Premium |
| 11 | ¿Qué letra falta en medio? | Premium |
| 12 | Lee la frase y elige el dibujo | Premium |

---

## Licencia

Todos los derechos reservados. Ver [LICENSE](LICENSE).

Puedes leer el código con fines de evaluación. No redistribuyas assets ni publiques un fork comercial sin permiso escrito.

Contacto: aprendefonemas@gmail.com
