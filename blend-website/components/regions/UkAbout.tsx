import Reveal from "@/components/Reveal";
import { ukContent } from "@/lib/regional-content";

export default function UkAbout() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#0d0f15] py-24 text-white sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(120,209,255,0.15),transparent_50%),radial-gradient(ellipse_at_10%_80%,rgba(243,111,180,0.12),transparent_45%)]" />
      <div className="container-max relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Blend United Kingdom</p>
          <h2 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl">{ukContent.about.title}</h2>
          <p className="mt-7 bg-gradient-to-r from-[#6bd688] via-[#78d1ff] to-[#f36fb4] bg-clip-text text-3xl font-medium leading-tight text-transparent">Unlock your brand’s potential with BLEND</p>
        </Reveal>
        <Reveal delay={0.05} className="space-y-6 text-base leading-8 text-white/70 sm:text-lg">
          {ukContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </Reveal>
      </div>
    </section>
  );
}
