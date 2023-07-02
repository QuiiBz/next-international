/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['next-international', 'international-types'],
  // Uncomment to use SSG
  // output: 'export',
};

module.exports = nextConfig;
