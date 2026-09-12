import type { NextConfig } from "next";

// Media is served by Strapi (self-hosted, path configured via
// NEXT_PUBLIC_STRAPI_MEDIA_URL — see src/shared/lib/env.ts) rather than a
// managed image CDN, so the allowed remote host has to be declared here.
const mediaUrl = new URL(
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ?? "http://localhost:1337"
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: mediaUrl.protocol.replace(":", "") as "http" | "https",
        hostname: mediaUrl.hostname,
        port: mediaUrl.port,
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
    ],
  },
};

export default nextConfig;
