import { MetadataRoute } from 'next';

import { envConfigs } from '@/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (envConfigs.app_url || 'https://udioai.lol').replace(/\/$/, '');
  const lastModified = new Date();

  return [
    { url: `${base}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/pricing`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    {
      url: `${base}/terms-of-service`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${base}/privacy-policy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];
}
