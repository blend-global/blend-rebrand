"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { isRegion, regionCookie, regionCookieMaxAge } from "@/lib/regions";

export default function RegionPreference() {
  const params = useParams();
  const region = params?.region;
  useEffect(() => {
    if (isRegion(region)) {
      document.cookie = `${regionCookie}=${region}; Path=/; Max-Age=${regionCookieMaxAge}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    }
  }, [region]);
  return null;
}
