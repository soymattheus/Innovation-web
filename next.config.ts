import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgprodutos.s3.us-east-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
