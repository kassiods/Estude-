
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // Recommended to set to false for production
  },
  eslint: {
    ignoreDuringBuilds: true, // Recommended to set to false for production
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Add your image storage domains here if any (e.g., Supabase Storage)
      // {
      //   protocol: 'https',
      //   hostname: 'yolcllzsszjltqnkucqk.supabase.co',
      // },
    ],
  },
};

export default nextConfig;
