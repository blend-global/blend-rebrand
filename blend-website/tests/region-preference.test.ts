import { afterEach, describe, expect, it, vi } from "vitest";
import { readRegionChoice, rememberRegionChoice } from "@/lib/region-preference";
import { regionCookie } from "@/lib/regions";

afterEach(() => vi.unstubAllGlobals());

describe("explicit region preferences", () => {
  it("does not treat an old page-inferred cookie as a choice", () => {
    vi.stubGlobal("document", { cookie: "blend-region=za" });
    expect(readRegionChoice()).toBeNull();
  });
  it("accepts valid explicit choices and ignores invalid values", () => {
    for (const code of ["za", "uk"]) {
      vi.stubGlobal("document", { cookie: `other=value; ${regionCookie}=${code}` });
      expect(readRegionChoice()).toBe(code);
    }
    vi.stubGlobal("document", { cookie: `${regionCookie}=unknown` });
    expect(readRegionChoice()).toBeNull();
  });
  it("remembers an explicit choice using a site-wide preference cookie", () => {
    const document = { cookie: "" };
    vi.stubGlobal("document", document);
    vi.stubGlobal("location", { protocol: "https:" });
    rememberRegionChoice("uk");
    expect(document.cookie).toBe(`${regionCookie}=uk; Path=/; Max-Age=31536000; SameSite=Lax; Secure`);
  });
});
