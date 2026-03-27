/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/task-gallery',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
