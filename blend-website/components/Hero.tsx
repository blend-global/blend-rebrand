"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";

const heroHeadlines = [
  {
    lead: "Empowering Connections",
    impact: "Globally",
  },
  {
    lead: "Create Unforgettable",
    impact: "Moments",
  },
  {
    lead: "Elevate Your",
    impact: "Brand",
  },
];

export default function Hero() {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const activeHeadline = heroHeadlines[headlineIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeadlineIndex((current) => (current + 1) % heroHeadlines.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-black">
      <video
        src="/hero-video/hero-video.mp4"
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-black/70" />

      <div className="pointer-events-none container-max relative z-10 flex min-h-[100svh] items-center justify-center text-center text-white">
        <Reveal>
          <AnimatePresence mode="wait">
            <motion.h1
              key={headlineIndex}
              initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -24, filter: "blur(10px)" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="text-[2.35rem] font-bold leading-tight text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)] sm:text-[3.25rem] lg:text-[4.5rem]"
            >
              {activeHeadline.lead}<br />
              <span className="bg-gradient-to-r from-green-300 via-[#78d1ff] to-pink-400 bg-clip-text text-transparent">
                {activeHeadline.impact}
              </span>
            </motion.h1>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
