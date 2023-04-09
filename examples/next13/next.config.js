/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['next-international', 'international-types'],
  output: 'export',
};

module.exports = nextConfig;
