import CaseStudyDetailsClient from "@/components/case-studies/CaseStudyDetailsClient";
import { workCaseStudies } from "@/lib/data";
import { notFound } from "next/navigation";
import { readCmsSection } from "@/lib/cms-server";
import { getCaseStudyCoverImage } from "@/lib/case-study-media";
import { createPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{
    slug: string;
    region: string;
  }>;
};

export function generateStaticParams() {
  return workCaseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug, region } = await params;
  const caseStudies = await readCmsSection("work");
  const item = caseStudies.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return createPageMetadata({ region,
    title: `${item.title} — ${item.project}`,
    description: item.summary,
    path: `/case-studies/${encodeURIComponent(slug)}`,
    image: getCaseStudyCoverImage(item),
  });
}

export default function CaseStudyPage({ params }: Props) {
  return <CaseStudyDetailsClient params={params} />;
}
