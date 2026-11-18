import type { Source } from './types';

/** Annotated bibliography: every source says what kind of evidence it is. */
export const SOURCES: Source[] = [
  {
    id: 'waite-1910', kind: 'primary',
    citation: 'Waite, A. E. (1910). The Pictorial Key to the Tarot. London: William Rider & Son.',
    note: { es: 'El libro del propio Waite que acompaña al mazo. Fuente de los significados citados como “Waite, 1910”.', en: 'Waite’s own companion book to the deck. Source of the meanings cited as “Waite, 1910”.' },
  },
  {
    id: 'court-de-gebelin-1781', kind: 'primary',
    citation: 'Court de Gébelin, A. (1781). Le Monde primitif, vol. VIII. Paris.',
    note: { es: 'Primera interpretación esotérica publicada del tarot. Propone un origen egipcio que la historia no respalda.', en: 'First published esoteric interpretation of tarot. Proposes an Egyptian origin unsupported by history.' },
  },
  {
    id: 'etteilla-1785', kind: 'primary',
    citation: 'Etteilla (J.-B. Alliette) (1785). Manière de se récréer avec le jeu de cartes nommées Tarots. Paris.',
    note: { es: 'Uno de los primeros manuales de cartomancia con tarot; incluye significados invertidos.', en: 'One of the first tarot cartomancy manuals; includes reversed meanings.' },
  },
  {
    id: 'mathers-1888', kind: 'school',
    citation: 'Mathers, S. L. MacGregor (1888). The Tarot: Its Occult Signification, Use in Fortune-Telling, and Method of Play. London: George Redway.',
    note: { es: 'Folleto de uno de los fundadores de la Golden Dawn.', en: 'Booklet by one of the founders of the Golden Dawn.' },
  },
  {
    id: 'regardie-1937', kind: 'school',
    citation: 'Regardie, I. (ed.) (1937–1940). The Golden Dawn. Chicago: Aries Press.',
    note: { es: 'Publica los documentos de la Golden Dawn, incluido el “Libro T”, con sus correspondencias del tarot.', en: 'Publishes the Golden Dawn papers, including “Book T” with its tarot correspondences.' },
  },
  {
    id: 'crowley-1944', kind: 'school',
    citation: 'Crowley, A. (1944). The Book of Thoth. London: O.T.O.',
    note: { es: 'Sistema de Crowley para su tarot Thoth; se aparta de la Golden Dawn en algunas atribuciones.', en: 'Crowley’s system for his Thoth tarot; departs from the Golden Dawn in some attributions.' },
  },
  {
    id: 'kaplan-1978', kind: 'research',
    citation: 'Kaplan, S. R. (1978). The Encyclopedia of Tarot, vol. I. New York: U.S. Games Systems.',
    note: { es: 'Catálogo ilustrado de mazos históricos.', en: 'Illustrated catalogue of historical decks.' },
  },
  {
    id: 'dummett-1980', kind: 'research',
    citation: 'Dummett, M. (1980). The Game of Tarot. London: Duckworth.',
    note: { es: 'Estudio histórico de referencia sobre el tarot como juego de cartas.', en: 'Standard historical study of tarot as a card game.' },
  },
  {
    id: 'decker-1996', kind: 'research',
    citation: 'Decker, R., Depaulis, T. y Dummett, M. (1996). A Wicked Pack of Cards: The Origins of the Occult Tarot. London: Duckworth.',
    note: { es: 'Historia del tarot ocultista desde Court de Gébelin hasta fines del siglo XIX.', en: 'History of the occult tarot from Court de Gébelin to the late nineteenth century.' },
  },
  {
    id: 'katz-goodwin-2015', kind: 'research',
    citation: 'Katz, M. y Goodwin, T. (2015). Secrets of the Waite-Smith Tarot. Woodbury: Llewellyn.',
    note: { es: 'Estudio sobre la creación del mazo y el trabajo de Pamela Colman Smith.', en: 'Study of how the deck was made and of Pamela Colman Smith’s work.' },
  },
];
