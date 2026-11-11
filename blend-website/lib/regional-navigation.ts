import sharedServices from "@/content/services.json";
import { regionalServices } from "@/lib/regional-content";
import { regionalPath, type RegionCode } from "@/lib/regions";

export function switchRegionPath(path: string, region: RegionCode): string {
  const localized = regionalPath(path, region);
  if (region === "uk" && /^\/uk\/(case-studies|blog)(\/|$)/.test(localized)) return "/uk";
  const service = localized.match(/^\/(za|uk)\/services\/([^/?#]+)(?:[?#].*)?$/);
  if (!service) return localized;
  const catalogue = regionalServices(region, sharedServices).servicesContent;
  const available = [...catalogue.digital, ...catalogue.experiential].some(({ slug }) => encodeURIComponent(slug) === service[2]);
  return available ? localized : `/${region}/services`;
}
