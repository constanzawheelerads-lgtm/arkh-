import { MAJORS } from './majors';
import { MARSEILLE_RANKS, MINOR_CONTENT, RANK_NAMES, SUITS } from './minors';
import type { Card, CorrespondenceBlock, L10n, MajorArcanum, SuitId } from './types';

const GD = 'Golden Dawn';
const lbl = (es: string, en: string): L10n => ({ es, en });

function majorId(n: number): string {
  return `m${String(n).padStart(2, '0')}`;
}

function fromMajor(m: MajorArcanum): Card {
  const correspondences: CorrespondenceBlock[] = [
    {
      school: GD,
      rows: [
        { label: lbl('Atribución', 'Attribution'), value: m.goldenDawn.attribution },
        { label: lbl('Letra hebrea', 'Hebrew letter'), value: lbl(m.goldenDawn.hebrewLetter, m.goldenDawn.hebrewLetter) },
      ],
    },
    ...(m.otherSchools ?? []).map((o) => ({ school: o.school, rows: [], note: o.text })),
  ];
  return {
    id: majorId(m.n),
    arcana: 'major',
    order: m.n,
    label: m.roman,
    name: m.name,
    marseille: m.marseille,
    visual: m.visual,
    waite: m.waite,
    waiteReversed: m.waiteReversed,
    correspondences,
    note: m.note,
  };
}

const PIP_NOTE = lbl(
  'En el Tarot de Marsella y en la mayoría de los mazos anteriores, las cartas numeradas muestran solo los símbolos del palo, sin escenas. Las escenas del RWS son una creación de Smith y Waite.',
  'In the Tarot de Marseille and most earlier decks, the numbered cards show only the suit symbols, without scenes. The RWS scenes are a creation of Smith and Waite.',
);
const COURT_NOTE = lbl(
  'La Golden Dawn usó otros nombres para la corte (Rey, Reina, Príncipe y Princesa), y la equivalencia con las figuras del RWS se sigue debatiendo.',
  'The Golden Dawn used other names for the court (King, Queen, Prince and Princess), and how they map onto the RWS figures is still debated.',
);

function buildMinors(): Card[] {
  const out: Card[] = [];
  SUITS.forEach((suit, si) => {
    MINOR_CONTENT[suit.id].forEach((c, i) => {
      const rank = i + 1;
      const rows: CorrespondenceBlock['rows'] = [{ label: lbl('Elemento del palo', 'Suit element'), value: suit.element }];
      let note: L10n | undefined;
      if (rank === 1) {
        rows.push({ label: lbl('Título', 'Title'), value: suit.aceTitle });
      } else if (rank <= 10) {
        const [planet, sign, title] = suit.decans[rank - 2];
        rows.push({ label: lbl('Decanato', 'Decan'), value: lbl(`${planet.es} en ${sign.es}`, `${planet.en} in ${sign.en}`) });
        rows.push({ label: lbl('Título', 'Title'), value: title });
      } else {
        note = COURT_NOTE;
      }
      out.push({
        id: `${suit.initial}${String(rank).padStart(2, '0')}`,
        arcana: 'minor',
        order: 22 + si * 14 + i,
        label: `${RANK_NAMES[i].es} · ${suit.name.es}`,
        suit: suit.id,
        rank,
        name: lbl(`${RANK_NAMES[i].es} de ${suit.name.es}`, `${RANK_NAMES[i].en} of ${suit.name.en}`),
        marseille: `${MARSEILLE_RANKS[i]} de ${suit.marseille}`,
        visual: c.visual,
        waite: c.waite,
        waiteReversed: c.rev,
        correspondences: [{ school: GD, rows, note }],
        note: rank >= 2 && rank <= 10 ? PIP_NOTE : undefined,
      });
    });
  });
  return out;
}

export const CARDS: Card[] = [...MAJORS.map(fromMajor), ...buildMinors()];
export const MAJOR_CARDS = CARDS.filter((c) => c.arcana === 'major');

const BY_ID = new Map(CARDS.map((c) => [c.id, c]));

export function getCard(id: string): Card | undefined {
  return BY_ID.get(id);
}

export function cardImage(id: string, large = false): string {
  return `${import.meta.env.BASE_URL}cards/${id}${large ? '_lg' : ''}.jpg`;
}

export function cardsOfSuit(suit: SuitId): Card[] {
  return CARDS.filter((c) => c.suit === suit);
}

/** Short visible label: roman numeral for majors, localized rank for minors. */
export function shortLabel(card: Card, lang: 'es' | 'en'): string {
  if (card.arcana === 'major') return card.label;
  return SUITS.find((s) => s.id === card.suit)!.name[lang];
}

export { majorId };
