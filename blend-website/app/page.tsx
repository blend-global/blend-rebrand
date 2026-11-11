import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowUpRight, Globe2 } from "lucide-react";
import { isRegion, regionCodes, regionCookie, regions } from "@/lib/regions";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Choose your region", path: "/", description: "One Blend. A world of possibilities. Choose South Africa or the United Kingdom to meet your local team." });

export default async function RegionWelcome() {
  const saved = (await cookies()).get(regionCookie)?.value;
  if (isRegion(saved)) redirect(`/${saved}`);
  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-[#090b10] px-6 py-8 text-white sm:px-12 sm:py-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_65%,rgba(107,214,136,0.12),transparent_50%),radial-gradient(ellipse_at_90%_25%,rgba(120,209,255,0.14),transparent_45%),radial-gradient(ellipse_at_65%_100%,rgba(243,111,180,0.10),transparent_45%)]" />
      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between">
        <Image src="/logo.png" alt="Blend" width={52} height={54} priority />
        <span className="text-xs tracking-[0.16em] text-white/55">MAKE MOMENTS MATTER</span>
      </header>
      <section className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center py-16 sm:py-20">
        <p className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/60"><Globe2 className="h-4 w-4" aria-hidden="true" /> Connected globally. Grounded locally.</p>
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-7xl lg:text-8xl">One Blend.<br /><span className="bg-gradient-to-r from-[#6bd688] via-[#78d1ff] to-[#f36fb4] bg-clip-text text-transparent">A world of possibilities.</span></h1>
        <p className="mt-7 max-w-xl text-base leading-7 text-white/60 sm:text-lg">Choose your region to explore Blend and connect with your local team.</p>
        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2">
          {regionCodes.map((code) => <Link key={code} href={`/${code}`} className="group flex min-h-40 items-end justify-between gap-4 rounded-3xl border border-white/15 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#78d1ff]/60 hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78d1ff] sm:p-8">
            <div><span className="text-xs tracking-[0.2em] text-[#78d1ff]">BLEND / {regions[code].shortName}</span><h2 className="mt-3 text-2xl font-medium sm:text-3xl">{regions[code].name}</h2><p className="mt-2 text-sm text-white/55">{regions[code].description}</p></div>
            <ArrowUpRight className="mb-1 h-6 w-6 shrink-0 text-white/70 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
          </Link>)}
        </div>
        <p className="mt-6 text-xs leading-5 text-white/45">We’ll remember your choice. You can change your region at any time.</p>
      </section>
      <footer className="relative mx-auto w-full max-w-6xl text-xs text-white/35">Blend Global · Local teams. Shared creativity.</footer>
    </main>
  );
}
