// Runs Mysterium's test questions against the real API and grades each answer.
// It spends money (roughly US$0.50 per full run with the default models), so it
// only runs when you call it explicitly:
//
//   ANTHROPIC_API_KEY=... npm run eval:mysterium            # agreed models
//   ANTHROPIC_API_KEY=... npm run eval:mysterium -- --teacher-model=claude-sonnet-5-5
//
// Output: evals/report-<timestamp>.md with every answer, the grader's verdict and token usage.

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'node:fs';
import corpusJson from '../supabase/functions/mysterium/corpus.json';
import { buildParams, MODELS, parseReply, selectDocs, validateRequest, type Corpus } from '../supabase/functions/mysterium/tutor';

interface Case {
  id: string;
  mode: 'teacher' | 'socratic' | 'client' | 'evaluate';
  lang: 'es' | 'en';
  question?: string;
  context?: Record<string, unknown>;
  reading?: Record<string, unknown>;
  expect: string;
}

const corpus = corpusJson as Corpus;
const cases = JSON.parse(readFileSync(new URL('../evals/mysterium-cases.json', import.meta.url), 'utf8')) as Case[];
const teacherOverride = process.argv.find((a) => a.startsWith('--teacher-model='))?.split('=')[1];
const client = new Anthropic();
const GRADER = 'claude-opus-5-5';

async function grade(c: Case, answer: string): Promise<{ pass: boolean; reason: string }> {
  const res = await client.messages.create({
    model: GRADER,
    max_tokens: 2000,
    output_config: {
      effort: 'low',
      format: {
        type: 'json_schema',
        schema: { type: 'object', properties: { pass: { type: 'boolean' }, reason: { type: 'string' } }, required: ['pass', 'reason'], additionalProperties: false },
      },
    },
    messages: [{
      role: 'user',
      content: `You grade a tarot-education tutor. Decide whether the ANSWER meets the EXPECTATION. Be strict about invented facts or authors and about claiming the cards predict events; be lenient about wording.\n\nQUESTION / INPUT:\n${c.question ?? JSON.stringify(c.reading)}\n\nEXPECTATION:\n${c.expect}\n\nANSWER:\n${answer}`,
    }],
  });
  const text = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  return JSON.parse(text);
}

const rows: string[] = [];
let passed = 0;
let inTok = 0;
let outTok = 0;
for (const c of cases) {
  const req = validateRequest({ mode: c.mode, lang: c.lang, context: c.context ?? {}, reading: c.reading, messages: c.question ? [{ role: 'user', content: c.question }] : undefined });
  const docs = selectDocs(corpus, req);
  const params = buildParams(req, docs);
  if (c.mode === 'teacher' && teacherOverride) params.model = teacherOverride;
  const msg = await client.beta.messages.create(params);
  inTok += msg.usage.input_tokens + (msg.usage.cache_read_input_tokens ?? 0) + (msg.usage.cache_creation_input_tokens ?? 0);
  outTok += msg.usage.output_tokens;
  const reply = parseReply(msg, req, docs);
  const answer = reply.kind === 'chat'
    ? `${reply.text}\n\n[citas: ${reply.citations.map((x) => x.title).join('; ') || 'ninguna'}]`
    : reply.kind === 'evaluation' ? JSON.stringify(reply.evaluation, null, 2) : '[refusal]';
  const verdict = await grade(c, answer);
  if (verdict.pass) passed++;
  console.log(`${verdict.pass ? 'PASS' : 'FAIL'}  ${c.id}  (${params.model})`);
  rows.push(`## ${verdict.pass ? '✅' : '❌'} ${c.id} — ${c.mode} · ${params.model}\n\n**Pregunta:** ${c.question ?? '(evaluación de lectura)'}\n\n**Esperado:** ${c.expect}\n\n**Respuesta:**\n\n${answer}\n\n**Veredicto:** ${verdict.reason}\n`);
}

const header = `# Evaluación de Mysterium\n\nModelos: Lección ${teacherOverride ?? MODELS.teacher}; Socrático, Consultante y Evaluación ${MODELS.socratic}. Corrector: ${GRADER}.\n\nResultado: **${passed} de ${cases.length}**. Tokens: ${inTok} de entrada, ${outTok} de salida (sin contar al corrector).\n`;
const file = new URL(`../evals/report-${new Date().toISOString().replace(/[:.]/g, '-')}.md`, import.meta.url);
writeFileSync(file, `${header}\n${rows.join('\n')}`);
console.log(`\n${passed}/${cases.length} — report: ${file.pathname}`);
