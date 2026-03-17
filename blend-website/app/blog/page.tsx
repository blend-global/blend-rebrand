"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { MotionLink } from "@/components/MotionLink";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import { useEffect, useMemo, useRef, useState } from "react";
import { blogSection } from "@/lib/data";

type BlogPost = {
  title: string;
  date: string;
  excerpt: string;
  image: string;
  tags: string[];
  slug: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
};

type SortOrder = "newest" | "oldest";

const parseBlogDate = (date: string) => {
  const normalized = date.replace(/\s*,\s*/g, " ").trim();
  return new Date(normalized);
};

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState<"category" | "date" | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const filterControlsRef = useRef<HTMLDivElement | null>(null);
  const itemsPerPage = 8;

  const posts: BlogPost[] = useMemo(
    () => [
      ...blogSection.featured.map((post) => ({
        title: post.description,
        date: post.date,
        excerpt: post.excerpt,
        image: post.image,
        tags: [post.slug === "how-can-design-even-help" ? "Web Development" : "Social Media"],
        slug: post.slug,
        author: post.author,
      })),
      ...blogSection.posts
        .filter((post) => post.slug !== "view-all" && post.author && post.date && post.excerpt)
        .map((post) => ({
          title: post.title,
          date: post.date,
          excerpt: post.excerpt,
          image: post.image,
          tags:
            post.slug === "fnb-christmas-2021" || post.slug === "acer-launch-2022"
              ? ["Digital Marketing"]
              : post.slug === "women-in-tech-event"
                ? ["Social Media"]
                : ["Web Development"],
          slug: post.slug,
          author: post.author,
        })),
    ],
    [],
  );
  const availableTags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))),
    [posts],
  );
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const filteredPosts = useMemo(() => {
    const visiblePosts =
      activeTags.length === 0
        ? posts
        : posts.filter((post) => post.tags.some((tag) => activeTags.includes(tag)));

    return [...visiblePosts].sort((a, b) => {
      const first = parseBlogDate(a.date).getTime();
      const second = parseBlogDate(b.date).getTime();
      return sortOrder === "newest" ? second - first : first - second;
    });
  }, [activeTags, posts, sortOrder]);

  const totalItems = filteredPosts.length;
  const pagedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(start, start + itemsPerPage);
  }, [currentPage, filteredPosts, itemsPerPage]);

  const toggleTag = (tag: string) => {
    setCurrentPage(1);
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  const clearAll = () => {
    setCurrentPage(1);
    setActiveTags([]);
    setSortOrder("newest");
    setActiveMenu(null);
  };

  useEffect(() => {
    if (!activeMenu) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (!filterControlsRef.current?.contains(target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [activeMenu]);

  return (
    <main className="min-h-screen bg-white text-[#0b0b0b]">
      <Navbar isOverlay={true} />
      <section className="relative overflow-hidden pt-32 sm:pt-40 md:pt-44">
        <div className="container-max pb-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <Reveal className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold leading-tight sm:text-[2.6rem]">The world of events and digital</h1>
              <div ref={filterControlsRef} className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="relative">
                  <motion.button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-[#cfd2d8] px-3 py-1 text-xs font-medium text-[#1f1f21] sm:text-sm"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveMenu((prev) => (prev === "category" ? null : "category"))}
                  >
                    Category <ChevronDown className="h-3.5 w-3.5" />
                  </motion.button>
                  {activeMenu === "category" ? (
                    <div className="absolute left-0 top-full z-20 mt-2 min-w-[200px] rounded-2xl border border-[#d8dbe1] bg-white p-2 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                      {availableTags.map((tag) => {
                        const isActive = activeTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm ${
                              isActive ? "bg-[#111216] text-white" : "text-[#1f1f21] hover:bg-[#f4f5f7]"
                            }`}
                            onClick={() => toggleTag(tag)}
                          >
                            <span>{tag}</span>
                            <span>{isActive ? "✓" : "+"}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                <div className="relative">
                  <motion.button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-[#cfd2d8] px-3 py-1 text-xs font-medium text-[#1f1f21] sm:text-sm"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveMenu((prev) => (prev === "date" ? null : "date"))}
                  >
                    Date <ChevronDown className="h-3.5 w-3.5" />
                  </motion.button>
                  {activeMenu === "date" ? (
                    <div className="absolute left-0 top-full z-20 mt-2 min-w-[180px] rounded-2xl border border-[#d8dbe1] bg-white p-2 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                      {[
                        { label: "Newest First", value: "newest" as const },
                        { label: "Oldest First", value: "oldest" as const },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm ${
                            sortOrder === option.value ? "bg-[#111216] text-white" : "text-[#1f1f21] hover:bg-[#f4f5f7]"
                          }`}
                          onClick={() => {
                            setCurrentPage(1);
                            setSortOrder(option.value);
                            setActiveMenu(null);
                          }}
                        >
                          <span>{option.label}</span>
                          <span>{sortOrder === option.value ? "✓" : ""}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.05} className="mt-4">
            <motion.button
              type="button"
              className="rounded-full border border-[#cfd2d8] px-3 py-1 text-xs text-[#1f1f21] sm:text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={clearAll}
            >
              Clear All
            </motion.button>
          </Reveal>

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
                  <div className="flex items-center gap-3">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#0b0b0b]">{post.author.name}</div>
                      <div className="text-xs text-[#5c5f66]">{post.author.role}</div>
                    </div>
                  </div>
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

          {pagedPosts.length === 0 ? (
            <div className="mt-8 rounded-[24px] border border-[#e5e7eb] bg-[#fafafa] px-6 py-10 text-center text-[#5c5f66]">
              No blog posts match the selected filters.
            </div>
          ) : null}

          <div className="mt-8 sm:mt-10">
            <Pagination
              totalItems={totalItems}
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
