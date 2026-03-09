"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { heroContent } from "@/lib/data";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-[#0a0a0f] pb-20 pt-10 sm:pt-12 lg:pt-16 lg:pb-24">
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.png"
          alt="Hero background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-transparent" />
      </div>

      <div className="relative container-max">
        <div className="relative z-10 flex flex-col items-center gap-10 text-center text-white sm:gap-12">
          <Reveal className="flex flex-col gap-4">
            <h1 className="bg-gradient-to-r from-green-300 via-[#78d1ff] to-pink-400 bg-clip-text text-[2.2rem] font-bold leading-tight text-transparent sm:text-[2.8rem] lg:text-[3.2rem]">
              Empowering Connections Globally
            </h1>
            <p className="max-w-3xl text-base leading-7 text-white/80 sm:text-lg lg:max-w-5xl">
              {heroContent.subtitleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="flex w-full justify-center">
            <motion.div
              className="relative w-full max-w-5xl rounded-[28px] bg-[#0c0c0f]/80 p-3 shadow-[0_25px_60px_rgba(0,0,0,0.4)] ring-1 ring-white/5 sm:rounded-[32px] sm:p-4"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <div className="relative overflow-hidden rounded-[24px] bg-black sm:rounded-[30px]">
              <iframe
                src="https://www.youtube.com/embed/1ZYbU82GVz4"
                title="Relaxing music"
                className="h-[190px] w-full rounded-[24px] sm:h-[280px] sm:rounded-[30px] md:h-[330px] lg:h-[360px]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              </div>

            {/* <div className="absolute left-[-42px] top-1/2 hidden -translate-y-1/2 md:flex">
              <button
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-base shadow-[0_10px_20px_rgba(0,0,0,0.3)] ring-2 ring-white"
                aria-label="Say Hi"
              >
                👋
              </button>
            </div> */}
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
