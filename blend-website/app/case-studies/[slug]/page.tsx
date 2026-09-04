import CaseStudyDetailsClient from "@/components/case-studies/CaseStudyDetailsClient";
import { workCaseStudies } from "@/lib/data";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return workCaseStudies.map(({ slug }) => ({ slug }));
}

export default function CaseStudyPage({ params }: Props) {
  return <CaseStudyDetailsClient params={params} />;
}
