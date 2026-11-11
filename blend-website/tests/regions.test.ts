import { describe, expect, it } from "vitest";
import { isRegion, regionalPath, regions } from "@/lib/regions";
import { createPageMetadata } from "@/lib/seo";

describe("regional navigation", () => {
  it("keeps navigation in the chosen branch and switches equivalent pages", () => {
    expect(regionalPath("/", "uk")).toBe("/uk");
    expect(regionalPath("/services/video-production", "uk")).toBe("/uk/services/video-production");
    expect(regionalPath("/uk/blog/example?ref=nav#article", "za")).toBe("/za/blog/example?ref=nav#article");
    expect(regionalPath("/#about", "za")).toBe("/za#about");
    expect(regionalPath("/ukraine", "za")).toBe("/za/ukraine");
  });
  it("leaves CMS, APIs, assets, external URLs and fragments alone", () => {
    for (const path of ["/cms", "/cms/settings", "/api/contact", "/_next/image", "/logo.png", "https://example.com", "//example.com", "mailto:info@blend.global", "#about"]) {
      expect(regionalPath(path, "uk")).toBe(path);
    }
    expect(isRegion("uk")).toBe(true);
    expect(isRegion("gb")).toBe(false);
    expect(isRegion("invalid")).toBe(false);
  });
});

describe("regional search metadata", () => {
  it("publishes the UK canonical, correct locale and reciprocal regional alternatives", () => {
    const metadata = createPageMetadata({ title: "Contact", path: "/contact", region: "uk" });
    expect(metadata.alternates).toMatchObject({
      canonical: "https://blend.global/uk/contact",
      languages: { "en-ZA": "https://blend.global/za/contact", "en-GB": "https://blend.global/uk/contact" },
    });
    expect(metadata.openGraph).toMatchObject({ locale: "en_GB", url: "https://blend.global/uk/contact" });
  });
  it("connects regional homepages to the default chooser", () => {
    const metadata = createPageMetadata({ title: "Home", path: "/", region: "za" });
    expect(metadata.alternates).toMatchObject({ canonical: "https://blend.global/za", languages: { "x-default": "https://blend.global/" } });
  });
  it("does not present ZA accreditation or address as UK details", () => {
    expect(regions.uk.accreditation).toBe("");
    expect(regions.uk.address).toBe("");
    expect(regions.uk.socials.find(({ label }) => label === "LinkedIn")?.href).toContain("blend-uk");
  });
});
