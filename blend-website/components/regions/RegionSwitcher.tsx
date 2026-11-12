"use client";

import { usePathname, useRouter } from "next/navigation";
import { rememberRegionChoice } from "@/lib/region-preference";
import { switchRegionPath } from "@/lib/regional-navigation";
import { ChevronDown, Globe2 } from "lucide-react";
import { isRegion, regionCodes, regions } from "@/lib/regions";
import { useRegion } from "./useRegion";

export default function RegionSwitcher() {
  const region = useRegion();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className="relative inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-[#111216] px-3 text-sm text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-white/70">
      <Globe2 className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="sr-only">Choose your region</span>
      <select aria-label="Choose your region" value={region.code} className="appearance-none bg-transparent py-2 pr-5 outline-none [&_option]:bg-[#111216]" onChange={(event) => {
        const next = event.target.value;
        event.currentTarget.blur();
        if (isRegion(next) && next !== region.code) {
          rememberRegionChoice(next);
          const path = switchRegionPath(pathname, next) + window.location.search + window.location.hash;
          router.push(path);
        }
      }}>
        {regionCodes.map((code) => <option key={code} value={code}>{regions[code].shortName}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5" aria-hidden="true" />
    </label>
  );
}
