import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { L10n, Lang } from '../content/types';
import { readJSON, writeJSON } from '../lib/storage';
import { en, es, type UiKey } from './ui';

const DICTS: Record<Lang, Record<UiKey, string>> = { es, en };
const LANG_KEY = 'arkhe.lang';

export function format(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

export function detectLang(): Lang {
  const saved = readJSON<Lang | null>(LANG_KEY, null);
  if (saved === 'es' || saved === 'en') return saved;
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'es';
  return nav.toLowerCase().startsWith('es') ? 'es' : 'en';
}

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Interface string. */
  t: (key: UiKey, vars?: Record<string, string | number>) => string;
  /** Localized content. */
  l: (text: L10n) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    writeJSON(LANG_KEY, l);
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      t: (key, vars) => format(DICTS[lang][key], vars),
      l: (text) => text[lang],
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
