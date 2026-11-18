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
        card: 'm01',
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
        card: 'm02',
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
        card: 'm08',
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
        card: 'm09',
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
        card: 'm01',
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
  {
    id: 'marseille',
    world: 2,
    title: { es: 'El Tarot de Marsella', en: 'The Tarot de Marseille' },
    minutes: 4,
    pages: [
      {
        text: {
          es: '“Tarot de Marsella” designa un modelo de mazo grabado en madera que se produjo en Francia y Suiza durante los siglos XVII y XVIII. El nombre se generalizó recién en los siglos XIX y XX.',
          en: '“Tarot de Marseille” names a woodcut deck pattern produced in France and Switzerland during the seventeenth and eighteenth centuries. The name only became widespread in the nineteenth and twentieth centuries.',
        },
      },
      {
        text: {
          es: 'Se conservan ejemplares de fabricantes como Jean Noblet (París, hacia 1650), Jean Dodal (Lyon, comienzos del s. XVIII) y Nicolas Conver (Marsella, 1760).',
          en: 'Surviving examples come from makers such as Jean Noblet (Paris, c. 1650), Jean Dodal (Lyon, early eighteenth century) and Nicolas Conver (Marseille, 1760).',
        },
      },
      {
        text: {
          es: 'Diferencias con el RWS: la Justicia es la VIII y la Fuerza la XI; Le Mat no lleva número; la XIII suele no tener nombre; y las cartas numeradas muestran solo los símbolos del palo, sin escenas.',
          en: 'Differences from the RWS: Justice is VIII and Strength XI; Le Mat is unnumbered; XIII usually has no name; and the numbered cards show only the suit symbols, without scenes.',
        },
        card: 'm11',
      },
    ],
    quiz: {
      prompt: { es: '¿Cómo suelen mostrar las cartas numeradas los mazos de Marsella?', en: 'How do Marseille decks usually show the numbered cards?' },
      options: [
        { es: 'Solo con los símbolos del palo', en: 'Only with the suit symbols' },
        { es: 'Con escenas y personajes', en: 'With scenes and figures' },
      ],
      correct: 0,
      explain: {
        es: 'Las escenas en todas las cartas numeradas son la gran novedad del RWS de 1909.',
        en: 'Scenes on every numbered card are the great novelty of the 1909 RWS.',
      },
    },
    sources: [
      'Dummett, M. (1980). The Game of Tarot. Duckworth.',
      'Kaplan, S. R. (1978). The Encyclopedia of Tarot, vol. I. U.S. Games Systems.',
    ],
  },
  {
    id: 'suits',
    world: 3,
    title: { es: 'Los cuatro palos', en: 'The four suits' },
    minutes: 4,
    pages: [
      {
        text: {
          es: 'Los arcanos menores tienen cuatro palos: Bastos, Copas, Espadas y Oros. Son los palos latinos de los naipes que llegaron a Europa a fines del siglo XIV, los mismos de la baraja española.',
          en: 'The minor arcana have four suits: Wands, Cups, Swords and Pentacles. They are the Latin suits of the playing cards that reached Europe in the late fourteenth century, the same as in Spanish decks.',
        },
        card: 'c01',
      },
      {
        text: {
          es: 'En el Tarot de Marsella los oros son monedas (deniers). Waite los llamó Pentacles y Smith los dibujó como discos con una estrella de cinco puntas.',
          en: 'In the Tarot de Marseille the coins are deniers. Waite called them Pentacles and Smith drew them as discs bearing a five-pointed star.',
        },
        card: 'p01',
      },
      {
        text: {
          es: 'La Golden Dawn y Waite asocian Bastos con el Fuego, Copas con el Agua, Espadas con el Aire y Oros con la Tierra. Algunos autores invierten Bastos y Espadas (Bastos-Aire, Espadas-Fuego). Arkhé siempre indica de qué escuela es cada correspondencia.',
          en: 'The Golden Dawn and Waite link Wands with Fire, Cups with Water, Swords with Air and Pentacles with Earth. Some authors swap Wands and Swords (Wands-Air, Swords-Fire). Arkhé always shows which school a correspondence belongs to.',
        },
        card: 'w01',
      },
    ],
    quiz: {
      prompt: { es: '¿Qué elemento asocia la Golden Dawn al palo de Copas?', en: 'Which element does the Golden Dawn link to the suit of Cups?' },
      options: [{ es: 'Fuego', en: 'Fire' }, { es: 'Agua', en: 'Water' }, { es: 'Tierra', en: 'Earth' }],
      correct: 1,
      explain: { es: 'Copas: Agua. Es una atribución de esa escuela.', en: 'Cups: Water. It is an attribution of that school.' },
    },
    sources: ['Dummett, M. (1980). The Game of Tarot. Duckworth.', 'Waite, A. E. (1910). The Pictorial Key to the Tarot. William Rider & Son.'],
  },
  {
    id: 'numbers',
    world: 3,
    title: { es: 'Del As al Diez', en: 'From Ace to Ten' },
    minutes: 4,
    pages: [
      {
        text: {
          es: 'Cada palo tiene diez cartas numeradas. En el RWS todas muestran una escena; mira, por ejemplo, el Tres de Espadas.',
          en: 'Each suit has ten numbered cards. In the RWS they all show a scene; look, for example, at the Three of Swords.',
        },
        card: 's03',
      },
      {
        text: {
          es: 'La Golden Dawn asignó a cada carta del Dos al Diez un decanato (diez grados del zodíaco regidos por un planeta) y un título. El Dos de Bastos, por ejemplo, es Marte en Aries, “Señor del Dominio”.',
          en: 'The Golden Dawn gave each card from Two to Ten a decan (ten degrees of the zodiac ruled by a planet) and a title. The Two of Wands, for example, is Mars in Aries, “Lord of Dominion”.',
        },
        card: 'w02',
      },
      {
        text: {
          es: 'También relacionó los números con las diez séfirot del Árbol de la Vida cabalístico, del As al Diez. El Diez de Oros muestra los pentáculos dispuestos según ese diagrama.',
          en: 'It also related the numbers to the ten sephiroth of the kabbalistic Tree of Life, from Ace to Ten. The Ten of Pentacles shows the pentacles arranged in that diagram.',
        },
        card: 'p10',
      },
      {
        text: {
          es: 'Son correspondencias de una escuela de fines del siglo XIX: sirven para estudiar ese sistema, no son un significado universal de los números.',
          en: 'These are correspondences of a late nineteenth-century school: useful for studying that system, not a universal meaning of the numbers.',
        },
      },
    ],
    quiz: {
      prompt: { es: '¿Qué asignó la Golden Dawn a cada carta del Dos al Diez?', en: 'What did the Golden Dawn assign to each card from Two to Ten?' },
      options: [
        { es: 'Un decanato y un título', en: 'A decan and a title' },
        { es: 'Una letra hebrea', en: 'A Hebrew letter' },
        { es: 'Un personaje histórico', en: 'A historical figure' },
      ],
      correct: 0,
      explain: { es: 'Las letras hebreas se reservan para los arcanos mayores en ese sistema.', en: 'In that system the Hebrew letters are reserved for the major arcana.' },
    },
    sources: ['Regardie, I. (ed.) (1937–1940). The Golden Dawn. Aries Press. (incluye el “Libro T”)'],
  },
  {
    id: 'courts',
    world: 3,
    title: { es: 'Las figuras de la corte', en: 'The court cards' },
    minutes: 3,
    pages: [
      {
        text: {
          es: 'Cada palo tiene cuatro figuras: Sota, Caballero, Reina y Rey. En el Tarot de Marsella se llaman Valet, Cavalier, Reine y Roi.',
          en: 'Each suit has four court cards: Page, Knight, Queen and King. In the Tarot de Marseille they are Valet, Cavalier, Reine and Roi.',
        },
        card: 'c11',
      },
      {
        text: {
          es: 'La Golden Dawn las llamó Princesa, Príncipe, Reina y Rey. Cómo se corresponden con las figuras del RWS sigue siendo motivo de debate.',
          en: 'The Golden Dawn called them Princess, Prince, Queen and King. How they correspond to the RWS figures is still debated.',
        },
      },
      {
        text: {
          es: 'Waite describió muchas figuras de la corte como personas con rasgos físicos y sociales; por ejemplo, el Rey de Bastos como un hombre amistoso y honesto. Muchos autores actuales las leen también como roles o actitudes.',
          en: 'Waite described many court cards as people with physical and social traits; for example, the King of Wands as a friendly, honest man. Many current authors also read them as roles or attitudes.',
        },
        card: 'w14',
      },
    ],
    quiz: {
      prompt: { es: '¿Cómo se llama la Sota en el Tarot de Marsella?', en: 'What is the Page called in the Tarot de Marseille?' },
      options: [{ es: 'Valet', en: 'Valet' }, { es: 'Cavalier', en: 'Cavalier' }, { es: 'Roi', en: 'Roi' }],
      correct: 0,
      explain: { es: 'Valet es la Sota; Cavalier, el Caballero; Roi, el Rey.', en: 'Valet is the Page; Cavalier, the Knight; Roi, the King.' },
    },
    sources: ['Waite, A. E. (1910). The Pictorial Key to the Tarot. William Rider & Son.'],
  },
  {
    id: 'pairs',
    world: 6,
    title: { es: 'Leer dos cartas juntas', en: 'Reading two cards together' },
    minutes: 4,
    pages: [
      {
        text: {
          es: 'Primero describe cada carta por separado, sin interpretar todavía.',
          en: 'First describe each card on its own, without interpreting yet.',
        },
        card: 'm01',
      },
      {
        text: {
          es: 'Busca vínculos visibles: palo, número, elemento, gestos, hacia dónde miran las figuras, objetos que se repiten. El Mago y el Ocho de Oros, por ejemplo, muestran a alguien trabajando con herramientas.',
          en: 'Look for visible links: suit, number, element, gestures, where the figures are looking, repeated objects. The Magician and the Eight of Pentacles, for example, both show someone working with tools.',
        },
        card: 'p08',
      },
      {
        text: {
          es: 'Relaciona esos vínculos con la pregunta. No hay una única respuesta correcta: una lectura es sólida cuando cada afirmación se apoya en algo que se ve en las cartas o en un autor que puedes citar.',
          en: 'Relate those links to the question. There is no single right answer: a reading is sound when each claim rests on something visible in the cards or on an author you can cite.',
        },
      },
    ],
    quiz: {
      prompt: { es: '¿Qué hace sólida una lectura de dos cartas?', en: 'What makes a two-card reading sound?' },
      options: [
        { es: 'Coincidir palabra por palabra con un libro', en: 'Matching a book word for word' },
        { es: 'Apoyar cada afirmación en lo que se ve o en una fuente', en: 'Backing each claim with what is visible or with a source' },
        { es: 'Usar la mayor cantidad posible de símbolos', en: 'Using as many symbols as possible' },
      ],
      correct: 1,
      explain: { es: 'Se aceptan distintas lecturas si están bien fundamentadas.', en: 'Different readings are accepted when they are well grounded.' },
    },
    sources: ['Waite, A. E. (1910). The Pictorial Key to the Tarot. William Rider & Son.'],
  },
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
