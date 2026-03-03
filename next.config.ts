import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: `${process.env.SERVER_URL || 'http://localhost:8080'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
