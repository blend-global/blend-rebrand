"use client";

import Image from "next/image";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { MotionLink } from "@/components/MotionLink";
import { getLatestCaseStudies } from "@/lib/cms-helpers";
import type { CaseStudy } from "@/lib/cms-types";
import { getFirebaseDb } from "@/lib/firebase/client";

async function readCaseStudiesFromFirestore(): Promise<CaseStudy[]> {
  const db = getFirebaseDb();
  const workSnapshot = await getDocs(query(collection(db, "caseStudies"), orderBy("order")));

  return workSnapshot.docs.map((entry) => {
    const data = entry.data();
    return {
      slug: data.slug,
      title: data.title,
      project: data.project,
      image: data.image,
      tags: data.tags ?? [],
      summary: data.summary,
      tabs: data.tabs ?? {},
    };
  }) as CaseStudy[];
}

export default function LatestWork() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    void readCaseStudiesFromFirestore()
      .then(setCaseStudies)
      .catch((error) => {
        console.error("Failed to load case studies from Firestore.", error);
        setCaseStudies([]);
      });
  }, []);

  const latestWorkItems = getLatestCaseStudies(caseStudies, 6);
  const activeItem = latestWorkItems[activeIndex] ?? latestWorkItems[0];
  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + latestWorkItems.length) % latestWorkItems.length);
  };
  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % latestWorkItems.length);
  };

  return (
    <section id="work" className="relative overflow-hidden py-20 text-white sm:py-24">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/latest-work/gradients.png"
          alt="Decorative gradients"
          fill
          priority
          className="object-cover opacity-100"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 -z-5 bg-[#0d0f15]/85" />
      <div className="container-max relative z-10 py-4 lg:py-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Our Latest Work
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/64 sm:text-lg">
            One focused story at a time. Use the arrows to browse selected case studies.
          </p>
          <MotionLink
            href="/work"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#43d1c2] to-[#f06fa9] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(0,0,0,0.25)]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View Case Studies</span>
            <span className="text-lg">⚡</span>
          </MotionLink>
        </Reveal>

        {activeItem ? (
          <Reveal delay={0.05}>
            <div className="mx-auto mt-12 max-w-6xl">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.055] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.38)]">
                <MotionLink
                  href={`/work/${activeItem.slug}`}
                  className="group relative block overflow-hidden rounded-[2rem] bg-black"
                  whileHover={{ scale: 1.005 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                >
                  <div className="relative aspect-[16/7] min-h-[320px] overflow-hidden rounded-[2rem]">
                    <iframe
                      src="https://www.youtube.com/embed/1ZYbU82GVz4?autoplay=1&mute=1&loop=1&playlist=1ZYbU82GVz4&controls=0&playsinline=1&rel=0&modestbranding=1"
                      title={`${activeItem.title} placeholder video`}
                      className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.777777vh] min-w-full -translate-x-1/2 -translate-y-1/2"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <div className="absolute inset-0 bg-black/45" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-black/60" />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-6 p-6 sm:p-8">
                      <div>
                        <div className="text-4xl font-semibold leading-none tracking-[-0.04em] text-white sm:text-5xl">
                          {activeItem.title}
                        </div>
                        <div className="mt-3 max-w-xl text-sm font-semibold uppercase tracking-[0.18em] text-white/58">
                          {activeItem.project}
                        </div>
                      </div>
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#101114] shadow-[0_16px_32px_rgba(0,0,0,0.24)] transition-transform group-hover:scale-105">
                        ▶
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 max-w-2xl p-6 sm:p-8">
                      <p className="text-base leading-7 text-white/74 sm:text-lg">
                        {activeItem.summary}
                      </p>
                    </div>
                  </div>
                </MotionLink>

                <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-5">
                  <motion.button
                    type="button"
                    aria-label="Previous case study"
                    className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#101114] shadow-[0_16px_32px_rgba(0,0,0,0.24)]"
                    onClick={goToPrevious}
                    whileHover={{ x: -2, scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                  </motion.button>
                  <motion.button
                    type="button"
                    aria-label="Next case study"
                    className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#101114] shadow-[0_16px_32px_rgba(0,0,0,0.24)]"
                    onClick={goToNext}
                    whileHover={{ x: 2, scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </motion.button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {activeItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_16px_rgba(0,0,0,0.2)] ring-1 ring-white/10 sm:text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
