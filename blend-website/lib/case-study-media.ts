import type { CaseStudy } from "@/lib/cms-types";

const caseStudyImagePools: Record<string, string[]> = {
  "amazon-summer-2025": [
    "/case-studies/Amazon Summer Essentials Campaign/Amazon Summer Essentials Campaign-33.jpg",
    "/case-studies/Amazon Summer Essentials Campaign/Amazon Summer Essentials Campaign-63.jpg",
    "/case-studies/Amazon Summer Essentials Campaign/Amazon Summer Essentials Campaign-64.jpg",
    "/case-studies/Amazon Summer Essentials Campaign/Amazon Summer Essentials Campaign-77.jpg",
    "/case-studies/Amazon Summer Essentials Campaign/Amazon Summer Essentials Campaign-85.jpg",
    "/case-studies/Amazon Summer Essentials Campaign/Amazon Summer Essentials Campaign-135.jpg",
  ],
  "youtube-works-awards": [
    "/case-studies/Youtube Works Awards/AW_Youtube Works Awards-2.jpg",
    "/case-studies/Youtube Works Awards/AW_Youtube Works Awards-25.jpg",
    "/case-studies/Youtube Works Awards/AW_Youtube Works Awards-40.jpg",
    "/case-studies/Youtube Works Awards/AW_Youtube Works Awards-42.jpg",
    "/case-studies/Youtube Works Awards/AW_Youtube Works Awards-55.jpg",
    "/case-studies/Youtube Works Awards/AW_Youtube Works Awards-76.jpg",
    "/case-studies/Youtube Works Awards/AW_Youtube Works Awards-103.jpg",
    "/case-studies/Youtube Works Awards/AW_Youtube Works Awards-117.jpg",
    "/case-studies/Youtube Works Awards/AW_Youtube Works Awards-161.jpg",
  ],
  "google-cloud-ai-in-action-cape-town": [
    "/case-studies/AI In Wonderland (CTN)/LT_AI in Wonderland_CPT-2306.jpg",
    "/case-studies/AI In Wonderland (CTN)/LT_AI in Wonderland_CPT-2309.jpg",
    "/case-studies/AI In Wonderland (CTN)/LT_AI in Wonderland_CPT-2877.jpg",
    "/case-studies/AI In Wonderland (CTN)/LT_AI in Wonderland_CPT-3332.jpg",
    "/case-studies/AI In Wonderland (CTN)/LT_AI in Wonderland_CPT-3352.jpg",
    "/case-studies/AI In Wonderland (CTN)/LT_AI in Wonderland_CPT-3438.jpg",
    "/case-studies/AI In Wonderland (CTN)/MS_AI in Wonderland_CPT-211.jpg",
  ],
  "google-fast-start-photography": [
    "/case-studies/GoogleFastStart/GoogleFastStart_18022026-95.jpg",
    "/case-studies/GoogleFastStart/GoogleFastStart_18022026-118.jpg",
    "/case-studies/GoogleFastStart/GoogleFastStart_18022026-120.jpg",
    "/case-studies/GoogleFastStart/GoogleFastStart_18022026-164.jpg",
    "/case-studies/GoogleFastStart/GoogleFastStart_18022026-176.jpg",
    "/case-studies/GoogleFastStart/GoogleFastStart_18022026-231.jpg",
    "/case-studies/GoogleFastStart/GoogleFastStart_18022026-287.jpg",
  ],
  "shoprite-csi-rainbow-dolls": [
    "/case-studies/shoprite-csi-rainbow-dolls/EBP_5318.jpg",
    "/case-studies/shoprite-csi-rainbow-dolls/EBP_5346.jpg",
    "/case-studies/shoprite-csi-rainbow-dolls/EBP_5347.jpg",
    "/case-studies/shoprite-csi-rainbow-dolls/EBP_5411.jpg",
    "/case-studies/shoprite-csi-rainbow-dolls/EBP_5466.jpg",
    "/case-studies/shoprite-csi-rainbow-dolls/EBP_5498.jpg",
    "/case-studies/shoprite-csi-rainbow-dolls/EBP_5520.jpg",
    "/case-studies/shoprite-csi-rainbow-dolls/EBP_5530.jpg",
  ],
};

export const getCaseStudyVisitImages = (slug: string) => {
  const images = [...(caseStudyImagePools[slug] ?? [])];

  for (let index = images.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [images[index], images[randomIndex]] = [images[randomIndex], images[index]];
  }

  return images.slice(0, 4);
};

export const hasCaseStudyImagePool = (slug: string) => Boolean(caseStudyImagePools[slug]?.length);

export const getCaseStudyProject = (caseStudy: Pick<CaseStudy, "slug" | "project">) =>
  caseStudy.slug === "google-cloud-ai-in-action-cape-town"
    ? "AI In Wonderland (Capetown)"
    : caseStudy.project;

export const getCaseStudyCoverVideo = (caseStudy: Pick<CaseStudy, "coverVideo">) =>
  caseStudy.coverVideo ?? null;
