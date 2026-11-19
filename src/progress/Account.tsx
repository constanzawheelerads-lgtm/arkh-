import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import * as api from '../lib/account';
import { isBackendConfigured } from '../lib/supabase';
import { readJSON, writeJSON } from '../lib/storage';
import { mergeProgress, sameProgress } from './merge';
import { useProgress } from './Progress';

export type SyncStatus = 'off' | 'syncing' | 'synced' | 'offline' | 'error';

interface AccountValue {
  available: boolean;
  account: api.Account | null;
  status: SyncStatus;
  lastSync: string | null;
  sendCode: (email: string) => Promise<api.Result>;
  verifyCode: (email: string, code: string) => Promise<api.Result<api.Account>>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<api.Result>;
  syncNow: () => Promise<void>;
}

const AccountContext = createContext<AccountValue | null>(null);
const LAST_SYNC_KEY = 'arkhe.lastSync';
const PUSH_DELAY_MS = 2500;

export function AccountProvider({ children }: { children: ReactNode }) {
  const { progress, replace } = useProgress();
  const available = isBackendConfigured();
  const [account, setAccount] = useState<api.Account | null>(null);
  const [status, setStatus] = useState<SyncStatus>('off');
  const [lastSync, setLastSync] = useState<string | null>(() => readJSON(LAST_SYNC_KEY, null));
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const skipNextPush = useRef(false);

  const markSynced = useCallback(() => {
    const at = new Date().toISOString();
    setLastSync(at);
    writeJSON(LAST_SYNC_KEY, at);
    setStatus('synced');
  }, []);

  /** Pull the cloud copy, merge it with this device and push the result. */
  const fullSync = useCallback(async (acc: api.Account) => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setStatus('offline');
      return;
    }
    setStatus('syncing');
    const pulled = await api.pullProgress(acc);
    if (!pulled.ok) {
      setStatus(pulled.error === 'network' ? 'offline' : 'error');
      return;
    }
    const merged = mergeProgress(progressRef.current, pulled.value);
    if (!sameProgress(merged, progressRef.current)) {
      skipNextPush.current = true;
      replace(merged);
    }
    const pushed = await api.pushProgress(acc, merged);
    if (pushed.ok) markSynced();
    else setStatus(pushed.error === 'network' ? 'offline' : 'error');
  }, [replace, markSynced]);

  // Restore the session on start.
  useEffect(() => {
    if (!available) return;
    let cancelled = false;
    api.currentAccount().then((acc) => {
      if (cancelled || !acc) return;
      setAccount(acc);
      void fullSync(acc);
    });
    return () => {
      cancelled = true;
    };
  }, [available, fullSync]);

  // Push local changes a moment after they happen.
  useEffect(() => {
    if (!account) return;
    if (skipNextPush.current) {
      skipNextPush.current = false;
      return;
    }
    const id = window.setTimeout(async () => {
      if (navigator.onLine === false) {
        setStatus('offline');
        return;
      }
      setStatus('syncing');
      const r = await api.pushProgress(account, progressRef.current);
      if (r.ok) markSynced();
      else setStatus(r.error === 'network' ? 'offline' : 'error');
    }, PUSH_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [progress, account, markSynced]);

  // Catch up when the connection comes back.
  useEffect(() => {
    if (!account) return;
    const onOnline = () => {
      void fullSync(account);
    };
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [account, fullSync]);

  const verifyCode = useCallback(async (email: string, code: string) => {
    const r = await api.verifyCode(email, code);
    if (r.ok) {
      setAccount(r.value);
      await fullSync(r.value);
    }
    return r;
  }, [fullSync]);

  const signOut = useCallback(async () => {
    await api.signOut();
    setAccount(null);
    setStatus('off');
  }, []);

  const deleteAccount = useCallback(async () => {
    const r = await api.deleteAccount();
    if (r.ok) {
      setAccount(null);
      setStatus('off');
      setLastSync(null);
      writeJSON(LAST_SYNC_KEY, null);
    }
    return r;
  }, []);

  const syncNow = useCallback(async () => {
    if (account) await fullSync(account);
  }, [account, fullSync]);

  return (
    <AccountContext.Provider value={{ available, account, status, lastSync, sendCode: api.sendCode, verifyCode, signOut, deleteAccount, syncNow }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount(): AccountValue {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used inside AccountProvider');
  return ctx;
}
