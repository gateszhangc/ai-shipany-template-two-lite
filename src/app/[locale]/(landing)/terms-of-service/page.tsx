import { setRequestLocale } from 'next-intl/server';

import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Terms of Service — Swarm Rebuild',
  description:
    'The terms that apply when you use swarmrebuild.xyz, sign in with Google or subscribe to a paid Swarm Rebuild plan through Stripe.',
  canonicalUrl: '/terms-of-service',
});

const sections = [
  [
    '1. Who we are',
    'Swarm Rebuild (swarmrebuild.xyz) is an independent Chrome-extension project. It is not affiliated with Google, Chrome, Stripe, Joel Califa or the original Swarm site. The project is a tribute to the motion language of Swarm by Joel Califa.',
  ],
  [
    '2. Accounts',
    'You sign in with Google and are responsible for activity on your account. You must be old enough to enter a binding contract in your country. Keep access to your Google account secure; we do not ask for your Google password.',
  ],
  [
    '3. Plans and billing',
    'Every plan shown on this site is a paid subscription. There is no free tier. Subscriptions are processed directly by Stripe, renew automatically for the interval shown at checkout and continue until you cancel from the billing page. Prices are shown in US dollars and may exclude local taxes.',
  ],
  [
    '4. The demo build queue',
    'The queue shown after activating the swarm on this website is a product demonstration. It is intentionally endless and does not represent real server capacity or a guaranteed processing time. The Chrome extension itself runs locally in your browser.',
  ],
  [
    '5. Acceptable use',
    'Use the site and extension lawfully. Do not attempt to disrupt the service, bypass access controls, abuse payment systems or use the project to infringe another person’s rights.',
  ],
  [
    '6. Page content',
    'You are responsible for the pages you choose to rebuild and for any content, media or styles on them. The extension creates a temporary visual copy in your browser for the animation; it does not grant you rights to that content.',
  ],
  [
    '7. Availability',
    'We work to keep the site online, but it is provided “as is” and may change, pause or remove features while it is improved. The extension may not work on restricted browser pages or pages that exceed its documented limits.',
  ],
  [
    '8. Changes',
    'We may update these terms. The version that applies when you subscribe is the one published at that time. Continued use after an update means you accept the revised terms.',
  ],
] as const;

export default async function TermsOfServicePage({
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
        <h1>Terms of Service</h1>
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
