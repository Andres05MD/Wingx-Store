/** @type {import('next').NextConfig} */

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.firebaseio.com https://*.googleapis.com https://*.firebaseapp.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://ik.imagekit.io https://ve.dolarapi.com https://firebasestorage.googleapis.com https://api.groq.com wss://api.groq.com",
  "img-src 'self' data: https://ik.imagekit.io https://firebasestorage.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "frame-src 'self'",
  "manifest-src 'self'",
  "media-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    experimental: {
        optimizePackageImports: [
            'lucide-react',
            'framer-motion',
            'date-fns',
        ],
    },
    images: {
        loader: 'custom',
        loaderFile: './src/lib/imagekitLoader.ts',
        formats: ['image/webp', 'image/avif'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ik.imagekit.io',
                port: '',
                pathname: '/**',
            },
        ],
    },
    onDemandEntries: {
        maxInactiveAge: 60 * 60 * 1000,
        pagesBufferLength: 5,
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'X-Powered-By', value: '' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    { key: 'Content-Security-Policy', value: csp },
                ],
            },
        ];
    },
};

export default nextConfig;
