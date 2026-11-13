'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';

import { useAppContext } from '@/shared/contexts/app';
import { cn } from '@/shared/lib/utils';
import { Subscription } from '@/shared/models/subscription';
import { Pricing as PricingType } from '@/shared/types/blocks/pricing';

const planNumbers = ['01', '02', '03'];

export function GalaxyPricing({
  section,
  currentSubscription,
}: {
  section: PricingType;
  currentSubscription?: Subscription;
}) {
  const locale = useLocale();
  const { user, setIsShowSignModal } = useAppContext();
  const [group, setGroup] = useState(() => {
    const featured = section.groups?.find((item) => item.is_featured);
    return featured?.name || section.groups?.[0]?.name || 'monthly';
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const checkout = async (productId: string) => {
    if (!user) {
      setIsShowSignModal(true);
      return;
    }

    try {
      setLoadingId(productId);
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          currency: 'USD',
          locale: locale || 'en',
          payment_provider: 'stripe',
          metadata: { source: 'galaxyai.homes' },
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (response.status === 401 || /sign in|auth/i.test(result?.message || '')) {
        setIsShowSignModal(true);
        return;
      }
      if (!response.ok || result?.code !== 0) {
        throw new Error(result?.message || 'Checkout could not be started');
      }
      if (!result?.data?.checkoutUrl) {
        throw new Error('Stripe Checkout did not return a URL');
      }

      window.location.assign(result.data.checkoutUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Checkout could not be started'
      );
      setLoadingId(null);
    }
  };

  const visibleItems =
    section.items?.filter((item) => !item.group || item.group === group) || [];

  return (
    <section className="gx-pricing-section" aria-labelledby="plans-heading">
      <div className="gx-pricing-intro">
        <p className="gx-eyebrow">Membership</p>
        <h2 id="plans-heading">Pick the orbit that fits.</h2>
        <p>
          One paid membership across GalaxyAI. No free tier, no payment-provider
          picker, no detours — checkout opens directly on Stripe.
        </p>
      </div>

      <div className="gx-pricing-toggle" aria-label="Billing period">
        {section.groups?.map((item) => (
          <button
            key={item.name}
            type="button"
            className={cn(group === item.name && 'is-active')}
            onClick={() => setGroup(item.name || '')}
          >
            {item.title}
            {item.label && <span>{item.label}</span>}
          </button>
        ))}
      </div>

      <div className="gx-pricing-grid">
        {visibleItems.map((item, index) => {
          const isCurrentPlan =
            currentSubscription?.productId === item.product_id;
          const loading = loadingId === item.product_id;

          return (
            <article
              key={item.product_id}
              className={cn('gx-plan', item.is_featured && 'is-featured')}
            >
              <div className="gx-plan-head">
                <span className="gx-plan-number">{planNumbers[index]}</span>
                {item.label && <span className="gx-plan-label">{item.label}</span>}
              </div>

              <h3>{item.title}</h3>
              <p className="gx-plan-description">{item.description}</p>

              <div className="gx-plan-price">
                <strong>{item.price}</strong>
                {item.unit && <span>{item.unit}</span>}
                {item.original_price && <del>{item.original_price}</del>}
              </div>
              {item.tip && <p className="gx-plan-tip">{item.tip}</p>}

              <button
                type="button"
                className="gx-button gx-plan-button"
                disabled={Boolean(loadingId) || isCurrentPlan}
                onClick={() => void checkout(item.product_id)}
              >
                {isCurrentPlan ? (
                  'Current plan'
                ) : loading ? (
                  <>
                    <Loader2 className="gx-spin" />
                    Opening Stripe
                  </>
                ) : (
                  <>
                    {item.button?.title || 'Continue to Stripe'}
                    <ArrowUpRight />
                  </>
                )}
              </button>

              {item.features_title && (
                <p className="gx-plan-features-title">{item.features_title}</p>
              )}
              <ul className="gx-plan-features">
                {item.features?.map((feature) => (
                  <li key={feature}>
                    <Check />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div className="gx-pricing-footnote">
        <span>stripe</span>
        <p>
          Every plan is billed in USD and renews automatically until cancelled.
          Prices exclude local taxes. Act only opens the demo queue after an
          active subscription is confirmed.
        </p>
      </div>
    </section>
  );
}
