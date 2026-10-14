import { setRequestLocale } from 'next-intl/server';

import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Terms and Conditions — Udio AI',
  description: 'The terms that apply when you use or subscribe to Udio AI.',
  canonicalUrl: '/terms-of-service',
});

const sections = [
  [
    '1. Who we are',
    'Udio AI (udioai.lol) is an AI music generation studio. It is an independent service and is not affiliated with Udio or Uncharted Labs, Inc. or with any record label or artist referenced on this site.',
  ],
  [
    '2. Accounts',
    'You sign in with Google and are responsible for the activity on your account. You must be old enough to enter a binding contract in your country.',
  ],
  [
    '3. Plans and billing',
    'Subscriptions are processed by Stripe. Monthly plans renew every month and annual plans every year until you cancel from the billing page. Prices are shown in US dollars and may exclude local taxes.',
  ],
  [
    '4. Generations and the queue',
    'Generation runs on shared capacity. During busy periods your request may wait in a queue, and priority depends on your plan. We may adjust limits to keep the service available for everyone.',
  ],
  [
    '5. Your content',
    'You keep the rights you have in the prompts and audio you upload, and you are responsible for making sure you have the right to use them. Songs generated with a paid plan may be used commercially; content created on a trial without an active plan is for personal, non-commercial use.',
  ],
  [
    '6. Acceptable use',
    'Do not use Udio AI to create content that infringes copyright, impersonates an artist, or breaks the law, and do not attempt to disrupt or reverse engineer the service.',
  ],
  [
    '7. Availability',
    'We work to keep the studio online, but the service is provided "as is" and may change or pause features while we improve it.',
  ],
  [
    '8. Changes',
    'We may update these terms; the version that applies to your subscription is the one published when you subscribe.',
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
    <main className="ua-main ua-legal">
      <h1>Terms and Conditions</h1>
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
