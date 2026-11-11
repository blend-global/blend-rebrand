import type { MetadataRoute } from "next";
import { readCmsSection } from "@/lib/cms-server";
import { getAllServices } from "@/lib/cms-helpers";
import { regionCodes, regionalPath } from "@/lib/regions";
import { regionalServices } from "@/lib/regional-content";
import { siteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, work, blog] = await Promise.all([
    readCmsSection("services"), readCmsSection("work"), readCmsSection("blog"),
  ]);
  const commonPaths = ["/", "/services", "/contact"];
  const globalPaths = [
    "/case-studies", "/blog",
    ...work.map(({ slug }) => `/case-studies/${encodeURIComponent(slug)}`),
    ...[...blog.featured, ...blog.posts].filter(({ slug }) => slug !== "view-all").map(({ slug }) => `/blog/${encodeURIComponent(slug)}`),
  ];
  const pathsForRegion = (region: string) => [...new Set([
    ...commonPaths,
    ...(region === "za" ? globalPaths : []),
    ...getAllServices(regionalServices(region, services)).map(({ slug }) => `/services/${encodeURIComponent(slug)}`),
  ])];
  const paths = { za: pathsForRegion("za"), uk: pathsForRegion("uk") };
  return [{ url: siteUrl.href }, ...regionCodes.flatMap((region) => paths[region].map((path) => ({
    url: new URL(regionalPath(path, region), siteUrl).href,
    alternates: { languages: Object.fromEntries(regionCodes
      .filter((alternate) => paths[alternate].includes(path))
      .map((alternate) => [alternate === "za" ? "en-ZA" : "en-GB", new URL(regionalPath(path, alternate), siteUrl).href])),
    },
  })))];
}
