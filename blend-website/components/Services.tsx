"use client";

import { useState } from "react";
import {
  ArrowRight,
  Camera,
  Clapperboard,
  Code,
  Gift,
  Megaphone,
  Monitor,
  Palette,
  Radio,
  Sparkles,
  Utensils,
  Users,
  Video,
  WandSparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import type { ServicesContent as ServicesSection } from "@/lib/cms-types";

const iconBySlug = {
  "video-production": Video,
  photography: Camera,
  animation: WandSparkles,
  "design-creative": Palette,
  "web-development": Code,
  "live-streaming": Radio,
  "hybrid-virtual-events": Monitor,
  "marketing-advertising-social-media": Megaphone,
  "event-production-management": Clapperboard,
  "venue-decor-entertainment": Sparkles,
  "rsvp-management": Users,
  "guest-logistics": Users,
  "swag-gifting": Gift,
  "food-beverage": Utensils,
  staffing: Users,
  "experiential-marketing-brand-activations": Megaphone,
} as const;

const fallbackIcon = Sparkles;
type ServiceKind = "digital" | "experiential";

const formatServiceLabel = (label: string) => label.replaceAll("/", " / ");

export default function Services({ servicesSection }: { servicesSection: ServicesSection }) {
  const servicesContent = servicesSection.servicesContent;
  const serviceDetails = servicesSection.serviceDetails;
  const services = [
    ...servicesContent.digital.map((service) => ({
      ...service,
      kind: "digital" as const,
      category: servicesContent.digitalLabel,
      accent: "from-[#6bd688] to-[#22d3ee]",
    })),
    ...servicesContent.experiential.map((service) => ({
      ...service,
      kind: "experiential" as const,
      category: servicesContent.experientialLabel,
      accent: "from-[#f36fb4] to-[#78d1ff]",
    })),
  ];
  const [activeKind, setActiveKind] = useState<ServiceKind>("digital");
  const filteredServices = services.filter((service) => service.kind === activeKind);
  const [activeSlug, setActiveSlug] = useState(services[0]?.slug ?? "");
  const activeService = filteredServices.find((service) => service.slug === activeSlug) ?? filteredServices[0] ?? services[0];
  const activeDetails = activeService ? serviceDetails[activeService.slug] : null;
  const ActiveIcon = activeService ? iconBySlug[activeService.slug as keyof typeof iconBySlug] ?? fallbackIcon : fallbackIcon;
  const activeHighlights = activeDetails
    ? (activeDetails.highlights.length ? activeDetails.highlights : activeDetails.deliverables).slice(0, 4)
    : [];
  const serviceFilters: Array<{ kind: ServiceKind; label: string }> = [
    { kind: "digital", label: servicesContent.digitalLabel },
    { kind: "experiential", label: servicesContent.experientialLabel },
  ];

  const selectServiceKind = (kind: ServiceKind) => {
    setActiveKind(kind);
    setActiveSlug(services.find((service) => service.kind === kind)?.slug ?? "");
  };

  return (
    <section id="services" className="relative overflow-hidden bg-[#050608] py-20 text-white sm:py-24">
      <div className="absolute left-[-10rem] top-[-8rem] h-96 w-96 rounded-full bg-[#22d3ee]/20 blur-3xl" />
      <div className="absolute bottom-[-8rem] right-[-8rem] h-96 w-96 rounded-full bg-[#f36fb4]/20 blur-3xl" />

      <div className="container-max relative">
        <div className="max-w-4xl">
          <Reveal className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#6bd688] to-[#f36fb4]" />
              Services
            </div>
            <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Services that move from screen to stage.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/64 sm:text-lg">
              Pick a capability to preview how Blend supports the work, then open the full service when you need the details.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {serviceFilters.map((filter) => {
                const isActive = activeKind === filter.kind;

                return (
                  <motion.button
                    key={filter.kind}
                    type="button"
                    onClick={() => selectServiceKind(filter.kind)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "border-white bg-white text-[#08090d]"
                        : "border-white/15 bg-white/[0.04] text-white/70 hover:border-white/30 hover:text-white"
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {filter.label}
                  </motion.button>
                );
              })}
            </div>
          </Reveal>
        </div>

        <div className="mx-auto mt-14 grid w-fit max-w-full gap-6 lg:grid-cols-[625px_520px] lg:items-start">
          <Reveal>
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredServices.map((service) => {
                const Icon = iconBySlug[service.slug as keyof typeof iconBySlug] ?? fallbackIcon;
                const isActive = service.slug === activeSlug;
                const serviceLabel = formatServiceLabel(service.label);

                return (
                  <motion.button
                    key={service.slug}
                    type="button"
                    onClick={() => setActiveSlug(service.slug)}
                    className={`group grid min-h-24 grid-cols-[3rem_minmax(0,1fr)_1rem] items-center gap-4 rounded-[1.4rem] border p-4 text-left transition-colors ${
                      isActive
                        ? "border-white/30 bg-white text-[#08090d] shadow-[0_22px_60px_rgba(255,255,255,0.14)]"
                        : "border-white/10 bg-white/[0.045] text-white hover:border-white/24 hover:bg-white/[0.075]"
                    }`}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${service.accent}`}>
                      <Icon className="h-6 w-6 text-[#07100e]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className={isActive ? "block text-[10px] font-bold uppercase tracking-[0.22em] text-[#4d5561]" : "block text-[10px] font-bold uppercase tracking-[0.22em] text-white/42"}>
                        {service.category}
                      </span>
                      <span className="mt-1 block break-normal text-[0.95rem] font-semibold leading-tight tracking-[-0.025em] [overflow-wrap:normal] [word-break:normal] xl:text-base">
                        {serviceLabel}
                      </span>
                    </span>
                    <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isActive ? "text-[#101114]" : "text-white/42"}`} aria-hidden="true" />
                  </motion.button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="sticky top-28 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.38)] backdrop-blur">
              <AnimatePresence mode="wait">
                {activeService ? (
                  <motion.div
                    key={activeService.slug}
                    initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-[1.6rem] bg-[#101114] p-5 sm:p-6"
                  >
                    <div className={`absolute right-[-6rem] top-[-7rem] h-60 w-60 rounded-full bg-gradient-to-br ${activeService.accent} opacity-35 blur-3xl`} />
                    <div className="relative flex flex-col">
                      <div className="flex items-start justify-between gap-5">
                        <span className={`flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-gradient-to-br ${activeService.accent}`}>
                          <ActiveIcon className="h-7 w-7 text-[#07100e]" aria-hidden="true" />
                        </span>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-white/50">
                          {activeService.category}
                        </span>
                      </div>

                      <div className="mt-6">
                        <h3 className="max-w-xl break-normal text-3xl font-semibold leading-[1.04] tracking-[-0.04em] [overflow-wrap:normal] [word-break:normal] sm:text-[2.15rem]">
                          {formatServiceLabel(activeService.label)}
                        </h3>
                        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/68 sm:text-base">
                          {activeDetails?.summary ?? "A focused service built to support standout brand experiences."}
                        </p>
                      </div>

                      {activeHighlights.length ? (
                        <div className="mt-7 grid gap-2">
                          {activeHighlights.slice(0, 4).map((highlight) => (
                            <div key={highlight} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-xs leading-5 text-white/72">
                              {highlight}
                            </div>
                          ))}
                        </div>
                      ) : null}

                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
