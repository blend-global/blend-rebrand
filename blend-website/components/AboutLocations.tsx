"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Slide = {
  title: string;
  subtitle: string;
  description: string;
  statValue: string;
  statLabel: string;
  image: string;
};

const slides: Slide[] = [
  {
    title: "About Us",
    subtitle: "Locations",
    description:
      "Spanning across the EMEA/META regions, our offices are strategically placed to maximize local and global connectivity and impact.",
    statValue: "3+",
    statLabel: "Continents",
    image: "/1_locations.png",
  },
  {
    title: "About Us",
    subtitle: "The Team",
    description:
      "Dedicated, diverse professionals committed to excellence. Together, we innovate, inspire, and lead the industry in every endeavor we undertake.",
    statValue: "50+",
    statLabel: "Happy Employees",
    image: "/2_the-team.png",
  },
  {
    title: "About Us",
    subtitle: "Blend Culture",
    description:
      "Our culture thrives on creativity and respect. We champion personal growth, teamwork, and sustainability to create meaningful experiences.",
    statValue: "100+",
    statLabel: "Successful Projects",
    image: "/3_successfull-projects.png",
  },
];

export default function AboutLocations() {
  const [index, setIndex] = useState(0);

  const current = slides[index];
  const prev = slides[(index - 1 + slides.length) % slides.length];
  const next = slides[(index + 1) % slides.length];

  const handlePrev = () => setIndex((idx) => (idx - 1 + slides.length) % slides.length);
  const handleNext = () => setIndex((idx) => (idx + 1) % slides.length);

  const stackImages = useMemo(
    () => [
      { slide: prev, className: "left-[-16%] top-12 scale-90 opacity-60" },
      { slide: next, className: "left-[12%] top-10 scale-95 opacity-70" },
    ],
    [prev, next]
  );

  return (
    <section id="about" className="bg-transparent py-16">
      <div className="container-max flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-between">
        <div className="relative flex h-full w-full justify-center md:w-1/2">
          <div className="absolute -left-10 -top-6 h-32 w-32 rounded-full bg-gradient-to-br from-green-200/30 to-blue-200/25 blur-3xl" />
          <div className="absolute -right-8 bottom-8 h-36 w-36 rounded-full bg-gradient-to-br from-pink-200/30 to-purple-200/25 blur-3xl" />

          <div className="relative w-full max-w-xl">
            {stackImages.map(({ slide, className }, idx) => (
              <div
                key={`${slide.subtitle}-${idx}`}
                className={`absolute z-0 overflow-hidden rounded-[38px] shadow-[0_25px_60px_rgba(0,0,0,0.28)] ${className}`}
              >
                <Image
                  src={slide.image}
                  alt={slide.subtitle}
                  width={640}
                  height={780}
                  className="h-[420px] w-[320px] rounded-[38px] object-cover"
                />
              </div>
            ))}

            <div className="relative z-10 overflow-hidden rounded-[38px] shadow-[0_28px_70px_rgba(0,0,0,0.36)] ring-1 ring-black/10">
              <Image
                src={current.image}
                alt={current.subtitle}
                width={760}
                height={920}
                className="h-[460px] w-full rounded-[38px] object-cover sm:h-[520px]"
                priority
              />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-5 text-[#1a1a1a] md:w-1/2">
          <h3 className="text-2xl font-semibold text-[#1d1d1f]">{current.title}</h3>
          <h4 className="text-xl font-semibold text-[#2d2d2f]">{current.subtitle}</h4>
          <p className="max-w-xl text-base leading-relaxed text-[#3c3f46]">{current.description}</p>

          <div className="mt-4 text-5xl font-semibold text-[#1b1b1d]">
            {current.statValue}
            <div className="mt-1 text-xl font-semibold text-[#2e2f33]">{current.statLabel}</div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={handlePrev}
              aria-label="Previous about slide"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-[#0f0f12] text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)] ring-1 ring-white/30"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              aria-label="Next about slide"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-[#0f0f12] text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)] ring-1 ring-white/30"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
