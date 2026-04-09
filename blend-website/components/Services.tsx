"use client";

import { Instagram, Monitor, Plus } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { MotionLink } from "@/components/MotionLink";
import type { ServicesContent as ServicesSection } from "@/lib/cms-types";

export default function Services({ servicesSection }: { servicesSection: ServicesSection }) {
  const servicesContent = servicesSection.servicesContent;

  return (
    <section id="services" className="overflow-hidden bg-white pb-16 pt-6 sm:pt-8">
      <div className="container-max relative">
        <div className="absolute -left-24 top-10 h-40 w-40 rounded-full bg-gradient-to-br from-green-200/70 to-blue-200/40 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-44 w-44 rounded-full bg-gradient-to-br from-pink-200/70 to-purple-200/50 blur-3xl" />
        <Reveal>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-300 to-pink-400" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9aa0ac] sm:text-sm">
              Services
            </p>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-[#0e0e10] sm:text-3xl">{servicesContent.title}</h2>
            <p className="text-sm text-[#3c3f46] sm:text-base">{servicesContent.description}</p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:gap-6 md:grid-cols-2">
          <Reveal delay={0.05}>
            <motion.div
              className="flex flex-col gap-3 rounded-3xl bg-[#0f0f12] p-5 text-white shadow-pill sm:p-6"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold sm:text-xl">{servicesContent.digitalLabel}</h3>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-pink-500 sm:h-6 sm:w-6">
                <Monitor className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" aria-hidden="true" />
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {servicesContent.digital.map((item) => (
                <MotionLink
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="flex items-center justify-between rounded-full bg-[#15151b] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white/90 transition-colors hover:bg-[#1b1b24] sm:py-3 sm:text-sm"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{item.label}</span>
                  <Plus className="h-3.5 w-3.5 text-white/80 sm:h-4 sm:w-4" aria-hidden="true" />
                </MotionLink>
              ))}
            </div>
            </motion.div>
          </Reveal>
          <Reveal delay={0.1}>
            <motion.div
              className="flex flex-col gap-3 rounded-3xl bg-[#0f0f12] p-5 text-white shadow-pill sm:p-6"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold sm:text-xl">{servicesContent.experientialLabel}</h3>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-pink-500 to-indigo-500 sm:h-6 sm:w-6">
                <Instagram className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" aria-hidden="true" />
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {servicesContent.experiential.map((item) => (
                <MotionLink
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="flex items-center justify-between rounded-full bg-[#15151b] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white/90 transition-colors hover:bg-[#1b1b24] sm:py-3 sm:text-sm"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{item.label}</span>
                  <Plus className="h-3.5 w-3.5 text-white/80 sm:h-4 sm:w-4" aria-hidden="true" />
                </MotionLink>
              ))}
            </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
