import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone режим: Next.js создаёт минимальный бандл для продакшна.
  // Docker-образ получается в ~10 раз меньше, чем если копировать node_modules целиком.
  output: "standalone",
};

export default nextConfig;
