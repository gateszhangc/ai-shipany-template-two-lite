import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';

import { GalaxyStructuredData } from '@/shared/blocks/galaxy/structured-data';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'GalaxyAI Inc. — We build, acquire & scale iconic AI products',
  description:
    'GalaxyAI Inc. is the company behind Magica and Spiral. We build, acquire and scale iconic AI products to put the power of AI in everyone’s hands.',
  keywords:
    'GalaxyAI, Galaxy AI, Magica, Spiral, artificial intelligence company, AI products',
  canonicalUrl: '/',
  imageUrl: '/galaxy/og.jpg',
});

function MagicaGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="gx-product-glyph"
      viewBox="0 0 40 40"
      fill="none"
    >
      <path
        d="M20 3.5c.7 7.8 3.2 10.7 10.1 12.1C27.4 17.2 24 19.8 23 23.8c-.7-4.4-4.3-7.1-8.6-8C18.4 14.7 20.3 10 20 3.5Z"
        fill="currentColor"
      />
      <path
        d="M8.5 18.5c.7 4.9 2.5 7.1 6.9 8.1-3.4 1.4-5.5 3.8-6.1 7.4-.8-3.9-3.1-6.3-6.5-7.3 3.6-.8 5.3-3.7 5.6-8.2Z"
        fill="currentColor"
      />
      <circle cx="30.5" cy="29.5" r="4.5" fill="currentColor" />
    </svg>
  );
}

function SpiralGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="gx-product-glyph gx-product-glyph-spiral"
      viewBox="0 0 40 40"
      fill="none"
    >
      <path
        d="M20 34.2c7.8 0 14.2-6.4 14.2-14.2S27.8 5.8 20 5.8 5.8 12.2 5.8 20c0 4.3 3.5 7.8 7.8 7.8s7.8-3.5 7.8-7.8-3.5-7.8-7.8-7.8c-2.2 0-4 1.8-4 4s1.8 4 4 4c.9 0 1.7-.7 1.7-1.7S20.6 17 19.7 17"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <GalaxyStructuredData />

      <section className="gx-hero" aria-labelledby="mission-heading">
        <div className="gx-hero-art" aria-hidden="true" />
        <svg
          viewBox="0 0 1000 1000"
          aria-hidden="true"
          className="gx-hero-orbit"
          fill="none"
        >
          <circle cx="500" cy="500" r="120" strokeWidth="1" />
          <circle cx="500" cy="500" r="220" strokeWidth="1" />
          <circle cx="500" cy="500" r="330" strokeWidth="1" />
          <circle cx="500" cy="500" r="450" strokeWidth="1" />
        </svg>

        <div className="gx-hero-inner">
          <h1 id="mission-heading">
            We build, acquire &amp; scale <em>iconic</em> AI products
          </h1>
          <p>to put the power of AI in everyone&apos;s hands.</p>
        </div>
      </section>

      <section
        className="gx-products-wrap"
        id="products"
        aria-labelledby="products-heading"
      >
        <h2 className="gx-sr-only" id="products-heading">
          Our products
        </h2>
        <ul className="gx-products">
          <li>
            <a
              href="https://magica.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="gx-product-card"
            >
              <MagicaGlyph />
              <h3>Magica</h3>
              <p>Your AI worker to get things done.</p>
              <span>
                magica.com <i aria-hidden="true">↗</i>
              </span>
            </a>
          </li>
          <li>
            <a
              href="https://spiral.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="gx-product-card"
            >
              <SpiralGlyph />
              <h3>Spiral</h3>
              <p>Give your agent superpowers.</p>
              <span>
                spiral.ai <i aria-hidden="true">↗</i>
              </span>
            </a>
          </li>
          <li>
            <a
              href="https://go.galaxy.ai/linkedin"
              target="_blank"
              rel="noopener noreferrer"
              className="gx-product-card"
            >
              <Image
                src="/galaxy/logo-mark-128.png"
                alt=""
                width={40}
                height={40}
                className="gx-product-glyph gx-product-glyph-mark"
              />
              <h3>Enterprise</h3>
              <p>Put AI to work across your whole company.</p>
              <span>
                Talk to us <i aria-hidden="true">↗</i>
              </span>
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}
