import { ukContent } from "@/lib/regional-content";
import ContactPageContent from "@/components/regions/ContactPageContent";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  return createPageMetadata({
    region,
    title: "Contact",
    description: region === "uk" ? ukContent.contact.description : "Start your next project with Blend. Get in touch about events, digital marketing, creative production, and immersive brand experiences.",
    path: "/contact",
  });
}

export default function ContactPage() { return <ContactPageContent />; }
