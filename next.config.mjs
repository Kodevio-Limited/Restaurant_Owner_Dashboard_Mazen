/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Required for Docker standalone build
  output: "standalone",

  images: {
    domains: ["placehold.co"],
  },
  webpack: (config) => {
    if (config.cache) config.cache = false;
    return config;
  },
};

export default nextConfig;