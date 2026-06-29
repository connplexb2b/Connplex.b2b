import { MetadataRoute } from 'next';
import { readInvestors } from '@/lib/admin-investors';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.theconnplex.com'; 

  const staticRoutes = [
    '',
    '/about',
    '/advertise',
    '/book-event',
    '/capex-for-developers',
    '/contact',
    '/franchise-with-us',
    '/gameflix',
    '/products',
    '/refund-policy',
    '/spectra-x',
    '/all',
    '/career',
    '/case-studies',
    '/connair',
    '/connevents',
    '/connflix',
    '/connmusic',
    '/connplex-studio',
    '/conntube',
    '/downtown',
    '/ecosystem',
    '/faq',
    '/feedback',
    '/gallery',
    '/investor-section',
    '/investors',
    '/legal-notice',
    '/merchandise',
    '/news',
    '/privacy-policy',
    '/sky-inn',
    '/terms-and-conditions',
    '/franchiseads',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    const investors = await readInvestors();
    const dynamicEntries = investors.map(inv => {
      const slug = inv.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return {
        url: `${baseUrl}/investor-documents/${slug}`,
        lastModified: new Date(inv.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    });
    return [...sitemapEntries, ...dynamicEntries];
  } catch (e) {
    console.error('Failed to read investors for sitemap:', e);
    return sitemapEntries;
  }
}
