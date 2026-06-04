import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  allowedDevOrigins: ['172.21.208.1', '192.168.188.50'],
  // PDFKit uses dynamic require() for font data — must not be bundled by webpack
  serverExternalPackages: ['pdfkit'],
};

export default withNextIntl(nextConfig)