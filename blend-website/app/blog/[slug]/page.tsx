import { notFound } from "next/navigation";
import BlogDetailsClient from "@/components/blog/BlogDetailsClient";
import { readCmsSection } from "@/lib/cms-server";
import { blogSection as fallbackBlogSection } from "@/lib/data";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export function generateStaticParams() {
  return [...fallbackBlogSection.featured, ...fallbackBlogSection.posts]
    .filter(({ slug }) => slug !== "view-all")
    .map(({ slug }) => ({ slug }));
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const blogSection = await readCmsSection("blog");
  const post =
    blogSection.featured.find((item) => item.slug === slug) ||
    blogSection.posts.find((item) => item.slug === slug);

  if (!post || post.slug === "view-all") {
    notFound();
  }

  return <BlogDetailsClient blogSection={blogSection} post={post} />;
}
