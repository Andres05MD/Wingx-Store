/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
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
};

export default nextConfig;
