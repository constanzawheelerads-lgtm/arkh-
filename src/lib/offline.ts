import { CARDS, cardImage } from '../content/cards';
import { IS_PREVIEW_BUILD } from './supabase';

export const CARDS_CACHE = 'arkhe-cards-v1';

/** True inside the Android/iOS app built with Capacitor (assets ship with the app). */
export function isNativeApp(): boolean {
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return Boolean(cap?.isNativePlatform?.());
}

export function offlineSupported(): boolean {
  return !IS_PREVIEW_BUILD && !isNativeApp() && typeof caches !== 'undefined' && 'serviceWorker' in navigator;
}

export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !offlineSupported()) return;
  const secure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!secure) return;
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
    // Without a service worker the app still works online.
  });
}

export function allCardImageUrls(): string[] {
  return CARDS.flatMap((c) => [cardImage(c.id), cardImage(c.id, true)]).map((u) => new URL(u, location.href).href);
}

export async function countCachedCards(): Promise<number> {
  try {
    const cache = await caches.open(CARDS_CACHE);
    const keys = new Set((await cache.keys()).map((r) => r.url));
    return allCardImageUrls().filter((u) => keys.has(u)).length;
  } catch {
    return 0;
  }
}

/** Downloads every card image into the offline cache, reporting progress. */
export async function downloadCards(onProgress: (done: number, total: number) => void): Promise<boolean> {
  const urls = allCardImageUrls();
  const cache = await caches.open(CARDS_CACHE);
  const existing = new Set((await cache.keys()).map((r) => r.url));
  let done = urls.filter((u) => existing.has(u)).length;
  onProgress(done, urls.length);
  const pending = urls.filter((u) => !existing.has(u));
  let failed = 0;
  // A few at a time keeps the phone responsive.
  for (let i = 0; i < pending.length; i += 6) {
    await Promise.all(pending.slice(i, i + 6).map(async (u) => {
      try {
        await cache.add(u);
        done++;
      } catch {
        failed++;
      }
      onProgress(done, urls.length);
    }));
  }
  return failed === 0;
}
