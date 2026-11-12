"use client";

import { usePathname } from "next/navigation";

// Wraps auth, consent and page content; the root selector also themes portalled dialogs.
export default function RegionalBrand({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div className="contents" data-brand-region={/^\/uk(?:\/|$)/.test(pathname) ? "uk" : "za"}>{children}</div>;
}
