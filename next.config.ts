import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // Standalone mode: Next.js creates a minimal bundle for production.
  // Docker image is about 10 times smaller than if you were to copy the entire `node_modules` directory.
  output: "standalone",
  devIndicators: false,
  allowedDevOrigins: ['172.21.208.1', '192.168.188.50'],
};

export default withNextIntl(nextConfig)