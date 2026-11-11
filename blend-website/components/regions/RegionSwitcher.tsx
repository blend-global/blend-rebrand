"use client";

import { usePathname, useRouter } from "next/navigation";
import { switchRegionPath } from "@/lib/regional-navigation";
import { Globe2 } from "lucide-react";
import { isRegion, regionCodes, regions } from "@/lib/regions";
import { useRegion } from "./useRegion";

export default function RegionSwitcher() {
  const region = useRegion();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-[#111216] px-3 text-sm text-white">
      <Globe2 className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="sr-only">Choose your region</span>
      <select aria-label="Choose your region" value={region.code} className="bg-[#111216] py-2 outline-offset-4" onChange={(event) => {
        const next = event.target.value;
        if (isRegion(next)) router.push(switchRegionPath(pathname, next) + window.location.search + window.location.hash);
      }}>
        {regionCodes.map((code) => <option key={code} value={code}>{regions[code].shortName}</option>)}
      </select>
    </label>
  );
}
