import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1b2pdd8bvo7rr.cloudfront.net',
        pathname: '/**',
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: '/franchise',
        destination: '/franchise-with-us',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;