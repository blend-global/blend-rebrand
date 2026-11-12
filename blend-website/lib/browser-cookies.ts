export function readBrowserCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  try {
    return document.cookie.split(";").map((entry) => entry.trim())
      .find((entry) => entry.startsWith(`${name}=`))?.slice(name.length + 1) ?? null;
  } catch { return null; }
}

export function writeBrowserCookie(name: string, value: string, maxAge?: number) {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  try {
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/${maxAge === undefined ? "" : `; Max-Age=${Math.max(0, Math.floor(maxAge))}`}; SameSite=Lax${secure}`;
  } catch { /* Optional preferences still apply in memory when cookies are blocked. */ }
}

export function deleteBrowserCookie(name: string) { writeBrowserCookie(name, "", 0); }
