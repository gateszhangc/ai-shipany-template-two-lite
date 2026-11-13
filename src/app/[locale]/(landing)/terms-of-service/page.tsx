import { setRequestLocale } from 'next-intl/server';

import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Terms of Service — GalaxyAI Inc.',
  description:
    'The terms that apply when you use galaxyai.homes, sign in with Google or subscribe to a paid GalaxyAI membership through Stripe.',
  canonicalUrl: '/terms-of-service',
});

const sections = [
  [
    '1. Who we are',
    'GalaxyAI Inc. (galaxyai.homes) builds, acquires and scales AI products. These terms apply to this website and the GalaxyAI membership offered here. Product-specific terms may also apply when you use another GalaxyAI product.',
  ],
  [
    '2. Accounts',
    'You sign in with Google and are responsible for activity on your account. You must be old enough to enter a binding contract in your country. Keep access to your Google account secure; GalaxyAI never asks for your Google password.',
  ],
  [
    '3. Memberships and billing',
    'Every membership shown on this site is paid. There is no free tier. Subscriptions are processed directly by Stripe, renew automatically for the interval shown at checkout and continue until you cancel from the billing page. Prices are shown in US dollars and may exclude local taxes.',
  ],
  [
    '4. The demo queue',
    'Act is available only after sign-in and an active paid membership are confirmed. For eligible accounts, Act opens a deliberately endless product queue. The queue is an interface demonstration; it does not reserve compute capacity, guarantee product access or create a completion time.',
  ],
  [
    '5. Acceptable use',
    'Use the site lawfully. Do not attempt to disrupt the service, bypass access controls, abuse payment systems or use the service to infringe another person’s rights.',
  ],
  [
    '6. Third-party products',
    'Some products linked from this site, including Magica and Spiral, are operated independently and may have their own terms and privacy policies. A GalaxyAI membership does not override those product-specific terms.',
  ],
  [
    '7. Availability',
    'We work to keep the site online, but it is provided “as is” and may change, pause or remove features while it is improved. The demo queue may reset or stop at any time and is not a promise of service capacity.',
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
    <article className="gx-legal-page">
      <header className="gx-legal-head">
        <p className="gx-eyebrow">Legal</p>
        <h1>Terms of Service</h1>
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
