import { getTranslations, setRequestLocale } from 'next-intl/server';

import { SwarmPricing } from '@/shared/blocks/swarm/pricing';
import { getMetadata } from '@/shared/lib/seo';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { getUserInfo } from '@/shared/models/user';
import { Pricing as PricingType } from '@/shared/types/blocks/pricing';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Swarm Rebuild Pricing — Paid Plans with Stripe Checkout',
  description:
    'Choose a Swarm Rebuild plan. Every tier is paid, billed securely by Stripe and unlocks the full cursor swarm. No free plan.',
  canonicalUrl: '/pricing',
  imageUrl: '/swarm/og.png',
});

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let currentSubscription;
  try {
    const user = await getUserInfo();
    if (user) {
      currentSubscription = await getCurrentSubscription(user.id);
    }
  } catch (error) {
    console.log('getting current subscription failed:', error);
  }

  const t = await getTranslations('pages.pricing');
  const section = t.raw('page.sections.pricing') as PricingType;

  return (
    <>
      <section className="sw-page-hero">
        <p className="sw-eyebrow">One canvas · three ways in</p>
        <h1>{t('page.title')}</h1>
        <p>{t('page.description')}</p>
      </section>

      <SwarmPricing section={section} currentSubscription={currentSubscription} />
    </>
  );
}
