// Client for the Mysterium Edge Function. The app never sees the Anthropic key:
// it signs in anonymously to Supabase and calls the function with that session.

import type { SupabaseClient } from '@supabase/supabase-js';
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

const URL_ = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Builds for the sandboxed web preview cannot reach outside servers. */
export const IS_PREVIEW_BUILD = import.meta.env.VITE_PREVIEW === '1';

export function isMysteriumConfigured(): boolean {
  return Boolean(URL_ && ANON);
}

let clientPromise: Promise<SupabaseClient> | null = null;

async function getClient(): Promise<SupabaseClient> {
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) => createClient(URL_!, ANON!));
  }
  return clientPromise;
}

async function accessToken(): Promise<string | null> {
  const supabase = await getClient();
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
    const res = await fetch(`${URL_}/functions/v1/mysterium`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, apikey: ANON! },
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
