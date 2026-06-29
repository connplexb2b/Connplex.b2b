import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.theconnplex.com'; 

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/scratch/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
