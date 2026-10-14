import { setRequestLocale } from 'next-intl/server';

import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Privacy Policy — Udio AI',
  description:
    'What udioai.lol stores when you browse, sign in or subscribe to Udio AI.',
  canonicalUrl: '/privacy-policy',
});

const sections = [
  [
    '1. What we collect',
    'We store the account details Google shares when you sign in (name, email address and profile picture), the plan you subscribe to, and the songs and prompts you create so they are available in your library.',
  ],
  [
    '2. Payments',
    'Card details never reach our servers. Checkout, renewals and invoices are handled by Stripe, which receives the email address and plan you selected.',
  ],
  [
    '3. Analytics',
    'We use Google Analytics 4 with IP anonymisation to count page views and button clicks. The data is aggregated and is not used to identify you.',
  ],
  [
    '4. Cookies',
    'A session cookie keeps you signed in. Analytics cookies are only set after the page loads and are never required to read the site.',
  ],
  [
    '5. Your creations',
    'Prompts, lyrics and songs you create are tied to your account. You can delete any of them from your library, and deleting your account removes them from our storage.',
  ],
  [
    '6. Your choices',
    'You can delete your account at any time from the account settings page, which also cancels the plan record we keep.',
  ],
  [
    '7. Contact',
    'For access, correction or deletion requests, email support@udioai.lol.',
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
    <main className="ua-main ua-legal">
      <h1>Privacy Policy</h1>
      <p className="ua-legal-updated">Last updated: 1 October 2026</p>
      {sections.map(([title, body]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{body}</p>
        </section>
      ))}
      <p className="ua-legal-contact">
        Questions? Email <a href="mailto:support@udioai.lol">support@udioai.lol</a>.
      </p>
    </main>
  );
}
