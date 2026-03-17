"use client";

import { use } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const recentPosts = [
  {
    title: "The thing about events",
    date: "Sunday , 1 Jan 2023",
    excerpt: "Unravel the unique aspects that make events a powerful tool for connection and impact.",
    image: "/placeholders/blog-2.svg",
  },
  {
    title: "How to measure productivity",
    date: "Sunday , 1 Jan 2023",
    excerpt: "Explore effective techniques to quantify productivity and enhance your team’s performance.",
    image: "/placeholders/blog-3.svg",
  },
  {
    title: "To VR or not to VR",
    date: "Sunday , 1 Jan 2023",
    excerpt: "Delve into the pros and cons of virtual reality and its potential in modern applications.",
    image: "/placeholders/blog-4.svg",
  },
  {
    title: "Why networking really matters",
    date: "Sunday , 1 Jan 2023",
    excerpt: "Uncover the pivotal role of networking in forging valuable connections and advancing careers.",
    image: "/placeholders/blog-5.svg",
  },
  {
    title: "Not news, just Blend being awesome",
    date: "Sunday , 1 Jan 2023",
    excerpt: "Celebrating our latest achievements and innovations that set Blend apart from the rest.",
    image: "/placeholders/blog-6.svg",
  },
  {
    title: "The Vision Pro is actually giving!",
    date: "Sunday , 1 Jan 2023",
    excerpt: "Discover how the Vision Pro is revolutionizing industry standards with its cutting-edge features.",
    image: "/placeholders/blog-7.svg",
  },
];

import { blogSection } from "@/lib/data";
import { notFound } from "next/navigation";

const paragraphs = [
  "A grid system is a design tool used to arrange content on a webpage. It is a series of vertical and horizontal lines that create a matrix of intersecting points, which can be used to align and organize page elements. Grid systems are used to create a consistent look and feel across a website, and can help to make the layout more visually appealing and easier to navigate.",
  "If you’ve been to New York City and have walked the streets, it is easy to figure out how to get from one place to another because of the grid system that the city is built on. Just as the predictability of a city grid helps locals and tourists get around easily, so do webpage grids provide a structure that guides users and designers alike. Because of their consistent reference point, grids improve page readability and scannability and allow people to quickly get where they need to go.",
];

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const BlogDetailsPage = ({ params }: Props) => {
  const { slug } = use(params);

  // Find the relevant post from featured or standard posts
  const post =
    blogSection.featured.find((p) => p.slug === slug) ||
    blogSection.posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-[#0b0b0b]">
      <Navbar />

      <section className="container-max pb-16 pt-10 sm:pt-12 lg:pb-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          <Reveal className="hidden w-full max-w-[320px] flex-shrink-0 space-y-6 lg:block">
            <h2 className="text-lg font-semibold">Recent blog posts</h2>
            <div className="space-y-6">
              {recentPosts.map((post) => (
                <motion.article
                  key={post.title}
                  className="space-y-3"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                >
                  <div className="overflow-hidden rounded-[14px] shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={520}
                      height={360}
                      className="h-[160px] w-full object-cover"
                    />
                  </div>
                  <p className="text-xs font-semibold text-[#6c5ce7]">{post.date}</p>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold leading-5">{post.title}</h3>
                    <span className="text-base">↗</span>
                  </div>
                  <p className="text-xs leading-5 text-[#4d4f55]">{post.excerpt}</p>
                </motion.article>
              ))}
            </div>
          </Reveal>

          <Reveal className="min-w-0 flex-1 space-y-6">
            <p className="text-xs font-semibold text-[#6c5ce7]">{"date" in post ? (post as any).date : "Recent"}</p>
            <h1 className="text-2xl font-semibold leading-tight sm:text-3xl md:text-[2.4rem]">{post.title}</h1>

            <motion.div
              className="overflow-hidden rounded-[18px] shadow-[0_12px_28px_rgba(0,0,0,0.15)]"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <Image
                src={post.image}
                alt={post.title}
                width={980}
                height={560}
                className="h-[220px] w-full object-cover sm:h-[280px] md:h-[340px]"
              />
            </motion.div>

            <div className="space-y-4 text-sm leading-6 text-[#2f3137]">
              {paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <p className="text-center text-xs font-semibold text-[#4a4a4a]">
                Definition: A grid is made up of columns, gutters, and margins that provide a structure for the layout
                of elements on a page.
              </p>
            </div>

            <motion.div
              className="overflow-hidden rounded-[18px] shadow-[0_12px_28px_rgba(0,0,0,0.15)]"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <Image
                src="/placeholders/blog-3.svg"
                alt="Team working"
                width={980}
                height={560}
                className="h-[220px] w-full object-cover sm:h-[280px] md:h-[340px]"
              />
            </motion.div>
            <p className="text-center text-xs text-[#4a4a4a]">
              Definition: A grid is made up of columns, gutters, and margins that provide a structure for the layout of
              elements on a page.
            </p>

            <div className="space-y-4 text-sm leading-6 text-[#2f3137]">
              <p>
                There are three common grid types used in websites and interfaces: column grid, modular grid, and
                hierarchical grid.
              </p>
              <p>
                Column grid involves dividing a page into vertical columns. UI elements and content are then aligned to
                these columns.
              </p>
              <p>
                Modular grid extends the column grid further by adding rows to it. This intersection of columns and rows
                make up modules to which elements and content are aligned. Modular grids are great for ecommerce and
                listing pages, as rows are repeatable to accommodate browsing.
              </p>
              <p>
                Hierarchical grid: Content is organized by importance using columns, rows, and modules. The most
                important elements and pieces of content take up the biggest pieces of the grid.
              </p>
            </div>

            <div className="space-y-4 text-sm leading-6 text-[#2f3137]">
              <h2 className="text-base font-semibold text-[#111]">Breaking Down the Grid</h2>
              <p>
                Regardless of the type of grid you are using, the grid is made up of three elements: columns, gutters,
                and margins.
              </p>
              <p>
                <span className="font-semibold text-[#111]">Columns:</span> Columns take up most of the real estate in a
                grid. Elements and content are placed in columns. To adapt to any screen size, column widths are
                generally defined with percentages rather than fixed values and the number of columns will vary. For
                example, a grid on a mobile device might have 4 columns and a grid on a desktop might have 12 columns.
              </p>
              <p>
                <span className="font-semibold text-[#111]">Gutters:</span> The gutter is the space between columns that
                separates elements and content from different columns. Gutter widths are fixed values but can change
                based on different breakpoints. For example, wider gutters are appropriate for larger screens, whereas
                smaller gutters are appropriate for smaller screens like mobile.
              </p>
            </div>

            <motion.div
              className="overflow-hidden rounded-[18px] shadow-[0_12px_28px_rgba(0,0,0,0.15)]"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <Image
                src="/placeholders/blog-4.svg"
                alt="Studio workspace"
                width={980}
                height={560}
                className="h-[220px] w-full object-cover sm:h-[280px] md:h-[340px]"
              />
            </motion.div>
            <p className="text-center text-xs text-[#4a4a4a]">
              Three elements make up any grid: (1) columns, (2) gutters, and (3) margins.
            </p>

            <div className="space-y-4 text-sm leading-6 text-[#2f3137]">
              <h2 className="text-base font-semibold text-[#111]">Examples of Grids in Use</h2>
              <p className="font-semibold text-[#111]">Example 1: Hierarchical Grid</p>
              <p>
                Our first example is from The New York Times. This screen utilizes a hierarchical grid to create a
                newspaper-like reading experience. A desktop screen size, two main columns make up the hierarchical
                grid. The most important news story takes up the most space in the grid, the left column, followed by
                secondary and tertiary stories, which take up the smaller column and modules on the right.
              </p>
            </div>

            <motion.div
              className="overflow-hidden rounded-[18px] shadow-[0_12px_28px_rgba(0,0,0,0.15)]"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <Image
                src="/placeholders/blog-5.svg"
                alt="Greenhouse workspace"
                width={980}
                height={560}
                className="h-[220px] w-full object-cover sm:h-[280px] md:h-[340px]"
              />
            </motion.div>

            <div className="space-y-4 text-sm leading-6 text-[#2f3137]">
              <p>
                Always place content within columns, not gutters. The gutters should remain empty as you place elements
                on the grid in order to clearly separate and align content and elements.
              </p>
              <p>
                <span className="font-semibold text-[#111]">Consider using an 8px grid system.</span> For most common
                devices, the screen size in pixels is a multiple of 8. Keeping grid-component values at a multiple of 8
                will generally make it easier to scale and implement a grid.
              </p>
              <h2 className="text-base font-semibold text-[#111]">Conclusion</h2>
              <p>
                Grids not only provide designers a structure on which to base layouts, but they also improve readability
                and scannability for end users. Use a good grid system that easily adapts to various screen sizes.
              </p>
            </div>

            <div className="mt-8 space-y-4 lg:hidden">
              <h2 className="text-lg font-semibold">Recent blog posts</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {recentPosts.map((post) => (
                  <motion.article
                    key={post.title}
                    className="min-w-[200px] space-y-3 sm:min-w-[220px]"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  >
                    <div className="overflow-hidden rounded-[14px] shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={520}
                        height={360}
                        className="h-[120px] w-full object-cover sm:h-[140px]"
                      />
                    </div>
                    <p className="text-xs font-semibold text-[#6c5ce7]">{post.date}</p>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-5">{post.title}</h3>
                      <span className="text-base">↗</span>
                    </div>
                    <p className="text-xs leading-5 text-[#4d4f55]">{post.excerpt}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default BlogDetailsPage;
