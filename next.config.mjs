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
};

export default nextConfig;
