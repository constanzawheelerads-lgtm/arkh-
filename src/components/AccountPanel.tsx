import { useState, type FormEvent } from 'react';
import type { AccountError } from '../lib/account';
import { IS_PREVIEW_BUILD } from '../lib/supabase';
import { useI18n } from '../i18n/I18n';
import type { UiKey } from '../i18n/ui';
import { useAccount } from '../progress/Account';

const ERROR_KEY: Record<AccountError, UiKey> = {
  'not-configured': 'account.errNotConfigured',
  'invalid-email': 'account.errEmail',
  'not-authorized': 'account.errNotAuthorized',
  'rate-limit': 'account.errRateLimit',
  'wrong-code': 'account.errCode',
  network: 'account.errNetwork',
  unknown: 'account.errUnknown',
};

const inputStyle = { minHeight: 48, borderRadius: 12, border: '1px solid var(--line-strong)', background: 'var(--surface)', padding: '0 14px', fontSize: 16, width: '100%' } as const;

export function AccountPanel() {
  const { t, lang } = useI18n();
  const acc = useAccount();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<UiKey | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!acc.available) {
    return (
      <section className="card" aria-label={t('account.title')}>
        <span className="eyebrow">{t('account.title')}</span>
        <p className="p" style={{ fontSize: 14 }}>{t(IS_PREVIEW_BUILD ? 'account.previewOnly' : 'account.errNotConfigured')}</p>
      </section>
    );
  }

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  const onSend = (e: FormEvent) => {
    e.preventDefault();
    void run(async () => {
      const r = await acc.sendCode(email);
      if (r.ok) setStep('code');
      else setError(ERROR_KEY[r.error]);
    });
  };

  const onVerify = (e: FormEvent) => {
    e.preventDefault();
    void run(async () => {
      const r = await acc.verifyCode(email, code);
      if (r.ok) {
        setStep('email');
        setCode('');
      } else setError(ERROR_KEY[r.error]);
    });
  };

  if (acc.account) {
    const when = acc.lastSync ? new Date(acc.lastSync).toLocaleString(lang === 'es' ? 'es' : 'en', { dateStyle: 'short', timeStyle: 'short' }) : null;
    const statusText: Record<typeof acc.status, string> = {
      off: '',
      syncing: t('account.syncing'),
      synced: when ? t('account.syncedAt', { when }) : t('account.synced'),
      offline: t('account.offline'),
      error: t('account.syncError'),
    };
    return (
      <section className="card" aria-label={t('account.title')}>
        <span className="eyebrow">{t('account.title')}</span>
        <strong style={{ wordBreak: 'break-all' }}>{acc.account.email}</strong>
        <span role="status" className="small" style={{ color: acc.status === 'error' ? 'var(--rose)' : 'var(--teal)', fontWeight: 700 }}>{statusText[acc.status]}</span>
        <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
          <button type="button" className="chip" disabled={acc.status === 'syncing'} onClick={() => void acc.syncNow()}>{t('account.syncNow')}</button>
          <button type="button" className="chip" onClick={() => void acc.signOut()}>{t('account.signOut')}</button>
        </div>
        {confirmDelete ? (
          <div className="stack" role="alertdialog" aria-label={t('account.delete')} style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
            <p className="p" style={{ fontSize: 14 }}>{t('account.deleteConfirm')}</p>
            <div className="row" style={{ gap: 8 }}>
              <button
                type="button"
                className="btn"
                style={{ background: 'var(--rose)', borderColor: 'var(--rose)' }}
                disabled={busy}
                onClick={() => void run(async () => {
                  const r = await acc.deleteAccount();
                  if (!r.ok) setError(ERROR_KEY[r.error]);
                  setConfirmDelete(false);
                })}
              >
                {t('account.delete')}
              </button>
              <button type="button" className="btn ghost" onClick={() => setConfirmDelete(false)}>{t('common.cancel')}</button>
            </div>
          </div>
        ) : (
          <button type="button" className="small" style={{ alignSelf: 'flex-start', background: 'none', border: 0, padding: '8px 0', color: 'var(--rose)', textDecoration: 'underline' }} onClick={() => setConfirmDelete(true)}>
            {t('account.delete')}
          </button>
        )}
        {error && <p role="alert" className="feedback bad">{t(error)}</p>}
      </section>
    );
  }

  return (
    <section className="card" aria-label={t('account.title')}>
      <span className="eyebrow">{t('account.title')}</span>
      <p className="p" style={{ fontSize: 14 }}>{t('account.pitch')}</p>
      {step === 'email' ? (
        <form onSubmit={onSend} className="stack" style={{ gap: 8 }}>
          <label htmlFor="account-email" className="small" style={{ fontWeight: 700 }}>{t('account.email')}</label>
          <input id="account-email" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          <button type="submit" className="btn" disabled={busy || !email.trim()}>{busy ? t('account.sending') : t('account.sendCode')}</button>
        </form>
      ) : (
        <form onSubmit={onVerify} className="stack" style={{ gap: 8 }}>
          <p className="p" style={{ fontSize: 14 }}>{t('account.codeSent', { email })}</p>
          <label htmlFor="account-code" className="small" style={{ fontWeight: 700 }}>{t('account.code')}</label>
          <input id="account-code" type="text" autoComplete="one-time-code" inputMode="numeric" maxLength={10} required value={code} onChange={(e) => setCode(e.target.value)} style={{ ...inputStyle, letterSpacing: '0.3em', fontVariantNumeric: 'tabular-nums' }} />
          <button type="submit" className="btn" disabled={busy || code.replace(/\D/g, '').length < 6}>{busy ? t('account.verifying') : t('account.verify')}</button>
          <button type="button" className="chip" style={{ alignSelf: 'flex-start' }} onClick={() => { setStep('email'); setCode(''); setError(null); }}>{t('account.otherEmail')}</button>
        </form>
      )}
      {error && <p role="alert" className="feedback bad">{t(error)}</p>}
      <p className="small muted" style={{ margin: 0 }}>{t('account.privacy')}</p>
    </section>
  );
}
