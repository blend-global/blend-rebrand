"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { MotionLink } from "@/components/MotionLink";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import type { CaseStudy } from "@/lib/cms-types";
import { getFirebaseDb } from "@/lib/firebase/client";

const filters = ["Experiences", "Digital"];

const tagToFilter: Record<string, string> = {
  "Event Management": "Experiences",
  Photography: "Experiences",
  Videography: "Experiences",
  Staffing: "Experiences",
  "Swag and Gifting": "Experiences",
  Animation: "Digital",
  "Web Development": "Digital",
  "Social Media": "Digital",
  "Email Marketing": "Digital",
};

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

export default function WorkPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<string[]>(filters);
  const [workCaseStudies, setWorkCaseStudies] = useState<CaseStudy[]>([]);
  const itemsPerPage = 8;

  useEffect(() => {
    void readCaseStudiesFromFirestore()
      .then(setWorkCaseStudies)
      .catch((error) => {
        console.error("Failed to load case studies from Firestore.", error);
        setWorkCaseStudies([]);
      });
  }, []);

  const filteredItems = useMemo(() => {
    if (activeFilters.length === 0 || activeFilters.length === filters.length) {
      return workCaseStudies;
    }

    return workCaseStudies.filter((item) =>
      item.tags.some((tag) => {
        const mapped = tagToFilter[tag];
        return mapped ? activeFilters.includes(mapped) : false;
      }),
    );
  }, [activeFilters, workCaseStudies]);

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, filteredItems]);

  const totalFilteredItems = filteredItems.length;

  const toggleFilter = (filter: string) => {
    setCurrentPage(1);
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter],
    );
  };

  const clearFilters = () => {
    setCurrentPage(1);
    setActiveFilters([]);
  };

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white">
      <Navbar isOverlay={true} />
      <section className="relative overflow-hidden pt-32 sm:pt-40 md:pt-44">
        <div className="container-max pb-16">
          <div className="grid gap-10 md:gap-12 md:grid-cols-[1.1fr,1fr]">
            <Reveal className="flex flex-col gap-4">
              <h1 className="text-3xl font-semibold leading-tight sm:text-[2.6rem] lg:text-[3rem]">
                Case Studies
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                Our success stories showcase innovative solutions brought to life with precision and creativity.
              </p>
            </Reveal>
            <Reveal delay={0.05} className="flex flex-col gap-3">
              <span className="text-sm font-semibold uppercase tracking-wide text-white/70">Filter By Type</span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {filters.map((filter) => {
                  const isActive = activeFilters.includes(filter);
                  return (
                  <motion.span
                    key={filter}
                    role="button"
                    onClick={() => toggleFilter(filter)}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-xs sm:text-sm ${
                      isActive
                        ? "border-white/60 bg-white/10 text-white"
                        : "border-white/30 text-white/90"
                    }`}
                    whileHover={{ y: -2 }}
                  >
                    {filter}
                    <span className="text-xs">{isActive ? "✕" : "+"}</span>
                  </motion.span>
                )})}
                <motion.button
                  className="rounded-full border border-white/30 px-3 py-1 text-xs text-white/80 sm:text-sm"
                  onClick={clearFilters}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Clear All
                </motion.button>
              </div>
            </Reveal>
          </div>

          <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 md:grid-cols-2">
            {pagedItems.map((item, index) => (
              <Reveal key={item.title} delay={0.05 * index}>
                <MotionLink
                  key={item.title}
                  href={`/work/${item.slug}`}
                  className="relative block overflow-hidden rounded-[24px] bg-white/5 shadow-[0_18px_48px_rgba(0,0,0,0.4)]"
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={1200}
                    height={800}
                    className="h-[220px] w-full rounded-[24px] object-cover sm:h-[260px] lg:h-[320px]"
                  />
                  <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-black/15 via-black/20 to-black/55" />
                  <div className="absolute left-0 right-0 top-0 flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xl font-semibold sm:text-2xl">{item.title}</div>
                    <div className="text-xs font-semibold text-white/85 sm:text-sm">{item.project}</div>
                  </div>
                  <div className="absolute bottom-3 left-0 right-0 flex flex-wrap gap-2 px-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_8px_16px_rgba(0,0,0,0.25)] sm:text-xs sm:py-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </MotionLink>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 sm:mt-10">
            <Pagination
              totalItems={totalFilteredItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
