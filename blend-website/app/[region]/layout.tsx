import UkServiceModalProvider from "@/components/regions/UkServiceModalProvider";
import { notFound } from "next/navigation";
import { isRegion, regionCodes } from "@/lib/regions";

export function generateStaticParams() {
  return regionCodes.map((region) => ({ region }));
}

export default async function RegionalLayout({ children, params }: {
  children: React.ReactNode; params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  if (!isRegion(region)) notFound();
  return <div lang={region === "uk" ? "en-GB" : "en-ZA"} data-region={region}>{region === "uk" ? <UkServiceModalProvider>{children}</UkServiceModalProvider> : children}</div>;
}
