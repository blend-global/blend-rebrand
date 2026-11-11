import { notFound } from "next/navigation";
import BlogDetailsClient from "@/components/blog/BlogDetailsClient";
import { readCmsSection } from "@/lib/cms-server";
import { blogSection as fallbackBlogSection } from "@/lib/data";
import { cache } from "react";
import { createPageMetadata } from "@/lib/seo";

const getBlogSection = cache(() => readCmsSection("blog"));

interface Props {
  params: Promise<{
    slug: string;
    region: string;
  }>;
}

export const revalidate = 60;

export function generateStaticParams() {
  return [...fallbackBlogSection.featured, ...fallbackBlogSection.posts]
    .filter(({ slug }) => slug !== "view-all")
    .map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug, region } = await params;
  const section = await getBlogSection();
  const post = [...section.featured, ...section.posts].find((entry) => entry.slug === slug && slug !== "view-all");
  if (!post) notFound();
  return createPageMetadata({ region,
    title: post.title,
    description: post.description || post.excerpt || post.body,
    path: `/blog/${encodeURIComponent(slug)}`,
    image: post.image,
    article: true,
  });
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const blogSection = await getBlogSection();
  const post =
    blogSection.featured.find((item) => item.slug === slug) ||
    blogSection.posts.find((item) => item.slug === slug);

  if (!post || post.slug === "view-all") {
    notFound();
  }

  return <BlogDetailsClient blogSection={blogSection} post={post} />;
}
