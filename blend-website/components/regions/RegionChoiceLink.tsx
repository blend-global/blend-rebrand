"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { rememberRegionChoice } from "@/lib/region-preference";
import type { RegionCode } from "@/lib/regions";

export default function RegionChoiceLink({ region, children, className }: {
  region: RegionCode; children: ReactNode; className?: string;
}) {
  return <Link href={`/${region}`} prefetch={false} className={className} onClick={(event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    rememberRegionChoice(region);
  }}>{children}</Link>;
}
