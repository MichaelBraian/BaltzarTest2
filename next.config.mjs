/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true, // Required for Netlify deployment
  },
  experimental: {
    // Remove optimizeCss as it requires the critters package
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable static exports for Netlify
  output: 'export',
  // Disable server-side features not supported in static exports
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},
};

export default nextConfig;
