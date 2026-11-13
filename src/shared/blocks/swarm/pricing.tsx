'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { CursorGlyph } from '@/shared/blocks/swarm/site';
import { Badge } from '@/shared/components/ui/badge';
import { useAppContext } from '@/shared/contexts/app';
import { cn } from '@/shared/lib/utils';
import { Subscription } from '@/shared/models/subscription';
import { Pricing as PricingType } from '@/shared/types/blocks/pricing';

const accents = ['#0D99FF', '#8B5CF6', '#FF6B62'];

export function SwarmPricing({
  section,
  currentSubscription,
}: {
  section: PricingType;
  currentSubscription?: Subscription;
}) {
  const locale = useLocale();
  const t = useTranslations('pages.pricing.messages');
  const { user, setIsShowSignModal } = useAppContext();
  const [group, setGroup] = useState(() => {
    const featuredGroup = section.groups?.find((item) => item.is_featured);
    return featuredGroup?.name || section.groups?.[0]?.name || 'monthly';
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (section.items && section.items.length > 0 && !group) {
      setGroup(section.items[0].group || 'monthly');
    }
  }, [group, section.items]);

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
          metadata: {},
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result?.code !== 0) {
        throw new Error(result?.message || 'Checkout could not be started');
      }

      if (!result?.data?.checkoutUrl) {
        throw new Error('Stripe checkout URL was not returned');
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
    <section className="sw-pricing" id={section.id}>
      <div className="sw-pricing-toggle" aria-label="Billing period">
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

      <div className="sw-pricing-grid">
        {visibleItems.map((item, index) => {
          const isCurrentPlan =
            currentSubscription?.productId === item.product_id;
          const accent = accents[index % accents.length];
          const loading = loadingId === item.product_id;

          return (
            <article
              className={cn('sw-plan', item.is_featured && 'is-featured')}
              key={item.product_id}
              style={{ '--plan-accent': accent } as React.CSSProperties}
            >
              <div className="sw-plan-topline">
                <span className="sw-plan-cursor">
                  <CursorGlyph color={accent} />
                </span>
                <span className="sw-plan-name">{item.title}</span>
                {item.label && <Badge>{item.label}</Badge>}
              </div>

              <p className="sw-plan-description">{item.description}</p>

              <div className="sw-plan-price">
                <span>{item.price}</span>
                {item.unit && <small>{item.unit}</small>}
                {item.original_price && (
                  <del>{item.original_price}</del>
                )}
              </div>
              {item.tip && <p className="sw-plan-tip">{item.tip}</p>}

              <button
                type="button"
                className="sw-button sw-plan-button"
                disabled={Boolean(loadingId) || isCurrentPlan}
                onClick={() => void checkout(item.product_id)}
              >
                {isCurrentPlan ? (
                  t('current_plan')
                ) : loading ? (
                  <>
                    <Loader2 className="sw-spin" />
                    {t('processing')}
                  </>
                ) : (
                  <>
                    {item.button?.title || 'Get started'}
                    <ArrowUpRight />
                  </>
                )}
              </button>

              {item.features_title && (
                <p className="sw-plan-features-title">{item.features_title}</p>
              )}
              <ul className="sw-plan-features">
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

      <div className="sw-pricing-footnote">
        <span className="sw-stripe-mark">stripe</span>
        <p>
          Checkout opens directly on Stripe&apos;s secure hosted page. There is
          no payment-provider picker, and there is no free plan.
        </p>
      </div>
    </section>
  );
}
