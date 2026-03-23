"use client";

import type { CmsDataMap } from "@/lib/cms-types";

export async function fetchCmsSection<T extends keyof CmsDataMap>(section: T): Promise<CmsDataMap[T]> {
  const response = await fetch(`/api/cms/${section}`, { cache: "no-store" });
  const payload = (await response.json()) as { data?: CmsDataMap[T]; error?: string };

  if (!response.ok || !payload.data) {
    throw new Error(payload.error ?? `Unable to load ${section} content.`);
  }

  return payload.data;
}
