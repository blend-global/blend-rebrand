import { notFound } from "next/navigation";
import BlogDetailsClient from "@/components/blog/BlogDetailsClient";
import { readCmsSection } from "@/lib/cms-server";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const blogSection = await readCmsSection("blog", { fallbackToFile: false });
  const post =
    blogSection.featured.find((item) => item.slug === slug) ||
    blogSection.posts.find((item) => item.slug === slug);

  if (!post || post.slug === "view-all") {
    notFound();
  }

  return <BlogDetailsClient blogSection={blogSection} post={post} />;
}
