# Aprende Fonemas

App de conciencia fonológica para niños de **3 a 7 años** (español de España).

Sesiones cortas: fonemas, letras, dibujos, sílabas, rimas, fusión de sonidos y primeras frases. Pensada para casa y aula.

**Sin publicidad · Offline · Sin registro · Freemium** (niveles 1–4 gratis · 5–12 Premium, pago único)

Stack: React Native + Expo SDK 54 · Android · móvil, tablet y landscape

---

## Este repositorio (portfolio)

Es una copia **pública de código** para recruiters y portfolio.

| Incluye | No incluye |
|---------|------------|
| Código fuente, tests, docs de producto | Audios MP3 (licencia comercial) |
| Landing (HTML/CSS) | Ilustraciones de palabras / mascota |
| Icono de marca | Keystores, `.env`, credenciales EAS |
| LICENSE | Historial del repo privado de producción |

La app publicada está en Google Play:  
https://play.google.com/store/apps/details?id=com.davidspr81.aprendefonemas

Landing: https://aprendefonemas.netlify.app

> Clonar este repo **no** reproduce un build jugable completo: faltan a propósito los assets de producto. Sirve para revisar arquitectura, UX y lógica.

El desarrollo y los builds reales viven en un **repo privado**.

---

## Qué puedes mirar

- `AprendeFonemasApp/src/` — pantallas, ejercicios, progreso, IAP Premium
- `AprendeFonemasApp/__tests__/` — tests de contenido y calidad pedagógica
- `landing/` — web de producto
- `docs/` — guía de lanzamiento y notas

```bash
cd AprendeFonemasApp
npm install
npm test
```

`npx expo start` arranca el proyecto, pero sin MP3/PNG de contenido la experiencia no es la de producción.

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

## Estructura

```
aprende-fonemas-portfolio/
├── AprendeFonemasApp/   App Expo
├── landing/             Web
├── docs/                Guías
├── LICENSE
└── README.md
```

---

## Licencia

Todos los derechos reservados. Ver [LICENSE](LICENSE).  
Puedes leer el código; no redistribuyas assets ni publiques un fork comercial sin permiso.

Contacto: aprendefonemas@gmail.com
