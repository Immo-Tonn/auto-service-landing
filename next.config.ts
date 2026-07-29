import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  allowedDevOrigins: ['172.21.208.1', '192.168.188.50'],
  // PDFKit uses dynamic require() for font data — must not be bundled by webpack
  serverExternalPackages: ['pdfkit'],
  // next-auth/react reads NEXTAUTH_URL at module load time in the browser bundle too;
  // without this it falls back to a hardcoded http://localhost:3000 default (see
  // node_modules/next-auth/utils/parse-url.js), breaking signOut() in production.
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // Fallback so signOut() still works even if NEXTAUTH_URL isn't set in
    // Vercel's project settings — VERCEL_URL is provided automatically.
    VERCEL_URL: process.env.VERCEL_URL,
  },
};

export default withNextIntl(nextConfig)