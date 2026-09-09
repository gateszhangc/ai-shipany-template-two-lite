import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Pricing } from '@/themes/default/blocks/pricing';
import { getMetadata } from '@/shared/lib/seo';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { getUserInfo } from '@/shared/models/user';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'pages.pricing.metadata',
  canonicalUrl: '/pricing',
});

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // get current subscription
  let currentSubscription;
  try {
    const user = await getUserInfo();
    if (user) {
      currentSubscription = await getCurrentSubscription(user.id);
    }
  } catch (error) {
    console.log('getting current subscription failed:', error);
  }

  // get pricing data
  const t = await getTranslations('pages.pricing');

  // build page sections
  const page: DynamicPage = {
    title: t.raw('page.title'),
    sections: {
      pricing: {
        ...t.raw('page.sections.pricing'),
        data: {
          currentSubscription,
        },
      },
    },
  };

  // load page component
  return <><h1 className="sr-only">{page.title}</h1><Pricing section={t.raw('page.sections.pricing')} currentSubscription={currentSubscription} /></>;
}
