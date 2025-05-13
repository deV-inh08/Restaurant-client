import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  experimental: {
    staleTimes: {
      static: 60,
      dynamic: 30
    },
  },
  images: {
    domains: ['localhost', 'www.google.com'], // 👈 Thêm dòng này
  },
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
