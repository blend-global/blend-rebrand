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
    <label className="relative inline-flex min-h-11 w-22 shrink-0 items-center rounded-full border border-white/20 bg-[#111216] text-sm text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-white/70">
      <Globe2 className="pointer-events-none absolute left-3 h-4 w-4" aria-hidden="true" />
      <span className="sr-only">Choose your region</span>
      <select aria-label="Choose your region" value={region.code} className="absolute inset-0 h-full w-full appearance-none rounded-full bg-transparent py-2 pl-9 pr-7 outline-none [&_option]:bg-[#111216]" onChange={(event) => {
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
