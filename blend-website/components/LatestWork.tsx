"use client";

import Image from "next/image";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    void readCaseStudiesFromFirestore()
      .then(setCaseStudies)
      .catch((error) => {
        console.error("Failed to load case studies from Firestore.", error);
        setCaseStudies([]);
      });
  }, []);

  const latestWorkItems = getLatestCaseStudies(caseStudies, 3);

  return (
    <section id="work" className="relative overflow-hidden py-12 text-white sm:py-16">
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
      <div className="container-max relative z-10 flex flex-col gap-8 py-4 lg:flex-row lg:items-center lg:gap-6 lg:py-6">
        <Reveal className="relative w-full max-w-none lg:max-w-[320px]">
          <h2 className="text-3xl font-bold leading-[1.1] text-white sm:text-4xl lg:text-5xl">Our Latest Work</h2>
          <MotionLink
            href="/work"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#43d1c2] to-[#f06fa9] px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_26px_rgba(0,0,0,0.25)] sm:text-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View Case Studies</span>
            <span className="text-lg">⚡</span>
          </MotionLink>
        </Reveal>

        <div className="grid flex-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latestWorkItems.map((item, index) => (
            <Reveal key={item.slug} delay={0.05 * index}>
              <MotionLink
                href={`/work/${item.slug}`}
                className="group relative overflow-hidden rounded-[40px] bg-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={900}
                  height={1400}
                  className="h-[260px] w-full rounded-[40px] object-cover sm:h-[360px] lg:h-[520px]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/60" />
                <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 pt-4">
                  <div className="text-xl font-semibold text-white drop-shadow-lg sm:text-2xl lg:text-3xl">
                    {item.title}
                  </div>
                  <motion.div
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[#0c0c0f] shadow sm:h-9 sm:w-9"
                    whileHover={{ scale: 1.1 }}
                  >
                    ▶
                  </motion.div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex flex-col items-start gap-2 px-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#35373b]/90 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_8px_16px_rgba(0,0,0,0.2)] sm:px-4 sm:py-2 sm:text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </MotionLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
