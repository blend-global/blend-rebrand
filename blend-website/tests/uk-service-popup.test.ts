import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ComponentProps, MouseEvent } from "react";

const state = vi.hoisted(() => ({
  region: "uk", openService: vi.fn(), handler: undefined as undefined | ((event: MouseEvent<HTMLAnchorElement>) => void),
}));
vi.stubGlobal("React", React);
vi.mock("next/navigation", () => ({ useParams: () => ({ region: state.region }) }));
vi.mock("@/components/regions/UkServiceModalProvider", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/components/regions/UkServiceModalProvider")>();
  return { ...original, useUkServiceModal: () => state.openService };
});
vi.mock("next/link", () => ({ default: ({ children, ...props }: ComponentProps<"a">) => {
  state.handler = props.onClick;
  return React.createElement("a", props, children);
} }));

import RegionLink from "@/components/regions/RegionLink";
import { UkServiceDialog } from "@/components/regions/UkServiceModalProvider";
import { ukContent } from "@/lib/regional-content";
import { regions } from "@/lib/regions";

function click(overrides: Partial<MouseEvent<HTMLAnchorElement>> = {}) {
  const event = {
    button: 0, defaultPrevented: false, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false,
    preventDefault: vi.fn(function (this: { defaultPrevented: boolean }) { this.defaultPrevented = true; }),
    ...overrides,
  } as unknown as MouseEvent<HTMLAnchorElement>;
  state.handler?.(event);
  return event;
}

beforeEach(() => { state.region = "uk"; state.openService.mockClear(); state.handler = undefined; });

describe("UK-only service popups", () => {
  it("opens each UK service in a dialog while keeping a real fallback URL", () => {
    for (const service of ukContent.services) {
      const html = renderToStaticMarkup(React.createElement(RegionLink, { href: `/services/${service.slug}` }, service.label));
      expect(html).toContain('aria-haspopup="dialog"');
      expect(html).toContain(`href="/uk/services/${service.slug}"`);
      const event = click();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(state.openService).toHaveBeenLastCalledWith(service.slug);
    }
  });
  it("keeps South African service links as ordinary page navigation", () => {
    state.region = "za";
    const html = renderToStaticMarkup(React.createElement(RegionLink, { href: "/services/video-production" }, "Video"));
    expect(html).toContain('href="/za/services/video-production"');
    expect(html).not.toContain("aria-haspopup");
    expect(click().preventDefault).not.toHaveBeenCalled();
    expect(state.openService).not.toHaveBeenCalled();
  });
  it("preserves modified clicks, other navigation, and caller cancellation", () => {
    renderToStaticMarkup(React.createElement(RegionLink, { href: "/services/video-production" }, "Video"));
    for (const modifier of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) expect(click(modifier).preventDefault).not.toHaveBeenCalled();
    expect(state.openService).not.toHaveBeenCalled();
    renderToStaticMarkup(React.createElement(RegionLink, { href: "/contact" }, "Contact"));
    expect(click().preventDefault).not.toHaveBeenCalled();
    renderToStaticMarkup(React.createElement(RegionLink, { href: "/services/video-production", onClick: (event) => event.preventDefault() }, "Video"));
    click();
    expect(state.openService).not.toHaveBeenCalled();
  });
  it("provides the complete source description, booking link and accessible close control", () => {
    const service = ukContent.services.find(({ slug }) => slug === "social-media-content-creation")!;
    const html = renderToStaticMarkup(React.createElement(UkServiceDialog, { service, onClose: vi.fn() }));
    expect(html).toContain('<dialog');
    expect(html).toContain('aria-labelledby="uk-service-title"');
    expect(html).toContain('aria-label="Close service details"');
    expect(html).toContain(service.summary);
    expect(html).toContain(regions.uk.bookingUrl);
    expect(html).toContain("Book a Call");
  });
});
