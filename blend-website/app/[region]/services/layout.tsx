import { ukContent } from "@/lib/regional-content";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  return createPageMetadata({
    region,
    title: "Services",
    description: region === "uk" ? ukContent.services.map(({ label }) => label).join(", ") : "Explore Blend's digital and experiential services, from creative design and video production to event management and brand activations.",
    path: "/services",
  });
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
