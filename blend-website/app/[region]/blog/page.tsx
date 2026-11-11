import BlogIndexClient from "@/components/blog/BlogIndexClient";
import { readCmsSection } from "@/lib/cms-server";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }) {
  return createPageMetadata({
    region: (await params).region,
    title: "Insights",
    description: "Stories, ideas, and insights from Blend on events, creative production, digital marketing, and meaningful brand experiences.",
    path: "/blog",
  });
}

export const revalidate = 60;

export default async function BlogPage() {
  const blogSection = await readCmsSection("blog");

  return <BlogIndexClient blogSection={blogSection} />;
}
