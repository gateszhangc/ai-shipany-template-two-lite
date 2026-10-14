import { envConfigs } from '@/config';

/**
 * JSON-LD for the home page: the Udio AI web application, the site itself and
 * the page breadcrumb.
 */
export function UdioStructuredData() {
  const appUrl = (envConfigs.app_url || 'https://udioai.lol').replace(/\/$/, '');

  const app = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Udio AI',
    url: `${appUrl}/`,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    description:
      'Create any song. Just imagine it. Udio AI turns a text prompt into a full track with vocals, instruments and mixing in seconds.',
    offers: [
      {
        '@type': 'Offer',
        name: 'Standard',
        price: '10.00',
        priceCurrency: 'USD',
        url: `${appUrl}/pricing`,
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '30.00',
        priceCurrency: 'USD',
        url: `${appUrl}/pricing`,
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Ultra',
        price: '99.00',
        priceCurrency: 'USD',
        url: `${appUrl}/pricing`,
        availability: 'https://schema.org/InStock',
      },
    ],
  };

  const site = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: envConfigs.app_name,
    url: `${appUrl}/`,
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${appUrl}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Pricing',
        item: `${appUrl}/pricing`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
