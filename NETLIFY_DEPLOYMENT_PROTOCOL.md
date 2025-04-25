# Netlify Deployment Protocol

This document outlines the requirements and best practices for ensuring code is deployable on Netlify.

## Next.js Configuration

1. **next.config.mjs**:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'standalone',
     images: {
       unoptimized: true,
     },
     experimental: {
       serverActions: {
         allowedOrigins: ['localhost:3000', process.env.NEXT_PUBLIC_SITE_URL],
         bodySizeLimit: '2mb'
       }
     },
     env: {
       NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
     },
   };

   export default nextConfig;
   ```

2. **Image Optimization**:
   - Use `unoptimized: true` for images in next.config.mjs
   - Use the Next.js Image component with proper width and height
   - Implement proper loading strategies (lazy loading)

## TypeScript Compatibility

1. **Page Components**:
   ```typescript
   // Correct type definition for page components
   type Params = {
     locale: string
   }

   type SearchParams = {
     [key: string]: string | string[] | undefined
   }

   export default function PageComponent({ params }: { params: Params }) {
     // Component implementation
   }
   ```

2. **API Routes**:
   - Use proper request/response types
   - Implement proper error handling
   - Return appropriate status codes

3. **Server Components**:
   - Mark with 'use server' when needed
   - Use proper async/await patterns
   - Implement proper error handling

## Environment Variables

1. **Required Variables**:
   - `NEXT_PUBLIC_SITE_URL`: The public URL of the site
   - `MUNTRA_API_BASE_URL`: Base URL for Muntra API
   - `MUNTRA_API_KEY`: API key for Muntra
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

2. **Naming Conventions**:
   - Use `NEXT_PUBLIC_` prefix for client-side variables
   - Use descriptive names for all variables
   - Document all variables in .env.example

## Netlify Configuration

1. **netlify.toml**:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
     functions = "netlify/functions"

   [build.environment]
     NEXT_TELEMETRY_DISABLED = "1"
     NODE_VERSION = "18"

   [[plugins]]
     package = "@netlify/plugin-nextjs"

   [[headers]]
     for = "/*"
     [headers.values]
       Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
       Permissions-Policy = "camera=(), microphone=(), geolocation=()"
       Referrer-Policy = "strict-origin-when-cross-origin"
       X-Content-Type-Options = "nosniff"
       X-Frame-Options = "DENY"

   [[headers]]
     for = "/static/*"
     [headers.values]
       Cache-Control = "public, max-age=31536000, immutable"

   [[headers]]
     for = "/*.html"
     [headers.values]
       Cache-Control = "public, max-age=0, must-revalidate"
   ```

2. **Redirects**:
   - Implement proper redirects for client-side routing
   - Handle locale redirects correctly
   - Redirect www to non-www or vice versa

## Build Process

1. **package.json**:
   - Include all necessary dependencies
   - Use compatible versions
   - Include proper build scripts

2. **Dependencies**:
   - Use pnpm for package management
   - Lock dependency versions
   - Minimize dependencies

3. **Testing**:
   - Run build process locally before pushing
   - Check for TypeScript errors
   - Verify all routes work correctly

## Error Handling

1. **Error Boundaries**:
   - Implement proper error boundaries
   - Add fallbacks for failed data fetching
   - Include loading states

2. **API Error Handling**:
   - Return appropriate status codes
   - Include error messages
   - Log errors properly

## Performance Optimization

1. **Code Splitting**:
   - Use dynamic imports
   - Implement proper lazy loading
   - Minimize bundle size

2. **Caching**:
   - Implement proper caching strategies
   - Use appropriate cache headers
   - Optimize static assets

3. **Images**:
   - Use proper image formats
   - Implement responsive images
   - Optimize image loading

## Deployment Checklist

Before pushing code:

1. Run `pnpm build` locally
2. Check for TypeScript errors
3. Verify all routes work correctly
4. Test with different locales
5. Check for environment variables
6. Verify API routes
7. Test error handling
8. Check performance metrics

## Troubleshooting

Common issues and solutions:

1. **Build Failures**:
   - Check TypeScript errors
   - Verify environment variables
   - Check for missing dependencies

2. **Runtime Errors**:
   - Check for proper error handling
   - Verify API routes
   - Check for proper data fetching

3. **Performance Issues**:
   - Check bundle size
   - Verify image optimization
   - Check for unnecessary re-renders 