"use client";

import Image from "next/image";
import { useRegion } from "./useRegion";

export default function BrandLogo({ placement = "nav", priority = false }: {
  placement?: "nav" | "footer" | "auth";
  priority?: boolean;
}) {
  const { code } = useRegion();
  const uk = code === "uk";
  const classes = uk
    ? { nav: "h-auto w-24 sm:w-28 md:w-36", footer: "h-auto w-36", auth: "h-auto w-24" }
    : { nav: "h-9 w-auto sm:h-11 md:h-14", footer: "h-6 w-6", auth: "h-11 w-auto" };
  return <Image src={uk ? "/uk/brand/blend-uk-horizontal.svg" : "/logo.png"}
    alt={uk ? "Blend UK" : "Blend logo"} width={uk ? 1477 : 89} height={uk ? 572 : 93}
    className={classes[placement]} priority={priority} />;
}
