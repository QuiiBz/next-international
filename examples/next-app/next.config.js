/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['next-international', 'international-types'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  // Uncomment to set base path
  // basePath: '/base',
  // Uncomment to use SSG
  // output: 'export',
};

module.exports = nextConfig;
