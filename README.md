# Arkhé — The study of tarot

MVP educativo (Fase 2 del documento maestro): app web mobile-first en React + TypeScript, lista para empaquetar luego con Capacitor (Android/iOS).

## Qué incluye

- **Biblioteca** de los 22 arcanos mayores con las ilustraciones originales de Pamela Colman Smith (edición Rider de 1909), sin alterar. Ficha por carta: observación, significados según Waite (1910), correspondencias de la Golden Dawn e historia (nombre y número en el Tarot de Marsella).
- **Lecciones** breves (4) agrupadas por mundos inspirados en los arcanos, con pregunta de comprobación y fuentes.
- **Juegos**: Adivinar la carta, Verdadero o falso, Memotest.
- **Progreso** local sin cuenta: XP, niveles, racha diaria y sellos.
- **Español e inglés** desde el inicio: todo el contenido es `{ es, en }` y los textos de interfaz están tipados para que falte una traducción sea un error de compilación.
- Mysterium (profesor) como emblema provisional.

## Comandos

```bash
npm install
npm run dev       # desarrollo
npm test          # pruebas (progreso, contenido bilingüe, rutas)
npm run build     # compila en dist/
```

## Estructura

```
src/
  content/   datos educativos (majors, lessons, trueFalse, worlds) separados de la interfaz
  i18n/      textos de interfaz es/en y proveedor de idioma
  progress/  modelo puro de progreso (XP, niveles, racha, sellos) + persistencia local
  screens/   pantallas
  components/
public/cards/  imágenes de las cartas (300 px y 600 px)
```

## Pendiente para próximas fases

- 56 arcanos menores, correspondencias de otras escuelas, más lecciones (Fase 3).
- Mapa explorable, misiones, exámenes y avatar (Fase 4).
- Tutor IA Mysterium con fuentes verificadas (Fase 5).
- Cuentas y sincronización (Supabase), contenido sin conexión, Capacitor (Fase 6).
- Revisión legal de las imágenes y textos antes de publicar en tiendas (Fase 7).
