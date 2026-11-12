import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { installBrowserCookies, type BrowserCookieJar } from "./browser-cookie-fixture";

let jar: BrowserCookieJar;
beforeEach(() => { vi.resetModules(); jar = installBrowserCookies().document; });
afterEach(() => vi.unstubAllGlobals());

describe("current-visit and remembered regions", () => {
  it("ignores inferred and obsolete long-term cookies", async () => {
    const { readRegionChoice } = await import("@/lib/region-preference");
    jar.cookie = "blend-region=za";
    jar.cookie = "blend-region-choice=uk";
    expect(readRegionChoice()).toBeNull();
  });
  it("uses explicit current-visit choices without persisting across visits", async () => {
    const { readRegionChoice, rememberRegionChoice } = await import("@/lib/region-preference");
    const { regionCookie, regionPreferenceCookie } = await import("@/lib/regions");
    rememberRegionChoice("uk");
    expect(readRegionChoice()).toBe("uk");
    expect(jar.writes).toContain(`${regionCookie}=uk; Path=/; SameSite=Lax; Secure`);
    expect(jar.cookie).not.toContain(`${regionPreferenceCookie}=`);
  });
  it("remembers a region only until its current consent expires", async () => {
    const prefs = await import("@/lib/cookie-preferences");
    const { rememberRegionChoice } = await import("@/lib/region-preference");
    const { regionPreferenceCookie } = await import("@/lib/regions");
    prefs.saveCookiePreferences({ rememberRegion: true, externalMedia: false });
    rememberRegionChoice("za");
    expect(jar.cookie).toContain(`${regionPreferenceCookie}=za`);
    expect(jar.writes.some((value) => value.startsWith(`${regionPreferenceCookie}=`) && value.includes("Max-Age="))).toBe(true);
  });
  it("does not let server redirects use persistent region memory without valid consent", async () => {
    const prefs = await import("@/lib/cookie-preferences");
    const { resolveRegionChoice } = await import("@/lib/region-preference");
    expect(resolveRegionChoice(undefined, "uk", undefined)).toBeNull();
    prefs.saveCookiePreferences({ rememberRegion: false, externalMedia: true });
    expect(resolveRegionChoice(undefined, "uk", JSON.stringify(prefs.readCookieChoice()))).toBeNull();
    prefs.saveCookiePreferences({ rememberRegion: true, externalMedia: false });
    const consent = JSON.stringify(prefs.readCookieChoice());
    expect(resolveRegionChoice(undefined, "uk", consent)).toBe("uk");
    expect(resolveRegionChoice("za", "uk", consent)).toBe("za");
    expect(resolveRegionChoice(undefined, "uk", consent, Date.now() + prefs.cookieConsentMaxAge * 1000 + 1)).toBeNull();
  });
});
