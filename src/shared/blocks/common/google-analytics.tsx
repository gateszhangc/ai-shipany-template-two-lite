'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

import { trackPageView } from '@/shared/lib/analytics';

/**
 * Google Analytics 4 (gtag.js).
 *
 * The measurement id is read from the runtime environment by the server
 * layout and passed in: the deploy platform only injects `NEXT_PUBLIC_APP_URL`
 * as a build argument, so other NEXT_PUBLIC_* values are empty in the client
 * bundle and have to arrive as props.
 *
 * `gtag('config', ...)` already sends the initial page_view, so the effect
 * below skips the first render and only reports client-side navigations.
 */
export function GoogleAnalytics({ measurementId = '' }: { measurementId?: string }) {
  const pathname = usePathname();
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (!measurementId) return;
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    trackPageView();
  }, [pathname, measurementId]);

  if (!measurementId) return null;

  return (
    <>
      <Script
        id="google-analytics-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        async
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}');`,
        }}
      />
    </>
  );
}
