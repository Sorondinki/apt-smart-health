/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true, // Wannan ne zai gyara matsalar 404 wajen Refresh!
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
