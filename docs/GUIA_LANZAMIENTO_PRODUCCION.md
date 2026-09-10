# Guía simple — Lanzar Aprende Fonemas (v18)

**Un solo camino:** Billing 8 en el código → build v18 → prueba interna → producción → landing y redes.

---

## Tú en Play Console: ¿hay que actualizar dependencias?

**NO.** En Play Console **no se actualizan librerías**.

| Quién | Qué hace |
|-------|----------|
| **Cursor / código (ya hecho)** | Actualizar Billing Library a **8.0.0** dentro del AAB |
| **Tú en Play Console** | Subir el AAB, probar, enviar a producción, rellenar ficha |
| **Tú en Netlify / redes** | Botón “Descargar” + posts cuando esté publicada |

El aviso de “Biblioteca de Facturación 8” **desaparece solo** cuando Google procese un AAB que ya lleve Billing ≥ 8 (el v18).

---

## Orden exacto (marca casillas)

### Paso 1 — Build v18 (lo hace el agente / EAS)

- Perfil: `production`
- Incluye: compras corregidas (Family Link PENDING) + Adult Gate + **Billing 8.0.0**
- Resultado: AAB con versionCode **18** (o el que marque EAS)

Cuando el build termine → descarga el `.aab` desde Expo.

### Paso 2 — Subir a Prueba interna (TÚ)

1. [Play Console](https://play.google.com/console) → Aprende Fonemas  
2. **Prueba** → **Prueba interna** → **Crear nueva versión**  
3. Sube el **AAB v18**  
4. Notas: `v18 Billing 8 + IAP Family Link`  
5. **Guardar** → **Revisar versión** → **Iniciar lanzamiento** a prueba interna  
6. Espera a que esté disponible para testers (minutos / pocas horas)  
7. En la tablet (cuenta tester + **Licencia de prueba**): actualiza / reinstala desde el enlace interno  

### Paso 3 — Probar igual que v17 (TÚ, en la tablet)

Con la cuenta que **ya tiene Premium**, al menos:

1. Abrir app → Premium sigue / o Restaurar → Premium OK  
2. Cerrar y abrir → Premium OK  
3. Adult Gate se ve bien (portrait / landscape)  
4. (Opcional) Desinstalar → reinstalar v18 → Restaurar → Premium OK  

Si puedes con otra cuenta tester sin compra: Comprar → cancelar → Premium NO.

**Si compra/restaurar fallan en v18 → no subas a producción; avísame.**

### Paso 4 — Producción (TÚ)

1. Play Console → **Producción** → **Crear nueva versión**  
2. Usa el **mismo AAB v18** (promocionar desde interna o subir el archivo)  
3. Revisa que no haya errores rojos en ficha / Data Safety / audiencia  
4. **Enviar a revisión**  
5. Espera **Disponible** (suele 1–7 días la primera vez)  
6. Copia el enlace:

   `https://play.google.com/store/apps/details?id=com.davidspr81.aprendefonemas`

7. Descarga **tú** desde Play Store pública y comprueba que abre

### Paso 5 — Landing el mismo día (TÚ o pedir al agente)

En `landing/index.html`, cambia “Próximamente…” por:

```html
<a class="btn btn-accent"
   href="https://play.google.com/store/apps/details?id=com.davidspr81.aprendefonemas"
   target="_blank" rel="noopener noreferrer">
  Descargar en Google Play
</a>
```

Deploy Netlify. Comprueba el botón en el móvil.

### Paso 6 — SEO y posición (gratis, claro)

**A) Google Play (lo que más importa para descargas)**

- Título de ficha con palabras naturales: *conciencia fonológica*, *letras*, *niños*  
- Descripción corta clara  
- Capturas buenas  
- Categoría Educación  
- Reseñas reales (pide a testers/docentes, sin presión)  
- Estabilidad (pocos crashes) → mejor ranking  

**B) Landing (Google búsqueda web)**

- URL: `https://aprendefonemas.netlify.app`  
- Título página y meta descripción con: *Aprende Fonemas*, *conciencia fonológica*, *niños 3–7*  
- Botón a Play  
- Registrar sitio en [Google Search Console](https://search.google.com/search-console) (gratis)  
- No hace falta blog al principio  

**C) Redes (casi 0 €)**

Crea solo lo que mantengas:

| Red | Acción |
|-----|--------|
| Instagram y/o TikTok | `@aprendefonemas` · bio con link Play o landing |
| Día del lanzamiento | 1 post/reel: “Ya en Google Play” + enlace |
| WhatsApp docentes | Mensaje corto + enlace |

Google Ads / Meta Ads: **no necesarios** para el día 1. Si algún día pruebas: presupuesto muy bajo y cuidado con políticas de apps infantiles.

### Paso 7 — Datos solo en Play Console (TÚ)

Cada día la primera semana (5 min):

- **Panel** → instalaciones / desinstalaciones  
- **Calidad → Fallos** → crashes  
- **Monetización** → ingresos de `premium_unlock`  
- **Reseñas** → leer y responder  

Nada de Firebase ni analítica externa (encaja con tu privacidad).

---

## Checklist final

- [ ] AAB v18 listo (EAS)  
- [ ] Subido a **prueba interna**  
- [ ] Probado Premium / Adult Gate en tablet  
- [ ] Mismo AAB a **producción**  
- [ ] App **Disponible** en Play  
- [ ] Landing → Descargar  
- [ ] 1 post redes + Search Console  
- [ ] Mirar Panel Play  

---

## Contactos

| Qué | Valor |
|-----|--------|
| Package | `com.davidspr81.aprendefonemas` |
| IAP | `premium_unlock` (pago único) |
| Landing | https://aprendefonemas.netlify.app |
| Privacidad | https://aprendefonemas.netlify.app/privacidad.html |

**Siguiente acción tuya cuando diga “Build finished”:** Paso 2 (subir AAB a prueba interna).
