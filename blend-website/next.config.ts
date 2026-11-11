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
        source: `/${section}`, destination: `/za/${section}`, permanent: true,
      })),
      ...["services", "case-studies", "blog"].map((section) => ({
        source: `/${section}/:slug([a-z0-9-]+)`, destination: `/za/${section}/:slug`, permanent: true,
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
  async rewrites() {
    return {
      beforeFiles: [{
        // Recover requests from browsers that cached the previous broad 308 redirects.
        // Serve these asset aliases directly to avoid a redirect loop back to the original URL.
        source: "/:region(za|uk)/:section(services|case-studies|blog)/:assetPath(.+\\.(?:avif|webp|png|jpe?g|gif|svg|mp4|webm))",
        destination: "/:section/:assetPath",
      }],
    };
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
