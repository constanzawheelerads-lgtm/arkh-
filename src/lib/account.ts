// Optional accounts: passwordless sign-in with a 6-digit code sent by email,
// and cloud copy of the study progress (table user_progress, owner-only).

import { getSupabase, isBackendConfigured } from './supabase';

export type AccountError = 'not-configured' | 'invalid-email' | 'not-authorized' | 'rate-limit' | 'wrong-code' | 'network' | 'unknown';
export type Result<T = void> = { ok: true; value: T } | { ok: false; error: AccountError };

export interface Account {
  id: string;
  email: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapError(e: { code?: string; status?: number; message?: string } | null | undefined): AccountError {
  if (!e) return 'unknown';
  const code = e.code ?? '';
  if (code === 'email_address_not_authorized') return 'not-authorized';
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit' || e.status === 429) return 'rate-limit';
  if (code === 'otp_expired' || code === 'invalid_credentials' || code === 'otp_disabled' || e.status === 403) return 'wrong-code';
  if (code === 'validation_failed' || code === 'email_address_invalid') return 'invalid-email';
  if (e.message && /fetch|network/i.test(e.message)) return 'network';
  return 'unknown';
}

export async function currentAccount(): Promise<Account | null> {
  if (!isBackendConfigured()) return null;
  try {
    const supabase = await getSupabase();
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user || user.is_anonymous || !user.email) return null;
    return { id: user.id, email: user.email };
  } catch {
    return null;
  }
}

export async function sendCode(email: string): Promise<Result> {
  if (!isBackendConfigured()) return { ok: false, error: 'not-configured' };
  const clean = email.trim().toLowerCase();
  if (!EMAIL.test(clean)) return { ok: false, error: 'invalid-email' };
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signInWithOtp({ email: clean, options: { shouldCreateUser: true } });
    return error ? { ok: false, error: mapError(error) } : { ok: true, value: undefined };
  } catch {
    return { ok: false, error: 'network' };
  }
}

export async function verifyCode(email: string, code: string): Promise<Result<Account>> {
  if (!isBackendConfigured()) return { ok: false, error: 'not-configured' };
  const token = code.replace(/\D/g, '');
  if (token.length < 6) return { ok: false, error: 'wrong-code' };
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token, type: 'email' });
    if (error || !data.user?.email) return { ok: false, error: mapError(error) };
    return { ok: true, value: { id: data.user.id, email: data.user.email } };
  } catch {
    return { ok: false, error: 'network' };
  }
}

export async function signOut(): Promise<void> {
  try {
    const supabase = await getSupabase();
    await supabase.auth.signOut({ scope: 'local' });
  } catch {
    // Local session is gone either way.
  }
}

export async function deleteAccount(): Promise<Result> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.rpc('delete_my_account');
    if (error) return { ok: false, error: mapError(error) };
    await supabase.auth.signOut({ scope: 'local' });
    return { ok: true, value: undefined };
  } catch {
    return { ok: false, error: 'network' };
  }
}

export async function pullProgress(account: Account): Promise<Result<unknown | null>> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.from('user_progress').select('data').eq('user_id', account.id).maybeSingle();
    if (error) return { ok: false, error: mapError(error) };
    return { ok: true, value: data?.data ?? null };
  } catch {
    return { ok: false, error: 'network' };
  }
}

export async function pushProgress(account: Account, progress: unknown): Promise<Result> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase
      .from('user_progress')
      .upsert({ user_id: account.id, data: progress, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    return error ? { ok: false, error: mapError(error) } : { ok: true, value: undefined };
  } catch {
    return { ok: false, error: 'network' };
  }
}
