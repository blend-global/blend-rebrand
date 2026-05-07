"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";
import { logos } from "@/lib/data";

export default function LogosRow() {
  const logoItems = [...logos, ...logos];

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-black py-20 text-white sm:py-24">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#090b10] to-transparent" />
      <div className="absolute left-1/2 top-[42%] h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-green-300 via-[#78d1ff] to-pink-400 opacity-30 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,209,255,0.16),rgba(0,0,0,0.76)_58%,rgba(0,0,0,0.96)_100%)]" />

      <div className="relative z-10 w-full">
        <Reveal className="container-max mx-auto text-center">
          <h2 className="mx-auto mb-16 max-w-5xl text-balance text-4xl font-semibold uppercase leading-[0.98] tracking-[-0.05em] text-white drop-shadow-[0_18px_60px_rgba(0,0,0,0.42)] sm:text-6xl lg:text-7xl">
            Some of our clients.
          </h2>
        </Reveal>

        <Reveal>
          <div className="w-screen overflow-hidden px-0 py-10 sm:py-14">
            <div className="marquee-track flex w-max items-center gap-14 sm:gap-20">
              {logoItems.map((logo, index) => (
                <div key={`${logo.src}-${index}`} className="flex min-w-36 items-center justify-center rounded-3xl bg-white px-8 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] ring-1 ring-white/25">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={240}
                    height={80}
                    className="h-12 w-auto object-contain opacity-95 transition duration-300 hover:scale-105 hover:opacity-100 sm:h-14 md:h-16"
                    sizes="(min-width: 768px) 240px, 180px"
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
      <style jsx>{`
        .marquee-track {
          animation: marquee 28s linear infinite;
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
