import { isRegion, regionCookie, regionCookieMaxAge, type RegionCode } from "@/lib/regions";

export function readRegionChoice(): RegionCode | null {
  if (typeof document === "undefined") return null;
  const value = document.cookie.split(";").map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${regionCookie}=`))?.slice(regionCookie.length + 1);
  return isRegion(value) ? value : null;
}

export function rememberRegionChoice(region: RegionCode) {
  document.cookie = `${regionCookie}=${region}; Path=/; Max-Age=${regionCookieMaxAge}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
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
