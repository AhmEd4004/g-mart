/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    dynamicIO: true,
    serverActions: {
      bodySizeLimit: '6mb',
    }
  },
};

export default nextConfig;