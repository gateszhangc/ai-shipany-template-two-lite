import { envConfigs } from '@/config';

export function SwarmStructuredData() {
  const appUrl = (envConfigs.app_url || 'https://swarmrebuild.xyz').replace(
    /\/$/,
    ''
  );

  const app = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Swarm Rebuild',
    alternateName: 'Swarm Rebuild Chrome extension',
    url: `${appUrl}/`,
    applicationCategory: 'BrowserApplication',
    operatingSystem: 'Chrome',
    description:
      'Swarm Rebuild wipes any web page to a blank canvas and lets a swarm of multiplayer cursors rebuild it live with boxes, text, pen-tool lines, ruler guides and duplicates.',
    featureList: [
      'Crosshair-drawn boxes with fills, borders, shadows and gradients',
      'Text layers typed with computed fonts, links and inline styles',
      'Pen-tool lines and Figma-style ruler guides',
      'Image, SVG, video, canvas and iframe media layers',
      'Alt-drag duplicate choreography for cards, nav rows and lists',
      'Synthesized typing, click and glass-piano sound effects',
    ],
    offers: [
      {
        '@type': 'Offer',
        name: 'Solo',
        price: '9.00',
        priceCurrency: 'USD',
        url: `${appUrl}/pricing`,
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Studio',
        price: '18.00',
        priceCurrency: 'USD',
        url: `${appUrl}/pricing`,
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Team',
        price: '36.00',
        priceCurrency: 'USD',
        url: `${appUrl}/pricing`,
        availability: 'https://schema.org/InStock',
      },
    ],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Swarm Rebuild',
    url: `${appUrl}/`,
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What does Swarm Rebuild do?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It turns any web page into a blank canvas, then animates a swarm of multiplayer cursors rebuilding the layout, text, media, borders and guides in front of you.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Swarm Rebuild send page data anywhere?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. The extension reads the page in your browser, keeps the snapshot in that tab and does not collect or transmit page content. Sound is synthesized locally.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which pages can the swarm rebuild?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Regular web pages work best. Chrome blocks chrome:// pages, the Web Store and the PDF viewer. Very long pages are capped at about 4,000 layers or 40,000 pixels.',
        },
      },
    ],
  };

  return (
    <>
      {[app, website, faq].map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
