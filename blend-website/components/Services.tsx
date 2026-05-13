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
import { MotionLink } from "@/components/MotionLink";
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
  const ambientColors =
    activeService?.kind === "experiential"
      ? {
          primary: "rgba(243, 111, 180, 0.26)",
          secondary: "rgba(120, 209, 255, 0.2)",
        }
      : {
          primary: "rgba(107, 214, 136, 0.24)",
          secondary: "rgba(34, 211, 238, 0.22)",
        };
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
      <motion.div
        className="absolute left-[-10rem] top-[-8rem] h-96 w-96 rounded-full blur-3xl"
        animate={{ backgroundColor: ambientColors.secondary }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute bottom-[-8rem] right-[-8rem] h-96 w-96 rounded-full blur-3xl"
        animate={{ backgroundColor: ambientColors.primary }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="container-max relative">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal className="mx-auto max-w-5xl">
            <h2 className="text-balance text-4xl font-bold leading-[0.98] tracking-[-0.05em] text-white drop-shadow-[0_18px_60px_rgba(0,0,0,0.42)] sm:text-5xl lg:text-6xl">
              Services to move
              <br />
              <span className="bg-gradient-to-r from-[#6bd688] via-[#78d1ff] to-[#f36fb4] bg-clip-text text-transparent">
                Renders to Reality
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/64 sm:text-lg">
              Pick a capability to preview how Blend supports the work, then open the full service when you need the details.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {serviceFilters.map((filter) => {
                const isActive = activeKind === filter.kind;
                const activeFilterClass =
                  filter.kind === "digital"
                    ? "border-transparent bg-gradient-to-r from-[#6bd688] to-[#22d3ee] text-[#07100e] shadow-[0_14px_34px_rgba(34,211,238,0.24)]"
                    : "border-transparent bg-gradient-to-r from-[#f36fb4] to-[#78d1ff] text-[#07100e] shadow-[0_14px_34px_rgba(243,111,180,0.24)]";

                return (
                  <motion.button
                    key={filter.kind}
                    type="button"
                    onClick={() => selectServiceKind(filter.kind)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? activeFilterClass
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
                  <motion.div
                    key={service.slug}
                    onMouseEnter={() => setActiveSlug(service.slug)}
                    className={`group grid min-h-24 grid-cols-[3rem_minmax(0,1fr)_1rem] items-center gap-4 rounded-[1.4rem] border p-4 text-left transition-colors ${
                      isActive
                        ? "border-white/30 bg-white text-[#08090d] shadow-[0_22px_60px_rgba(255,255,255,0.14)]"
                        : "border-white/10 bg-white/[0.045] text-white hover:border-white/24 hover:bg-white/[0.075]"
                    }`}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveSlug(service.slug)}
                      onFocus={() => setActiveSlug(service.slug)}
                      className="col-span-2 grid min-w-0 grid-cols-[3rem_minmax(0,1fr)] items-center gap-4 text-left"
                    >
                      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${service.accent}`}>
                        <Icon className="h-6 w-6 text-[#07100e]" aria-hidden="true" />
                      </span>
                      <span className={`block min-w-0 break-normal text-[0.95rem] font-semibold leading-tight tracking-[-0.025em] [overflow-wrap:normal] [word-break:normal] xl:text-base ${isActive ? "text-[#08090d]" : "text-white"}`}>
                        {serviceLabel}
                      </span>
                    </button>
                    <MotionLink
                      href={`/services/${service.slug}`}
                      aria-label={`View ${serviceLabel} details`}
                      className={`flex h-9 w-9 -translate-x-2 items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/40 ${isActive ? "text-[#101114]" : "text-white/42 hover:text-white"}`}
                      whileHover={{ x: 1, scale: 1.18 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </MotionLink>
                  </motion.div>
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

                      <div className="mt-6 aspect-video overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/30">
                        <div className={`h-full w-full bg-gradient-to-br ${activeService.accent} opacity-35`} />
                      </div>

                      <div className="mt-6">
                        <h3 className="max-w-xl break-normal text-3xl font-semibold leading-[1.04] tracking-[-0.04em] [overflow-wrap:normal] [word-break:normal] sm:text-[2.15rem]">
                          {formatServiceLabel(activeService.label)}
                        </h3>
                        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/68 sm:text-base">
                          {activeDetails?.summary ?? "A focused service built to support standout brand experiences."}
                        </p>
                      </div>

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
