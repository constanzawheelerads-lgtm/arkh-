import type { L10n } from '../content/types';
import { WORLDS } from '../content/worlds';
import { href } from '../router';
import { examPassed, type ProgressState } from './model';

export interface WorldActivity {
  label: L10n;
  href: string;
}

export interface WorldDef {
  n: number;
  name: L10n;
  desc: L10n;
  exam?: string;
  activities: WorldActivity[];
  requirement?: { text: L10n; met: (s: ProgressState) => boolean };
}

/** The academy path, in the order it is drawn on the map. */
export const WORLD_PATH: WorldDef[] = [
  {
    n: 0, name: WORLDS[0], exam: 'majors',
    desc: { es: 'Los 22 arcanos mayores, uno por etapa. Leerlos como “el viaje del Loco” es una metáfora moderna (s. XX), útil para estudiar, no un dato histórico.', en: 'The 22 major arcana, one per stage. Reading them as “the Fool’s journey” is a modern (20th-century) metaphor, useful for study, not a historical fact.' },
    activities: [{ label: { es: 'Estudiar los arcanos mayores', en: 'Study the major arcana' }, href: href.library() }],
  },
  {
    n: 1, name: WORLDS[1], exam: 'foundations',
    desc: { es: 'Fundamentos del sistema: estructura del mazo, palos, números y figuras de la corte. Sobre la mesa del Mago aparecen los cuatro palos.', en: 'Foundations of the system: deck structure, suits, numbers and court cards. The four suits lie on the Magician’s table.' },
    activities: [],
  },
  {
    n: 2, name: WORLDS[2], exam: 'history',
    desc: { es: 'Historia del tarot: de los mazos italianos del s. XV al Tarot de Marsella y al Rider-Waite-Smith, separando documento, hipótesis y leyenda.', en: 'History of tarot: from fifteenth-century Italian decks to the Tarot de Marseille and the Rider-Waite-Smith, separating document, hypothesis and legend.' },
    activities: [{ label: { es: 'Bibliografía comentada', en: 'Annotated bibliography' }, href: href.sources() }],
  },
  {
    n: 3, name: WORLDS[3], exam: 'minors',
    desc: { es: 'Los 56 arcanos menores: palos, números y figuras de la corte, con las escenas ilustradas que distinguen al RWS.', en: 'The 56 minor arcana: suits, numbers and court cards, with the illustrated scenes that set the RWS apart.' },
    activities: [{ label: { es: 'Estudiar los arcanos menores', en: 'Study the minor arcana' }, href: href.library() }],
    requirement: { text: { es: 'Completa la lección “La estructura del mazo”.', en: 'Complete the lesson “The structure of the deck”.' }, met: (s) => s.lessonsDone.includes('structure') },
  },
  {
    n: 6, name: WORLDS[6],
    desc: { es: 'Combinaciones: cómo dialogan dos o más cartas entre sí y con la pregunta.', en: 'Combinations: how two or more cards speak to each other and to the question.' },
    activities: [{ label: { es: 'Practicar combinaciones', en: 'Practise combinations' }, href: href.game('combination') }],
    requirement: { text: { es: 'Completa la lección “Observar antes de interpretar”.', en: 'Complete the lesson “Observe before interpreting”.' }, met: (s) => s.lessonsDone.includes('observe') },
  },
  {
    n: 9, name: WORLDS[9],
    desc: { es: 'Interpretación: observar, formular preguntas y leer para otras personas con consultas ficticias.', en: 'Interpretation: observing, asking questions and reading for others through fictional consultations.' },
    activities: [{ label: { es: 'Consultas ficticias', en: 'Fictional consultations' }, href: href.lab() }],
  },
  {
    n: 10, name: WORLDS[10],
    desc: { es: 'El Laboratorio: simulador de tiradas, práctica libre y consultas ficticias.', en: 'The Laboratory: spread simulator, free practice and fictional consultations.' },
    activities: [{ label: { es: 'Abrir el Laboratorio', en: 'Open the Laboratory' }, href: href.lab() }],
  },
  {
    n: 11, name: WORLDS[11],
    desc: { es: 'La sala de pruebas: juegos, contrarreloj y exámenes que evalúan comprensión, no solo memoria.', en: 'The testing hall: games, time trials and exams that assess understanding, not just memory.' },
    activities: [{ label: { es: 'Juegos y contrarreloj', en: 'Games and time trial' }, href: href.games() }],
  },
  {
    n: 17, name: WORLDS[17],
    desc: { es: 'Correspondencias: astrología, cábala y elementos, siempre con la escuela, el autor y la época de cada una.', en: 'Correspondences: astrology, kabbalah and elements, always with the school, author and period of each.' },
    activities: [{ label: { es: 'Ver correspondencias en la biblioteca', en: 'See correspondences in the library' }, href: href.library() }],
    requirement: { text: { es: 'Aprueba el examen de Arcanos mayores.', en: 'Pass the Major Arcana exam.' }, met: (s) => examPassed(s, 'majors') },
  },
];

export function getWorld(n: number): WorldDef | undefined {
  return WORLD_PATH.find((w) => w.n === n);
}

export function isWorldOpen(w: WorldDef, s: ProgressState): boolean {
  return !w.requirement || w.requirement.met(s);
}
