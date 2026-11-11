"use client";

import { useParams } from "next/navigation";
import { isRegion, regions } from "@/lib/regions";

export function useRegion() {
  const params = useParams();
  const code = isRegion(params?.region) ? params.region : "za";
  return { code, ...regions[code] };
}
