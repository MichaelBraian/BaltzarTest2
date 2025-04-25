/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', process.env.NEXT_PUBLIC_SITE_URL, '*.netlify.app'],
      bodySizeLimit: '2mb'
    }
  },
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/sv',
        permanent: true,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export default nextConfig;
