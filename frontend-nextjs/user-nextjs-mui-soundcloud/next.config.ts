import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

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
    }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);