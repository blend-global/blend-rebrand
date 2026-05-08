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

const clientLogoByTitle: Record<string, string> = {
  Deloitte: "/new-client-logos/Deloitte.svg",
  Geberit: "/new-client-logos/Geberit.svg",
  Google: "/new-client-logos/Google%20Cloud.svg",
  Shoprite: "/new-client-logos/Shoprite.svg",
};

const getYouTubeEmbedUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const videoId =
      parsedUrl.hostname.includes("youtu.be")
        ? parsedUrl.pathname.replace("/", "")
        : parsedUrl.searchParams.get("v") ?? parsedUrl.pathname.split("/").filter(Boolean).pop();

    if (!videoId || (!parsedUrl.hostname.includes("youtube.com") && !parsedUrl.hostname.includes("youtu.be"))) {
      return null;
    }

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&playsinline=1&rel=0&modestbranding=1`;
  } catch {
    return null;
  }
};

function CaseStudyCover({ item }: { item: CaseStudy }) {
  const youtubeEmbedUrl = item.coverVideo ? getYouTubeEmbedUrl(item.coverVideo) : null;

  if (youtubeEmbedUrl) {
    return (
      <iframe
        src={youtubeEmbedUrl}
        title={`${item.title} cover video`}
        className="pointer-events-none h-[220px] w-full rounded-[24px] sm:h-[260px] lg:h-[320px]"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (item.coverVideo) {
    return (
      <video
        src={item.coverVideo}
        className="h-[220px] w-full rounded-[24px] object-cover sm:h-[260px] lg:h-[320px]"
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return (
    <Image
      src={item.image}
      alt={item.title}
      width={1200}
      height={800}
      className="h-[220px] w-full rounded-[24px] object-cover sm:h-[260px] lg:h-[320px]"
    />
  );
}

function CaseStudyLogo({ item }: { item: CaseStudy }) {
  const logoSrc = clientLogoByTitle[item.title] ?? item.logo;

  if (!logoSrc) {
    return <div className="text-xl font-semibold sm:text-2xl">{item.title}</div>;
  }

  return (
    <span className="flex h-10 w-36 items-center justify-center overflow-hidden rounded-full bg-white px-3 shadow-[0_10px_24px_rgba(0,0,0,0.24)] ring-1 ring-white/70 sm:w-40">
      <Image
        src={logoSrc}
        alt={`${item.title} logo`}
        width={160}
        height={160}
        className="h-40 w-40 max-w-none object-contain"
        unoptimized
      />
    </span>
  );
}

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
      coverVideo: data.coverVideo,
      logo: data.logo,
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
    <main className="min-h-screen bg-background text-white">
      <Navbar isOverlay={true} />
      <section className="relative overflow-hidden pt-32 sm:pt-40 md:pt-44">
        <div className="gradient-orb gradient-orb-pink h-[240px] w-[240px] -top-28 -left-28 animate-float sm:h-[400px] sm:w-[400px] sm:-top-32 sm:-left-32" />
        <div className="gradient-orb gradient-orb-cyan h-[220px] w-[220px] top-24 right-0 animate-float-delayed sm:h-[360px] sm:w-[360px]" />
        <div className="gradient-orb gradient-orb-pink h-[180px] w-[180px] bottom-20 left-1/3 opacity-50 sm:h-[280px] sm:w-[280px]" />

        <div className="container-max relative z-10 pb-16">
          <div className="flex min-h-[58svh] flex-col justify-center pb-14">
            <Reveal className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#6bd688] to-[#f36fb4]" />
                Our Work
              </div>
              <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl">
                Case studies that prove the <span className="bg-gradient-to-r from-[#f36fb4] via-[#9fb8ff] to-[#22d3ee] bg-clip-text text-transparent">experience</span>.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/64 sm:text-lg">
                Our success stories showcase innovative solutions brought to life with precision, creativity, and measurable brand impact.
              </p>
            </Reveal>

            <div className="mt-10">
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
          </div>

          <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
            {pagedItems.map((item, index) => (
              <Reveal key={item.title} delay={0.05 * index}>
                <MotionLink
                  key={item.title}
                  href={`/work/${item.slug}`}
                  className="relative block overflow-hidden rounded-[24px] bg-white/5 shadow-[0_18px_48px_rgba(0,0,0,0.4)]"
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                >
                  <CaseStudyCover item={item} />
                  <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-black/15 via-black/20 to-black/55" />
                  <div className="absolute left-0 right-0 top-0 flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <CaseStudyLogo item={item} />
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
