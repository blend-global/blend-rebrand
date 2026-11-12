import Reveal from "@/components/Reveal";
import { ukContent } from "@/lib/regional-content";

export default function UkAbout() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#050608] py-24 text-white sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
        <div className="absolute inset-0 bg-[#0d0f15]" />
        <div className="absolute -right-24 top-0 h-[32rem] w-[42rem] rounded-full bg-[radial-gradient(ellipse,rgba(var(--brand-middle-rgb),0.24),transparent_70%)] blur-[80px] sm:blur-[120px]" />
        <div className="absolute -left-32 bottom-0 h-[28rem] w-[38rem] rounded-full bg-[radial-gradient(ellipse,rgba(var(--brand-end-rgb),0.2),transparent_70%)] blur-[80px] sm:blur-[120px]" />
      </div>
      <div className="container-max relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Blend United Kingdom</p>
          <h2 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl">{ukContent.about.title}</h2>
          <p className="mt-7 bg-gradient-to-r from-[var(--brand-start)] via-[var(--brand-middle)] to-[var(--brand-end)] bg-clip-text text-3xl font-medium leading-tight text-transparent">Unlock your brand’s potential with BLEND</p>
        </Reveal>
        <Reveal delay={0.05} className="space-y-6 text-base leading-8 text-white/70 sm:text-lg">
          {ukContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </Reveal>
      </div>
    </section>
  );
}
