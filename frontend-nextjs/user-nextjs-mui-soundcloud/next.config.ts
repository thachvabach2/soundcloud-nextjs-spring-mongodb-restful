import type { NextConfig } from "next";

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

export default nextConfig;