import { deleteBrowserCookie, readBrowserCookie, writeBrowserCookie } from "@/lib/browser-cookies";
import { isRegion, regionCookie, regionPreferenceCookie } from "@/lib/regions";

export const cookiePreferencesKey = "blend-cookie-preferences-v2";
export const cookiePreferencesEvent = "blend:cookie-preferences";
export const openCookiePreferencesEvent = "blend:open-cookie-preferences";
export const cookieConsentMaxAge = 60 * 60 * 24 * 180;
export type CookieOptions = { rememberRegion: boolean; externalMedia: boolean };
export type CookieChoice = CookieOptions & { version: 2; updatedAt: number; expiresAt: number };
let sessionChoice: CookieChoice | null = null;
let dialogOpen = false;
const consentChannel = "blend-cookie-preferences";

function openConsentChannel(): BroadcastChannel | null {
  try {
    return typeof window !== "undefined" && "BroadcastChannel" in window ? new BroadcastChannel(consentChannel) : null;
  } catch { return null; }
}

export function parseCookieChoice(value: string | null | undefined, now = Date.now()): CookieChoice | null {
  if (!value) return null;
  try {
    const choice = JSON.parse(decodeURIComponent(value));
    if (choice?.version !== 2 || typeof choice.rememberRegion !== "boolean" || typeof choice.externalMedia !== "boolean"
      || !Number.isFinite(choice.updatedAt) || !Number.isFinite(choice.expiresAt)
      || choice.updatedAt > now || choice.expiresAt <= now
      || choice.expiresAt !== choice.updatedAt + cookieConsentMaxAge * 1000) return null;
    return choice;
  } catch { return null; }
}

export function readCookieChoice(): CookieChoice | null {
  if (typeof window === "undefined") return null;
  const stored = readBrowserCookie(cookiePreferencesKey);
  // Only use the in-memory choice when browser storage rejected the write.
  return stored ? parseCookieChoice(stored) : parseCookieChoice(sessionChoice && JSON.stringify(sessionChoice));
}

export function hasCookieChoice() { return readCookieChoice() !== null; }
export function externalMediaAllowed() { return readCookieChoice()?.externalMedia === true; }

export function saveCookiePreferences(options: CookieOptions) {
  const updatedAt = Date.now();
  const choice: CookieChoice = { ...options, version: 2, updatedAt, expiresAt: updatedAt + cookieConsentMaxAge * 1000 };
  const serialized = JSON.stringify(choice);
  writeBrowserCookie(cookiePreferencesKey, serialized, cookieConsentMaxAge);
  sessionChoice = readBrowserCookie(cookiePreferencesKey) ? null : choice;

  const selected = readBrowserCookie(regionCookie) ?? readBrowserCookie(regionPreferenceCookie);
  const routeRegion = typeof location === "undefined" ? null : location.pathname.split("/")[1];
  const region = isRegion(selected) ? selected : options.rememberRegion && isRegion(routeRegion) ? routeRegion : null;
  if (region) writeBrowserCookie(regionCookie, region); // Current visit only.
  if (region && options.rememberRegion) writeBrowserCookie(regionPreferenceCookie, region, cookieConsentMaxAge);
  else deleteBrowserCookie(regionPreferenceCookie);

  window.dispatchEvent(new Event(cookiePreferencesEvent));
  window.dispatchEvent(new Event("blend:region-choice"));
  const channel = openConsentChannel();
  channel?.postMessage("changed");
  channel?.close();
}

export function removeLegacyCookiePreferences() {
  for (const name of ["blend-region", "blend-region-choice"]) {
    if (readBrowserCookie(name)) deleteBrowserCookie(name);
  }
  try { window.localStorage.removeItem("blend-cookie-preferences-v1"); } catch { /* Storage may be unavailable. */ }
  if (!readCookieChoice()) {
    if (readBrowserCookie(cookiePreferencesKey)) deleteBrowserCookie(cookiePreferencesKey);
    if (readBrowserCookie(regionPreferenceCookie)) deleteBrowserCookie(regionPreferenceCookie);
  }
}

export function subscribeCookiePreferences(callback: () => void) {
  const channel = openConsentChannel();
  channel?.addEventListener("message", callback);
  window.addEventListener(cookiePreferencesEvent, callback);
  window.addEventListener("storage", callback);
  window.addEventListener("focus", callback);
  document.addEventListener("visibilitychange", callback);
  return () => {
    channel?.close();
    window.removeEventListener(cookiePreferencesEvent, callback);
    window.removeEventListener("storage", callback);
    window.removeEventListener("focus", callback);
    document.removeEventListener("visibilitychange", callback);
  };
}

export function cookiePreferencesOpen() { return dialogOpen; }
export function showCookiePreferences() {
  dialogOpen = true;
  window.dispatchEvent(new Event(openCookiePreferencesEvent));
}
export function closeCookiePreferences() {
  dialogOpen = false;
  window.dispatchEvent(new Event(openCookiePreferencesEvent));
}
export function subscribeCookieDialog(callback: () => void) {
  window.addEventListener(openCookiePreferencesEvent, callback);
  return () => window.removeEventListener(openCookiePreferencesEvent, callback);
}
