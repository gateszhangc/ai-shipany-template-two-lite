'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

import { SignUser } from '@/shared/blocks/sign/sign-user';
import { useAppContext } from '@/shared/contexts/app';

export function FalconAction({
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
  ['Falcon Home', '#home'],
  ['Highlights', '#highlights'],
  ['What’s New', '#whats-new'],
  ['How it performs', '#performance'],
  ['Multilingual & Multimodal', '#multilingual'],
  ['Word of mouth', '#word-of-mouth'],
  ['What’s Next', '#whats-next'],
  ['FAQ', '#faq'],
] as const;

export function FalconHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="gen-header">
      <div className="gen-nav">
        <a className="gen-logo" href="#home" aria-label="Falcon 2 home">
          <img src="/falcon2-logo.svg" alt="" aria-hidden="true" />
          Falcon 2
        </a>
        <nav>
          {navigation.map(([label, href]) => (
            <a href={href} key={label}>
              {label}
              {label === 'Falcon Home' ? null : <ChevronDown />}
            </a>
          ))}
        </nav>
        <FalconAction className="gen-header-action">
          Generate with Falcon 2
        </FalconAction>
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
            <FalconAction className="gen-gradient-button">
              Start Generating
            </FalconAction>
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
  ['Falcon', ['Home', 'Falcon Models', 'Research']],
  ['Resources', ['Documentation', 'Hugging Face', 'Datasets', 'FAQ']],
  ['Legal', ['Terms of Use', 'Privacy Policy']],
] as const;

export function FalconFooter() {
  return (
    <footer className="gen-footer">
      <div className="gen-footer-top">
        <div>
          <a className="gen-logo" href="#home">
            <img src="/falcon2-logo.svg" alt="" aria-hidden="true" />
            Falcon 2
          </a>
          <p>Open, multilingual, and multimodal Falcon model series.</p>
          <a href="mailto:support@falcon2.lol">support@falcon2.lol</a>
        </div>
        {footerGroups.map(([title, links]) => (
          <div className="gen-footer-group" key={title}>
            <h3>{title}</h3>
            {links.map((link) => (
              <a
                href={
                  link === 'Home'
                    ? '#home'
                    : link === 'Falcon Models'
                      ? 'https://falconllm.tii.ae/falcon-models.html'
                      : link === 'Research'
                        ? 'https://falconllm.tii.ae/our-research.html'
                        : link === 'FAQ'
                          ? 'https://falconllm.tii.ae/faq.html'
                          : link === 'Privacy Policy'
                            ? '/privacy-policy'
                            : link === 'Terms of Use'
                              ? '/terms-of-service'
                              : '#'
                }
                key={link}
                target={
                  link === 'Falcon Models' ||
                  link === 'Research' ||
                  link === 'FAQ'
                    ? '_blank'
                    : undefined
                }
                rel={
                  link === 'Falcon Models' ||
                  link === 'Research' ||
                  link === 'FAQ'
                    ? 'noreferrer'
                    : undefined
                }
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="gen-footer-bottom">
        © 2026 falcon2.lol. All rights reserved.
      </div>
    </footer>
  );
}
