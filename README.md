# Arkhé — The study of tarot

Fases 2 y 3 del documento maestro: app web mobile-first en React + TypeScript, lista para empaquetar luego con Capacitor (Android/iOS).

## Qué incluye

- **Biblioteca completa de 78 cartas** con las ilustraciones originales de Pamela Colman Smith (edición Rider de 1909), sin alterar, con filtros por palo. Ficha por carta: observación, significados según Waite (1910), correspondencias por escuela (Golden Dawn: atribuciones de los mayores, decanatos y títulos de los menores; diferencias de Crowley) e historia (nombre en el Tarot de Marsella).
- **9 lecciones** breves agrupadas por mundos inspirados en los arcanos: estructura, orígenes, RWS, Tarot de Marsella, observación, palos, números, figuras de la corte y lectura de dos cartas. Cada una con pregunta de comprobación y fuentes.
- **Bibliografía comentada** que clasifica cada fuente (primaria, investigación histórica, escuela esotérica).
- **Juegos**: Adivinar la carta, Verdadero o falso, Memotest y Combinaciones (lectura de dos cartas con vínculos observables y lista de criterios).
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
public/cards/  imágenes de las 78 cartas (300 px y 600 px): m00–m21, w/c/s/p01–14
```

## Pendiente para próximas fases

- Mapa explorable, misiones, exámenes y avatar (Fase 4).
- Tutor IA Mysterium con fuentes verificadas (Fase 5).
- Cuentas y sincronización (Supabase), contenido sin conexión, Capacitor (Fase 6).
- Revisión legal de las imágenes y textos antes de publicar en tiendas (Fase 7).
