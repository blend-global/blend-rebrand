import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }) {
  return createPageMetadata({
    region: (await params).region,
    title: "Case Studies",
    description: "Explore how Blend brings brands to life through events, digital campaigns, video production, and immersive experiences.",
    path: "/case-studies",
  });
}

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
