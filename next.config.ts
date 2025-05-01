import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  experimental: {
    staleTimes: {
      static: 60,
      dynamic: 30
    }
  },
  images: {
    domains: ['localhost'], // 👈 Thêm dòng này
  },
};

export default nextConfig;
