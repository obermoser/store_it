import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'img.freepik.com/**'
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io"
      }
    ]
  }
};

export default nextConfig;
