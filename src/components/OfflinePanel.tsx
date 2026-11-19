import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18n';
import { allCardImageUrls, countCachedCards, downloadCards, isNativeApp, offlineSupported } from '../lib/offline';

export function OfflinePanel() {
  const { t } = useI18n();
  const total = allCardImageUrls().length;
  const [cached, setCached] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const supported = offlineSupported();

  useEffect(() => {
    if (supported) countCachedCards().then(setCached);
  }, [supported]);

  if (isNativeApp()) {
    return (
      <section className="card"><span className="eyebrow">{t('offline.title')}</span><p className="p" style={{ fontSize: 14 }}>{t('offline.native')}</p></section>
    );
  }
  if (!supported) return null;

  const complete = cached !== null && cached >= total;
  const start = async () => {
    setBusy(true);
    setFailed(false);
    const ok = await downloadCards((done) => setCached(done));
    setFailed(!ok);
    setBusy(false);
  };

  return (
    <section className="card" aria-label={t('offline.title')}>
      <span className="eyebrow">{t('offline.title')}</span>
      <p className="p" style={{ fontSize: 14 }}>{complete ? t('offline.ready') : t('offline.text')}</p>
      {cached !== null && (
        <>
          <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={cached}>
            <span style={{ width: `${(cached / total) * 100}%`, background: complete ? 'var(--teal)' : undefined }} />
          </div>
          <span className="small muted">{t('offline.count', { n: Math.round(cached / 2), m: total / 2 })}</span>
        </>
      )}
      {!complete && (
        <button type="button" className="btn ghost" disabled={busy || !navigator.onLine} onClick={() => void start()}>
          {busy ? t('offline.downloading') : t('offline.download')}
        </button>
      )}
      {failed && <p role="alert" className="feedback bad">{t('offline.failed')}</p>}
    </section>
  );
}
