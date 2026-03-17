"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  return (
    <section className="bg-[#0d0f15] py-12 text-white sm:py-16">
      <div className="container-max flex flex-col gap-8">
        <Reveal>
          <h2 className="text-2xl font-semibold sm:text-3xl">{testimonials.title}</h2>
        </Reveal>
        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.items.map((item, index) => (
            <Reveal key={`${item.name}-${item.role}-${index}`} delay={0.04 * index}>
              <motion.div
                className="relative overflow-hidden rounded-[24px] bg-[#11141f] p-5 shadow-xl ring-1 ring-white/10 sm:p-6"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <p className="text-sm leading-relaxed text-white/80">{item.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="overflow-hidden rounded-full">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="h-10 w-10 object-cover sm:h-12 sm:w-12"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{item.name}</div>
                    <div className="text-xs uppercase tracking-wide text-white/60">{item.role}</div>
                  </div>
                </div>
                <div className="absolute -bottom-16 right-6 h-28 w-28 rounded-full bg-gradient-to-br from-green-300/30 to-pink-400/40 blur-2xl" />
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="flex items-center justify-center gap-3">
            <span className="h-3 w-3 rounded-full bg-white"></span>
            <span className="h-3 w-3 rounded-full bg-white/30"></span>
            <span className="h-3 w-3 rounded-full bg-white/30"></span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
