# Cuentas, uso sin conexión y apps para Android e iOS (Fase 6)

## Qué quedó listo

| Pieza | Estado |
|---|---|
| Cuentas opcionales | Inicio de sesión con un **código de 6 dígitos** por correo (sin contraseñas). Perfil → «Tu cuenta». |
| Sincronización | El progreso se guarda en la nube (tabla `user_progress`, solo visible para su dueña o dueño) y se combina sin perder nada entre dispositivos. Se sincroniza solo, también al recuperar la conexión. |
| Eliminar la cuenta | Perfil → «Eliminar mi cuenta» (borra cuenta y copia en la nube; lo exigen Apple y Google). |
| Sin conexión (web) | *Service worker*: la app abre sin internet. Perfil → «Descargar la biblioteca» guarda las 78 cartas (≈20 MB). |
| Sin conexión (apps) | En Android e iOS todo viene incluido: cartas, textos y tipografías. |
| Instalable desde el navegador | Manifiesto e íconos: «Agregar a la pantalla de inicio». |
| Proyectos nativos | Carpetas `android/` e `ios/` (Capacitor 8), con ícono y pantalla de inicio generados desde `resources/`. |
| Mysterium | Desactivado (`VITE_MYSTERIUM_ENABLED=0`): muestra «Próximamente». El servidor queda desplegado y sin costo. |

## Pasos pendientes en Supabase (panel → proyecto `arkhe`)

1. **Plantilla del código** — *Authentication → Emails → Templates*. En **Magic Link** y en **Confirm signup**, agrega el código:

   ```html
   <h2>Tu código de Arkhé</h2>
   <p>Escribe este código en la app: <strong>{{ .Token }}</strong></p>
   <p>Vence en una hora. Si no lo pediste, ignora este correo.</p>
   ```

2. **Correo para el público (antes del lanzamiento)** — el servicio de correo incluido en Supabase solo envía a los miembros del equipo del proyecto (por ahora, tu correo) y pocos mensajes por hora. Para el público hace falta un SMTP propio. Opción gratuita: **Brevo** (plan gratuito con unos 300 correos por día). Se configura en *Authentication → Emails → SMTP Settings*. Ideal: usar un dominio propio para que los correos no vayan a spam.

## Compilar las apps

Cada vez que cambies la app web:

```bash
npm run cap:sync
```

**Android** (gratis, en Windows, Mac o Linux): instala [Android Studio](https://developer.android.com/studio), luego `npm run android`. Desde ahí: *Run* para probar en un teléfono o emulador, y *Build → Generate Signed App Bundle* para Google Play.

**iOS** (necesita una Mac con Xcode): `npm run ios`, luego *Product → Archive*.

> El identificador de la app es `com.arkhestudy.tarot` (en `capacitor.config.ts`). No se puede cambiar después de la primera publicación: revísalo antes.

## Costos de publicar (no son de Arkhé, son de las tiendas)

| Canal | Costo |
|---|---|
| Web instalable (GitHub Pages, Cloudflare Pages o Netlify) | **Gratis** |
| Google Play | US$25, pago único |
| App Store | US$99 por año |

Para empezar sin gastar: publicar la versión web instalable y dejar las tiendas para cuando haya ingresos.

## Requisitos de las tiendas ya cubiertos

- Eliminación de la cuenta desde la app.
- Sin publicidad ni rastreo.
- Política de privacidad: borrador en [POLITICA-DE-PRIVACIDAD.md](POLITICA-DE-PRIVACIDAD.md) (necesita revisión legal y una dirección de contacto antes de publicarse).
- Íconos y pantalla de inicio provisionales (estrella de ocho puntas). Reemplaza `resources/icon-only.png`, `icon-foreground.png`, `icon-background.png` y `splash.png`, y ejecuta `npx @capacitor/assets generate`.

## Pendiente para la Fase 7

- Revisión legal de imágenes, textos y política de privacidad.
- Pruebas en teléfonos reales (Android e iOS).
- Hosting de la versión web y, si se decide, publicación en tiendas.
- Fichas de las tiendas: capturas, descripción en español e inglés, clasificación por edad, formulario de seguridad de datos.
