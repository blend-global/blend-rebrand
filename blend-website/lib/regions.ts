export const regionCodes = ["za", "uk"] as const;
export type RegionCode = (typeof regionCodes)[number];
export const regionCookie = "blend-region";
export const regionCookieMaxAge = 60 * 60 * 24 * 365;

export function isRegion(value: unknown): value is RegionCode {
  return value === "za" || value === "uk";
}

export const regions = {
  za: {
    name: "South Africa", shortName: "ZA", locale: "en-ZA", currency: "ZAR",
    email: "info@blend.global", phone: "+27 21 448 8282",
    address: "33 Salt River Road, Salt River, Cape Town, South Africa, 7925",
    location: "Cape Town, South Africa", accreditation: "B-BBEE Level 1",
    bookingUrl: "", description: "Local understanding. Global possibilities.",
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/BLENDAfrica/" },
      { label: "Instagram", href: "https://www.instagram.com/blend.global" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/blend-eventlife/" },
    ],
  },
  uk: {
    name: "United Kingdom", shortName: "UK", locale: "en-GB", currency: "GBP",
    // Contact and social links carried over from the existing UK branch website.
    email: "contactEU@blend.global", phone: "+44 7340 050676", address: "", location: "United Kingdom", accreditation: "",
    bookingUrl: "https://meetings-eu1.hubspot.com/andysaunders/my-calendar",
    description: "Your UK team. A world of creativity.",
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61553346375316" },
      { label: "Instagram", href: "https://www.instagram.com/blend.digital.global/" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/blend-uk/" },
    ],
  },
} as const;

export function regionalPath(path: string, region: RegionCode): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const suffixIndex = path.search(/[?#]/);
  const pathname = suffixIndex < 0 ? path : path.slice(0, suffixIndex);
  const suffix = suffixIndex < 0 ? "" : path.slice(suffixIndex);
  if (/^\/(api|cms|_next)(\/|$)/.test(pathname) || /\.[^/]+$/.test(pathname)) return path;
  const stripped = pathname.replace(/^\/(za|uk)(?=\/|$)/, "");
  return `/${region}${stripped === "/" ? "" : stripped}${suffix}`;
}
