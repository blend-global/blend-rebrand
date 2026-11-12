"use client";

import { useRegion } from "@/components/regions/useRegion";
import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

type Slide = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

const slides: Slide[] = [
  {
    title: "About Us",
    subtitle: "Locations",
    description:
      "Spanning across the EMEA/META regions, our offices are strategically placed to maximize local and global connectivity and impact.",
    image: "/about/locations-hires.webp",
  },
  {
    title: "About Us",
    subtitle: "The Team",
    description:
      "Dedicated, diverse professionals committed to excellence. Together, we innovate, inspire, and lead the industry in every endeavor we undertake.",
    image: "/about/team-hires.webp",
  },
];

export default function AboutLocations() {
  const region = useRegion();
  const [index, setIndex] = useState(0);

  const current = slides[index];
  const prev = slides[(index - 1 + slides.length) % slides.length];
  const next = slides[(index + 1) % slides.length];

  const handlePrev = () => setIndex((idx) => (idx - 1 + slides.length) % slides.length);
  const handleNext = () => setIndex((idx) => (idx + 1) % slides.length);

  const stackImages = useMemo(
    () =>
      [
        { slide: prev, className: "left-[-16%] top-12 scale-90 opacity-60" },
        { slide: next, className: "left-[12%] top-10 scale-95 opacity-70" },
      ].filter(
        ({ slide }, idx, all) =>
          all.findIndex(({ slide: candidate }) => candidate.subtitle === slide.subtitle) === idx,
      ),
    [prev, next]
  );

  return (
    <section id="about" className="relative flex min-h-[100svh] items-center overflow-hidden bg-[linear-gradient(to_bottom,#050608,#0d0f15_12rem)] py-12 text-white sm:py-16">
      {/* Fade only the top: preserve the existing final edge against the footer. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_12rem)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_48%,rgba(var(--brand-middle-rgb),0.18),transparent_34%),radial-gradient(circle_at_70%_45%,rgba(var(--brand-end-rgb),0.14),transparent_30%)]" />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:left-1/4">
            <Image
              src="/gradients.png"
              alt=""
              width={900}
              height={900}
              className="h-[420px] w-[420px] max-w-none object-contain sm:h-[520px] sm:w-[520px] md:h-[620px] md:w-[620px]"
            />
        </div>
      </div>
      <div className="container-max relative z-10 flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between md:gap-10">
        <Reveal className="relative flex h-full w-full justify-center md:w-1/2">

          <div className="relative w-full max-w-md">
            {stackImages.map(({ slide, className }, idx) => (
              <motion.div
                key={`${slide.subtitle}-${idx}`}
                className={`absolute z-0 hidden overflow-hidden rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.28)] md:block ${className}`}
                whileHover={{ rotate: idx === 0 ? -1 : 1 }}
              >
                <Image
                  src={slide.image}
                  alt={slide.subtitle}
                  width={640}
                  height={780}
                  className="h-[336px] w-[256px] rounded-[28px] object-cover"
                />
              </motion.div>
            ))}

            <motion.div
              className="relative z-10 overflow-hidden rounded-[28px] shadow-[0_28px_70px_rgba(0,0,0,0.36)] ring-1 ring-black/10"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <Image
                src={current.image}
                alt={current.subtitle}
                width={760}
                height={920}
                className="h-[260px] w-full rounded-[28px] object-cover sm:h-[340px] md:h-[400px]"
                sizes="(min-width: 1024px) 448px, (min-width: 768px) 45vw, 100vw"
              />
            </motion.div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="flex w-full flex-col gap-5 text-white md:w-1/2">
          <h2 className="text-balance text-4xl font-bold leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            {current.title}:
            <br />
            <span className="bg-gradient-to-r from-[var(--brand-start)] via-[var(--brand-middle)] to-[var(--brand-end)] bg-clip-text text-transparent">
              {current.subtitle}
            </span>
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">{index === 0 ? (region.code === "uk" ? "Meet Blend United Kingdom. Local understanding and global creativity come together to help your brand connect with its audience." : "Rooted in Cape Town and connected globally, our South African team brings local understanding to every brand experience.") : current.description}</p>

          <div className="mt-0 flex items-center gap-3 sm:gap-4">
            <motion.button
              onClick={handlePrev}
              aria-label="Previous about slide"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#101114] shadow-[0_10px_24px_rgba(0,0,0,0.25)] ring-1 ring-white/30 sm:h-12 sm:w-12"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </motion.button>
            <motion.button
              onClick={handleNext}
              aria-label="Next about slide"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#101114] shadow-[0_10px_24px_rgba(0,0,0,0.25)] ring-1 ring-white/30 sm:h-12 sm:w-12"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </motion.button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
