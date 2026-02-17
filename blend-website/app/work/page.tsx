"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { MotionLink } from "@/components/MotionLink";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";

type WorkItem = {
  title: string;
  project: string;
  image: string;
  tags: string[];
  slug: string;
};

const workItems: WorkItem[] = [
  {
    title: "Google",
    project: "Project Name",
    image: "/placeholders/work-google.svg",
    tags: ["Event Management", "Photography", "Videography"],
    slug: "google",
  },
  {
    title: "Deloitte",
    project: "Project Name",
    image: "/placeholders/work-deloitte.svg",
    tags: ["Social Media", "Staffing", "Web Development"],
    slug: "deloitte",
  },
  {
    title: "Geberit",
    project: "Project Name",
    image: "/placeholders/work-geberit.svg",
    tags: ["Videography", "Photography", "Animation"],
    slug: "geberit",
  },
  {
    title: "Shoprite",
    project: "Project Name",
    image: "/placeholders/work-deloitte.svg",
    tags: ["Swag and Gifting", "Email Marketing", "Social Media"],
    slug: "shoprite",
  },
];

const filters = ["Experiences", "Digital", "Digital Marketing"];

export default function WorkPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalItems = workItems.length;
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return workItems.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage]);

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white">
      <Navbar />
      <div className="container-max pb-16 pt-8 sm:pt-10 md:pt-12">
        <div className="grid gap-10 md:gap-12 md:grid-cols-[1.1fr,1fr]">
          <Reveal className="flex flex-col gap-4">
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:mt-6 sm:text-[2.6rem] lg:mt-12">
              Case Studies
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              Our success stories showcase innovative solutions brought to life with precision and creativity.
            </p>
          </Reveal>
          <Reveal delay={0.05} className="flex flex-col gap-3">
            <span className="text-sm font-semibold uppercase tracking-wide text-white/70">Filter By Type</span>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {filters.map((filter) => (
                <motion.span
                  key={filter}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1 text-xs text-white/90 sm:text-sm"
                  whileHover={{ y: -2 }}
                >
                  {filter} <span className="text-xs">✕</span>
                </motion.span>
              ))}
              <motion.button
                className="rounded-full border border-white/30 px-3 py-1 text-xs text-white/80 sm:text-sm"
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
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}
