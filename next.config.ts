import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')


const nextConfig: NextConfig = {
  // Standalone режим: Next.js создаёт минимальный бандл для продакшна.
  // Docker-образ получается в ~10 раз меньше, чем если копировать node_modules целиком.
  output: "standalone",
  devIndicators: false,
};

// export default nextConfig;
export default withNextIntl(nextConfig)