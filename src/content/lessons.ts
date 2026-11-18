import type { Lesson } from './types';

export const LESSONS: Lesson[] = [
  {
    id: 'structure',
    world: 1,
    title: { es: 'La estructura del mazo', en: 'The structure of the deck' },
    minutes: 3,
    pages: [
      {
        text: {
          es: 'El tarot Rider-Waite-Smith tiene 78 cartas: 22 arcanos mayores y 56 arcanos menores.',
          en: 'The Rider-Waite-Smith tarot has 78 cards: 22 major arcana and 56 minor arcana.',
        },
        card: 1,
      },
      {
        text: {
          es: 'Los menores se dividen en cuatro palos: Bastos, Copas, Espadas y Oros (también llamados Pentáculos). Cada palo tiene 14 cartas: del As al Diez y cuatro figuras de corte, Sota, Caballero, Reina y Rey.',
          en: 'The minor arcana are divided into four suits: Wands, Cups, Swords and Pentacles. Each suit has 14 cards: Ace to Ten and four court cards, Page, Knight, Queen and King.',
        },
      },
      {
        text: {
          es: 'Las expresiones “arcanos mayores” y “arcanos menores” no aparecen en los primeros mazos: se difunden en el ocultismo francés del siglo XIX.',
          en: 'The terms “major arcana” and “minor arcana” do not appear on the earliest decks: they spread through nineteenth-century French occultism.',
        },
      },
    ],
    quiz: {
      prompt: { es: '¿Cuántas cartas tiene cada palo de los arcanos menores?', en: 'How many cards are in each suit of the minor arcana?' },
      options: [{ es: '10', en: '10' }, { es: '14', en: '14' }, { es: '22', en: '22' }],
      correct: 1,
      explain: {
        es: 'Diez cartas numeradas (del As al Diez) más cuatro figuras de corte: 14.',
        en: 'Ten numbered cards (Ace to Ten) plus four court cards: 14.',
      },
    },
    sources: ['Dummett, M. (1980). The Game of Tarot. Duckworth.'],
  },
  {
    id: 'origins',
    world: 2,
    title: { es: 'Los primeros tarots', en: 'The first tarots' },
    minutes: 4,
    pages: [
      {
        text: {
          es: 'Los primeros tarots documentados aparecen en el norte de Italia a mediados del siglo XV, en cortes como las de Milán y Ferrara. Se los llamaba carte da trionfi, “cartas de triunfos”.',
          en: 'The earliest documented tarots appear in northern Italy in the mid-fifteenth century, at courts such as Milan and Ferrara. They were called carte da trionfi, “cards of triumphs”.',
        },
      },
      {
        text: {
          es: 'Eran un juego de cartas: los triunfos funcionaban como un palo superior en un juego de bazas. Juegos de esta familia se siguen jugando hoy en varios países de Europa.',
          en: 'They were a card game: the triumphs worked as a superior suit in a trick-taking game. Games of this family are still played today in several European countries.',
        },
      },
      {
        text: {
          es: 'Se conservan, de forma incompleta, barajas pintadas a mano para la nobleza, como las asociadas a la familia Visconti-Sforza de Milán.',
          en: 'Hand-painted decks made for the nobility survive incompletely, such as those associated with the Visconti-Sforza family of Milan.',
        },
      },
      {
        text: {
          es: 'El uso esotérico y adivinatorio del tarot está documentado mucho después, en la Francia del siglo XVIII. En 1781 Antoine Court de Gébelin propuso un origen egipcio que la investigación histórica no respalda.',
          en: 'The esoteric and divinatory use of tarot is documented much later, in eighteenth-century France. In 1781 Antoine Court de Gébelin proposed an Egyptian origin that historical research does not support.',
        },
      },
    ],
    quiz: {
      prompt: { es: 'Verdadero o falso: el tarot fue creado en el antiguo Egipto.', en: 'True or false: tarot was created in ancient Egypt.' },
      options: [{ es: 'Verdadero', en: 'True' }, { es: 'Falso', en: 'False' }],
      correct: 1,
      explain: {
        es: 'Es una teoría del siglo XVIII (Court de Gébelin, 1781) sin respaldo documental. Los primeros tarots conocidos son italianos, del siglo XV.',
        en: 'It is an eighteenth-century theory (Court de Gébelin, 1781) without documentary support. The earliest known tarots are Italian, from the fifteenth century.',
      },
    },
    sources: [
      'Dummett, M. (1980). The Game of Tarot. Duckworth.',
      'Decker, R., Depaulis, T. y Dummett, M. (1996). A Wicked Pack of Cards. St. Martin’s Press.',
    ],
  },
  {
    id: 'rws',
    world: 2,
    title: { es: 'El nacimiento del Rider-Waite-Smith', en: 'The birth of the Rider-Waite-Smith' },
    minutes: 4,
    pages: [
      {
        text: {
          es: 'En 1909 la editorial William Rider & Son de Londres publicó un mazo diseñado bajo la dirección de Arthur Edward Waite e ilustrado por Pamela Colman Smith. Ambos habían pertenecido a la Orden Hermética de la Golden Dawn.',
          en: 'In 1909 the London publisher William Rider & Son issued a deck designed under the direction of Arthur Edward Waite and illustrated by Pamela Colman Smith. Both had belonged to the Hermetic Order of the Golden Dawn.',
        },
        card: 2,
      },
      {
        text: {
          es: 'Su novedad más visible: las cartas numeradas de los menores muestran escenas con personajes, no solo grupos de símbolos. Un precedente parcial es el tarot Sola Busca (Italia, fines del s. XV).',
          en: 'Its most visible novelty: the numbered minor cards show scenes with figures, not just groups of pips. A partial precedent is the Sola Busca tarot (Italy, late fifteenth century).',
        },
      },
      {
        text: {
          es: 'Waite también intercambió dos cartas: en el Tarot de Marsella la Justicia es la VIII y la Fuerza la XI; en el RWS la Fuerza pasa a ser la VIII y la Justicia la XI, para ajustarse a las correspondencias de la Golden Dawn.',
          en: 'Waite also swapped two cards: in the Tarot de Marseille Justice is VIII and Strength XI; in the RWS Strength becomes VIII and Justice XI, to fit the Golden Dawn correspondences.',
        },
        card: 8,
      },
      {
        text: {
          es: 'En 1910 Waite publicó The Pictorial Key to the Tarot, donde describe cada carta y enumera significados adivinatorios. Arkhé cita esas listas como “Waite, 1910”.',
          en: 'In 1910 Waite published The Pictorial Key to the Tarot, describing each card and listing divinatory meanings. Arkhé cites those lists as “Waite, 1910”.',
        },
      },
    ],
    quiz: {
      prompt: { es: '¿Qué número tiene La Fuerza en el Rider-Waite-Smith?', en: 'What number is Strength in the Rider-Waite-Smith?' },
      options: [{ es: 'VIII', en: 'VIII' }, { es: 'XI', en: 'XI' }, { es: 'XIV', en: 'XIV' }],
      correct: 0,
      explain: {
        es: 'En el RWS es la VIII; en el Tarot de Marsella, la XI.',
        en: 'In the RWS it is VIII; in the Tarot de Marseille, XI.',
      },
    },
    sources: [
      'Waite, A. E. (1910). The Pictorial Key to the Tarot. William Rider & Son.',
      'Katz, M. y Goodwin, T. (2015). Secrets of the Waite-Smith Tarot. Llewellyn.',
    ],
  },
  {
    id: 'observe',
    world: 9,
    title: { es: 'Observar antes de interpretar', en: 'Observe before interpreting' },
    minutes: 3,
    pages: [
      {
        text: {
          es: 'Antes de interpretar, observa. Describe lo que ves: personajes, gestos, objetos, colores, paisaje y hacia dónde miran las figuras.',
          en: 'Before interpreting, observe. Describe what you see: figures, gestures, objects, colours, landscape and where the figures are looking.',
        },
        card: 9,
      },
      {
        text: {
          es: 'Distingue tres niveles: lo que la carta muestra, lo que un autor afirma que significa (por ejemplo, Waite en 1910) y lo que tú infieres. Arkhé siempre indica de quién es cada afirmación.',
          en: 'Distinguish three levels: what the card shows, what an author says it means (for example, Waite in 1910) and what you infer. Arkhé always shows who each claim belongs to.',
        },
      },
      {
        text: {
          es: 'Practica con El Mago: sobre su mesa hay una copa, una espada, un pentáculo y una vara, los cuatro palos del mazo.',
          en: 'Practise with The Magician: on his table lie a cup, a sword, a pentacle and a wand, the four suits of the deck.',
        },
        card: 1,
      },
    ],
    quiz: {
      prompt: { es: '¿Qué conviene hacer primero ante una carta?', en: 'What should you do first with a card?' },
      options: [
        { es: 'Recordar su significado de memoria', en: 'Recall its meaning from memory' },
        { es: 'Observar y describir lo que muestra', en: 'Observe and describe what it shows' },
        { es: 'Buscar su correspondencia astrológica', en: 'Look up its astrological correspondence' },
      ],
      correct: 1,
      explain: {
        es: 'La observación es la base: luego puedes comparar con lo que proponen distintos autores.',
        en: 'Observation is the foundation: then you can compare it with what different authors propose.',
      },
    },
    sources: ['Waite, A. E. (1910). The Pictorial Key to the Tarot. William Rider & Son.'],
  },
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
