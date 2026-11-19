// Shared, lazily loaded Supabase client. Only the public project URL and
// publishable key live in the app; secrets stay on the server.

import type { SupabaseClient } from '@supabase/supabase-js';

const URL_ = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const SUPABASE_URL = URL_ ?? '';
export const SUPABASE_KEY = KEY ?? '';

/** Builds for the sandboxed web preview cannot reach outside servers. */
export const IS_PREVIEW_BUILD = import.meta.env.VITE_PREVIEW === '1';

/** Mysterium (AI tutor) stays off until there is a budget for it (premium plan). */
export const MYSTERIUM_ENABLED = import.meta.env.VITE_MYSTERIUM_ENABLED === '1';

export function isBackendConfigured(): boolean {
  return Boolean(URL_ && KEY) && !IS_PREVIEW_BUILD;
}

let clientPromise: Promise<SupabaseClient> | null = null;

export function getSupabase(): Promise<SupabaseClient> {
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(URL_!, KEY!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } }),
    );
  }
  return clientPromise;
}
