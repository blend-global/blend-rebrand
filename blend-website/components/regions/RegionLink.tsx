"use client";

import Link from "next/link";
import { forwardRef, type ComponentProps } from "react";
import { regionalPath } from "@/lib/regions";
import { ukContent } from "@/lib/regional-content";
import { useUkServiceModal } from "./UkServiceModalProvider";
import { useRegion } from "./useRegion";

const RegionLink = forwardRef<HTMLAnchorElement, ComponentProps<typeof Link>>(function RegionLink({ href, onClick, ...props }, ref) {
  const region = useRegion();
  const openUkService = useUkServiceModal();
  const localizedHref = typeof href === "string" ? regionalPath(href, region.code) : {
    ...href, pathname: href.pathname ? regionalPath(href.pathname, region.code) : href.pathname,
  };
  const pathname = typeof localizedHref === "string" ? localizedHref.split(/[?#]/)[0] : localizedHref.pathname;
  const slug = region.code === "uk" ? pathname?.match(/^\/uk\/services\/([^/]+)\/?$/)?.[1] : undefined;
  const opensDialog = Boolean(openUkService && slug && ukContent.services.some((service) => service.slug === slug));

  return <Link ref={ref} href={localizedHref} {...props}
    aria-haspopup={opensDialog ? "dialog" : props["aria-haspopup"]}
    onClick={(event) => {
      onClick?.(event);
      if (!opensDialog || !slug || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (props.target && props.target !== "_self") || props.download) return;
      event.preventDefault();
      openUkService?.(slug);
    }}
  />;
});

export default RegionLink;
