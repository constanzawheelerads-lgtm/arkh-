// Client for the Mysterium Edge Function. The app never sees the Anthropic key:
// it signs in anonymously to Supabase and calls the function with that session.

import { getSupabase, isBackendConfigured, MYSTERIUM_ENABLED, SUPABASE_KEY, SUPABASE_URL } from './supabase';
import type { Lang } from '../content/types';

export type TutorMode = 'teacher' | 'socratic' | 'client' | 'evaluate';

export interface TutorCitation { docId: string; title: string; quote: string }
export interface TutorEvaluation {
  criteria: { id: string; score: 0 | 1 | 2; comment: string }[];
  strengths: string;
  suggestion: string;
  summary: string;
}

export type TutorResult =
  | { ok: true; kind: 'chat'; text: string; citations: TutorCitation[]; remaining: number }
  | { ok: true; kind: 'evaluation'; evaluation: TutorEvaluation; remaining: number }
  | { ok: false; reason: 'not-configured' | 'limit' | 'refusal' | 'network' | 'invalid' | 'server'; remaining?: number };

export interface TutorPayload {
  mode: TutorMode;
  lang: Lang;
  messages?: { role: 'user' | 'assistant'; content: string }[];
  context?: { cardIds?: string[]; lessonId?: string; caseId?: string };
  reading?: { kind: 'combination' | 'case'; text: string; question?: string };
}

export { IS_PREVIEW_BUILD } from './supabase';

export function isMysteriumConfigured(): boolean {
  return MYSTERIUM_ENABLED && isBackendConfigured();
}

async function accessToken(): Promise<string | null> {
  const supabase = await getSupabase();
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session.access_token;
  const { data: signed, error } = await supabase.auth.signInAnonymously();
  if (error || !signed.session) return null;
  return signed.session.access_token;
}

export async function askMysterium(payload: TutorPayload): Promise<TutorResult> {
  if (!isMysteriumConfigured()) return { ok: false, reason: 'not-configured' };
  try {
    const token = await accessToken();
    if (!token) return { ok: false, reason: 'network' };
    const res = await fetch(`${SUPABASE_URL}/functions/v1/mysterium`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, apikey: SUPABASE_KEY },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (res.status === 429) return { ok: false, reason: 'limit', remaining: 0 };
    if (res.status === 400) return { ok: false, reason: 'invalid' };
    if (!res.ok) return { ok: false, reason: 'server' };
    if (body.kind === 'refusal') return { ok: false, reason: 'refusal', remaining: body.remaining };
    if (body.kind === 'chat') return { ok: true, kind: 'chat', text: body.text, citations: body.citations ?? [], remaining: body.remaining };
    if (body.kind === 'evaluation') return { ok: true, kind: 'evaluation', evaluation: body.evaluation, remaining: body.remaining };
    return { ok: false, reason: 'server' };
  } catch {
    return { ok: false, reason: 'network' };
  }
}
