'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Crown,
  Instagram,
  Menu,
  MessageCircle,
  Music2,
  Twitter,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { SignUser } from '@/shared/blocks/sign/sign-user';
import { useAppContext } from '@/shared/contexts/app';
import { trackEvent } from '@/shared/lib/analytics';

/** Set while the visitor waits in the simulated generation queue. */
export const QUEUE_QUERY = 'queued';
export const QUEUE_EVENT = 'udioai:queue';

/** Cross-page handoff: set before leaving the current page for the queue. */
const QUEUE_INTENT_KEY = 'udioai:queue-intent';

/**
 * Capture a `?queued=1` deep link before the router/hydration can rewrite the
 * address bar. Module scope runs before any effect, so this is the earliest
 * point that still sees the query string of the initial document.
 */
const initialQueueParam = (() => {
  if (typeof window === 'undefined') return null;
  try {
    return new URLSearchParams(window.location.search).get(QUEUE_QUERY);
  } catch {
    return null;
  }
})();

function readQueueIntent() {
  try {
    return window.sessionStorage.getItem(QUEUE_INTENT_KEY) === '1';
  } catch {
    return false;
  }
}

function writeQueueIntent(value: boolean) {
  try {
    if (value) {
      window.sessionStorage.setItem(QUEUE_INTENT_KEY, '1');
    } else {
      window.sessionStorage.removeItem(QUEUE_INTENT_KEY);
    }
  } catch {
    /* sessionStorage can be unavailable; the in-page queue still works */
  }
}

export function openQueue() {
  window.dispatchEvent(new Event(QUEUE_EVENT));
}

/**
 * Every primary call to action on udioai.lol.
 *
 * Signed out -> the Google-only sign-in dialog. Signed in -> the account's
 * subscription decides between the generation queue and `/pricing`. The
 * billing backend is untouched: this only reads what the subscription tables
 * already know.
 */
export function UdioAction({
  children,
  className = 'ua-btn ua-btn-dark',
  ctaId = 'ua_cta',
}: {
  children: React.ReactNode;
  className?: string;
  ctaId?: string;
}) {
  const router = useRouter();
  const { isCheckSign, setIsShowSignModal } = useAppContext();
  const [checking, setChecking] = useState(false);

  const act = async () => {
    if (checking || isCheckSign) return;

    setChecking(true);
    try {
      const response = await fetch('/api/user/get-subscription', {
        method: 'POST',
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result?.code !== 0) {
        // Signed out (or the check failed): ask for sign-in first.
        trackEvent('cta_click', { cta_id: ctaId, destination: 'sign_in' });
        setIsShowSignModal(true);
        return;
      }

      if (!result?.data?.subscribed) {
        trackEvent('cta_click', { cta_id: ctaId, destination: '/pricing' });
        router.push('/pricing');
        return;
      }

      trackEvent('cta_click', { cta_id: ctaId, destination: 'queue' });
      if (
        window.location.pathname === '/' ||
        /\/$/.test(window.location.pathname)
      ) {
        writeQueueIntent(false);
        openQueue();
        return;
      }
      // The router may rewrite the query string on the way home, so carry the
      // intent across the navigation explicitly as well.
      writeQueueIntent(true);
      router.push(`/?${QUEUE_QUERY}=1`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Please try again');
    } finally {
      setChecking(false);
    }
  };

  return (
    <button
      type="button"
      className={className}
      disabled={checking}
      onClick={act}
    >
      {checking ? 'Checking your plan…' : children}
    </button>
  );
}

export function UdioLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`ua-wordmark ${className}`} aria-label="Udio AI">
      <span className="ua-wordmark-core">udio</span>
      <span className="ua-wordmark-suffix">ai</span>
    </span>
  );
}

export function UdioHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="ua-header">
      <div className="ua-header-inner">
        <a className="ua-logo-link" href="/" aria-label="Udio AI home">
          <UdioLogo />
        </a>
        <nav className="ua-header-nav" aria-label="Primary">
          <span className="ua-trial">
            <Crown aria-hidden="true" />
            Start a Free Trial
          </span>
          <UdioAction className="ua-btn ua-btn-dark" ctaId="header_sign_in">
            Sign In
          </UdioAction>
          <UdioAction className="ua-btn ua-btn-pink" ctaId="header_sign_up">
            Sign Up
          </UdioAction>
        </nav>
        <button
          className="ua-menu"
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        {open && (
          <div className="ua-mobile-menu">
            <span className="ua-trial">
              <Crown aria-hidden="true" />
              Start a Free Trial
            </span>
            <UdioAction className="ua-btn ua-btn-dark" ctaId="menu_sign_in">
              Sign In
            </UdioAction>
            <UdioAction className="ua-btn ua-btn-pink" ctaId="menu_sign_up">
              Sign Up
            </UdioAction>
          </div>
        )}
        <div className="ua-session-bootstrap" aria-hidden="true">
          <SignUser
            googleOnly
            signModalClassName="ua-sign-dialog"
            userNav={{ items: [] }}
          />
        </div>
      </div>
    </header>
  );
}

const footerColumns = [
  ['About', 'Press', 'Blog'],
  ['Pricing', 'Help'],
] as const;

export function UdioFooter() {
  return (
    <footer className="ua-footer">
      <div className="ua-footer-inner">
        <div className="ua-footer-brand">
          <UdioLogo className="ua-wordmark-small" />
          <div className="ua-socials">
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
              <Twitter />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Instagram />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Discord"
            >
              <MessageCircle />
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
            >
              <Music2 />
            </a>
          </div>
        </div>
        <div className="ua-footer-nav">
          <div className="ua-footer-links">
            {footerColumns.map((column, index) => (
              <div key={index}>
                {column.map((label) => (
                  <a
                    key={label}
                    href={label === 'Pricing' ? '/pricing' : '#'}
                  >
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="ua-footer-legal">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms and Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const WAIT_STEPS = [
  'Analyzing your prompt and picking a key',
  'Composing melody, harmony and lyrics',
  'Synthesizing vocals and live instruments',
  'Mixing and mastering your track',
];

/**
 * The simulated generation queue. It never resolves on its own: the place in
 * line keeps moving, the bar keeps crawling, and the wait time keeps rolling.
 *
 * It is only reachable for a subscribed account: the CTA gate above opens it
 * directly, and a `?queued=1` deep link is re-verified against the same
 * subscription check before anything is shown.
 */
export function UdioQueueOverlay() {
  const router = useRouter();
  const { isCheckSign, setIsShowSignModal } = useAppContext();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(486_213);
  const [progress, setProgress] = useState(9);
  const [step, setStep] = useState(0);
  const [waited, setWaited] = useState(0);
  const openedAt = useRef<number | null>(null);
  const gateChecked = useRef(false);

  const show = useCallback(() => {
    openedAt.current = Date.now();
    setPosition(486_213);
    setProgress(9);
    setStep(0);
    setWaited(0);
    setOpen(true);
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get(QUEUE_QUERY) !== '1') {
        url.searchParams.set(QUEUE_QUERY, '1');
        window.history.replaceState(null, '', url.toString());
      }
    } catch {
      /* history is a nicety; the queue still runs */
    }
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete(QUEUE_QUERY);
      window.history.replaceState(null, '', url.toString());
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const listener = () => show();
    window.addEventListener(QUEUE_EVENT, listener);
    return () => window.removeEventListener(QUEUE_EVENT, listener);
  }, [show]);

  // A ?queued=1 deep link still has to pass the same gate as the CTAs:
  // signed out -> the Google sign-in dialog; signed in without a plan ->
  // /pricing; subscribed -> the queue that never resolves.
  const stripQueueParam = useCallback(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete(QUEUE_QUERY);
      window.history.replaceState(null, '', url.toString());
    } catch {
      /* ignore */
    }
  }, []);

  const verifyAccess = useCallback(async () => {
    try {
      const response = await fetch('/api/user/get-subscription', {
        method: 'POST',
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result?.code === 0) {
        if (result?.data?.subscribed) {
          writeQueueIntent(false);
          return true;
        }
        // Signed in without a plan: the queue stays off-limits.
        stripQueueParam();
        writeQueueIntent(false);
        router.replace('/pricing');
        return false;
      }
    } catch {
      /* fall through to the sign-in dialog */
    }
    // Signed out (or the plan check failed): ask for sign-in, never queue.
    stripQueueParam();
    writeQueueIntent(false);
    setIsShowSignModal(true);
    return false;
  }, [router, setIsShowSignModal, stripQueueParam]);

  useEffect(() => {
    if (isCheckSign || gateChecked.current) return;
    const deepLinked =
      initialQueueParam === '1' ||
      new URLSearchParams(window.location.search).get(QUEUE_QUERY) === '1';
    if (!deepLinked && !readQueueIntent()) {
      return;
    }
    gateChecked.current = true;
    (async () => {
      const allowed = await verifyAccess();
      if (allowed) {
        show();
      }
    })();
  }, [isCheckSign, verifyAccess, show]);

  useEffect(() => {
    if (!open) return;
    const tick = window.setInterval(() => {
      setPosition((current) => Math.max(3, current - Math.round(3 + Math.random() * 9)));
      setProgress((current) => (current >= 96 ? 9 : current + 1));
      setStep((current) => (current + 1) % WAIT_STEPS.length);
      setWaited(Math.round((Date.now() - (openedAt.current || Date.now())) / 1000));
    }, 1400);
    return () => window.clearInterval(tick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, hide]);

  if (!open) return null;

  const minutes = Math.floor(waited / 60);
  const seconds = String(waited % 60).padStart(2, '0');

  return (
    <div className="ua-queue-overlay" role="status" aria-live="polite">
      <div className="ua-queue-card">
        <div className="ua-queue-spinner" aria-hidden="true">
          <i />
        </div>
        <h2>You are in the queue</h2>
        <p>{WAIT_STEPS[step]}. Keep this page open — we will keep your place.</p>
        <div className="ua-queue-position">
          #{position.toLocaleString('en-US')}
        </div>
        <div className="ua-queue-bar" aria-hidden="true">
          <i style={{ width: `${progress}%` }} />
        </div>
        <div className="ua-queue-meta">
          <span>
            Estimated wait: {minutes}:{seconds} and counting
          </span>
          <span>Waiting…</span>
        </div>
        <button type="button" className="ua-queue-leave" onClick={hide}>
          Leave the queue
        </button>
      </div>
    </div>
  );
}
