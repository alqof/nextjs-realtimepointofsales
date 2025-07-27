import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    }
  },
  devIndicators: false,
  images: {
    domains: ["https://pknnjvbehmdpfuxtirjg.supabase.co"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pknnjvbehmdpfuxtirjg.supabase.co',
        port: '',
        pathname: '/**',
      }
    ]
  }
};

export default nextConfig;
