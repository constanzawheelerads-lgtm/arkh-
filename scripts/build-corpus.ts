// Builds the source corpus Mysterium is allowed to cite, from the same content
// the app shows. Run with: npm run build:corpus
// Output: supabase/functions/mysterium/corpus.json (committed, deployed with the function).

import { writeFileSync } from 'node:fs';
import { CARDS } from '../src/content/cards';
import { CASES } from '../src/content/cases';
import { LESSONS } from '../src/content/lessons';
import { SOURCES } from '../src/content/sources';
import type { L10n, Lang } from '../src/content/types';
import type { CorpusDoc } from '../supabase/functions/mysterium/tutor';

const LANGS: Lang[] = ['es', 'en'];
const both = (f: (lang: Lang) => string): L10n => ({ es: f('es'), en: f('en') });
const L = {
  shows: { es: 'Qué muestra la ilustración (Pamela Colman Smith, 1909)', en: 'What the illustration shows (Pamela Colman Smith, 1909)' },
  waite: { es: 'Significados según A. E. Waite, The Pictorial Key to the Tarot (1910), selección parafraseada', en: 'Meanings according to A. E. Waite, The Pictorial Key to the Tarot (1910), paraphrased selection' },
  upright: { es: 'Derecha', en: 'Upright' },
  reversed: { es: 'Invertida', en: 'Reversed' },
  noRev: { es: 'Waite no da un significado invertido diferenciado para esta carta.', en: 'Waite gives no separate reversed meaning for this card.' },
  corr: { es: 'Correspondencias (pertenecen a la escuela indicada, no al tarot histórico)', en: 'Correspondences (they belong to the school named, not to the historical tarot)' },
  marseille: { es: 'En el Tarot de Marsella', en: 'In the Tarot de Marseille' },
  sources: { es: 'Fuentes', en: 'Sources' },
};

const docs: CorpusDoc[] = [];

for (const c of CARDS) {
  const keywords = new Set<string>();
  for (const lang of LANGS) c.name[lang].toLowerCase().split(/\s+/).forEach((w) => keywords.add(w));
  docs.push({
    id: `card:${c.id}`,
    kind: 'card',
    title: both((lang) => `${c.name[lang]}${c.arcana === 'major' ? ` (${c.label})` : ''} — Rider-Waite-Smith`),
    keywords: [...keywords],
    text: both((lang) => [
      `${L.shows[lang]}: ${c.visual[lang]}`,
      `${L.waite[lang]}. ${L.upright[lang]}: ${c.waite[lang]} ${L.reversed[lang]}: ${c.waiteReversed ? c.waiteReversed[lang] : L.noRev[lang]}`,
      `${L.corr[lang]}: ${c.correspondences.map((b) => `[${b.school}] ${b.rows.map((r) => `${r.label[lang]}: ${r.value[lang]}`).join('; ')}${b.note ? ` ${b.note[lang]}` : ''}`).join(' ')}`,
      `${L.marseille[lang]}: ${c.marseille}.${c.note ? ` ${c.note[lang]}` : ''}`,
    ].join('\n')),
  });
}

for (const lesson of LESSONS) {
  const keywords = new Set<string>();
  for (const lang of LANGS) lesson.title[lang].toLowerCase().split(/\s+/).forEach((w) => keywords.add(w));
  docs.push({
    id: `lesson:${lesson.id}`,
    kind: 'lesson',
    title: both((lang) => `Arkhé — ${lesson.title[lang]}`),
    keywords: [...keywords],
    text: both((lang) => `${lesson.pages.map((p) => p.text[lang]).join('\n')}\n${L.sources[lang]}: ${lesson.sources.join(' / ')}`),
  });
}

docs.push({
  id: 'sources',
  kind: 'sources',
  title: { es: 'Arkhé — Bibliografía comentada', en: 'Arkhé — Annotated bibliography' },
  keywords: ['bibliografía', 'bibliography', 'fuentes', 'sources', 'libro', 'book', 'autor', 'author'],
  text: both((lang) => SOURCES.map((s) => `${s.citation} — ${s.note[lang]}`).join('\n')),
});

for (const c of CASES) {
  docs.push({
    id: `case:${c.id}`,
    kind: 'case',
    title: both((lang) => (lang === 'es' ? `Consulta ficticia: ${c.client}` : `Fictional consultation: ${c.client}`)),
    keywords: [c.client.toLowerCase()],
    text: both((lang) => [
      `${c.client}. ${c.story[lang]}`,
      `${lang === 'es' ? 'Pregunta' : 'Question'}: ${c.question[lang]}`,
      `${lang === 'es' ? 'Tirada' : 'Spread'}: ${c.cards.map((x) => `${x.position[lang]}: ${CARDS.find((k) => k.id === x.card)!.name[lang]}${x.reversed ? ` (${L.reversed[lang].toLowerCase()})` : ''}`).join('; ')}`,
      ...c.dialogue.map((d) => `${lang === 'es' ? 'Si le preguntan' : 'If asked'} «${d.ask[lang]}»: «${d.answer[lang]}»`),
    ].join('\n')),
    cardIds: c.cards.map((x) => x.card),
  });
}

writeFileSync(new URL('../supabase/functions/mysterium/corpus.json', import.meta.url), JSON.stringify({ version: 1, docs }, null, 0));
console.log(`corpus: ${docs.length} documents`);
