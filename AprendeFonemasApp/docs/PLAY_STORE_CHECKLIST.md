# Checklist técnico Play Store — Aprende Fonemas

Guía narrativa: [`GUIA_PUBLICACION_COMPLETA.md`](GUIA_PUBLICACION_COMPLETA.md)

---

## Código

- [x] `USE_SPEECH_PREVIEW = false`
- [x] Ilustraciones + icono/splash
- [x] IAP `premium_unlock` cableado
- [x] Landing + `privacidad.html`
- [x] `eas` + `projectId` en `app.json`
- [ ] Producto IAP verificado en compra real (track cerrado / prod)
- [x] `npm test` en verde

Build de prueba: `EXPO_PUBLIC_BETA_REVIEW=1` → Premium gratis.  
Producción: sin esa variable.

---

## EAS / build

```bash
cd AprendeFonemasApp
npx eas-cli build -p android --profile testing      # prueba cerrada (beta)
npx eas-cli build -p android --profile production   # tienda
# opcional:
npx eas-cli submit -p android --profile testing     # track alpha
```

- [x] Cuenta Expo
- [x] `eas.json`
- [x] package `com.davidspr81.aprendefonemas`
- [x] AAB testing (cerrada, versionCode 11)
- [ ] Primera AAB production
- [x] Keystore en EAS

---

## Google Play Console

| Ítem | Notas |
|------|--------|
| App | Educación |
| Ficha / capturas | Subidas; vídeo YouTube opcional |
| Privacidad | `https://aprendefonemas.netlify.app/privacidad.html` |
| IAP `premium_unlock` | ~3,99 € |
| Prueba cerrada | Alpha, v11 activa |
| Prueba interna | Pausada |
| Producción | Tras 12×14 + formulario |

---

## Ramas

- Desarrollo: `develop`
- Release: merge a `main` + tag `v1.0.0`
