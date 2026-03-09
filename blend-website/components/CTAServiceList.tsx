"use client";

import Reveal from "@/components/Reveal";
import { MotionLink } from "@/components/MotionLink";
import { digitalServicesCTA } from "@/lib/data";

export default function CTAServiceList() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="container-max grid items-center gap-8 sm:gap-10 md:grid-cols-2">
        <Reveal className="relative">
          <div className="absolute -left-12 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-200/60 to-slate-200/40 blur-3xl sm:h-52 sm:w-52" />
          <div className="absolute -bottom-24 left-16 h-48 w-48 rounded-full bg-gradient-to-br from-pink-200/80 to-purple-300/70 blur-3xl sm:h-64 sm:w-64" />
          <h2 className="relative z-10 text-3xl font-bold leading-tight text-[#0c0c0f] sm:text-4xl">
            {digitalServicesCTA.title}
          </h2>
        </Reveal>
        <Reveal delay={0.05} className="relative z-10 flex flex-col gap-3 overflow-hidden rounded-[28px] bg-[#0f0f12] p-5 text-white shadow-pill sm:p-6">
          <div className="absolute -bottom-12 -right-6 h-28 w-28 rounded-full bg-gradient-to-br from-green-300/50 to-pink-400/50 blur-2xl sm:h-32 sm:w-32" />
          {digitalServicesCTA.services.map((service) => (
            <MotionLink
              key={service.slug}
              href={`/services/${service.slug}`}
              className="flex items-center justify-between rounded-full bg-[#15151b] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white/90 transition-colors hover:bg-[#1b1b24] sm:py-3 sm:text-sm"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{service.label}</span>
              <span className="h-2 w-2 rounded-full bg-white" />
            </MotionLink>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
