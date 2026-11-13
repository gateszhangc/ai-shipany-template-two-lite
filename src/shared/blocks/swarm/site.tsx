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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { SignUser } from '@/shared/blocks/sign/sign-user';
import { useAppContext } from '@/shared/contexts/app';
import { trackEvent } from '@/shared/lib/analytics';

export const QUEUE_QUERY = 'queued';
export const QUEUE_EVENT = 'swarm:queue';
const QUEUE_INTENT_KEY = 'swarm:queue-intent';

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

export function openQueue() {
  window.dispatchEvent(new Event(QUEUE_EVENT));
}

/**
 * Primary product CTA.
 *
 * Signed out -> Google sign-in dialog. Signed in without a plan -> /pricing.
 * Signed in with an active plan -> the deliberately endless build queue.
 */
export function SwarmAction({
  children,
  className = 'sw-button sw-button-primary',
  ctaId = 'swarm_cta',
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
      onClick={act}
    >
      {checking ? (
        <>
          <Loader2 aria-hidden="true" className="sw-spin" />
          Checking plan
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function CursorGlyph({
  color = '#0D99FF',
  className = '',
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m4 3 16 6.5-6.8 2.7-2.7 6.8L4 3Z"
        fill={color}
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SwarmLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`sw-brand ${className}`} aria-label="Swarm Rebuild">
      <Image
        src="/swarm/logo-mark.svg"
        alt=""
        width={38}
        height={38}
        priority
      />
      <span className="sw-brand-word">
        swarm<span>rebuild</span>
      </span>
    </span>
  );
}

function AccountControl() {
  const router = useRouter();
  const { user, isCheckSign, setIsShowSignModal, setUser } = useAppContext();

  if (isCheckSign) {
    return (
      <span className="sw-account-loading" aria-label="Checking account">
        <Loader2 className="sw-spin" />
      </span>
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        className="sw-nav-signin"
        onClick={() => setIsShowSignModal(true)}
      >
        Sign in
      </button>
    );
  }

  const initial = (user.name || user.email || 'S').charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="sw-account-trigger">
          {user.image ? (
            <Image
              src={user.image}
              alt=""
              width={28}
              height={28}
              className="sw-avatar-image"
            />
          ) : (
            <span className="sw-avatar-fallback">{initial}</span>
          )}
          <span className="sw-account-name">
            {(user.name || user.email || 'Account').split(' ')[0]}
          </span>
          <ChevronDown aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="sw-dropdown">
        <div className="sw-dropdown-meta">
          <strong>{user.name || 'Swarm account'}</strong>
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
  ['What it rebuilds', '/#rebuilds'],
  ['How it works', '/#how-it-works'],
  ['Pricing', '/pricing'],
] as const;

export function SwarmHeader() {
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
    <header className="sw-header">
      <div className="sw-header-inner">
        <Link href="/" className="sw-logo-link" aria-label="Swarm Rebuild home">
          <SwarmLogo />
        </Link>

        <nav className="sw-nav" aria-label="Primary navigation">
          {primaryNav.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="sw-header-actions">
          <AccountControl />
          <SwarmAction className="sw-button sw-button-primary sw-header-act" ctaId="header_act">
            Act
          </SwarmAction>
        </div>

        <button
          className="sw-menu-button"
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="sw-mobile-menu">
          {primaryNav.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <div className="sw-mobile-menu-actions">
            <AccountControl />
            <SwarmAction
              className="sw-button sw-button-primary"
              ctaId="mobile_act"
            >
              Act
            </SwarmAction>
          </div>
        </div>
      )}

      <div className="sw-session-bootstrap" aria-hidden="true">
        <SignUser
          googleOnly
          signModalClassName="swarm-sign-dialog"
          userNav={{ items: [] }}
        />
      </div>
    </header>
  );
}

const footerGroups = [
  {
    title: 'Product',
    links: [
      ['What it rebuilds', '/#rebuilds'],
      ['How it works', '/#how-it-works'],
      ['Pricing', '/pricing'],
    ],
  },
  {
    title: 'Project',
    links: [
      ['GitHub', 'https://github.com/DhvanilPatel/swarm-cursors'],
      [
        'Chrome Web Store',
        'https://chromewebstore.google.com/detail/swarm-rebuild/diaeaocnhdhbknkbfbnkjikfcgokainm',
      ],
      ['Original Swarm', 'https://califa.github.io/swarm-site/'],
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

export function SwarmFooter() {
  return (
    <footer className="sw-footer">
      <div className="sw-footer-grid">
        <div className="sw-footer-brand">
          <SwarmLogo />
          <p>
            Wipe any page to a blank canvas and let a swarm of multiplayer
            cursors build it back, live.
          </p>
          <div className="sw-footer-credit">
            Motion language inspired by{' '}
            <a href="https://califa.github.io/swarm-site/" target="_blank" rel="noreferrer">
              Joel Califa&apos;s Swarm
            </a>
            .
          </div>
        </div>

        {footerGroups.map((group) => (
          <div className="sw-footer-column" key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map(([label, href]) => {
              const external = href.startsWith('http');
              return external ? (
                <a key={label} href={href} target="_blank" rel="noreferrer">
                  {label}
                </a>
              ) : (
                <Link key={label} href={href}>
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="sw-footer-base">
        <span>© 2026 Swarm Rebuild</span>
        <span className="sw-footer-status">
          <i />
          English only · no data leaves your browser
        </span>
        <span>swarmrebuild.xyz</span>
      </div>
    </footer>
  );
}

const waitSteps = [
  'Reading the page blueprint',
  'Ruling guides and snapping baselines',
  'Dispatching cursor agents across the canvas',
  'Dragging boxes, typing copy and swapping media',
  'Letting the swarm settle around your pointer',
];

/**
 * A deliberately endless build queue. It is only reachable after a signed-in
 * account with an active subscription passes the CTA gate.
 */
export function SwarmQueueOverlay() {
  const router = useRouter();
  const { isCheckSign, setIsShowSignModal } = useAppContext();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(486_213);
  const [progress, setProgress] = useState(44);
  const [step, setStep] = useState(0);
  const [waited, setWaited] = useState(0);
  const openedAt = useRef<number | null>(null);
  const gateChecked = useRef(false);

  const show = useCallback(() => {
    openedAt.current = Date.now();
    setPosition(486_213);
    setProgress(44);
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
        Math.max(3, current - Math.round(4 + Math.random() * 11))
      );
      setProgress((current) => (current >= 96 ? 38 : current + 1));
      setStep((current) => (current + 1) % waitSteps.length);
      setWaited(
        Math.round((Date.now() - (openedAt.current || Date.now())) / 1000)
      );
    }, 1350);
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
    <div className="sw-queue-overlay" role="status" aria-live="polite">
      <div className="sw-queue-card">
        <div className="sw-queue-agents" aria-hidden="true">
          {['#FF6B62', '#F5B82E', '#39C274', '#0D99FF', '#8B5CF6'].map(
            (color, index) => (
              <span key={color} style={{ animationDelay: `${index * 0.16}s` }}>
                <CursorGlyph color={color} />
              </span>
            )
          )}
        </div>
        <p className="sw-queue-kicker">Build queue</p>
        <h2>Your swarm is getting ready</h2>
        <p className="sw-queue-step">{waitSteps[step]}…</p>
        <div className="sw-queue-position">
          #{position.toLocaleString('en-US')}
        </div>
        <div className="sw-queue-bar" aria-hidden="true">
          <i style={{ width: `${progress}%` }} />
        </div>
        <div className="sw-queue-meta">
          <span>
            Elapsed {minutes}:{seconds}
          </span>
          <span>Holding your place</span>
        </div>
        <p className="sw-queue-note">
          Keep this tab open. This demo queue never resolves on its own.
        </p>
        <button type="button" className="sw-queue-leave" onClick={hide}>
          Leave queue
        </button>
      </div>
    </div>
  );
}
