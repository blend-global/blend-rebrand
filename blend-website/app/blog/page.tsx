import BlogIndexClient from "@/components/blog/BlogIndexClient";
import { readCmsSection } from "@/lib/cms-server";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const blogSection = await readCmsSection("blog", { fallbackToFile: false });

  return <BlogIndexClient blogSection={blogSection} />;
}
