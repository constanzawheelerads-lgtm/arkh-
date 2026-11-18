import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { LESSONS } from '../content/lessons';
import { useI18n } from '../i18n/I18n';
import { dayKey } from '../lib/random';
import { readJSON, removeKey, writeJSON } from '../lib/storage';
import { applyEvent, BADGES, initialProgress, migrate, type ProgressEvent, type ProgressState } from './model';

const KEY = 'arkhe.progress';

interface ProgressValue {
  progress: ProgressState;
  record: (e: ProgressEvent) => number;
  reset: () => void;
  toast: string | null;
}

const ProgressContext = createContext<ProgressValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { t, l } = useI18n();
  const [progress, setProgress] = useState<ProgressState>(() => migrate(readJSON(KEY, null)));
  const [toast, setToast] = useState<string | null>(null);
  const ref = useRef(progress);
  ref.current = progress;

  useEffect(() => {
    writeJSON(KEY, progress);
  }, [progress]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const record = useCallback(
    (e: ProgressEvent) => {
      const res = applyEvent(ref.current, e, dayKey(), LESSONS.length);
      ref.current = res.state;
      setProgress(res.state);
      if (res.newBadges.length) {
        const badge = BADGES.find((b) => b.id === res.newBadges[0]);
        if (badge) setToast(t('toast.badge', { name: l(badge.name) }));
      } else if (res.levelUp) {
        setToast(t('toast.level', { n: res.levelUp }));
      }
      return res.xpGained;
    },
    [t, l],
  );

  const reset = useCallback(() => {
    removeKey(KEY);
    ref.current = initialProgress;
    setProgress(initialProgress);
  }, []);

  return <ProgressContext.Provider value={{ progress, record, reset, toast }}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
