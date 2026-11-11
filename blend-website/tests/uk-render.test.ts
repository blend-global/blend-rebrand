import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.stubGlobal("React", React);
vi.mock("next/navigation", () => ({
  useParams: () => ({ region: "uk" }), usePathname: () => "/uk", useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/lib/cms-server", () => ({ readCmsSection: vi.fn(() => { throw new Error("UK homepage must not read ZA CMS content"); }) }));
vi.mock("@/components/Reveal", () => ({ default: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children) }));

import Home from "@/app/[region]/page";
import ServicesPage from "@/app/[region]/services/page";
import ProjectInquiryForm from "@/components/ProjectInquiryForm";
import ProjectModalProvider from "@/components/ProjectModalProvider";
import ServiceDetailPage from "@/app/[region]/services/[slug]/page";

let home: string;
beforeAll(async () => {
  home = renderToStaticMarkup(await Home({ params: Promise.resolve({ region: "uk" }) }));
});

describe("rendered UK experience", () => {
  it("renders UK source messaging and clients instead of the ZA homepage sections", () => {
    expect(home).toContain("Connecting digital worlds,");
    expect(home).toContain("elevating brands");
    expect(home).toContain("trailblazing digital agency");
    expect(home).toContain("Social Impact &amp; CSR Initiatives");
    expect(home).toContain("/uk/clients/2U-Logo.svg");
    expect(home).toContain("contactEU@blend.global");
    expect(home).not.toContain("B-BBEE");
    expect(home).not.toContain("Renders to Reality");
    expect(home).not.toContain("33 Salt River Road");
    expect(home).not.toContain("/uk/case-studies");
  });
  it("renders the same UK catalogue in service listings and project enquiries", () => {
    for (const element of [React.createElement(ServicesPage), React.createElement(ProjectInquiryForm)]) {
      const html = renderToStaticMarkup(element);
      expect(html).toContain("Digital Strategy &amp; Consultation");
      expect(html).toContain("Social Impact &amp; CSR Initiatives");
      expect(html).not.toContain("Guest Logistics");
      expect(html).not.toContain("Food &amp; Beverage");
    }
  });
  it("renders the original UK service description without ZA portfolio images or invented deliverables", async () => {
    const html = renderToStaticMarkup(React.createElement(ProjectModalProvider, null, await ServiceDetailPage({ params: Promise.resolve({ region: "uk", slug: "video-production" }) })));
    expect(html).toContain("From concept development to filming and editing");
    expect(html).toContain("Book a Call");
    expect(html).not.toContain("/case-studies/videos/");
    expect(html).not.toContain("Structured deliverables tailored to your goals");
  });
});
