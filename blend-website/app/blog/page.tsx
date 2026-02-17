"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { MotionLink } from "@/components/MotionLink";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import { useMemo, useState } from "react";

type BlogPost = {
  title: string;
  date: string;
  excerpt: string;
  image: string;
  tags: string[];
  slug: string;
};

const posts: BlogPost[] = [
  {
    title: "How does design even help?",
    date: "Sunday , 1 Jan 2023",
    excerpt: "Discover how thoughtful design transforms user experience and drives business success.",
    image: "/placeholders/blog-1.svg",
    tags: ["Design", "Research", "Presentation"],
    slug: "how-does-design-even-help",
  },
  {
    title: "The thing about events",
    date: "Sunday , 1 Jan 2023",
    excerpt: "Unravel the unique aspects that make events a powerful tool for connection and impact.",
    image: "/placeholders/blog-2.svg",
    tags: ["Design", "Research", "Presentation"],
    slug: "the-thing-about-events",
  },
  {
    title: "How to really measure productivity",
    date: "Sunday , 1 Jan 2023",
    excerpt: "Explore effective techniques to quantify productivity and enhance your team's performance.",
    image: "/placeholders/blog-3.svg",
    tags: ["Design", "Research", "Presentation"],
    slug: "how-to-really-measure-productivity",
  },
  {
    title: "To VR or not to VR",
    date: "Sunday , 1 Jan 2023",
    excerpt: "Delve into the pros and cons of virtual reality and its potential in modern applications.",
    image: "/placeholders/blog-4.svg",
    tags: ["Design", "Research", "Presentation"],
    slug: "to-vr-or-not-to-vr",
  },
];

const filters = ["Category", "Date"];
const tags = ["Web Development", "Social Media", "Digital Marketing"];

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalItems = posts.length;
  const pagedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return posts.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage]);

  return (
    <main className="min-h-screen bg-white text-[#0b0b0b]">
      <Navbar />
      <div className="container-max pb-16 pt-10 sm:pt-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <Reveal className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold leading-tight sm:text-[2.6rem]">The world of events and digital</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {filters.map((filter) => (
                <motion.button
                  key={filter}
                  className="flex items-center gap-2 rounded-full border border-[#cfd2d8] px-3 py-1 text-xs font-medium text-[#1f1f21] sm:text-sm"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {filter} <span className="text-xs">▾</span>
                </motion.button>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.05} className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <motion.span
                key={tag}
                className="inline-flex items-center gap-2 rounded-full border border-[#cfd2d8] px-3 py-1 text-xs text-[#1f1f21] sm:text-sm"
                whileHover={{ y: -2 }}
              >
                {tag} <span className="text-xs">✕</span>
              </motion.span>
            ))}
            <motion.button
              className="rounded-full border border-[#cfd2d8] px-3 py-1 text-xs text-[#1f1f21] sm:text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Clear All
            </motion.button>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-2">
          {pagedPosts.map((post, index) => (
            <Reveal key={post.title} delay={0.04 * index}>
              <MotionLink
                href={`/blog/${post.slug}`}
                className="flex flex-col gap-3"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <div className="overflow-hidden rounded-[18px] shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={900}
                    height={620}
                    className="h-[220px] w-full object-cover sm:h-[280px]"
                  />
                </div>
                <div className="text-xs font-semibold text-[#16a34a]">{post.date}</div>
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-[#0b0b0b] sm:text-xl">{post.title}</h3>
                  <span className="text-lg">↗</span>
                </div>
                <p className="text-sm leading-6 text-[#3a3c40]">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#e5e7eb] px-3 py-1 text-xs font-semibold text-[#1f1f21]">
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
