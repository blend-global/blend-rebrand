import Reveal from "@/components/Reveal";
import { ukContent } from "@/lib/regional-content";
import { regions } from "@/lib/regions";

export default function UkCallToAction() {
  return (
    <section className="relative overflow-hidden bg-[#050608] py-24 text-white sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(var(--brand-start-rgb),0.12),transparent_65%)]" />
      <Reveal className="container-max relative text-center">
        <h2 className="mx-auto max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">{ukContent.cta.title}</h2>
        <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/65">{ukContent.cta.description}</p>
        <a href={regions.uk.bookingUrl} target="_blank" rel="noreferrer" data-uk-action className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--brand-start)] via-[var(--brand-middle)] to-[var(--brand-end)] px-8 text-sm font-bold text-[var(--brand-button-ink)] transition-transform hover:-translate-y-1">{ukContent.cta.label} ↗</a>
      </Reveal>
    </section>
  );
}
