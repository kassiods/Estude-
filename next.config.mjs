/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The 'swcMinify' option was removed as it's not recognized
  // by Next.js 15.0.0-rc.0 and was causing startup errors.
  // SWC is generally the default in newer Next.js versions.
};

export default nextConfig;
