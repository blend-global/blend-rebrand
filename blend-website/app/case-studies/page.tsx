"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import { MotionLink } from "@/components/MotionLink";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import { getCaseStudyCoverVideo, getCaseStudyTags } from "@/lib/case-study-media";
import type { CaseStudy } from "@/lib/cms-types";
import { fetchCmsSection } from "@/lib/cms-client";
import { workCaseStudies as fallbackCaseStudies } from "@/lib/data";

const getYouTubeEmbedUrl = (url: string, autoplay: boolean) => {
  try {
    const parsedUrl = new URL(url);
    const videoId =
      parsedUrl.hostname.includes("youtu.be")
        ? parsedUrl.pathname.replace("/", "")
        : parsedUrl.searchParams.get("v") ?? parsedUrl.pathname.split("/").filter(Boolean).pop();

    if (!videoId || (!parsedUrl.hostname.includes("youtube.com") && !parsedUrl.hostname.includes("youtu.be"))) {
      return null;
    }

    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? "1" : "0"}&mute=1&loop=1&playlist=${videoId}&controls=0&playsinline=1&rel=0&modestbranding=1`;
  } catch {
    return null;
  }
};

function CaseStudyCover({ item, isActive }: { item: CaseStudy; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const coverVideo = getCaseStudyCoverVideo(item);
  const youtubeEmbedUrl = coverVideo ? getYouTubeEmbedUrl(coverVideo, isActive) : null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      void video.play().catch(() => undefined);
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [isActive]);

  if (youtubeEmbedUrl) {
    return (
      <iframe
        key={isActive ? "playing" : "paused"}
        src={youtubeEmbedUrl}
        title={`${item.title} cover video`}
        className="pointer-events-none h-[220px] w-full rounded-[24px] sm:h-[260px] lg:h-[320px]"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (coverVideo) {
    return (
      <video
        ref={videoRef}
        src={coverVideo}
        className="h-[220px] w-full rounded-[24px] object-cover sm:h-[260px] lg:h-[320px]"
        muted
        loop
        playsInline
        preload="auto"
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

function CaseStudyCard({ item }: { item: CaseStudy }) {
  const [isActive, setIsActive] = useState(false);
  const tags = getCaseStudyTags(item);

  return (
    <MotionLink
      href={`/case-studies/${item.slug}`}
      prefetch
      className="case-study-card relative block overflow-hidden rounded-[24px] bg-white/5 shadow-[0_18px_48px_rgba(0,0,0,0.4)]"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
    >
      <CaseStudyCover item={item} isActive={isActive} />
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-black/15 via-black/20 to-black/55" />
      <div className="pointer-events-none absolute inset-x-0 bottom-3 overflow-hidden px-4 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div
          className="case-study-tags-track flex w-max"
          style={{ animationPlayState: isActive ? "paused" : "running" }}
        >
          {[false, true].map((isDuplicate) => (
            <div
              key={isDuplicate ? "duplicate" : "original"}
              className="flex shrink-0 gap-2 pr-2"
              aria-hidden={isDuplicate || undefined}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="whitespace-nowrap rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_8px_16px_rgba(0,0,0,0.25)] sm:py-2 sm:text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </MotionLink>
  );
}

export default function WorkPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("All");
  const [workCaseStudies, setWorkCaseStudies] = useState<CaseStudy[]>(fallbackCaseStudies);
  const itemsPerPage = 8;

  useEffect(() => {
    void fetchCmsSection("work").then(setWorkCaseStudies).catch(() => undefined);
  }, []);

  const projectFilters = useMemo(() => {
    const tags = new Set<string>();
    workCaseStudies.forEach((item) => {
      getCaseStudyTags(item).forEach((tag) => tags.add(tag));
    });

    return ["All", ...Array.from(tags).sort((a, b) => a.localeCompare(b))];
  }, [workCaseStudies]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "All") return workCaseStudies;
    return workCaseStudies.filter((item) => getCaseStudyTags(item).includes(activeFilter));
  }, [activeFilter, workCaseStudies]);

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [currentPage, filteredItems, itemsPerPage]);

  return (
    <main className="min-h-screen bg-background text-white">
      <Navbar />
      <section className="relative overflow-hidden pt-32 sm:pt-40 md:pt-44">
        <div className="gradient-orb gradient-orb-pink h-[240px] w-[240px] -top-28 -left-28 animate-float sm:h-[400px] sm:w-[400px] sm:-top-32 sm:-left-32" />
        <div className="gradient-orb gradient-orb-cyan h-[220px] w-[220px] top-24 right-0 animate-float-delayed sm:h-[360px] sm:w-[360px]" />
        <div className="gradient-orb gradient-orb-pink h-[180px] w-[180px] bottom-20 left-1/3 opacity-50 sm:h-[280px] sm:w-[280px]" />

        <div className="container-max relative z-10 pb-16">
          <div className="flex min-h-[36svh] flex-col justify-center pb-8 sm:pb-10">
            <Reveal className="max-w-4xl">
              <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl">
                Case studies that prove the <span className="bg-gradient-to-r from-[#f36fb4] via-[#9fb8ff] to-[#22d3ee] bg-clip-text text-transparent">experience</span>.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/64 sm:text-lg">
                Our success stories showcase innovative solutions brought to life with precision, creativity, and measurable brand impact.
              </p>
            </Reveal>

          </div>

          <div className="mb-8 flex flex-wrap items-center gap-2 sm:mb-10 sm:gap-3">
            {projectFilters.map((filter) => {
              const isActive = filter === activeFilter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setActiveFilter(filter);
                    setCurrentPage(1);
                  }}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition sm:px-5 sm:text-sm ${
                    isActive
                      ? "border-transparent bg-white text-black shadow-[0_14px_32px_rgba(255,255,255,0.16)]"
                      : "border-white/14 bg-white/[0.06] text-white/70 hover:border-white/30 hover:bg-white/[0.1] hover:text-white"
                  }`}
                  aria-pressed={isActive}
                >
                  {filter === "All" ? "All Projects" : filter}
                </button>
              );
            })}
          </div>

          <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
            {pagedItems.map((item, index) => (
              <Reveal key={item.slug} delay={0.05 * index}>
                <CaseStudyCard item={item} />
              </Reveal>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-6 py-10 text-center text-sm font-medium text-white/64">
              No case studies match this filter yet.
            </div>
          ) : null}

          <div className="mt-8 sm:mt-10">
            <Pagination
              totalItems={filteredItems.length}
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
