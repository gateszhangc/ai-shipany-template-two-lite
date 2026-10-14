import '@/config/style/global.css';

import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import NextTopLoader from 'nextjs-toploader';

import { envConfigs } from '@/config';
import { locales } from '@/config/locale';
import { routing } from '@/core/i18n/config';
import { ThemeProvider } from '@/core/theme/provider';
import { GoogleAnalytics } from '@/shared/blocks/common/google-analytics';
import { UtmCapture } from '@/shared/blocks/common/utm-capture';
import { Toaster } from '@/shared/components/ui/sonner';
import { AppContextProvider } from '@/shared/contexts/app';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata();

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const appUrl = envConfigs.app_url || '';

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href={envConfigs.app_favicon} />
        <link rel="alternate icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {locales
          ? locales.map((loc) => (
              <link
                key={loc}
                rel="alternate"
                hrefLang={loc}
                href={`${appUrl}${loc === 'en' ? '' : `/${loc}`}`}
              />
            ))
          : null}
      </head>
      <body suppressHydrationWarning className="overflow-x-hidden">
        <GoogleAnalytics measurementId={envConfigs.ga_id} />
        <NextTopLoader
          color="#E30B5D"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
        />

        <UtmCapture />

        <NextIntlClientProvider>
          <ThemeProvider>
            <AppContextProvider>
              {children}
              <Toaster position="top-center" richColors />
            </AppContextProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
