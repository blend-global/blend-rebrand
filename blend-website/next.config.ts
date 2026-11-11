import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      ...["services", "case-studies", "blog", "contact"].map((section) => ({
        source: `/${section}/:path*`, destination: `/za/${section}/:path*`, permanent: true,
      })),
      { source: "/:region(za|uk)/work/:path*", destination: "/:region/case-studies/:path*", permanent: true },
      { source: "/uk/contact-us", destination: "/uk/contact", permanent: true },
      {
        source: "/work",
        destination: "/za/case-studies",
        permanent: true,
      },
      {
        source: "/work/:slug",
        destination: "/za/case-studies/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
