/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // You can add other image provider hostnames here if needed
    ],
  },
  // Add other Next.js configurations here if required
  // For example:
  // experimental: {
  //   typedRoutes: true,
  // },
};

export default nextConfig;
