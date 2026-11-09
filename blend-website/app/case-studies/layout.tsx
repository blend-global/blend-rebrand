import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Case Studies",
  description: "Explore how Blend brings brands to life through events, digital campaigns, video production, and immersive experiences.",
  path: "/case-studies",
});

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
