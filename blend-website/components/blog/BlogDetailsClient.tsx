"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { MotionLink } from "@/components/MotionLink";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBlogListItems } from "@/lib/cms-helpers";
import type { BlogContent, BlogEntry } from "@/lib/cms-types";
import { normalizeRichTextHtml } from "@/lib/rich-text";

type BlogDetailsClientProps = {
  blogSection: BlogContent;
  post: BlogEntry;
};

const getPostTitle = (post: BlogEntry) => post.description ?? post.title ?? "Blog post";

export default function BlogDetailsClient({ blogSection, post }: BlogDetailsClientProps) {
  const recentPosts = getBlogListItems(blogSection).filter((item) => item.slug !== post.slug).slice(0, 3);
  const postTitle = getPostTitle(post);
  const bodyHtml = normalizeRichTextHtml(post.body ?? post.excerpt ?? "This post does not have body content yet.");

  return (
    <main className="min-h-screen bg-white text-[#0b0b0b]">
      <Navbar />

      <section className="relative overflow-hidden pt-32 sm:pt-40 md:pt-44">
        <div className="container-max pb-16 lg:pb-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            <Reveal className="hidden w-full max-w-[320px] flex-shrink-0 space-y-6 lg:block">
              <h2 className="text-lg font-semibold">Recent blog posts</h2>
              <div className="space-y-6">
                {recentPosts.map((recentPost) => (
                  <MotionLink
                    key={recentPost.slug}
                    href={`/blog/${recentPost.slug}`}
                    className="space-y-3"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  >
                    <div className="overflow-hidden rounded-[14px] shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
                      <Image
                        src={recentPost.image}
                        alt={recentPost.title}
                        width={520}
                        height={360}
                        className="h-[160px] w-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-semibold text-[#6c5ce7]">{recentPost.date}</p>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-semibold leading-5">{recentPost.title}</h3>
                      <span className="text-base">↗</span>
                    </div>
                    <p className="text-xs leading-5 text-[#4d4f55]">{recentPost.excerpt}</p>
                  </MotionLink>
                ))}
              </div>
            </Reveal>

            <Reveal className="min-w-0 flex-1 space-y-6">
              <p className="text-xs font-semibold text-[#6c5ce7]">{post.date ?? "Recent"}</p>
              {post.author ? (
                <div className="flex items-center gap-3">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#111]">{post.author.name}</p>
                    <p className="text-sm text-[#5c5f66]">{post.author.role}</p>
                  </div>
                </div>
              ) : null}
              <h1 className="text-2xl font-semibold leading-tight sm:text-3xl md:text-[2.4rem]">{postTitle}</h1>

              <motion.div
                className="overflow-hidden rounded-[18px] shadow-[0_12px_28px_rgba(0,0,0,0.15)]"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              >
                <Image
                  src={post.image}
                  alt={postTitle}
                  width={980}
                  height={560}
                  className="h-[220px] w-full object-cover sm:h-[280px] md:h-[340px]"
                />
              </motion.div>

              <div
                className="space-y-4 text-sm leading-7 text-[#2f3137] [&_a]:font-medium [&_a]:text-[#111] [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-[#111]/20 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-6 [&_li]:list-item [&_ol]:my-4 [&_ol]:list-decimal [&_p]:mb-4 [&_ul]:my-4 [&_ul]:list-disc"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />

              <div className="mt-8 space-y-4 lg:hidden">
                <h2 className="text-lg font-semibold">Recent blog posts</h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {recentPosts.map((recentPost) => (
                    <MotionLink
                      key={recentPost.slug}
                      href={`/blog/${recentPost.slug}`}
                      className="min-w-[200px] space-y-3 sm:min-w-[220px]"
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    >
                      <div className="overflow-hidden rounded-[14px] shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
                        <Image
                          src={recentPost.image}
                          alt={recentPost.title}
                          width={520}
                          height={360}
                          className="h-[120px] w-full object-cover sm:h-[140px]"
                        />
                      </div>
                      <p className="text-xs font-semibold text-[#6c5ce7]">{recentPost.date}</p>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold leading-5">{recentPost.title}</h3>
                        <span className="text-base">↗</span>
                      </div>
                      <p className="text-xs leading-5 text-[#4d4f55]">{recentPost.excerpt}</p>
                    </MotionLink>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
