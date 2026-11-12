import { vi } from "vitest";

export class BrowserCookieJar extends EventTarget {
  values = new Map<string, { value: string; expires: number | null }>();
  writes: string[] = [];
  blockWrites = false;
  get cookie() {
    return [...this.values.entries()].filter(([, item]) => item.expires === null || item.expires > Date.now())
      .map(([name, item]) => `${name}=${item.value}`).join("; ");
  }
  set cookie(serialized: string) {
    this.writes.push(serialized);
    if (this.blockWrites) return;
    const [pair, ...attributes] = serialized.split("; ").map((value) => value.trim());
    const index = pair.indexOf("=");
    const name = pair.slice(0, index);
    const value = pair.slice(index + 1);
    const maxAge = attributes.find((attribute) => attribute.startsWith("Max-Age="));
    if (maxAge && Number(maxAge.slice(8)) <= 0) { this.values.delete(name); return; }
    this.values.set(name, { value, expires: maxAge ? Date.now() + Number(maxAge.slice(8)) * 1000 : null });
  }
}

export function installBrowserCookies() {
  const document = new BrowserCookieJar();
  const storage = new Map<string, string>();
  const location = new URL("https://blend.global/uk");
  const window = Object.assign(new EventTarget(), {
    location,
    localStorage: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value), removeItem: (key: string) => storage.delete(key) },
  });
  vi.stubGlobal("document", document);
  vi.stubGlobal("window", window);
  vi.stubGlobal("location", location);
  return { document, window, storage };
}
