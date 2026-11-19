# Arkhé — The study of tarot

Fases 2 a 6 del documento maestro: app web mobile-first en React + TypeScript, lista para empaquetar luego con Capacitor (Android/iOS).

## Qué incluye

- **Biblioteca completa de 78 cartas** con las ilustraciones originales de Pamela Colman Smith (edición Rider de 1909), sin alterar, con filtros por palo. Ficha por carta: observación, significados según Waite (1910), correspondencias por escuela (Golden Dawn: atribuciones de los mayores, decanatos y títulos de los menores; diferencias de Crowley) e historia (nombre en el Tarot de Marsella).
- **9 lecciones** breves agrupadas por mundos inspirados en los arcanos: estructura, orígenes, RWS, Tarot de Marsella, observación, palos, números, figuras de la corte y lectura de dos cartas. Cada una con pregunta de comprobación y fuentes.
- **Bibliografía comentada** que clasifica cada fuente (primaria, investigación histórica, escuela esotérica).
- **Juegos**: Adivinar la carta, Verdadero o falso, Memotest y Combinaciones (lectura de dos cartas con vínculos observables y lista de criterios).
- **Mapa de mundos** inspirados en los arcanos mayores, con desbloqueos por requisitos (exploración libre + algunos pasos previos) y temario visible aunque el mundo esté bloqueado.
- **4 exámenes** (Fundamentos, Historia, Arcanos mayores, Arcanos menores): 8 preguntas generadas en cada intento, devolución al final y aprobación con 75 %.
- **Laboratorio**: simulador de tiradas de 1, 2 o 3 cartas con invertidas opcionales y 4 consultas ficticias (inicial, intermedia y avanzada) con preguntas al consultante y lista de criterios.
- **Contrarreloj**: identificar cartas durante 60 segundos.
- **Progresión RPG**: desafío diario, misiones semanales, 9 coleccionables (uno por mundo) y avatar personalizable (mantos por nivel, accesorios por coleccionables).
- **Progreso** local sin cuenta: XP, niveles, racha diaria y sellos; migración automática desde versiones anteriores.
- **Español e inglés** desde el inicio: todo el contenido es `{ es, en }` y los textos de interfaz están tipados para que falte una traducción sea un error de compilación.
- **Cuentas opcionales** con código por correo, **sincronización** del progreso entre dispositivos y eliminación de la cuenta desde la app. Guía: [docs/PUBLICAR-EN-TIENDAS.md](docs/PUBLICAR-EN-TIENDAS.md).
- **Sin conexión**: la app web funciona sin internet y puede descargar las 78 cartas; las apps nativas las incluyen.
- **Apps para Android e iOS** con Capacitor (`android/`, `ios/`), ícono y pantalla de inicio.
- **Mysterium, tutor con IA** (desactivado por ahora, se muestra «Próximamente») en tres modos (Lección con Claude Haiku 5.5; Socrático y Consultante con Claude Sonnet 5.5) y devolución de lecturas abiertas con criterios explícitos. Responde solo con las fuentes de Arkhé y las cita; 15 mensajes gratis por día. Configuración: [docs/CONFIGURAR-MYSTERIUM.md](docs/CONFIGURAR-MYSTERIUM.md).
- Mysterium se muestra con un emblema provisional hasta tener su ilustración definitiva.

## Comandos

```bash
npm install
npm run dev       # desarrollo
npm test          # pruebas (progreso, contenido bilingüe, rutas)
npm run build     # compila en dist/
npm run build:corpus   # regenera las fuentes de Mysterium tras editar contenido
npm run cap:sync       # compila y copia la app a android/ e ios/
npm run android        # abre el proyecto en Android Studio
```

## Estructura

```
src/
  content/   datos educativos (majors, lessons, trueFalse, worlds) separados de la interfaz
  i18n/      textos de interfaz es/en y proveedor de idioma
  progress/  modelo puro de progreso (XP, niveles, racha, sellos) + persistencia local
  screens/   pantallas
  components/
  lib/mysterium.ts  cliente del tutor (sesión anónima de Supabase + función)
supabase/
  functions/mysterium/  función que guarda la clave de la IA (tutor.ts = lógica probada)
  migrations/           contador diario de mensajes
evals/       30 preguntas de prueba para Mysterium
scripts/     build-corpus.ts (fuentes del tutor) y run-eval.ts
public/cards/  imágenes de las 78 cartas (300 px y 600 px): m00–m21, w/c/s/p01–14
```

## Pendiente para próximas fases

- Revisión legal de las imágenes y textos antes de publicar en tiendas (Fase 7).
