"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { logos } from "@/lib/data";

export default function LogosRow() {
  return (
    <section className="bg-white py-6 sm:py-8">
      <div className="container-max">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-4 rounded-3xl bg-white px-4 py-4 text-sm font-semibold text-[#545454] shadow-light ring-1 ring-black/5 sm:justify-between sm:gap-6">
            {logos.map((logo) => (
              <motion.span
                key={logo}
                className="whitespace-nowrap text-sm sm:text-base md:text-lg"
                whileHover={{ y: -2, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                {logo}
              </motion.span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
