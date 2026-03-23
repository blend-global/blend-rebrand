"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { MotionLink } from "@/components/MotionLink";
import type { BlogContent } from "@/lib/cms-types";

export default function BlogPreview({ blogSection }: { blogSection: BlogContent }) {
  return (
    <section id="blog" className="bg-white py-12 sm:py-16">
      <div className="container-max flex flex-col gap-8">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-[#0e0e10] sm:text-2xl">{blogSection.title}</h2>
          <MotionLink
            href="/blog"
            className="pill-button pill-primary w-full justify-center text-sm font-semibold sm:w-auto"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {blogSection.cta}
          </MotionLink>
        </Reveal>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          {blogSection.featured.map((post, index) => (
            <Reveal key={post.title} delay={0.05 * index}>
              <Link href={`/blog/${post.slug}`} className="block">
                <motion.div
                className="overflow-hidden rounded-[28px] bg-white shadow-light ring-1 ring-black/5"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  width={900}
                  height={700}
                  className="h-[220px] w-full object-cover sm:h-[280px] md:h-[320px]"
                />
                <div className="p-5">
                  <div className="text-sm font-semibold uppercase tracking-wide text-[#5c5f66]">
                    {post.title}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#1a1b1f] sm:text-base">{post.description}</p>
                </div>
              </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-5">
          {blogSection.posts.map((post, index) => (
            <Reveal key={post.title} delay={0.02 * index}>
              <Link href={post.slug === "view-all" ? "/blog" : `/blog/${post.slug}`} className="block">
                <motion.div
                className="overflow-hidden rounded-[20px] bg-white shadow-light ring-1 ring-black/5"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  width={320}
                  height={200}
                  className="h-[120px] w-full object-cover sm:h-[140px]"
                />
                <div className="px-3 py-3 text-center text-xs font-semibold text-[#2f3034] sm:text-sm">
                  {post.title}
                </div>
              </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
