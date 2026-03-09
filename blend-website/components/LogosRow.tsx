"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";
import { logos } from "@/lib/data";

export default function LogosRow() {
  const logoItems = [...logos, ...logos];

  return (
    <section className="bg-white py-6 sm:py-8">
      <div className="container-max">
        <Reveal>
          <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#7a7a7a] sm:text-sm">
            We Work With
          </h2>
        </Reveal>
        <Reveal>
          <div className="overflow-hidden rounded-3xl bg-white px-4 py-4 shadow-light ring-1 ring-black/5">
            <div className="marquee-track flex w-max items-center gap-8 sm:gap-10">
              {logoItems.map((logo, index) => (
                <div key={`${logo.src}-${index}`} className="flex items-center">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={160}
                    height={40}
                    className="h-8 w-auto object-contain opacity-90 sm:h-9 md:h-10"
                    sizes="(min-width: 768px) 160px, 120px"
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
      <style jsx>{`
        .marquee-track {
          animation: marquee 22s linear infinite;
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
