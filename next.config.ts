/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["staging-lemangtulapi.naisu.my"], // Add your image domain here
    remotePatterns: [
      {
        protocol: "https",
        hostname: "staging-lemangtulapi.naisu.my",
        pathname: "/api/storage/menu_assets/**", // Adjust based on actual path
      },
    ],
  },
};

module.exports = nextConfig;
