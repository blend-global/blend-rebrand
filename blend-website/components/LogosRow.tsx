"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";
import { logos } from "@/lib/data";

export default function LogosRow() {
  const logoItems = [...logos, ...logos];

  return (
    <section className="relative flex min-h-[70svh] items-center overflow-hidden bg-black py-14 text-white sm:py-16">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#090b10] to-transparent" />
      <div className="absolute left-1/2 top-[42%] h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-green-300 via-[#78d1ff] to-pink-400 opacity-30 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,209,255,0.16),rgba(0,0,0,0.76)_58%,rgba(0,0,0,0.96)_100%)]" />

      <div className="relative z-10 w-full">
        <Reveal className="container-max mx-auto text-center">
          <h2 className="mx-auto mb-10 max-w-5xl text-balance text-4xl font-bold leading-[0.98] tracking-[-0.05em] text-white drop-shadow-[0_18px_60px_rgba(0,0,0,0.42)] sm:mb-12 sm:text-5xl lg:text-6xl">
            Some of our
            <br />
            <span className="bg-gradient-to-r from-[#6bd688] via-[#78d1ff] to-[#f36fb4] bg-clip-text text-transparent">
              clients
            </span>
          </h2>
        </Reveal>

        <Reveal>
          <div className="w-screen overflow-hidden px-0 py-8 sm:py-10">
            <div className="marquee-track flex w-max items-center gap-14 sm:gap-20">
              {logoItems.map((logo, index) => (
                <div key={`${logo.src}-${index}`} className="flex h-28 w-56 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-white px-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)] ring-1 ring-white/25 sm:h-[7.5rem] sm:w-60">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={260}
                    height={260}
                    className="h-56 w-56 max-w-none object-contain opacity-95 transition duration-300 hover:scale-105 hover:opacity-100 sm:h-60 sm:w-60"
                    sizes="(min-width: 640px) 240px, 224px"
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
      <style jsx>{`
        .marquee-track {
          animation: marquee 52s linear infinite;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
