import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import sharedServices from "@/content/services.json";
import { regionalServices, ukContent, ukServices } from "@/lib/regional-content";
import { switchRegionPath } from "@/lib/regional-navigation";
import { createPageMetadata } from "@/lib/seo";

describe("UK source content", () => {
  it("uses all eight published UK services without the ZA-only service catalogue", () => {
    const content = regionalServices("uk", sharedServices);
    expect(content.servicesContent.digital.map(({ label }) => label)).toEqual([
      "Digital Strategy & Consultation", "Web Design & Development", "Digital Marketing & Communications",
      "Social Media Marketing & Management", "Video Production", "Live Streaming",
      "Social Media Content Creation", "Social Impact & CSR Initiatives",
    ]);
    expect(content.servicesContent.experiential).toEqual([]);
    expect(content.serviceDetails["digital-strategy-consultation"].summary).toContain("comprehensive digital strategies");
    expect(content.serviceDetails["video-production"].summary).toContain("From concept development to filming and editing");
    expect(regionalServices("za", sharedServices)).toBe(sharedServices);
  });
  it("retains source messaging, About copy, and the published client list", () => {
    expect(ukContent.hero.lead + " " + ukContent.hero.impact).toBe("Connecting digital worlds, elevating brands");
    expect(ukContent.about.paragraphs).toHaveLength(2);
    expect(ukContent.about.paragraphs[0]).toContain("trailblazing digital agency");
    expect(ukContent.clients.map(({ alt }) => alt)).toEqual(["Zip Zap", "Google", "Deloitte", "YouTube", "Google cloud", "Shoprite", "Geberit", "Empact Group", "2U"]);
    for (const client of ukContent.clients) expect(existsSync(path.join(process.cwd(), "public", client.src))).toBe(true);
    expect(ukContent.source.homepage).toBe("https://blend.global/uk/");
    expect(Object.keys(ukServices.serviceDetails)).toHaveLength(8);
  });
});

describe("switching different regional service catalogues", () => {
  it("keeps shared services and falls back to the listing for unavailable services", () => {
    expect(switchRegionPath("/za/services/video-production", "uk")).toBe("/uk/services/video-production");
    expect(switchRegionPath("/za/services/staffing", "uk")).toBe("/uk/services");
    expect(switchRegionPath("/uk/services/digital-strategy-consultation", "za")).toBe("/za/services");
    expect(switchRegionPath("/uk/contact", "za")).toBe("/za/contact");
    expect(switchRegionPath("/za/case-studies/google-cloud-x-blend", "uk")).toBe("/uk");
  });
  it("does not publish an alternate URL for a UK-only service", () => {
    const metadata = createPageMetadata({ title: "Strategy", region: "uk", path: "/services/digital-strategy-consultation", regionalAlternates: false });
    expect(metadata.alternates?.languages).toEqual({ "en-GB": "https://blend.global/uk/services/digital-strategy-consultation" });
  });
});
