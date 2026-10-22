import { readFile, readdir, access, mkdir, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

// Run against a production build: npm run build && npm run start -- --port 3100
const base = new URL(process.env.PERFORMANCE_BASE_URL || "http://localhost:3100");
if (!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)) {
  throw new Error("The concurrent request check is restricted to localhost.");
}
const output = "artifacts/performance";
await mkdir(output, { recursive: true });
const manifest = JSON.parse(await readFile(".next/prerender-manifest.json", "utf8"));
const pages = Object.keys(manifest.routes).filter((p) => !p.startsWith("/_") && p !== "/favicon.ico");
const checks = [];
async function check(path, expectedStatus = 200, options = {}) {
  const start = performance.now();
  try {
    const response = await fetch(new URL(path, base), {
      redirect: "manual", signal: AbortSignal.timeout(20000), ...options,
    });
    const body = await response.arrayBuffer();
    checks.push({ path, expectedStatus, status: response.status, passed: response.status === expectedStatus,
      ms: Math.round(performance.now() - start), bytes: body.byteLength,
      cacheControl: response.headers.get("cache-control"), location: response.headers.get("location") });
  } catch (error) {
    checks.push({ path, passed: false, error: error.message });
  }
}
for (const page of pages) await check(page);
for (const section of ["work", "services", "blog"]) await check(`/api/cms/${section}`);
await check("/api/cms/invalid", 404);
await check("/missing-performance-test", 404);
await check("/work", 308);
await check("/work/google-cloud-x-blend", 308);
// Invalid payloads return before the mail transport is reached; no email is sent.
await check("/api/contact", 400, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
await check("/hero-video/hero-video-720p.mp4", 206, { headers: { Range: "bytes=0-1023" } });
await check("/hero-video/hero-poster.webp");
await check("/_next/image?url=%2Fhero-video%2Fhero-poster.webp&w=640&q=75");

const assets = new Set();
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await scan(file);
    else if (/\.(tsx?|json|css)$/.test(file)) {
      const source = await readFile(file, "utf8");
      for (const match of source.matchAll(/["'`](\/[^"'`\n]+\.(?:png|jpe?g|webp|svg|mp4|ico))["'`]/g)) {
        if (!match[1].includes("${")) assets.add(match[1]);
      }
    }
  }
}
for (const dir of ["app", "components", "lib", "content"]) await scan(dir);
const missingAssets = [];
for (const src of assets) {
  try { await access(`public${decodeURIComponent(src)}`); }
  catch { missingAssets.push(src); }
}
// Include the generated poster paths, which are constructed from slugs in source.
for (const entry of await readdir("public/case-studies/videos")) {
  if (entry.endsWith(".mp4")) {
    const poster = `public/case-studies/videos/${entry.replace(/\.mp4$/, ".webp")}`;
    try { await access(poster); } catch { missingAssets.push(poster); }
  }
}
const timings = [];
let next = 0;
let failedRequests = 0;
const started = performance.now();
await Promise.all(Array.from({ length: 20 }, async () => {
  while (next < 200) {
    const index = next++;
    const start = performance.now();
    try {
      const response = await fetch(new URL(pages[index % pages.length], base), { signal: AbortSignal.timeout(15000) });
      await response.arrayBuffer();
      if (response.status !== 200) failedRequests++;
    } catch { failedRequests++; }
    timings.push(performance.now() - start);
  }
}));
timings.sort((a, b) => a - b);
const result = {
  at: new Date().toISOString(), baseUrl: base.href,
  scope: "Local production HTTP and asset checks. Authenticated rendering and real-user Core Web Vitals need separate browser testing.",
  pages: pages.length, checks, assetsChecked: assets.size, missingAssets,
  load: { requests: 200, concurrency: 20, failedRequests, durationMs: Math.round(performance.now() - started),
    p50Ms: Math.round(timings[Math.floor(timings.length * 0.5)]),
    p95Ms: Math.round(timings[Math.floor(timings.length * 0.95)]), maxMs: Math.round(timings.at(-1)) },
};
await writeFile(`${output}/http-results.json`, `${JSON.stringify(result, null, 2)}\n`);
const failures = checks.filter((c) => !c.passed);
console.log(JSON.stringify({ pages: pages.length, checks: checks.length, failures, missingAssets, load: result.load }, null, 2));
if (failures.length || missingAssets.length || failedRequests) process.exitCode = 1;
