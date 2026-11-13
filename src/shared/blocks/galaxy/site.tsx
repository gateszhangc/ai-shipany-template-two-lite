'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  CreditCard,
  Loader2,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { signOut } from '@/core/auth/client';
import { SignUser } from '@/shared/blocks/sign/sign-user';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useAppContext } from '@/shared/contexts/app';
import { trackEvent } from '@/shared/lib/analytics';

export const QUEUE_QUERY = 'queued';
export const QUEUE_EVENT = 'galaxy:queue';
const QUEUE_INTENT_KEY = 'galaxy:queue-intent';

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
    // The queue still works when sessionStorage is unavailable.
  }
}

function openQueue() {
  window.dispatchEvent(new Event(QUEUE_EVENT));
}

export function GalaxyMark({ size = 32 }: { size?: number }) {
  return (
    <Image
      src="/galaxy/logo-mark-128.png"
      alt=""
      width={size}
      height={size}
      priority
    />
  );
}

export function GalaxyLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`gx-brand ${className}`} aria-label="GalaxyAI Inc.">
      <GalaxyMark size={30} />
      <span className="gx-brand-name">GalaxyAI</span>
    </span>
  );
}

export function GalaxyAction({
  children,
  className = 'gx-button gx-button-primary',
  ctaId = 'galaxy_act',
}: {
  children: React.ReactNode;
  className?: string;
  ctaId?: string;
}) {
  const router = useRouter();
  const { user, isCheckSign, setIsShowSignModal } = useAppContext();
  const [checking, setChecking] = useState(false);

  const act = async () => {
    if (checking || isCheckSign) return;

    if (!user) {
      trackEvent('cta_click', { cta_id: ctaId, destination: 'sign_in' });
      setIsShowSignModal(true);
      return;
    }

    setChecking(true);
    try {
      const response = await fetch('/api/user/get-subscription', {
        method: 'POST',
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result?.code !== 0) {
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
      if (window.location.pathname === '/') {
        writeQueueIntent(false);
        openQueue();
        return;
      }

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
      disabled={checking || isCheckSign}
      onClick={() => void act()}
    >
      {checking ? (
        <>
          <Loader2 aria-hidden="true" className="gx-spin" />
          Checking plan
        </>
      ) : (
        children
      )}
    </button>
  );
}

function AccountControl() {
  const router = useRouter();
  const { user, isCheckSign, setIsShowSignModal, setUser } = useAppContext();

  if (isCheckSign) {
    return (
      <span className="gx-account-loading" aria-label="Checking account">
        <Loader2 className="gx-spin" />
      </span>
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        className="gx-nav-signin"
        onClick={() => setIsShowSignModal(true)}
      >
        Sign in
      </button>
    );
  }

  const initial = (user.name || user.email || 'G').charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="gx-account-trigger">
          {user.image ? (
            <Image
              src={user.image}
              alt=""
              width={26}
              height={26}
              className="gx-avatar-image"
            />
          ) : (
            <span className="gx-avatar-fallback">{initial}</span>
          )}
          <span className="gx-account-name">
            {(user.name || user.email || 'Account').split(' ')[0]}
          </span>
          <ChevronDown aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="gx-dropdown">
        <div className="gx-dropdown-meta">
          <strong>{user.name || 'GalaxyAI account'}</strong>
          <span>{user.email}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings/billing">
            <CreditCard />
            Billing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            signOut({
              fetchOptions: {
                onSuccess: () => {
                  setUser(null);
                  router.refresh();
                },
              },
            })
          }
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const primaryNav = [
  ['Our products', '/#products'],
  ['Pricing', '/pricing'],
  ['Careers', 'https://go.galaxy.ai/jobs'],
] as const;

export function GalaxyHeader() {
  const [open, setOpen] = useState(false);
  const { setIsShowSignModal } = useAppContext();

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('signin') !== '1') return;
      setIsShowSignModal(true);
      url.searchParams.delete('signin');
      window.history.replaceState(null, '', url.toString());
    } catch {
      // The header still works without query-string handling.
    }
  }, [setIsShowSignModal]);

  return (
    <header className="gx-header">
      <div className="gx-header-inner">
        <Link href="/" className="gx-logo-link" aria-label="GalaxyAI home">
          <GalaxyLogo />
        </Link>

        <nav className="gx-nav" aria-label="Primary">
          {primaryNav.map(([label, href]) =>
            href.startsWith('http') ? (
              <a key={label} href={href} target="_blank" rel="noreferrer">
                {label}
              </a>
            ) : (
              <Link key={label} href={href}>
                {label}
              </Link>
            )
          )}
        </nav>

        <div className="gx-header-actions">
          <AccountControl />
          <GalaxyAction
            className="gx-button gx-button-primary gx-header-act"
            ctaId="header_act"
          >
            Act
          </GalaxyAction>
        </div>

        <button
          className="gx-menu-button"
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="gx-mobile-menu">
          {primaryNav.map(([label, href]) =>
            href.startsWith('http') ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ) : (
              <Link key={label} href={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            )
          )}
          <div className="gx-mobile-menu-actions">
            <AccountControl />
            <GalaxyAction
              className="gx-button gx-button-primary"
              ctaId="mobile_act"
            >
              Act
            </GalaxyAction>
          </div>
        </div>
      )}

      <div className="gx-session-bootstrap" aria-hidden="true">
        <SignUser
          googleOnly
          signModalClassName="gx-sign-dialog"
          userNav={{ items: [] }}
        />
      </div>
    </header>
  );
}

const footerGroups = [
  {
    title: 'Company',
    links: [
      ['Our products', '/#products'],
      ['Pricing', '/pricing'],
      ['Careers', 'https://go.galaxy.ai/jobs'],
      ['LinkedIn', 'https://go.galaxy.ai/linkedin'],
    ],
  },
  {
    title: 'Membership',
    links: [
      ['Plans', '/pricing'],
      ['Billing', '/settings/billing'],
      ['Act', '/#products'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Privacy Policy', '/privacy-policy'],
      ['Terms of Service', '/terms-of-service'],
    ],
  },
] as const;

export function GalaxyFooter() {
  return (
    <footer className="gx-footer">
      <div className="gx-footer-grid">
        <div className="gx-footer-brand">
          <GalaxyLogo />
          <p>
            We build, acquire and scale iconic AI products to put the power of
            AI in everyone&apos;s hands.
          </p>
          <address>8 The Green STE A, Dover, DE 19901, USA</address>
        </div>

        {footerGroups.map((group) => (
          <div className="gx-footer-column" key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map(([label, href]) =>
              href.startsWith('http') ? (
                <a key={label} href={href} target="_blank" rel="noreferrer">
                  {label}
                </a>
              ) : (
                <Link key={label} href={href}>
                  {label}
                </Link>
              )
            )}
          </div>
        ))}
      </div>

      <div className="gx-footer-base">
        <span>© 2026 GalaxyAI Inc.</span>
        <span className="gx-footer-status">
          <i />
          English only
        </span>
        <span>galaxyai.homes</span>
      </div>
    </footer>
  );
}

const waitSteps = [
  'Calibrating your orbit',
  'Reserving a seat in the Galaxy Studio',
  'Checking product access across our portfolio',
  'Preparing your workspace',
  'Holding your place in line',
];

export function GalaxyQueueOverlay() {
  const router = useRouter();
  const { isCheckSign, setIsShowSignModal } = useAppContext();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(486_213);
  const [progress, setProgress] = useState(27);
  const [step, setStep] = useState(0);
  const [waited, setWaited] = useState(0);
  const openedAt = useRef<number | null>(null);
  const gateChecked = useRef(false);

  const show = useCallback(() => {
    openedAt.current = Date.now();
    setPosition(486_213);
    setProgress(27);
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
      // The queue still runs if history is unavailable.
    }
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete(QUEUE_QUERY);
      window.history.replaceState(null, '', url.toString());
    } catch {
      // Ignore history failures.
    }
  }, []);

  useEffect(() => {
    const listener = () => show();
    window.addEventListener(QUEUE_EVENT, listener);
    return () => window.removeEventListener(QUEUE_EVENT, listener);
  }, [show]);

  const stripQueueParam = useCallback(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete(QUEUE_QUERY);
      window.history.replaceState(null, '', url.toString());
    } catch {
      // Ignore history failures.
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

        stripQueueParam();
        writeQueueIntent(false);
        router.replace('/pricing');
        return false;
      }
    } catch {
      // Fall through to sign-in.
    }

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
    if (!deepLinked && !readQueueIntent()) return;

    gateChecked.current = true;
    void (async () => {
      const allowed = await verifyAccess();
      if (allowed) show();
    })();
  }, [isCheckSign, verifyAccess, show]);

  useEffect(() => {
    if (!open) return;
    const tick = window.setInterval(() => {
      setPosition((current) =>
        Math.max(3, current - Math.round(3 + Math.random() * 10))
      );
      setProgress((current) => (current >= 96 ? 27 : current + 1));
      setStep((current) => (current + 1) % waitSteps.length);
      setWaited(
        Math.round((Date.now() - (openedAt.current || Date.now())) / 1000)
      );
    }, 1450);
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
    <div className="gx-queue-overlay" role="status" aria-live="polite">
      <div className="gx-queue-card">
        <div className="gx-queue-orbit" aria-hidden="true">
          <span className="gx-queue-ring gx-queue-ring-a" />
          <span className="gx-queue-ring gx-queue-ring-b" />
          <span className="gx-queue-ring gx-queue-ring-c" />
          <i />
        </div>
        <p className="gx-queue-kicker">Galaxy Studio access</p>
        <h2>Your place is being held</h2>
        <p className="gx-queue-step">{waitSteps[step]}…</p>
        <div className="gx-queue-position">
          #{position.toLocaleString('en-US')}
        </div>
        <div className="gx-queue-bar" aria-hidden="true">
          <i style={{ width: `${progress}%` }} />
        </div>
        <div className="gx-queue-meta">
          <span>
            Elapsed {minutes}:{seconds}
          </span>
          <span>Holding your place</span>
        </div>
        <p className="gx-queue-note">
          Keep this tab open. This demo queue never resolves on its own.
        </p>
        <button type="button" className="gx-queue-leave" onClick={hide}>
          Leave queue
        </button>
      </div>
    </div>
  );
}
