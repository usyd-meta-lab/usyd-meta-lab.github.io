/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/task-gallery',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
