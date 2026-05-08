"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.items.length);
    }, 9000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden py-20 text-white sm:py-24">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#0d0f15] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-white" />
      <div className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-green-300 via-[#78d1ff] to-pink-400 opacity-35 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,209,255,0.16),rgba(0,0,0,0.78)_58%,rgba(0,0,0,0.95)_100%)]" />

      <div className="container-max relative z-10">
        <Reveal className="mx-auto max-w-5xl text-center">
          <h2 className="text-balance text-4xl font-bold leading-[0.98] tracking-[-0.05em] text-white drop-shadow-[0_18px_60px_rgba(0,0,0,0.42)] sm:text-5xl lg:text-6xl">
            What People Are
            <br />
            <span className="bg-gradient-to-r from-[#6bd688] via-[#78d1ff] to-[#f36fb4] bg-clip-text text-transparent">
              Saying
            </span>
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 max-w-6xl text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[0, 1, 2].map((offset) => {
                const quote = testimonials.items[(activeIndex + offset) % testimonials.items.length];

                return (
                  <motion.blockquote
                    key={`${activeIndex}-${offset}`}
                    className="rounded-[1.75rem] border border-white/12 bg-black/35 p-6 text-left shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur"
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  >
                    <p className="text-base leading-7 text-white/82">
                      “{quote.quote}”
                    </p>
                  </motion.blockquote>
                );
              })}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-3">
            {testimonials.items.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show quote ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? "w-9 bg-white" : "w-2.5 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
