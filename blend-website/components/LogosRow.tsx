"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";
import { logos } from "@/lib/data";

export default function LogosRow() {
  const logoItems = [...logos, ...logos];

  return (
    <section className="flex min-h-[100svh] items-center overflow-hidden bg-white py-20 sm:py-24">
      <div className="w-full">
        <Reveal className="container-max mx-auto text-center">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.42em] text-[#7a7a7a] sm:text-base">
            We Work With
          </h2>
          <p className="mx-auto mb-14 max-w-5xl text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#101114] sm:text-5xl lg:text-6xl">
            Trusted by brands that shape culture, commerce, and connection.
          </p>
        </Reveal>

        <Reveal>
          <div className="w-screen overflow-hidden bg-white px-0 py-10 shadow-[0_28px_90px_rgba(16,17,23,0.12)] ring-1 ring-black/5 sm:py-14">
            <div className="marquee-track flex w-max items-center gap-14 sm:gap-20">
              {logoItems.map((logo, index) => (
                <div key={`${logo.src}-${index}`} className="flex items-center">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={240}
                    height={80}
                    className="h-14 w-auto object-contain opacity-95 transition duration-300 hover:scale-105 hover:opacity-100 sm:h-16 md:h-20"
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
