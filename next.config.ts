import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Dev server on port 3001 to avoid conflict with backend on 3000 */
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
