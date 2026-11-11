import { readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const base = new URL(process.env.MEDIA_BASE_URL || "http://localhost:3107");
if (!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)) throw new Error("Media checks must run against localhost.");

async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]));
  return nested.flat();
}
const assets = (await Promise.all([files("public/case-studies"), files("public/services")])).flat()
  .filter((path) => /\.(avif|webp|png|jpe?g|gif|svg|mp4|webm)$/i.test(path))
  .map((path) => `/${relative("public", path).split(sep).join("/")}`);

let checks = 0;
const failures = [];
async function check(path, options = {}, expected = 200, contentType) {
  const response = await fetch(new URL(path, base), { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(15000), ...options });
  checks++;
  if (response.status !== expected || (contentType && !response.headers.get("content-type")?.startsWith(contentType))) {
    failures.push({ path, status: response.status, location: response.headers.get("location"), type: response.headers.get("content-type") });
  }
  await response.body?.cancel();
}
for (const asset of assets) {
  const type = /\.(mp4|webm)$/i.test(asset) ? "video/" : "image/";
  await check(asset, {}, 200, type);
  await check(`/za${asset}`, {}, 200, type);
}
for (const video of assets.filter((asset) => /\.(mp4|webm)$/i.test(asset))) {
  await check(video, { method: "GET", headers: { Range: "bytes=0-1023" } }, 206, "video/");
}
for (const section of ["services", "case-studies", "blog", "contact"]) await check(`/${section}`, {}, 308);
await check("/case-studies/google-cloud-x-blend", {}, 308);
await check("/services/video-production", {}, 308);
await check("/blog/how-can-design-even-help", {}, 308);
await check("/_next/image?url=%2Fcase-studies%2Fvideos%2Fgoogle-cloud-x-blend.webp&w=640&q=75", { method: "GET" }, 200, "image/");
console.log(JSON.stringify({ assets: assets.length, checks, failures }, null, 2));
if (failures.length) process.exitCode = 1;
