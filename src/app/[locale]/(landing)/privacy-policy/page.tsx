import { setRequestLocale } from 'next-intl/server';

import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Privacy Policy — GalaxyAI Inc.',
  description:
    'How galaxyai.homes handles Google account data, Stripe billing and membership information.',
  canonicalUrl: '/privacy-policy',
});

const sections = [
  [
    '1. The short version',
    'GalaxyAI collects only the account, membership and billing information needed to operate this website. We do not sell personal information. Checkout card details are handled by Stripe and never reach our servers.',
  ],
  [
    '2. Website accounts',
    'When you sign in with Google, we receive the account details Google shares, such as your name, email address and profile picture. We store those details with your session and subscription state so the site can recognise your account, confirm an active plan and show the correct billing information.',
  ],
  [
    '3. The Act queue',
    'Act checks whether you are signed in and whether your account has an active membership. It does not send product prompts or confidential work to the queue. The queue shown on this site is a deliberately endless interface demonstration.',
  ],
  [
    '4. Payments',
    'Card details never reach our servers. Checkout, renewals, invoices and payment-method updates are hosted by Stripe. Stripe receives the email address, plan and payment details you provide on its checkout page.',
  ],
  [
    '5. Analytics and cookies',
    'If analytics is enabled for this deployment, we use Google Analytics 4 to count page views and primary button clicks in aggregate. A session cookie keeps you signed in. Analytics cookies are not required to read the site and are never used to identify your private product work.',
  ],
  [
    '6. Your choices',
    'You can sign out at any time, manage or cancel a subscription from the billing page, and request deletion of your website account by emailing us. Deleting your account removes the website profile and plan record associated with it.',
  ],
  [
    '7. Contact',
    'For access, correction or deletion requests, email support@galaxyai.homes.',
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
    <article className="gx-legal-page">
      <header className="gx-legal-head">
        <p className="gx-eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="gx-legal-updated">Last updated: 13 November 2026</p>
      </header>
      <div className="gx-legal-body">
        {sections.map(([title, body]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
      </div>
      <p className="gx-legal-contact">
        Questions? Email{' '}
        <a href="mailto:support@galaxyai.homes">support@galaxyai.homes</a>.
      </p>
    </article>
  );
}
