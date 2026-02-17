"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { MotionLink } from "@/components/MotionLink";

const tabs = ["Context", "Problem", "Process", "Solution", "Takeaway"] as const;
type TabKey = (typeof tabs)[number];

const tabContent: Record<TabKey, { body: string; images: string[]; showStats?: boolean }> = {
  Context: {
    body:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda voluptatum ullam totam, ipsa quaerat numquam culpa neque facilis harum, soluta quam? Quia veniam commodi doloribus nobis, inventore voluptatem sed aperiam.",
    images: ["/placeholders/work-google.svg", "/placeholders/work-deloitte.svg"],
    showStats: true,
  },
  Problem: {
    body:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda voluptatum ullam totam, ipsa quaerat numquam culpa neque facilis harum, soluta quam? Quia veniam commodi doloribus nobis, inventore voluptatem sed aperiam.",
    images: ["/placeholders/work-geberit.svg", "/placeholders/work-google.svg"],
  },
  Process: {
    body:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda voluptatum ullam totam, ipsa quaerat numquam culpa neque facilis harum, soluta quam? Quia veniam commodi doloribus nobis, inventore voluptatem sed aperiam.",
    images: ["/placeholders/work-deloitte.svg", "/placeholders/work-geberit.svg"],
    showStats: true,
  },
  Solution: {
    body:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda voluptatum ullam totam, ipsa quaerat numquam culpa neque facilis harum, soluta quam? Quia veniam commodi doloribus nobis, inventore voluptatem sed aperiam.",
    images: ["/placeholders/work-google.svg", "/placeholders/work-deloitte.svg"],
  },
  Takeaway: {
    body:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda voluptatum ullam totam, ipsa quaerat numquam culpa neque facilis harum, soluta quam? Quia veniam commodi doloribus nobis, inventore voluptatem sed aperiam.",
    images: ["/placeholders/work-geberit.svg", "/placeholders/work-google.svg"],
  },
};

const stats = [
  { value: "300+", label: "Attendees" },
  { value: "1000+", label: "Online Visitors" },
  { value: "20+", label: "Countries" },
];

export default function WorkDetailPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("Context");
  const [imageIndex, setImageIndex] = useState(0);

  const images = useMemo(() => tabContent[activeTab].images, [activeTab]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setImageIndex(0);
  };

  const handlePrev = () => {
    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="min-h-screen bg-[#0b0b0d] text-white">
      <div className="container-max relative pb-16 pt-10 sm:pt-12 lg:pb-20">
        <MotionLink
          href="/work"
          aria-label="Close"
          className="absolute right-3 top-6 text-2xl text-white/70 transition-colors hover:text-white"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          x
        </MotionLink>

        <Reveal className="space-y-3">
          <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl">Google</h1>
          <p className="max-w-2xl text-sm text-white/70">
            The key to great ideas is not in having them, but acting on them.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="relative mt-12 flex items-center justify-center sm:mt-16">
          <div className="absolute right-16 top-1/2 hidden h-[220px] w-[220px] -translate-y-1/2 rounded-full bg-gradient-to-br from-white/40 via-white/20 to-white/5 blur-[2px] md:block" />

          <motion.button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-0 hidden h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_28px_rgba(0,0,0,0.35)] md:flex"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            ←
          </motion.button>

          <motion.div
            className="relative w-full max-w-[560px] overflow-hidden rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <Image
              src={images[imageIndex]}
              alt="Project highlight"
              width={900}
              height={620}
              className="h-[240px] w-full object-cover sm:h-[280px] md:h-[320px]"
            />
          </motion.div>

          <motion.button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-0 hidden h-10 w-10 translate-x-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_28px_rgba(0,0,0,0.35)] md:flex"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            →
          </motion.button>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-col gap-6 sm:mt-12 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
          <p className="max-w-xl text-sm leading-6 text-white/75">{tabContent[activeTab].body}</p>

          {tabContent[activeTab].showStats ? (
            <div className="flex flex-wrap gap-6 md:justify-end">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center md:text-left">
                  <div className="text-2xl font-semibold sm:text-3xl">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          ) : null}
        </Reveal>

        <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-10 sm:gap-3">
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors sm:px-4 ${
                activeTab === tab
                  ? "border-white bg-white text-black"
                  : "border-white/40 bg-transparent text-white/80 hover:border-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab}
            </motion.button>
          ))}
        </Reveal>
      </div>
    </main>
  );
}
