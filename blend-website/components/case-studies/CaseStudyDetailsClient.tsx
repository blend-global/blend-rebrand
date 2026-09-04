"use client";

import { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { MotionLink } from "@/components/MotionLink";
import { notFound } from "next/navigation";
import {
  getCaseStudyCoverVideo,
  getCaseStudyVisitImages,
  hasCaseStudyImagePool,
} from "@/lib/case-study-media";
import { fetchCmsSection } from "@/lib/cms-client";
import type { CaseStudy } from "@/lib/cms-types";
import { workCaseStudies as fallbackCaseStudies } from "@/lib/data";

const tabs = ["Context", "Problem", "Process", "Solution", "Takeaway"] as const;
type TabKey = (typeof tabs)[number];
const detailMediaClass = "h-[clamp(160px,34svh,320px)] w-full object-cover";

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

function CaseStudyDetailMedia({
  caseStudy,
  fallbackImage,
  shouldUseCoverVideo,
}: {
  caseStudy: CaseStudy;
  fallbackImage: string;
  shouldUseCoverVideo: boolean;
}) {
  const coverVideo = getCaseStudyCoverVideo(caseStudy);
  const youtubeEmbedUrl = coverVideo ? getYouTubeEmbedUrl(coverVideo) : null;
  const mediaWrapperRef = useRef<HTMLDivElement | null>(null);

  const requestFullscreen = () => {
    const element = mediaWrapperRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null;

    if (!element) {
      return;
    }

    if (element.requestFullscreen) {
      void element.requestFullscreen();
      return;
    }

    element.webkitRequestFullscreen?.();
  };

  if (shouldUseCoverVideo && youtubeEmbedUrl) {
    return (
      <div ref={mediaWrapperRef} className="relative bg-black">
        <iframe
          src={youtubeEmbedUrl}
          title={`${caseStudy.title} cover video`}
          className={`pointer-events-none ${detailMediaClass}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <motion.button
          type="button"
          aria-label="Watch video fullscreen"
          onClick={requestFullscreen}
          className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white shadow-[0_14px_34px_rgba(0,0,0,0.35)] ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-black/75"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <Maximize2 className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      </div>
    );
  }

  if (shouldUseCoverVideo && coverVideo) {
    return (
      <div ref={mediaWrapperRef} className="relative bg-black">
        <video
          src={coverVideo}
          className={detailMediaClass}
          autoPlay
          muted
          loop
          playsInline
        />
        <motion.button
          type="button"
          aria-label="Watch video fullscreen"
          onClick={requestFullscreen}
          className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white shadow-[0_14px_34px_rgba(0,0,0,0.35)] ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-black/75"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <Maximize2 className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      </div>
    );
  }

  return (
    <Image
      src={fallbackImage}
      alt="Project highlight"
      width={900}
      height={620}
      className={detailMediaClass}
      sizes="(max-width: 640px) 100vw, 560px"
      priority
    />
  );
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default function CaseStudyDetailsClient({ params }: Props) {
  const { slug } = use(params);
  const [activeTab, setActiveTab] = useState<TabKey>("Context");
  const [visitImages] = useState(() => getCaseStudyVisitImages(slug));
  const [workCaseStudies, setWorkCaseStudies] = useState<CaseStudy[]>(fallbackCaseStudies);

  useEffect(() => {
    void fetchCmsSection("work").then(setWorkCaseStudies).catch(() => undefined);
  }, []);

  const caseStudy = workCaseStudies?.find((item) => item.slug === slug);

  if (!caseStudy) {
    notFound();
  }

  const activeSection = caseStudy.tabs[activeTab];
  const tabIndex = tabs.indexOf(activeTab);
  const fallbackImage = visitImages[tabIndex] ?? activeSection.images[0] ?? caseStudy.image;
  const shouldUseCoverVideo = activeTab === "Takeaway" || !hasCaseStudyImagePool(caseStudy.slug);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
  };

  const handlePrev = () => {
    const currentIndex = tabs.indexOf(activeTab);
    const previousIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    handleTabChange(tabs[previousIndex]);
  };

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
    handleTabChange(tabs[nextIndex]);
  };

  return (
    <main className="relative isolate h-[100svh] overflow-hidden bg-background text-white">
      <div className="gradient-orb gradient-orb-pink pointer-events-none -left-28 -top-28 h-[240px] w-[240px] animate-float sm:-left-32 sm:-top-32 sm:h-[400px] sm:w-[400px]" />
      <div className="gradient-orb gradient-orb-cyan pointer-events-none right-0 top-24 h-[220px] w-[220px] animate-float-delayed sm:h-[360px] sm:w-[360px]" />
      <div className="gradient-orb gradient-orb-pink pointer-events-none bottom-20 left-1/3 h-[180px] w-[180px] opacity-50 sm:h-[280px] sm:w-[280px]" />

      <div className="container-max relative z-10 flex h-full min-h-0 items-center justify-center overflow-hidden py-4 sm:py-5 lg:py-6">

        <div className="mx-auto flex max-h-full w-full max-w-[980px] flex-col items-center">
          <Reveal className="relative w-full max-w-[780px] space-y-3 text-center">
            <MotionLink
              href="/case-studies"
              aria-label="Close"
              className="absolute right-0 top-0 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/70 backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/[0.1] hover:text-white"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </MotionLink>
            <h1 className="px-11 text-[clamp(1.75rem,4svh,2.5rem)] font-semibold leading-tight">{caseStudy.title}</h1>
            <div className="mx-auto flex h-[4rem] max-w-2xl items-center justify-center overflow-hidden sm:h-[3.5rem]">
              <AnimatePresence initial={false} mode="wait">
                <motion.p
                  key={activeTab}
                  className="line-clamp-2 text-xs leading-5 text-white/70 sm:text-sm sm:leading-6"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  {activeSection.body}
                </motion.p>
              </AnimatePresence>
            </div>
          </Reveal>

          <Reveal delay={0.05} className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-3">
            {tabs.map((tab) => (
              <motion.button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors sm:px-4 ${
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

          <Reveal delay={0.05} className="relative mt-7 flex w-full items-center justify-center sm:mt-8">
            <motion.button
              type="button"
              onClick={handlePrev}
              aria-label="Previous section"
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
              <CaseStudyDetailMedia
                caseStudy={caseStudy}
                fallbackImage={fallbackImage}
                shouldUseCoverVideo={shouldUseCoverVideo}
              />
            </motion.div>

            <motion.button
              type="button"
              onClick={handleNext}
              aria-label="Next section"
              className="absolute right-0 hidden h-10 w-10 translate-x-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_28px_rgba(0,0,0,0.35)] md:flex"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              →
            </motion.button>
          </Reveal>

          <div className="mt-6 flex h-[4.75rem] w-full max-w-[780px] items-start justify-center text-center sm:mt-7 sm:h-[5.25rem]">
            {activeSection.stats ? (
              <Reveal delay={0.1} className="flex w-full flex-col items-center gap-4">
                <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
                  {activeSection.stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-xl font-semibold sm:text-2xl md:text-3xl">{stat.value}</div>
                      <div className="text-xs text-white/80 sm:text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
