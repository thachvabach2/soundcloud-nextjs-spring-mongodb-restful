import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
    /* config options here */
    // docker
    output: "standalone",
    images: {
        remotePatterns: [new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/**`)]
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb',
        }
    },
    async rewrites() {
        if (isDev) {
            return [
                {
                    source: '/backend-for-client/:path*',
                    destination: `${process.env.SPRING_BACKEND_URL || 'http://localhost:8080'}/:path*`,
                },
            ];
        }

        return [];
    },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);