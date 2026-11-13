import { getTranslations, setRequestLocale } from 'next-intl/server';

import { GalaxyPricing } from '@/shared/blocks/galaxy/pricing';
import { getMetadata } from '@/shared/lib/seo';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { getUserInfo } from '@/shared/models/user';
import { Pricing as PricingType } from '@/shared/types/blocks/pricing';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Pricing — GalaxyAI Membership',
  description:
    'Choose a paid GalaxyAI membership. Every plan opens directly on Stripe Checkout. There is no free tier and no payment-provider picker.',
  canonicalUrl: '/pricing',
  imageUrl: '/galaxy/og.jpg',
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
      <section className="gx-page-hero">
        <div className="gx-page-orbit" aria-hidden="true" />
        <p className="gx-eyebrow">GalaxyAI membership</p>
        <h1>Build in a bigger orbit.</h1>
        <p>
          One membership across the GalaxyAI portfolio. Choose a plan, continue
          straight to Stripe, then use Act to enter the Studio queue.
        </p>
      </section>

      <GalaxyPricing
        section={section}
        currentSubscription={currentSubscription}
      />
    </>
  );
}
