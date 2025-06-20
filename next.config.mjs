/** @type {import('next').NextConfig} */
const nextConfig = {    experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default nextConfig;