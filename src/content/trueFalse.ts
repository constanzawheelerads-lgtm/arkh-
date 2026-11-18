import type { TrueFalseItem } from './types';

export const TRUE_FALSE: TrueFalseItem[] = [
  {
    id: 'rws-1909',
    statement: { es: 'El mazo Rider-Waite-Smith se publicó en 1909.', en: 'The Rider-Waite-Smith deck was published in 1909.' },
    answer: true,
    explain: { es: 'Lo publicó William Rider & Son, en Londres, en 1909.', en: 'It was published by William Rider & Son, London, in 1909.' },
  },
  {
    id: 'egypt',
    statement: { es: 'El tarot nació en el antiguo Egipto.', en: 'Tarot was born in ancient Egypt.' },
    answer: false,
    explain: { es: 'Es una teoría de Court de Gébelin (1781) sin respaldo histórico. Los primeros tarots conocidos son italianos, del siglo XV.', en: 'It is a theory by Court de Gébelin (1781) without historical support. The earliest known tarots are fifteenth-century Italian.' },
  },
  {
    id: 'marseille-justice',
    statement: { es: 'En el Tarot de Marsella, la Justicia lleva el número VIII.', en: 'In the Tarot de Marseille, Justice is number VIII.' },
    answer: true,
    explain: { es: 'Waite la trasladó al XI y puso a la Fuerza en el VIII.', en: 'Waite moved it to XI and put Strength at VIII.' },
  },
  {
    id: 'waite-drew',
    statement: { es: 'Arthur Edward Waite dibujó las ilustraciones del mazo.', en: 'Arthur Edward Waite drew the deck’s illustrations.' },
    answer: false,
    explain: { es: 'Waite dirigió el proyecto; las ilustraciones son de Pamela Colman Smith.', en: 'Waite directed the project; the illustrations are by Pamela Colman Smith.' },
  },
  {
    id: 'game',
    statement: { es: 'Los primeros tarots se usaban para jugar a las cartas.', en: 'The first tarots were used to play card games.' },
    answer: true,
    explain: { es: 'Los triunfos funcionaban como un palo superior en un juego de bazas.', en: 'The triumphs worked as a superior suit in a trick-taking game.' },
  },
  {
    id: 'reversed',
    statement: { es: 'Los significados invertidos se usan desde los primeros tarots del siglo XV.', en: 'Reversed meanings have been used since the first tarots of the fifteenth century.' },
    answer: false,
    explain: { es: 'Aparecen documentados en la cartomancia francesa del siglo XVIII, por ejemplo en Etteilla.', en: 'They are documented in eighteenth-century French cartomancy, for example in Etteilla.' },
  },
  {
    id: 'hermit-lantern',
    statement: { es: 'En el RWS, El Ermitaño sostiene una linterna con una estrella de seis puntas.', en: 'In the RWS, The Hermit holds a lantern containing a six-pointed star.' },
    answer: true,
    explain: { es: 'Es uno de los detalles más reconocibles de la carta IX.', en: 'It is one of the most recognisable details of card IX.' },
  },
  {
    id: 'mercury-universal',
    statement: { es: 'La correspondencia entre El Mago y Mercurio es común a todas las tradiciones históricas del tarot.', en: 'The correspondence between The Magician and Mercury is shared by all historical tarot traditions.' },
    answer: false,
    explain: { es: 'Es una atribución de la Golden Dawn (fines del s. XIX), no del tarot histórico.', en: 'It is a Golden Dawn attribution (late nineteenth century), not part of the historical tarot.' },
  },
  {
    id: 'scenic-pips',
    statement: { es: 'En el RWS, las cartas numeradas de los menores muestran escenas con personajes.', en: 'In the RWS, the numbered minor cards show scenes with figures.' },
    answer: true,
    explain: { es: 'Es su novedad más visible frente a la mayoría de los mazos anteriores.', en: 'It is its most visible novelty compared with most earlier decks.' },
  },
  {
    id: 'star-points',
    statement: { es: 'En La Estrella del RWS, la estrella principal tiene ocho puntas.', en: 'In the RWS Star, the main star has eight points.' },
    answer: true,
    explain: { es: 'Una gran estrella de ocho puntas rodeada de siete más pequeñas.', en: 'A great eight-pointed star surrounded by seven smaller ones.' },
  },
];
