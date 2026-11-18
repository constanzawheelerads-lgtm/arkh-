import type { L10n } from './types';

export interface CaseCard {
  card: string;
  position: L10n;
  reversed?: boolean;
}

export interface ConsultationCase {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  client: string;
  story: L10n;
  question: L10n;
  cards: CaseCard[];
  /** Questions the student may ask, with the fictional client's answers. */
  dialogue: { ask: L10n; answer: L10n }[];
  note?: L10n;
}

const POS = {
  situation: { es: 'Situación', en: 'Situation' },
  obstacle: { es: 'Obstáculo', en: 'Obstacle' },
  advice: { es: 'Consejo', en: 'Advice' },
  past: { es: 'Pasado', en: 'Past' },
  present: { es: 'Presente', en: 'Present' },
  future: { es: 'Tendencia', en: 'Trend' },
};

/** Fictional consultations. Every person here is invented for practice. */
export const CASES: ConsultationCase[] = [
  {
    id: 'marina', level: 'beginner', client: 'Marina',
    story: { es: 'Marina tiene 34 años. Le ofrecieron liderar un proyecto nuevo en su trabajo y no sabe si está preparada.', en: 'Marina is 34. She has been offered the lead on a new project at work and is unsure whether she is ready.' },
    question: { es: '¿Qué tengo que tener en cuenta antes de aceptar?', en: 'What should I consider before accepting?' },
    cards: [{ card: 'm01', position: POS.situation }, { card: 'p02', position: POS.obstacle }, { card: 'w06', position: POS.advice }],
    dialogue: [
      { ask: { es: '¿Qué te preocupa más del proyecto?', en: 'What worries you most about the project?' }, answer: { es: 'Tener que coordinar a mucha gente mientras sigo con mis tareas de siempre.', en: 'Having to coordinate many people while keeping up with my usual tasks.' } },
      { ask: { es: '¿Liderarías por primera vez?', en: 'Would this be your first time leading?' }, answer: { es: 'Sí, nunca estuve a cargo de un equipo.', en: 'Yes, I have never been in charge of a team.' } },
    ],
  },
  {
    id: 'tomas', level: 'intermediate', client: 'Tomás',
    story: { es: 'Tomás tiene 58 años. Piensa mudarse a otra ciudad para estar cerca de su hija y su nieto, pero le cuesta dejar su barrio.', en: 'Tomás is 58. He is thinking of moving to another city to be near his daughter and grandson, but finds it hard to leave his neighbourhood.' },
    question: { es: '¿Cómo puedo tomar esta decisión con más claridad?', en: 'How can I make this decision more clearly?' },
    cards: [{ card: 's06', position: POS.present }, { card: 'c06', position: POS.past }, { card: 'p10', position: POS.future }],
    dialogue: [
      { ask: { es: '¿Qué te ata a tu barrio?', en: 'What ties you to your neighbourhood?' }, answer: { es: 'Mis amigos de toda la vida y la casa donde crecieron mis hijos.', en: 'My lifelong friends and the house where my children grew up.' } },
      { ask: { es: '¿Qué opina tu hija?', en: 'What does your daughter think?' }, answer: { es: 'Le encantaría, pero dice que la decisión es mía.', en: 'She would love it, but says it is my decision.' } },
    ],
  },
  {
    id: 'lucia', level: 'intermediate', client: 'Lucía',
    story: { es: 'Lucía tiene 22 años. Estudia Derecho, pero desde hace un año piensa en dedicarse a la ilustración.', en: 'Lucía is 22. She studies law, but for a year she has been thinking about becoming an illustrator.' },
    question: { es: '¿Qué necesito saber para elegir mi camino?', en: 'What do I need to know to choose my path?' },
    cards: [{ card: 'w02', position: POS.situation }, { card: 'c07', position: POS.obstacle }, { card: 'm09', position: POS.advice }],
    dialogue: [
      { ask: { es: '¿Ya hiciste algún trabajo de ilustración?', en: 'Have you done any illustration work yet?' }, answer: { es: 'Algunos encargos para amigos, nada profesional.', en: 'A few commissions for friends, nothing professional.' } },
      { ask: { es: '¿Qué te gusta de Derecho?', en: 'What do you like about law?' }, answer: { es: 'Me da seguridad, pero no me entusiasma.', en: 'It feels safe, but it does not excite me.' } },
    ],
  },
  {
    id: 'raul', level: 'advanced', client: 'Raúl',
    story: { es: 'Raúl tiene 45 años y un restaurante familiar que perdió clientes este año. Su socio quiere vender el local.', en: 'Raúl is 45 and runs a family restaurant that lost customers this year. His partner wants to sell the premises.' },
    question: { es: '¿Qué actitud me conviene frente a la propuesta de mi socio?', en: 'What attitude should I take towards my partner’s proposal?' },
    cards: [{ card: 'p05', position: POS.situation, reversed: true }, { card: 's02', position: POS.obstacle }, { card: 'm10', position: POS.advice }],
    dialogue: [
      { ask: { es: '¿Desde cuándo bajaron las ventas?', en: 'Since when have sales dropped?' }, answer: { es: 'Desde que abrió una cadena a dos cuadras, hace ocho meses.', en: 'Since a chain opened two blocks away, eight months ago.' } },
      { ask: { es: '¿Y tú qué quieres hacer?', en: 'And what do you want to do?' }, answer: { es: 'No lo sé. Es el lugar de mi padre.', en: 'I don’t know. It was my father’s place.' } },
    ],
    note: { es: 'Esta tirada incluye una carta invertida. Indica qué criterio sigues para leerla (por ejemplo, Waite, 1910) o si prefieres no usar invertidas.', en: 'This spread includes a reversed card. State which approach you follow to read it (for example, Waite, 1910) or whether you prefer not to use reversals.' },
  },
];

export function getCase(id: string): ConsultationCase | undefined {
  return CASES.find((c) => c.id === id);
}
