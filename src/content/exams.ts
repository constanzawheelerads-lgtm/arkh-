import { CARDS, MAJOR_CARDS } from './cards';
import { SUITS } from './minors';
import type { Card, L10n, Question } from './types';
import { sample, shuffle } from '../lib/random';

/** An exam question may show a card image (id) above the prompt. */
export interface ExamQuestion extends Question {
  image?: string;
}

export interface ExamDef {
  id: string;
  world: number;
  title: L10n;
  /** Builds a fresh set of questions for one attempt. */
  build: (rand?: () => number) => ExamQuestion[];
}

const q = (prompt: L10n, options: L10n[], correct: number, explain: L10n): ExamQuestion => ({ prompt, options, correct, explain });

/** Shuffle options while keeping track of the right one. */
function mix(question: ExamQuestion, rand: () => number): ExamQuestion {
  const order = shuffle(question.options.map((_, i) => i), rand);
  return { ...question, options: order.map((i) => question.options[i]), correct: order.indexOf(question.correct) };
}

function nameOptions(answer: Card, pool: Card[], rand: () => number): { options: L10n[]; correct: number } {
  const others = sample(pool.filter((c) => c.id !== answer.id), 3, rand);
  const cards = shuffle([answer, ...others], rand);
  return { options: cards.map((c) => c.name), correct: cards.indexOf(answer) };
}

function imageToName(card: Card, pool: Card[], rand: () => number): ExamQuestion {
  const { options, correct } = nameOptions(card, pool, rand);
  return {
    image: card.id,
    prompt: { es: '¿Qué carta es esta?', en: 'Which card is this?' },
    options,
    correct,
    explain: { es: `Es ${card.name.es}.`, en: `It is ${card.name.en}.` },
  };
}

function descriptionToName(card: Card, pool: Card[], rand: () => number): ExamQuestion {
  const { options, correct } = nameOptions(card, pool, rand);
  return {
    prompt: { es: `¿Qué carta se describe? «${card.visual.es}»`, en: `Which card is described? “${card.visual.en}”` },
    options,
    correct,
    explain: { es: `Es ${card.name.es}.`, en: `It is ${card.name.en}.` },
  };
}

const FOUNDATIONS: ExamQuestion[] = [
  q({ es: '¿Cuántas cartas tiene el mazo Rider-Waite-Smith?', en: 'How many cards does the Rider-Waite-Smith deck have?' },
    [{ es: '78', en: '78' }, { es: '72', en: '72' }, { es: '56', en: '56' }], 0,
    { es: '22 arcanos mayores y 56 menores.', en: '22 major and 56 minor arcana.' }),
  q({ es: '¿Cuántas figuras de la corte tiene cada palo?', en: 'How many court cards does each suit have?' },
    [{ es: '4', en: '4' }, { es: '3', en: '3' }, { es: '10', en: '10' }], 0,
    { es: 'Sota, Caballero, Reina y Rey.', en: 'Page, Knight, Queen and King.' }),
  q({ es: 'Según la Golden Dawn, ¿qué elemento corresponde a Espadas?', en: 'According to the Golden Dawn, which element belongs to Swords?' },
    [{ es: 'Aire', en: 'Air' }, { es: 'Fuego', en: 'Fire' }, { es: 'Tierra', en: 'Earth' }], 0,
    { es: 'Aire. Algunos autores intercambian Bastos y Espadas; por eso importa citar la escuela.', en: 'Air. Some authors swap Wands and Swords, which is why the school matters.' }),
  q({ es: '¿Qué asignó la Golden Dawn a las cartas del Dos al Diez?', en: 'What did the Golden Dawn assign to the cards from Two to Ten?' },
    [{ es: 'Un decanato y un título', en: 'A decan and a title' }, { es: 'Una letra hebrea', en: 'A Hebrew letter' }, { es: 'Un número romano', en: 'A Roman numeral' }], 0,
    { es: 'Las letras hebreas se reservan para los arcanos mayores en ese sistema.', en: 'In that system Hebrew letters are reserved for the major arcana.' }),
  q({ es: '¿Cómo llamó Waite al palo de Oros?', en: 'What did Waite call the suit of Coins?' },
    [{ es: 'Pentacles', en: 'Pentacles' }, { es: 'Deniers', en: 'Deniers' }, { es: 'Discs', en: 'Discs' }], 0,
    { es: 'Pentacles; deniers es el nombre en el Tarot de Marsella.', en: 'Pentacles; deniers is the Tarot de Marseille name.' }),
  q({ es: '¿Qué conviene hacer primero ante una carta?', en: 'What should you do first with a card?' },
    [{ es: 'Observar y describir lo que muestra', en: 'Observe and describe what it shows' }, { es: 'Recordar su significado', en: 'Recall its meaning' }, { es: 'Buscar su planeta', en: 'Look up its planet' }], 0,
    { es: 'La observación es la base de cualquier interpretación fundamentada.', en: 'Observation is the basis of any grounded interpretation.' }),
];

const HISTORY: ExamQuestion[] = [
  q({ es: '¿Dónde y cuándo aparecen los primeros tarots documentados?', en: 'Where and when do the first documented tarots appear?' },
    [{ es: 'Norte de Italia, siglo XV', en: 'Northern Italy, 15th century' }, { es: 'Egipto antiguo', en: 'Ancient Egypt' }, { es: 'Francia, siglo XVIII', en: 'France, 18th century' }], 0,
    { es: 'En cortes como Milán y Ferrara, a mediados del siglo XV.', en: 'At courts such as Milan and Ferrara, in the mid-fifteenth century.' }),
  q({ es: '¿Para qué se usaban los primeros tarots?', en: 'What were the first tarots used for?' },
    [{ es: 'Para jugar a las cartas', en: 'To play card games' }, { es: 'Para adivinar el futuro', en: 'To tell the future' }, { es: 'Para rituales religiosos', en: 'For religious rituals' }], 0,
    { es: 'El uso adivinatorio se documenta mucho después.', en: 'Divinatory use is documented much later.' }),
  q({ es: '¿Qué propuso Court de Gébelin en 1781?', en: 'What did Court de Gébelin propose in 1781?' },
    [{ es: 'Un origen egipcio del tarot', en: 'An Egyptian origin of tarot' }, { es: 'Los significados invertidos', en: 'Reversed meanings' }, { es: 'El mazo de Marsella', en: 'The Marseille deck' }], 0,
    { es: 'Una teoría sin respaldo histórico.', en: 'A theory without historical support.' }),
  q({ es: '¿Quién ilustró el mazo Rider-Waite-Smith?', en: 'Who illustrated the Rider-Waite-Smith deck?' },
    [{ es: 'Pamela Colman Smith', en: 'Pamela Colman Smith' }, { es: 'Arthur Edward Waite', en: 'Arthur Edward Waite' }, { es: 'Frieda Harris', en: 'Frieda Harris' }], 0,
    { es: 'Waite dirigió el proyecto; Frieda Harris pintó el Thoth de Crowley.', en: 'Waite directed the project; Frieda Harris painted Crowley’s Thoth.' }),
  q({ es: '¿En qué año se publicó el Rider-Waite-Smith?', en: 'In which year was the Rider-Waite-Smith published?' },
    [{ es: '1909', en: '1909' }, { es: '1781', en: '1781' }, { es: '1944', en: '1944' }], 0,
    { es: 'Lo publicó William Rider & Son en Londres.', en: 'It was published by William Rider & Son in London.' }),
  q({ es: '¿Qué número tiene la Justicia en el Tarot de Marsella?', en: 'What number is Justice in the Tarot de Marseille?' },
    [{ es: 'VIII', en: 'VIII' }, { es: 'XI', en: 'XI' }, { es: 'XX', en: 'XX' }], 0,
    { es: 'Waite la pasó al XI e intercambió su lugar con la Fuerza.', en: 'Waite moved it to XI, swapping places with Strength.' }),
  q({ es: '¿Dónde aparecen documentados los significados invertidos?', en: 'Where are reversed meanings documented?' },
    [{ es: 'En la cartomancia francesa del siglo XVIII', en: 'In eighteenth-century French cartomancy' }, { es: 'En los primeros tarots italianos', en: 'In the first Italian tarots' }, { es: 'En el Tarot de Marsella de Noblet', en: 'In Noblet’s Tarot de Marseille' }], 0,
    { es: 'Por ejemplo en Etteilla (1785).', en: 'For example in Etteilla (1785).' }),
  q({ es: '¿Qué libro publicó Waite en 1910?', en: 'Which book did Waite publish in 1910?' },
    [{ es: 'The Pictorial Key to the Tarot', en: 'The Pictorial Key to the Tarot' }, { es: 'The Book of Thoth', en: 'The Book of Thoth' }, { es: 'Le Monde primitif', en: 'Le Monde primitif' }], 0,
    { es: 'The Book of Thoth es de Crowley (1944); Le Monde primitif, de Court de Gébelin.', en: 'The Book of Thoth is Crowley’s (1944); Le Monde primitif, Court de Gébelin’s.' }),
];

const MARSEILLE_DIFF: { n: number; right: L10n }[] = [
  { n: 1, right: { es: 'Le Bateleur', en: 'Le Bateleur' } },
  { n: 2, right: { es: 'La Papesse', en: 'La Papesse' } },
  { n: 5, right: { es: 'Le Pape', en: 'Le Pape' } },
  { n: 16, right: { es: 'La Maison Dieu', en: 'La Maison Dieu' } },
];

function majorsExam(rand: () => number): ExamQuestion[] {
  const out: ExamQuestion[] = [];
  sample(MAJOR_CARDS, 4, rand).forEach((c) => out.push(imageToName(c, MAJOR_CARDS, rand)));
  sample(MAJOR_CARDS.filter((c) => c.id !== 'm00'), 2, rand).forEach((c) => {
    const wrong = sample(MAJOR_CARDS.filter((x) => x.id !== c.id && x.id !== 'm00'), 2, rand).map((x) => ({ es: x.label, en: x.label }));
    out.push(mix({
      prompt: { es: `¿Qué número tiene ${c.name.es} en el RWS?`, en: `What number is ${c.name.en} in the RWS?` },
      options: [{ es: c.label, en: c.label }, ...wrong], correct: 0,
      explain: { es: `${c.name.es} es la ${c.label}.`, en: `${c.name.en} is ${c.label}.` },
    }, rand));
  });
  const m = sample(MARSEILLE_DIFF, 1, rand)[0];
  const card = MAJOR_CARDS[m.n];
  const decoys = MARSEILLE_DIFF.filter((x) => x.n !== m.n).map((x) => x.right);
  out.push(mix({
    prompt: { es: `¿Cómo se llama ${card.name.es} en el Tarot de Marsella?`, en: `What is ${card.name.en} called in the Tarot de Marseille?` },
    options: [m.right, ...sample(decoys, 2, rand)], correct: 0,
    explain: { es: `${card.name.es} es ${m.right.es} en Marsella.`, en: `${card.name.en} is ${m.right.en} in Marseille.` },
  }, rand));
  out.push(mix({
    prompt: { es: '¿Qué carta lleva el número VIII en el Rider-Waite-Smith?', en: 'Which card is number VIII in the Rider-Waite-Smith?' },
    options: [MAJOR_CARDS[8].name, MAJOR_CARDS[11].name, MAJOR_CARDS[14].name], correct: 0,
    explain: { es: 'La Fuerza; en Marsella la VIII es la Justicia.', en: 'Strength; in Marseille VIII is Justice.' },
  }, rand));
  return shuffle(out, rand);
}

function minorsExam(rand: () => number): ExamQuestion[] {
  const minors = CARDS.filter((c) => c.arcana === 'minor');
  const pips = minors.filter((c) => c.rank! >= 2 && c.rank! <= 10);
  const out: ExamQuestion[] = [];
  sample(minors, 3, rand).forEach((c) => out.push(imageToName(c, minors, rand)));
  sample(minors, 2, rand).forEach((c) => out.push(descriptionToName(c, minors, rand)));
  sample(pips, 2, rand).forEach((c) => {
    const decan = c.correspondences[0].rows.find((r) => r.label.en === 'Decan')!.value;
    const { options, correct } = nameOptions(c, pips, rand);
    out.push({
      prompt: { es: `Según la Golden Dawn, ¿qué carta corresponde a ${decan.es}?`, en: `According to the Golden Dawn, which card corresponds to ${decan.en}?` },
      options, correct,
      explain: { es: `${c.name.es}. Es una atribución de esa escuela.`, en: `${c.name.en}. It is an attribution of that school.` },
    });
  });
  const suit = sample(SUITS, 1, rand)[0];
  out.push(mix({
    prompt: { es: `¿Cómo se llama el palo de ${suit.name.es} en el Tarot de Marsella?`, en: `What is the suit of ${suit.name.en} called in the Tarot de Marseille?` },
    options: [{ es: suit.marseille, en: suit.marseille }, ...SUITS.filter((s) => s.id !== suit.id).slice(0, 2).map((s) => ({ es: s.marseille, en: s.marseille }))], correct: 0,
    explain: { es: `${suit.name.es}: ${suit.marseille}.`, en: `${suit.name.en}: ${suit.marseille}.` },
  }, rand));
  return shuffle(out, rand);
}

function foundationsExam(rand: () => number): ExamQuestion[] {
  const minors = CARDS.filter((c) => c.arcana === 'minor');
  const suitQs = sample(minors, 2, rand).map((c) => {
    const s = SUITS.find((x) => x.id === c.suit)!;
    return mix({
      image: c.id,
      prompt: { es: '¿A qué palo pertenece esta carta?', en: 'Which suit does this card belong to?' },
      options: [s.name, ...SUITS.filter((x) => x.id !== s.id).map((x) => x.name)], correct: 0,
      explain: { es: `Es ${c.name.es}.`, en: `It is ${c.name.en}.` },
    }, rand);
  });
  return shuffle([...FOUNDATIONS.map((x) => mix(x, rand)), ...suitQs], rand);
}

export const EXAMS: ExamDef[] = [
  { id: 'foundations', world: 1, title: { es: 'Fundamentos del sistema', en: 'Foundations of the system' }, build: (r = Math.random) => foundationsExam(r) },
  { id: 'history', world: 2, title: { es: 'Historia del tarot', en: 'History of tarot' }, build: (r = Math.random) => shuffle(HISTORY, r).map((x) => mix(x, r)) },
  { id: 'majors', world: 0, title: { es: 'Arcanos mayores', en: 'Major arcana' }, build: (r = Math.random) => majorsExam(r) },
  { id: 'minors', world: 3, title: { es: 'Arcanos menores', en: 'Minor arcana' }, build: (r = Math.random) => minorsExam(r) },
];

export function getExam(id: string): ExamDef | undefined {
  return EXAMS.find((e) => e.id === id);
}
