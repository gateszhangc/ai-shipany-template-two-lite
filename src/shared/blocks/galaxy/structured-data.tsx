import { envConfigs } from '@/config';

export function GalaxyStructuredData() {
  const appUrl = (envConfigs.app_url || 'https://galaxyai.homes').replace(
    /\/$/,
    ''
  );

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GalaxyAI Inc.',
    url: `${appUrl}/`,
    logo: `${appUrl}/galaxy/logo-mark-512.png`,
    description:
      'GalaxyAI Inc. builds, acquires and scales iconic AI products to put the power of AI in everyone’s hands.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '8 The Green STE A',
      addressLocality: 'Dover',
      addressRegion: 'DE',
      postalCode: '19901',
      addressCountry: 'US',
    },
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GalaxyAI',
    alternateName: 'GalaxyAI Inc.',
    url: `${appUrl}/`,
  };

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'GalaxyAI membership',
    provider: { '@type': 'Organization', name: 'GalaxyAI Inc.' },
    serviceType: 'AI product membership',
    url: `${appUrl}/pricing`,
    description:
      'Paid access to GalaxyAI products, portfolio experiments and the Galaxy Studio demo queue.',
    offers: [
      {
        '@type': 'Offer',
        name: 'Core',
        price: '19.00',
        priceCurrency: 'USD',
        url: `${appUrl}/pricing`,
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Studio',
        price: '49.00',
        priceCurrency: 'USD',
        url: `${appUrl}/pricing`,
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Scale',
        price: '99.00',
        priceCurrency: 'USD',
        url: `${appUrl}/pricing`,
        availability: 'https://schema.org/InStock',
      },
    ],
  };

  return (
    <>
      {[organization, website, service].map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
