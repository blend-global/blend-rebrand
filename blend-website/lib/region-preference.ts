import { isRegion, regionCookie, regionPreferenceCookie, type RegionCode } from "@/lib/regions";
import { parseCookieChoice, readCookieChoice } from "@/lib/cookie-preferences";
import { deleteBrowserCookie, readBrowserCookie, writeBrowserCookie } from "@/lib/browser-cookies";

export function resolveRegionChoice(session: string | null | undefined, remembered: string | null | undefined, consent: string | null | undefined, now = Date.now()): RegionCode | null {
  if (isRegion(session)) return session;
  return parseCookieChoice(consent, now)?.rememberRegion && isRegion(remembered) ? remembered : null;
}

export function readRegionChoice(): RegionCode | null {
  const session = readBrowserCookie(regionCookie);
  if (isRegion(session)) return session;
  const remembered = readBrowserCookie(regionPreferenceCookie);
  return readCookieChoice()?.rememberRegion && isRegion(remembered) ? remembered : null;
}

export function rememberRegionChoice(region: RegionCode) {
  writeBrowserCookie(regionCookie, region);
  const consent = readCookieChoice();
  if (consent?.rememberRegion) writeBrowserCookie(regionPreferenceCookie, region, (consent.expiresAt - Date.now()) / 1000);
  else if (readBrowserCookie(regionPreferenceCookie)) deleteBrowserCookie(regionPreferenceCookie);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("blend:region-choice"));
}

export function subscribeRegionChoice(onChange: () => void) {
  window.addEventListener("blend:region-choice", onChange);
  window.addEventListener("focus", onChange);
  return () => {
    window.removeEventListener("blend:region-choice", onChange);
    window.removeEventListener("focus", onChange);
  };
}
