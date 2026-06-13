/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
