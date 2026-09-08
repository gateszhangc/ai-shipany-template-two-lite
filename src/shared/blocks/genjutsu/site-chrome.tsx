'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

import { SignUser } from '@/shared/blocks/sign/sign-user';
import { useAppContext } from '@/shared/contexts/app';

export function GenjutsuAction({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const { user, isCheckSign, setIsShowSignModal } = useAppContext();
  const [loading, setLoading] = useState(false);
  const act = async () => {
    if (loading || isCheckSign) return;
    if (!user) {
      setIsShowSignModal(true);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/user/get-user-credits', {
        method: 'POST',
      });
      if (response.status === 401 || response.status === 403) {
        setIsShowSignModal(true);
        return;
      }
      if (!response.ok) throw new Error('Unable to check your credits');
      const result = await response.json();
      // The credits endpoint uses the template's JSON error envelope (HTTP 200
      // for an unauthenticated request), so handle that case explicitly.
      if (result.code !== 0) {
        setIsShowSignModal(true);
        return;
      }
      router.push(
        (result.data?.remainingCredits ?? 0) > 0 ? '/chat' : '/pricing'
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Please try again');
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      type="button"
      className={className}
      disabled={loading || isCheckSign}
      onClick={act}
    >
      {loading ? 'Checking…' : children}
    </button>
  );
}

const navigation = [
  ['Home', '#home'],
  ['Imagine', '#generator'],
  ['Compare Models', '#workflows'],
  ['Prompt Guide', '#how-it-works'],
  ['Pricing', '#pricing'],
  ['FAQ', '#faq'],
] as const;

export function GenjutsuHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="gen-header">
      <div className="gen-nav">
        <a
          className="gen-logo"
          href="#home"
          aria-label="Higgsfield Genjutsu home"
        >
          <img src="/genjutsu-logo.svg" alt="" aria-hidden="true" />
          Higgsfield Genjutsu
        </a>
        <nav>
          {navigation.map(([label, href]) => (
            <a href={href} key={label}>
              {label}
              {label === 'Compare Models' && <ChevronDown />}
            </a>
          ))}
        </nav>
        <GenjutsuAction className="gen-header-action">
          Sign in to Create
        </GenjutsuAction>
        <button
          className="gen-menu"
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        {open && (
          <div className="gen-mobile-menu">
            {navigation.map(([label, href]) => (
              <a href={href} key={label} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <GenjutsuAction className="gen-gradient-button">
              Start Creating
            </GenjutsuAction>
          </div>
        )}
        <div className="gen-session-bootstrap" aria-hidden="true">
          <SignUser
            googleOnly
            signModalClassName="gen-sign-dialog"
            userNav={{ items: [] }}
          />
        </div>
      </div>
    </header>
  );
}

const footerGroups = [
  ['Models', ['Genjutsu Generator', 'Text to Video', 'Image to Video']],
  ['Resources', ['Prompt Guide', 'How to Use', 'Mobile App', 'Blog']],
  ['Explore', ['Features', 'Video Examples', 'Pricing', 'FAQ']],
] as const;

export function GenjutsuFooter() {
  return (
    <footer className="gen-footer">
      <div className="gen-footer-top">
        <div>
          <a className="gen-logo" href="#home">
            <img src="/genjutsu-logo.svg" alt="" aria-hidden="true" />
            Higgsfield Genjutsu
          </a>
          <p>Create cinematic AI videos from text and images.</p>
          <a href="mailto:support@higgsfieldgenjutsu.lol">
            support@higgsfieldgenjutsu.lol
          </a>
        </div>
        {footerGroups.map(([title, links]) => (
          <div className="gen-footer-group" key={title}>
            <h3>{title}</h3>
            {links.map((link) => (
              <a
                href={
                  link === 'Pricing'
                    ? '#pricing'
                    : link === 'FAQ'
                      ? '#faq'
                      : '#features'
                }
                key={link}
              >
                {link}
              </a>
            ))}
          </div>
        ))}
        <div className="gen-footer-group">
          <h3>Legal</h3>
          <a href="/terms-of-service">Terms of Service</a>
          <a href="/privacy-policy">Privacy Policy</a>
        </div>
      </div>
      <div className="gen-footer-bottom">
        © 2026 higgsfieldgenjutsu.lol. All rights reserved.
      </div>
    </footer>
  );
}
