import type { CaseStudy } from "@/lib/cms-types";

const coverVideoBySlug: Record<string, string> = {
  deloitte: "/case-studies/deloitte.mp4",
  geberit: "/case-studies/geberit.mp4",
  google: "/case-studies/google-cloud.mp4",
  shoprite: "/case-studies/shoprite.mp4",
};

export const getCaseStudyCoverVideo = (caseStudy: Pick<CaseStudy, "slug" | "coverVideo">) =>
  coverVideoBySlug[caseStudy.slug] ?? caseStudy.coverVideo ?? null;
