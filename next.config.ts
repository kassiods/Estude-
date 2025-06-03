import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: [
    '9003-firebase-studio-1748989356421.cluster-uf6urqn4lned4spwk4xorq6bpo.cloudworkstations.dev',
    // The backend URL might also be relevant if there are dev-time interactions, keeping it as per previous suggestions.
    '3001-firebase-studio-1748989356421.cluster-uf6urqn4lned4spwk4xorq6bpo.cloudworkstations.dev',
  ],
};

export default nextConfig;
