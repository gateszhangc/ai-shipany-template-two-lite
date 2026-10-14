/**
 * Browser-side Google Analytics (gtag) helpers.
 *
 * Every helper is a no-op when gtag is unavailable, so analytics can never
 * throw inside a click handler or block a user journey.
 */

type EventParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const pendingEvents: Array<[string, EventParams]> = [];
const PENDING_LIMIT = 50;
const FLUSH_INTERVAL_MS = 200;
const FLUSH_ATTEMPTS = 75; // ~15 seconds, then give up rather than leak memory
let flushTimer: number | undefined;
let flushAttempts = 0;

function canTrack(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

function flushPending(): void {
  if (!canTrack()) return;
  while (pendingEvents.length > 0) {
    const [name, params] = pendingEvents.shift()!;
    window.gtag!('event', name, params);
  }
}

function stopFlushing(): void {
  if (flushTimer === undefined) return;
  window.clearInterval(flushTimer);
  flushTimer = undefined;
}

function scheduleFlush(): void {
  if (flushTimer !== undefined) return;
  flushTimer = window.setInterval(() => {
    flushAttempts += 1;
    if (canTrack()) {
      stopFlushing();
      flushPending();
      return;
    }
    if (flushAttempts >= FLUSH_ATTEMPTS) {
      stopFlushing();
      pendingEvents.length = 0;
    }
  }, FLUSH_INTERVAL_MS);
}

/** Send a GA4 event; returns false only when there is nowhere to queue it. */
export function trackEvent(name: string, params: EventParams = {}): boolean {
  if (typeof window === 'undefined') return false;
  if (canTrack()) {
    window.gtag!('event', name, params);
    return true;
  }
  if (pendingEvents.length >= PENDING_LIMIT) return false;
  pendingEvents.push([name, params]);
  scheduleFlush();
  return true;
}

/** Send a page_view for the current URL, waiting briefly for the title. */
export function trackPageView(params: EventParams = {}): void {
  if (typeof window === 'undefined') return;

  const send = () => {
    trackEvent('page_view', {
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.search}`,
      page_title: document.title,
      ...params,
    });
  };

  if (document.title) {
    send();
    return;
  }

  let tries = 0;
  const timer = window.setInterval(() => {
    tries += 1;
    if (document.title || tries >= 30) {
      window.clearInterval(timer);
      send();
    }
  }, 10);
}
