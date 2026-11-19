// Supabase Edge Function: the only place that holds the Anthropic API key.
// Deploy: supabase functions deploy mysterium
// Secret:  supabase secrets set ANTHROPIC_API_KEY=...   (never in the app)

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { buildParams, DAILY_LIMIT, parseReply, selectDocs, validateRequest, ValidationError, type Corpus } from './tutor.ts';

const CORS = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

// Arkhé's sources, pinned to a commit of the public repository so they cannot
// change without a new deploy. Override with the CORPUS_URL secret if needed.
const CORPUS_URL = Deno.env.get('CORPUS_URL') ??
  'https://raw.githubusercontent.com/constanzawheelerads-lgtm/arkh-/f86167b6356477c2675d02022765570cd0cbc602/supabase/functions/mysterium/corpus.json';
let corpusPromise: Promise<Corpus> | null = null;
function loadCorpus(): Promise<Corpus> {
  corpusPromise ??= fetch(CORPUS_URL)
    .then((r) => {
      if (!r.ok) throw new Error(`corpus ${r.status}`);
      return r.json() as Promise<Corpus>;
    })
    .then((c) => {
      if (!Array.isArray(c.docs) || c.docs.length === 0) throw new Error('corpus empty');
      return c;
    })
    .catch((e) => {
      corpusPromise = null; // retry on the next request
      throw e;
    });
  return corpusPromise;
}

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });
const limit = Number(Deno.env.get('TUTOR_DAILY_LIMIT') ?? DAILY_LIMIT);
// Service-role client: only this function may change the daily counter.
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json(405, { error: 'method' });

  // 1. Who is asking: a Supabase user (anonymous sign-in is enough).
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData.user) return json(401, { error: 'auth' });
  const userId = userData.user.id;

  // 2. Validate before spending anything.
  let tutorReq;
  try {
    tutorReq = validateRequest(await req.json());
  } catch (e) {
    return json(400, { error: e instanceof ValidationError ? `invalid:${e.message}` : 'invalid' });
  }

  let corpus: Corpus;
  try {
    corpus = await loadCorpus();
  } catch (e) {
    console.error('mysterium corpus', e);
    return json(503, { error: 'corpus' });
  }

  // 3. Daily limit, counted atomically in the database.
  const { data: usage, error: usageError } = await admin.rpc('tutor_consume', { p_user: userId, p_limit: limit });
  if (usageError) return json(500, { error: 'usage' });
  const { allowed, used } = usage as { allowed: boolean; used: number };
  if (!allowed) return json(429, { error: 'limit', remaining: 0, limit });

  // 4. Ask Claude with Arkhé's own sources.
  const docs = selectDocs(corpus, tutorReq);
  try {
    const message = await anthropic.beta.messages.create(buildParams(tutorReq, docs));
    const reply = parseReply(message, tutorReq, docs);
    return json(200, { ...reply, remaining: Math.max(0, limit - used), limit });
  } catch (e) {
    // Give the message back if the call failed on our side.
    await admin.rpc('tutor_refund', { p_user: userId });
    console.error('mysterium error', e instanceof Anthropic.APIError ? `${e.status} ${e.message}` : e);
    const status = e instanceof Anthropic.RateLimitError ? 503 : 502;
    return json(status, { error: 'upstream' });
  }
});
