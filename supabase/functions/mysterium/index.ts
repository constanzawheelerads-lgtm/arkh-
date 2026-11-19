// Supabase Edge Function: the only place that holds the Anthropic API key.
// Deploy: supabase functions deploy mysterium
// Secret:  supabase secrets set ANTHROPIC_API_KEY=...   (never in the app)

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import corpus from './corpus.json' with { type: 'json' };
import { buildParams, DAILY_LIMIT, parseReply, selectDocs, validateRequest, ValidationError, type Corpus } from './tutor.ts';

const CORS = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });
const limit = Number(Deno.env.get('TUTOR_DAILY_LIMIT') ?? DAILY_LIMIT);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json(405, { error: 'method' });

  // 1. Who is asking: a Supabase user (anonymous sign-in is enough).
  const authHeader = req.headers.get('Authorization') ?? '';
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return json(401, { error: 'auth' });

  // 2. Validate before spending anything.
  let tutorReq;
  try {
    tutorReq = validateRequest(await req.json());
  } catch (e) {
    return json(400, { error: e instanceof ValidationError ? `invalid:${e.message}` : 'invalid' });
  }

  // 3. Daily limit, counted atomically in the database.
  const { data: usage, error: usageError } = await supabase.rpc('tutor_consume', { p_limit: limit });
  if (usageError) return json(500, { error: 'usage' });
  const { allowed, used } = usage as { allowed: boolean; used: number };
  if (!allowed) return json(429, { error: 'limit', remaining: 0, limit });

  // 4. Ask Claude with Arkhé's own sources.
  const docs = selectDocs(corpus as Corpus, tutorReq);
  try {
    const message = await anthropic.beta.messages.create(buildParams(tutorReq, docs));
    const reply = parseReply(message, tutorReq, docs);
    return json(200, { ...reply, remaining: Math.max(0, limit - used), limit });
  } catch (e) {
    // Give the message back if the call failed on our side.
    await supabase.rpc('tutor_refund');
    console.error('mysterium error', e instanceof Anthropic.APIError ? `${e.status} ${e.message}` : e);
    const status = e instanceof Anthropic.RateLimitError ? 503 : 502;
    return json(status, { error: 'upstream' });
  }
});
