import ukContent from "@/content/uk.json";
import type { ServicesContent } from "@/lib/cms-types";

export { ukContent };

export const ukServices: ServicesContent = {
  servicesContent: {
    title: ukContent.servicesIntro.title,
    description: ukContent.servicesIntro.description,
    digitalLabel: "Digital",
    experientialLabel: "Experiential",
    digital: ukContent.services.map(({ label, slug }) => ({ label, slug })),
    experiential: [],
  },
  serviceDetails: Object.fromEntries(ukContent.services.map(({ slug, summary }) => [slug, {
    summary, highlights: [], deliverables: [], outcomes: [],
  }])),
};

export function regionalServices(region: string, shared: ServicesContent): ServicesContent {
  return region === "uk" ? ukServices : shared;
}
