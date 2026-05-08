"use client";

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
    image: "/1_locations.png",
  },
  {
    title: "About Us",
    subtitle: "The Team",
    description:
      "Dedicated, diverse professionals committed to excellence. Together, we innovate, inspire, and lead the industry in every endeavor we undertake.",
    image: "/2_the-team.png",
  },
  {
    title: "About Us",
    subtitle: "Blend Culture",
    description:
      "Our culture thrives on creativity and respect. We champion personal growth, teamwork, and sustainability to create meaningful experiences.",
    image: "/3_successfull-projects.png",
  },
];

export default function AboutLocations() {
  const [index, setIndex] = useState(0);

  const current = slides[index];
  const prev = slides[(index - 1 + slides.length) % slides.length];
  const next = slides[(index + 1) % slides.length];

  const handlePrev = () => setIndex((idx) => (idx - 1 + slides.length) % slides.length);
  const handleNext = () => setIndex((idx) => (idx + 1) % slides.length);

  const stackImages = useMemo(
    () => [
      { slide: prev, className: "left-[-16%] top-12 scale-90 opacity-60" },
      { slide: next, className: "left-[12%] top-10 scale-95 opacity-70" },
    ],
    [prev, next]
  );

  return (
    <section id="about" className="overflow-hidden bg-white py-12 sm:py-16">
      <div className="container-max flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between md:gap-10">
        <Reveal className="relative flex h-full w-full justify-center md:w-1/2">
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
            <Image
              src="/gradients.png"
              alt="Decorative background"
              width={900}
              height={900}
              className="h-[420px] w-[420px] max-w-none object-contain sm:h-[520px] sm:w-[520px] md:h-[620px] md:w-[620px]"
            />
          </div>

          <div className="relative w-full max-w-xl">
            {stackImages.map(({ slide, className }, idx) => (
              <motion.div
                key={`${slide.subtitle}-${idx}`}
                className={`absolute z-0 hidden overflow-hidden rounded-[38px] shadow-[0_25px_60px_rgba(0,0,0,0.28)] md:block ${className}`}
                whileHover={{ rotate: idx === 0 ? -1 : 1 }}
              >
                <Image
                  src={slide.image}
                  alt={slide.subtitle}
                  width={640}
                  height={780}
                  className="h-[420px] w-[320px] rounded-[38px] object-cover"
                />
              </motion.div>
            ))}

            <motion.div
              className="relative z-10 overflow-hidden rounded-[38px] shadow-[0_28px_70px_rgba(0,0,0,0.36)] ring-1 ring-black/10"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <Image
                src={current.image}
                alt={current.subtitle}
                width={760}
                height={920}
                className="h-[320px] w-full rounded-[38px] object-cover sm:h-[420px] md:h-[520px]"
                priority
              />
            </motion.div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="flex w-full flex-col gap-5 text-[#1a1a1a] md:w-1/2">
          <h2 className="text-balance text-4xl font-bold leading-[0.98] tracking-[-0.05em] text-[#101114] sm:text-5xl lg:text-6xl">
            {current.title}
            <br />
            <span className="bg-gradient-to-r from-[#6bd688] via-[#78d1ff] to-[#f36fb4] bg-clip-text text-transparent">
              {current.subtitle}
            </span>
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-[#3c3f46] sm:text-base">{current.description}</p>

          <div className="mt-0 flex items-center gap-3 sm:gap-4">
            <motion.button
              onClick={handlePrev}
              aria-label="Previous about slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white bg-[#0f0f12] text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)] ring-1 ring-white/30 sm:h-12 sm:w-12"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </motion.button>
            <motion.button
              onClick={handleNext}
              aria-label="Next about slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white bg-[#0f0f12] text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)] ring-1 ring-white/30 sm:h-12 sm:w-12"
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
