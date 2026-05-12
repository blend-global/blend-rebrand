"use client";

import Image from "next/image";
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
  const [isPageLoaded, setIsPageLoaded] = useState(
    () => typeof document !== "undefined" && document.readyState === "complete",
  );
  const [isHeroVideoReady, setIsHeroVideoReady] = useState(false);
  const activeHeadline = heroHeadlines[headlineIndex];
  const showLoader = !isPageLoaded || !isHeroVideoReady;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeadlineIndex((current) => (current + 1) % heroHeadlines.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isPageLoaded) {
      return;
    }

    const handleLoad = () => setIsPageLoaded(true);
    window.addEventListener("load", handleLoad);

    return () => window.removeEventListener("load", handleLoad);
  }, [isPageLoaded]);

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-black">
      <AnimatePresence>
        {showLoader ? (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black text-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col items-center gap-5">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-white/15" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6bd688] border-r-[#f36fb4] animate-spin" />
                <Image src="/logo.png" alt="Blend" width={32} height={34} className="h-8 w-auto" priority />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Loading</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <video
        src="/hero-video/hero-video.mp4"
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setIsHeroVideoReady(true)}
        onCanPlayThrough={() => setIsHeroVideoReady(true)}
        onError={() => setIsHeroVideoReady(true)}
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
