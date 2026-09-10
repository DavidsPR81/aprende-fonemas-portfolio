# Guía para crear los dibujos (palabras y frases)

**Listado único sin duplicados:** [`LISTADO_IMAGENES.md`](LISTADO_IMAGENES.md) (`npm run content:images`).

Hay **150 palabras + 20 frases = 170 PNG** (no 311: muchas palabras se reutilizan en varios niveles).

---

## ¿IA o imágenes gratis de internet?

| Opción | Veredicto para esta app |
|--------|-------------------------|
| **IA con el mismo prompt** | **Recomendado.** 150 objetos con estilo uniforme. La app se ve profesional y coherente. |
| **Bancos gratis** (Flaticon, Freepik, Pixabay…) | Mezcla de estilos, licencias distintas, difícil que parezcan un solo pack. Solo compensa para 5–10 iconos puntuales. |
| **Híbrido** | IA para el grueso + retoque manual en Canva/Photopea si un dibujo sale raro. |

**Con créditos limitados (ej. ~18/día en Bing):** no vayas alfabéticamente. Abre el listado **por categoría** y haz un lote entero el mismo día con **el mismo prompt** (todos los animales, luego todo cuerpo, etc.).

### Prioridad sugerida

1. **Gratis primero** (50 palabras niveles 1–4): animales → naturaleza → casa → vehículos básicos  
2. **Premium** por categoría  
3. **Frases** (20 escenas) al final — son composiciones, no un solo objeto

---

## Especificaciones técnicas

| | |
|---|---|
| **Tamaño** | 512 × 512 px |
| **Formato** | PNG |
| **Fondo** | Transparente (no blanco ni cuadros) |
| **Nombre** | slug minúsculas: `Árbol` → `arbol.png` |
| **Palabras** | `assets/images/words/` |
| **Frases** | `assets/images/sentences/` |

---

## Estilo único — un prompt para todos

### Reglas

1. **Un objeto** por imagen, grande y centrado (~70–80 % del cuadro).  
2. **Sin texto** en el dibujo.  
3. **Flat design infantil** — no fotorrealismo.  
4. **Mismos colores suaves** en todo el pack.  
5. Solo cambia el **objeto** entre imágenes; el prompt base no cambia.

### Colores de referencia (app)

- Fondo app: `#F4F9FC`  
- Azul acento: `#5BA4D9`  
- Amarillo mascota: `#FFD166`

### Prompt base (inglés — suele ir mejor en Bing/DALL·E)

```
Flat children educational app illustration, [OBJECT], single centered object,
soft bright colors, rounded shapes, clean cute cartoon, transparent background,
no text, no border, no shadow on floor, friendly for ages 3-7, consistent style
```

Sustituye `[OBJECT]` por: `duck`, `red apple`, `school bus`, `human ear`, etc.

### Prompt base (español — Copilot/Bing)

```
Ilustración infantil flat design, [OBJETO], un solo objeto centrado,
colores suaves y vivos, formas redondeadas, estilo app educativa limpia,
fondo transparente, sin texto, sin marco, sin sombra en el suelo, niños 3-7 años
```

### Ejemplo de lote (animales, mismo día)

```
... duck
... honey bee
... elephant
... cat
```

No cambies adjetivos ni estilo entre generaciones del mismo lote.

---

## Flujo de trabajo (IA)

1. Abre **una categoría** del listado (ej. «Animales (32)»).  
2. Genera en [Bing Image Creator](https://www.bing.com/create) con el prompt base.  
3. **remove.bg** o Photopea → fondo transparente.  
4. Redimensiona **512×512**, objeto centrado.  
5. Guarda como `slug.png` (nombre exacto del listado).  
6. Marca el checkbox en `LISTADO_IMAGENES.md`.  
7. Al terminar la categoría, pasa a la siguiente otro día si te quedas sin créditos.

### Si el fondo sale con cuadros (checkerboard)

```bash
node scripts/remove-checkerboard-bg.js assets/images/words/nombre.png
```

---

## Frases (nivel 11) — distinto a palabras

Cada frase es una **escena pequeña** (personaje + acción), no un objeto aislado.

Prompt ejemplo:

```
Flat children app illustration, simple scene: [DESCRIPCIÓN EN INGLÉS],
two or three elements max, soft colors, transparent background, no text, ages 3-7
```

Ejemplo: `a duck and the sun, simple cute scene`

---

## Herramientas

| Herramienta | Uso |
|-------------|-----|
| [Bing Image Creator](https://www.bing.com/create) | Generar con IA |
| [Canva](https://www.canva.com) | Recortar y centrar |
| [remove.bg](https://www.remove.bg) | Quitar fondo |
| [Photopea](https://www.photopea.com) | PNG transparente, retoques |

---

## Después de crear un lote

1. Copia PNG en `assets/images/words/` o `sentences/`.  
2. Registra en `src/data/imageRegistry.js`.  
3. Recarga la app (`r` en Metro).

Detalle histórico: [`archivo/INTEGRACION_ASSETS.md`](archivo/INTEGRACION_ASSETS.md).

---

## Cuánto tiempo (orientativo)

| Ritmo | Palabras | Días (~18 IA/día) |
|-------|----------|-------------------|
| Solo gratis | 50 | ~3 días |
| Todas las palabras | 150 | ~8–9 días |
| + 20 frases | 170 | ~10 días |

Con bancos de imágenes no ahorras tiempo si luego tienes que unificar estilo a mano.
