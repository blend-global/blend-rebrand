"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { featuredService } from "@/lib/data";

export default function FeaturedService() {
  return (
    <section className="bg-black py-12 text-white sm:py-16">
      <div className="container-max">
        <Reveal className="flex flex-col gap-3 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">{featuredService.title}</h2>
          <p className="text-sm text-white/70 sm:text-base">{featuredService.description}</p>
        </Reveal>
        <Reveal delay={0.05}>
          <motion.div
            className="mt-8 overflow-hidden rounded-[28px] bg-[#10131c] shadow-pill ring-1 ring-white/5"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <Image
              src={featuredService.media}
              alt={featuredService.title}
              width={1200}
              height={700}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </Reveal>
        <Reveal delay={0.1} className="mt-6 flex justify-center">
          <motion.button
            className="pill-button pill-primary shadow-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {featuredService.cta}
          </motion.button>
        </Reveal>
      </div>
    </section>
  );
}
