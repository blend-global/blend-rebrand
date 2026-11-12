import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { installBrowserCookies, type BrowserCookieJar } from "./browser-cookie-fixture";

let jar: BrowserCookieJar;
beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-11T20:00:00Z"));
  jar = installBrowserCookies().document;
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe("versioned cookie consent", () => {
  it("defaults both optional purposes to off until a decision is made", async () => {
    const prefs = await import("@/lib/cookie-preferences");
    expect(prefs.hasCookieChoice()).toBe(false);
    expect(prefs.externalMediaAllowed()).toBe(false);
    expect(prefs.readCookieChoice()).toBeNull();
  });
  it("remembers essential-only decisions without granting optional consent", async () => {
    const prefs = await import("@/lib/cookie-preferences");
    prefs.saveCookiePreferences({ rememberRegion: false, externalMedia: false });
    expect(prefs.hasCookieChoice()).toBe(true);
    expect(prefs.externalMediaAllowed()).toBe(false);
    expect(prefs.readCookieChoice()).toMatchObject({ version: 2, rememberRegion: false, externalMedia: false });
    expect(jar.writes.some((value) => value.includes("Max-Age=15552000"))).toBe(true);
  });
  it("allows purposes independently and preserves the current visit when consent is withdrawn", async () => {
    const prefs = await import("@/lib/cookie-preferences");
    const { regionCookie, regionPreferenceCookie } = await import("@/lib/regions");
    prefs.saveCookiePreferences({ rememberRegion: true, externalMedia: false });
    expect(prefs.externalMediaAllowed()).toBe(false);
    expect(jar.cookie).toContain(`${regionPreferenceCookie}=uk`);
    prefs.saveCookiePreferences({ rememberRegion: false, externalMedia: true });
    expect(prefs.externalMediaAllowed()).toBe(true);
    expect(jar.cookie).not.toContain(`${regionPreferenceCookie}=`);
    expect(jar.cookie).toContain(`${regionCookie}=uk`);
  });
  it("retains valid consent across module reloads without relying on memory", async () => {
    const prefs = await import("@/lib/cookie-preferences");
    prefs.saveCookiePreferences({ rememberRegion: true, externalMedia: true });
    vi.resetModules();
    const reloaded = await import("@/lib/cookie-preferences");
    expect(reloaded.hasCookieChoice()).toBe(true);
    expect(reloaded.externalMediaAllowed()).toBe(true);
  });
  it("requires a fresh decision after six months", async () => {
    const prefs = await import("@/lib/cookie-preferences");
    prefs.saveCookiePreferences({ rememberRegion: true, externalMedia: true });
    vi.advanceTimersByTime(prefs.cookieConsentMaxAge * 1000 + 1);
    expect(prefs.hasCookieChoice()).toBe(false);
    expect(prefs.externalMediaAllowed()).toBe(false);
  });
  it("does not infer consent after browser cookies are cleared", async () => {
    const prefs = await import("@/lib/cookie-preferences");
    prefs.saveCookiePreferences({ rememberRegion: true, externalMedia: true });
    jar.values.clear();
    expect(prefs.hasCookieChoice()).toBe(false);
    expect(prefs.externalMediaAllowed()).toBe(false);
  });
  it.each(["null", "{}", "invalid", '{"version":1,"externalMedia":true}', '{"version":3,"externalMedia":true}', '{"externalMedia":"true"}'])("rejects invalid or obsolete consent %s", async (value) => {
    const prefs = await import("@/lib/cookie-preferences");
    jar.cookie = `${prefs.cookiePreferencesKey}=${encodeURIComponent(value)}`;
    expect(prefs.hasCookieChoice()).toBe(false);
    expect(prefs.externalMediaAllowed()).toBe(false);
  });
  it("rejects records whose embedded expiry or purpose version has changed", async () => {
    const prefs = await import("@/lib/cookie-preferences");
    prefs.saveCookiePreferences({ rememberRegion: true, externalMedia: true });
    const valid = prefs.readCookieChoice()!;
    expect(prefs.parseCookieChoice(JSON.stringify({ ...valid, version: 1 }))).toBeNull();
    expect(prefs.parseCookieChoice(JSON.stringify({ ...valid, expiresAt: valid.expiresAt + 1000 }))).toBeNull();
    expect(prefs.parseCookieChoice(JSON.stringify(valid), valid.expiresAt + 1)).toBeNull();
  });
  it("applies explicit choices for the current session if browser cookies are blocked", async () => {
    const prefs = await import("@/lib/cookie-preferences");
    jar.blockWrites = true;
    prefs.saveCookiePreferences({ rememberRegion: false, externalMedia: true });
    expect(prefs.hasCookieChoice()).toBe(true);
    expect(prefs.externalMediaAllowed()).toBe(true);
    prefs.saveCookiePreferences({ rememberRegion: false, externalMedia: false });
    expect(prefs.externalMediaAllowed()).toBe(false);
  });
  it("removes the old region memory and video-only consent without migrating optional permission", async () => {
    const prefs = await import("@/lib/cookie-preferences");
    jar.cookie = "blend-region-choice=uk";
    window.localStorage.setItem("blend-cookie-preferences-v1", '{"externalMedia":true}');
    prefs.removeLegacyCookiePreferences();
    expect(jar.cookie).not.toContain("blend-region-choice=");
    expect(window.localStorage.getItem("blend-cookie-preferences-v1")).toBeNull();
    expect(prefs.hasCookieChoice()).toBe(false);
  });
});
