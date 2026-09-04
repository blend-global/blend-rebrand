import BlogIndexClient from "@/components/blog/BlogIndexClient";
import { readCmsSection } from "@/lib/cms-server";

export const revalidate = 60;

export default async function BlogPage() {
  const blogSection = await readCmsSection("blog");

  return <BlogIndexClient blogSection={blogSection} />;
}
