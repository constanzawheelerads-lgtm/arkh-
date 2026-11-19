import { describe, expect, it } from 'vitest';
import type Anthropic from '@anthropic-ai/sdk';
import corpusJson from './corpus.json';
import { buildParams, DAILY_LIMIT, MODELS, parseReply, selectDocs, validateRequest, ValidationError, type Corpus } from './tutor';

const corpus = corpusJson as Corpus;
const ask = (content: string, extra: Record<string, unknown> = {}) =>
  validateRequest({ mode: 'teacher', lang: 'es', messages: [{ role: 'user', content }], ...extra });

function fakeMessage(partial: Partial<Anthropic.Beta.Messages.BetaMessage>): Anthropic.Beta.Messages.BetaMessage {
  return { id: 'msg_test', type: 'message', role: 'assistant', model: 'claude-haiku-5-5', content: [], stop_reason: 'end_turn', stop_sequence: null, usage: {} as never, ...partial } as Anthropic.Beta.Messages.BetaMessage;
}

describe('configuration', () => {
  it('uses the agreed models and daily limit', () => {
    expect(MODELS).toEqual({ teacher: 'claude-haiku-5-5', socratic: 'claude-sonnet-5-5', client: 'claude-sonnet-5-5', evaluate: 'claude-sonnet-5-5' });
    expect(DAILY_LIMIT).toBe(15);
  });
});

describe('validateRequest', () => {
  it('accepts a normal question and drops invalid card ids', () => {
    const r = ask('¿Qué significa El Mago?', { context: { cardIds: ['m01', '../etc', 'z99'] } });
    expect(r.context.cardIds).toEqual(['m01']);
  });

  it('rejects bad shapes', () => {
    const bad = [
      null,
      { mode: 'hack', lang: 'es', messages: [{ role: 'user', content: 'hola' }] },
      { mode: 'teacher', lang: 'fr', messages: [{ role: 'user', content: 'hola' }] },
      { mode: 'teacher', lang: 'es', messages: [] },
      { mode: 'teacher', lang: 'es', messages: [{ role: 'assistant', content: 'hola' }] },
      { mode: 'teacher', lang: 'es', messages: [{ role: 'user', content: 'x'.repeat(2001) }] },
      { mode: 'teacher', lang: 'es', messages: [{ role: 'user', content: 'a' }, { role: 'assistant', content: 'b' }] },
      { mode: 'client', lang: 'es', messages: [{ role: 'user', content: 'hola' }] },
      { mode: 'evaluate', lang: 'es', reading: { kind: 'combination', text: 'corta' }, context: { cardIds: ['m01', 'p08'] } },
      { mode: 'evaluate', lang: 'es', reading: { kind: 'combination', text: 'una lectura suficientemente larga' }, context: { cardIds: ['m01'] } },
    ];
    for (const b of bad) expect(() => validateRequest(b), JSON.stringify(b)).toThrow(ValidationError);
  });
});

describe('selectDocs', () => {
  it('finds the cards and lessons a question is about', () => {
    const ids = selectDocs(corpus, ask('¿Por qué El Colgado está cabeza abajo?')).map((d) => d.id);
    expect(ids).toContain('card:m12');
    expect(ids).toContain('sources');
    const hist = selectDocs(corpus, ask('Was the tarot born in Egypt? Tell me about the first tarots', { lang: 'en' })).map((d) => d.id);
    expect(hist).toContain('lesson:origins');
  });

  it('puts context first and never exceeds the limit', () => {
    const docs = selectDocs(corpus, ask('compara la luna, el sol, la estrella, el mundo y el juicio', { context: { cardIds: ['m01'], lessonId: 'rws' } }));
    expect(docs[0].id).toBe('card:m01');
    expect(docs[1].id).toBe('lesson:rws');
    expect(docs.length).toBeLessThanOrEqual(6);
  });

  it('gives the querent only their own case', () => {
    const r = validateRequest({ mode: 'client', lang: 'es', context: { caseId: 'marina' }, messages: [{ role: 'user', content: '¿Qué te preocupa?' }] });
    expect(selectDocs(corpus, r).map((d) => d.id)).toEqual(['case:marina']);
  });
});

describe('buildParams', () => {
  it('teacher: Haiku, low effort, cited documents, no fallbacks', () => {
    const req = ask('¿Qué significa El Mago?', { context: { cardIds: ['m01'] } });
    const docs = selectDocs(corpus, req);
    const p = buildParams(req, docs);
    expect(p.model).toBe('claude-haiku-5-5');
    expect(p.output_config).toEqual({ effort: 'low' });
    expect(p.fallbacks).toBeUndefined();
    expect('temperature' in p).toBe(false);
    const first = p.messages[0].content as Anthropic.Beta.Messages.BetaContentBlockParam[];
    const documents = first.filter((b) => b.type === 'document') as Anthropic.Beta.Messages.BetaRequestDocumentBlock[];
    expect(documents).toHaveLength(docs.length);
    expect(documents.every((d) => d.citations?.enabled)).toBe(true);
    expect(documents[documents.length - 1].cache_control).toEqual({ type: 'ephemeral' });
    expect(first[first.length - 1]).toEqual({ type: 'text', text: '¿Qué significa El Mago?' });
    expect(String(p.system)).toContain('Mysterium');
  });

  it('keeps the conversation append-only after the documents', () => {
    const req = validateRequest({
      mode: 'socratic', lang: 'en', context: { cardIds: ['m09'] },
      messages: [{ role: 'user', content: 'Help me read the Hermit' }, { role: 'assistant', content: 'What does he hold?' }, { role: 'user', content: 'A lantern' }],
    });
    const p = buildParams(req, selectDocs(corpus, req));
    expect(p.model).toBe('claude-sonnet-5-5');
    expect(p.fallbacks).toBe('default');
    expect(p.betas).toEqual(['server-side-fallback-2026-07-01']);
    expect(p.messages.map((m) => m.role)).toEqual(['user', 'assistant', 'user']);
    expect(p.messages[2].content).toBe('A lantern');
  });

  it('evaluate: Sonnet with a JSON schema and no citations', () => {
    const req = validateRequest({ mode: 'evaluate', lang: 'es', context: { cardIds: ['m01', 'p08'] }, reading: { kind: 'combination', text: 'El Mago y el Ocho de Oros muestran trabajo con herramientas.', question: '¿Cómo empiezo?' } });
    const p = buildParams(req, selectDocs(corpus, req));
    expect(p.model).toBe('claude-sonnet-5-5');
    expect(p.output_config?.format?.type).toBe('json_schema');
    expect(p.output_config?.effort).toBe('medium');
    const blocks = p.messages[0].content as Anthropic.Beta.Messages.BetaContentBlockParam[];
    expect(blocks.some((b) => b.type === 'document' && b.citations)).toBe(false);
  });
});

describe('parseReply', () => {
  const req = ask('¿Qué significa El Mago?', { context: { cardIds: ['m01'] } });
  const docs = selectDocs(corpus, req);

  it('maps citations to Arkhé documents and skips thinking blocks', () => {
    const msg = fakeMessage({
      content: [
        { type: 'thinking', thinking: '', signature: 'sig' },
        { type: 'text', text: 'Waite lo asocia con la habilidad', citations: [{ type: 'char_location', cited_text: 'Habilidad, diplomacia', document_index: 0, document_title: docs[0].title.es, start_char_index: 0, end_char_index: 10, file_id: null }] },
        { type: 'text', text: '.', citations: null },
      ] as never,
    });
    const r = parseReply(msg, req, docs);
    expect(r).toMatchObject({ kind: 'chat', text: 'Waite lo asocia con la habilidad.' });
    if (r.kind === 'chat') expect(r.citations).toEqual([{ docId: 'card:m01', title: docs[0].title.es, quote: 'Habilidad, diplomacia' }]);
  });

  it('reports refusals without reading content', () => {
    expect(parseReply(fakeMessage({ stop_reason: 'refusal', content: [] }), req, docs)).toEqual({ kind: 'refusal', model: 'claude-haiku-5-5' });
  });

  it('parses evaluations and drops unknown criteria', () => {
    const ev = validateRequest({ mode: 'evaluate', lang: 'es', context: { caseId: 'marina' }, reading: { kind: 'case', text: 'Leo El Mago como recursos disponibles para Marina.' } });
    const json = JSON.stringify({ criteria: [{ id: 'positions', score: 2, comment: 'ok' }, { id: 'made-up', score: 0, comment: 'x' }], strengths: 's', suggestion: 'g', summary: 'm' });
    const r = parseReply(fakeMessage({ model: 'claude-sonnet-5-5', content: [{ type: 'text', text: json, citations: null }] as never }), ev, []);
    expect(r.kind).toBe('evaluation');
    if (r.kind === 'evaluation') expect(r.evaluation.criteria.map((c) => c.id)).toEqual(['positions']);
  });
});

describe('eval set and corpus', () => {
  it('every test question is a valid request with sources', async () => {
    const { readFileSync } = await import('node:fs');
    const cases = JSON.parse(readFileSync(new URL('../../../evals/mysterium-cases.json', import.meta.url), 'utf8')) as Record<string, unknown>[];
    expect(cases.length).toBeGreaterThanOrEqual(30);
    for (const c of cases) {
      const req = validateRequest({ mode: c.mode, lang: c.lang, context: c.context ?? {}, reading: c.reading, messages: c.question ? [{ role: 'user', content: c.question }] : undefined });
      expect(selectDocs(corpus, req).length, String(c.id)).toBeGreaterThan(0);
    }
  });

  it('corpus covers the whole deck, every lesson and case', async () => {
    const { CARDS } = await import('../../../src/content/cards');
    const { LESSONS } = await import('../../../src/content/lessons');
    const { CASES } = await import('../../../src/content/cases');
    const ids = new Set(corpus.docs.map((d) => d.id));
    for (const c of CARDS) expect(ids.has(`card:${c.id}`), c.id).toBe(true);
    for (const l of LESSONS) expect(ids.has(`lesson:${l.id}`), l.id).toBe(true);
    for (const c of CASES) expect(ids.has(`case:${c.id}`), c.id).toBe(true);
    // Regenerate with `npm run build:corpus` if this fails after editing content.
    const card = corpus.docs.find((d) => d.id === 'card:m01')!;
    expect(card.text.es).toContain(CARDS[1].visual.es);
  });
});
