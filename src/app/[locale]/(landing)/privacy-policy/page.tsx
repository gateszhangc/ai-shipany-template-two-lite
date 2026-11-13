import { setRequestLocale } from 'next-intl/server';

import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Privacy Policy — Swarm Rebuild',
  description:
    'How swarmrebuild.xyz handles account data, Stripe billing and the page snapshots created by the Swarm Rebuild Chrome extension.',
  canonicalUrl: '/privacy-policy',
});

const sections = [
  [
    '1. The short version',
    'Swarm Rebuild does not collect or transmit the pages you rebuild. The extension keeps its page snapshot in the current tab and discards it when you exit or leave the page. This website only stores the account and billing details needed to operate a paid plan.',
  ],
  [
    '2. The extension',
    'By default the extension uses Chrome activeTab permission, so it only touches the tab you click and only at that moment. If you turn on automatic play, Chrome first asks for access to the sites you choose. Switching back to click-only removes that access. The extension makes no analytics calls, uploads no page content and loads no remote code.',
  ],
  [
    '3. Page snapshots and screenshots',
    'To rebuild a page, the extension reads layout and styles in your browser. For WebGL canvases, playing video and embedded frames, it takes one screenshot of the visible tab and crops those regions. The blueprint and screenshot live only in that tab memory and are not sent to us.',
  ],
  [
    '4. Website accounts',
    'When you sign in with Google, we receive the account details Google shares, such as your name, email address and profile picture. We store those details with your session and subscription state so the site can recognize your account and show your current plan.',
  ],
  [
    '5. Payments',
    'Card details never reach our servers. Checkout, renewals, invoices and payment-method updates are hosted by Stripe. Stripe receives the email address, plan and payment details you provide on its checkout page.',
  ],
  [
    '6. Analytics and cookies',
    'If analytics is enabled for this deployment, we use Google Analytics 4 to count page views and primary button clicks in aggregate. A session cookie keeps you signed in. Analytics cookies are not required to read the site and are never used to identify the content of a page you rebuilt.',
  ],
  [
    '7. Your choices',
    'You can sign out at any time, manage or cancel a subscription from the billing page, and request deletion of your website account by emailing us. Deleting your account removes the website profile and plan record associated with it.',
  ],
  [
    '8. Contact',
    'For access, correction or deletion requests, email support@swarmrebuild.xyz.',
  ],
] as const;

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="sw-legal-page">
      <header className="sw-legal-head">
        <p className="sw-eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="sw-legal-updated">Last updated: 13 November 2026</p>
      </header>
      <div className="sw-legal-body">
        {sections.map(([title, body]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
      </div>
      <p className="sw-legal-contact">
        Questions? Email{' '}
        <a href="mailto:support@swarmrebuild.xyz">support@swarmrebuild.xyz</a>.
      </p>
    </main>
  );
}
