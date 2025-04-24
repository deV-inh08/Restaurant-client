import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  experimental: {
    staleTimes: {
      static: 60,
      dynamic: 30
    }
  }
};

export default nextConfig;
