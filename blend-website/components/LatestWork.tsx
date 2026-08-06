"use client";

import Image from "next/image";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { MotionLink } from "@/components/MotionLink";
import { getCaseStudyCoverVideo, getCaseStudyProject } from "@/lib/case-study-media";
import { getLatestCaseStudies } from "@/lib/cms-helpers";
import type { CaseStudy } from "@/lib/cms-types";
import { getFirebaseDb } from "@/lib/firebase/client";

const mobileSummaryBySlug: Record<string, string> = {
  google: "A polished Google Cloud partner experience built for hybrid audiences.",
  deloitte: "A next-gen summit campaign across staffing, digital, and live delivery.",
  geberit: "Product storytelling, event capture, and motion assets for a showcase rollout.",
  shoprite: "A retail campaign blending gifting, digital communication, and social amplification.",
  amazon: "A vibrant summer experience for Amazon, combining energetic event production.",
};

const logoBySlug: Record<string, string> = {
  deloitte: "/new-client-logos/Deloitte.svg",
  geberit: "/new-client-logos/Geberit.svg",
  google: "/new-client-logos/Google%20Cloud.svg",
  shoprite: "/new-client-logos/Shoprite.svg",
  amazon: "/new-client-logos/amazon-logo-amazon-icon-transparent-free-png.webp",
  "amazon-summer-2025": "/new-client-logos/amazon-logo-amazon-icon-transparent-free-png.webp",
};

const getCaseStudyLogo = (caseStudy: Pick<CaseStudy, "slug" | "logo">) =>
  logoBySlug[caseStudy.slug] ?? caseStudy.logo ?? null;

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

export default function LatestWork() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeDirection, setActiveDirection] = useState(1);

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
  const activeCoverVideoSrc = activeItem ? getCaseStudyCoverVideo(activeItem) : null;
  const activeCoverVideo = activeCoverVideoSrc ? getYouTubeEmbedUrl(activeCoverVideoSrc) : null;
  const activeLogo = activeItem ? getCaseStudyLogo(activeItem) : null;
  const goToPrevious = () => {
    if (latestWorkItems.length <= 1) return;
    setActiveDirection(-1);
    setActiveIndex((current) => (current - 1 + latestWorkItems.length) % latestWorkItems.length);
  };
  const goToNext = () => {
    if (latestWorkItems.length <= 1) return;
    setActiveDirection(1);
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
          <h2 className="text-balance text-4xl font-bold leading-[0.98] tracking-[-0.05em] text-white drop-shadow-[0_18px_60px_rgba(0,0,0,0.42)] sm:text-5xl lg:text-6xl">
            Our Latest
            <br />
            <span className="bg-gradient-to-r from-[#6bd688] via-[#78d1ff] to-[#f36fb4] bg-clip-text text-transparent">
              Work
            </span>
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
          </MotionLink>
        </Reveal>

        {activeItem ? (
          <Reveal delay={0.05}>
            <div className="mx-auto mt-12 max-w-6xl">
              <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
                {latestWorkItems
                  .map((item) => ({ item, logo: getCaseStudyLogo(item) }))
                  .filter(({ logo }) => logo)
                  .map(({ item, logo }) => (
                    <Image
                      key={`${item.slug}-logo-preload`}
                      src={logo as string}
                      alt=""
                      width={160}
                      height={160}
                      className="h-20 w-20"
                      priority
                      unoptimized
                    />
                  ))}
              </div>

              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.055] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.38)]">
                <AnimatePresence initial={false} custom={activeDirection} mode="wait">
                  <MotionLink
                    key={activeItem.slug}
                    href={`/work/${activeItem.slug}`}
                    className="group relative block overflow-hidden rounded-[2rem] bg-black"
                    custom={activeDirection}
                    initial={{ opacity: 0, x: activeDirection * 42, scale: 0.985, filter: "blur(8px)" }}
                    animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: activeDirection * -42, scale: 0.99, filter: "blur(8px)" }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.005 }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] sm:aspect-[16/7] sm:min-h-[320px]">
                      {activeCoverVideo ? (
                        <iframe
                          src={activeCoverVideo}
                          title={`${activeItem.title} cover video`}
                          className="pointer-events-none absolute left-1/2 top-1/2 h-full w-[133.333%] -translate-x-1/2 -translate-y-1/2 sm:h-[56.25vw] sm:min-h-full sm:w-[177.777777vh] sm:min-w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : activeCoverVideoSrc ? (
                        <video
                          src={activeCoverVideoSrc}
                          className="absolute inset-0 h-full w-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <Image
                          src={activeItem.image}
                          alt={activeItem.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 1100px, 100vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/45" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-black/60" />
                      <div className="absolute inset-x-0 top-0 p-6 sm:p-8">
                        <div>
                          {activeLogo ? (
                            <span className="flex h-[30px] w-28 items-center justify-center overflow-hidden rounded-full bg-white px-2 shadow-[0_10px_24px_rgba(0,0,0,0.24)] ring-1 ring-white/70 sm:h-8 sm:w-32">
                              <Image
                                src={activeLogo}
                                alt={`${activeItem.title} logo`}
                                width={160}
                                height={160}
                                className="h-20 w-20 max-w-none object-contain sm:h-[5.5rem] sm:w-[5.5rem]"
                                priority
                                unoptimized
                              />
                            </span>
                          ) : (
                            <div className="text-4xl font-semibold leading-none tracking-[-0.04em] text-white sm:text-5xl">
                              {activeItem.title}
                            </div>
                          )}
                          <div className="mt-3 hidden max-w-xl text-sm font-semibold uppercase tracking-[0.18em] text-white/58 sm:block">
                            {getCaseStudyProject(activeItem)}
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 hidden max-w-2xl p-6 pr-10 sm:block sm:p-8">
                        <p className="text-sm leading-6 text-white/74 sm:text-lg sm:leading-7">
                          {activeItem.summary}
                        </p>
                      </div>
                    </div>
                  </MotionLink>
                </AnimatePresence>

                <div className="pointer-events-none absolute inset-x-5 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-between sm:inset-x-8 sm:flex">
                  <motion.button
                    type="button"
                    aria-label="Previous case study"
                    className="pointer-events-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#101114] shadow-[0_16px_32px_rgba(0,0,0,0.24)]"
                    onClick={goToPrevious}
                    whileHover={{ x: -2, scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                  </motion.button>
                  <motion.button
                    type="button"
                    aria-label="Next case study"
                    className="pointer-events-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#101114] shadow-[0_16px_32px_rgba(0,0,0,0.24)]"
                    onClick={goToNext}
                    whileHover={{ x: 2, scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </motion.button>
                </div>
              </div>

              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={`${activeItem.slug}-mobile-details`}
                  className="mt-5 flex flex-col items-center gap-4 px-4 text-center sm:hidden"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/58">
                    {getCaseStudyProject(activeItem)}
                  </div>
                  <p className="max-w-[22rem] text-sm leading-6 text-white/74">
                    {mobileSummaryBySlug[activeItem.slug] ?? activeItem.summary}
                  </p>
                  <div className="flex items-center justify-center gap-5">
                    <motion.button
                      type="button"
                      aria-label="Previous case study"
                      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#101114] shadow-[0_16px_32px_rgba(0,0,0,0.24)]"
                      onClick={goToPrevious}
                      whileHover={{ x: -2, scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                    </motion.button>
                    <motion.button
                      type="button"
                      aria-label="Next case study"
                      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#101114] shadow-[0_16px_32px_rgba(0,0,0,0.24)]"
                      onClick={goToNext}
                      whileHover={{ x: 2, scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={`${activeItem.slug}-tags`}
                  className="mt-5 flex flex-wrap justify-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {activeItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_16px_rgba(0,0,0,0.2)] ring-1 ring-white/10 sm:text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
