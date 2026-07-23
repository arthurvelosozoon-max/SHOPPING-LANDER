import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Product image uploads go through a Server Action (uploadProductImageAction),
      // which itself caps files at 5MB — the framework default of 1MB was rejecting
      // the request before that validation ever ran.
      bodySizeLimit: "6mb",
    },
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
