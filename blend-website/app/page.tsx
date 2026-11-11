import Image from "next/image";
import RegionChoiceLink from "@/components/regions/RegionChoiceLink";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { isRegion, regionCodes, regionCookie, regions } from "@/lib/regions";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Choose your region", path: "/", description: "Choose South Africa or the United Kingdom to connect with your local Blend team." });

export default async function RegionWelcome() {
  const saved = (await cookies()).get(regionCookie)?.value;
  if (isRegion(saved)) redirect(`/${saved}`);
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#090b10] px-6 py-12 text-white">
      <section className="w-full max-w-md" aria-labelledby="region-title">
        <Image src="/logo.png" alt="Blend" width={40} height={42} className="mb-10 h-11 w-auto" priority />
        <h1 id="region-title" className="text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl">Choose your region.</h1>
        <div className="mt-8 divide-y divide-white/15 rounded-2xl border border-white/15">
          {regionCodes.map((code) => (
            <RegionChoiceLink key={code} region={code} className="group flex min-h-20 items-center justify-between gap-4 px-5 py-5 text-base transition-colors first:rounded-t-2xl last:rounded-b-2xl hover:bg-white/5 focus-visible:relative focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78d1ff] sm:text-lg">
              <span>{regions[code].name}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white" aria-hidden="true" />
            </RegionChoiceLink>
          ))}
        </div>
        <p className="mt-6 text-xs leading-5 text-white/40">You can change your region at any time.</p>
      </section>
    </main>
  );
}
