import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllServices } from "@/lib/cms-helpers";
import { readCmsSection } from "@/lib/cms-server";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");

const titleCase = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatServiceLabel = (label: string) => label.replaceAll("/", " / ");

const getServiceTone = (category: string) => {
  const isExperiential = category.toLowerCase().includes("experiential");

  return isExperiential
    ? {
        accent: "from-[#f36fb4] to-[#78d1ff]",
        soft: "from-[#f36fb4]/18 to-[#78d1ff]/12",
        orbPrimary: "bg-[#f36fb4]/20",
        orbSecondary: "bg-[#78d1ff]/16",
        text: "text-[#f6a6d4]",
      }
    : {
        accent: "from-[#6bd688] to-[#22d3ee]",
        soft: "from-[#6bd688]/18 to-[#22d3ee]/12",
        orbPrimary: "bg-[#6bd688]/18",
        orbSecondary: "bg-[#22d3ee]/18",
        text: "text-[#7de4c6]",
      };
};

const resolveService = (slug: string, allServices: ReturnType<typeof getAllServices>, serviceDetails: Record<string, { summary: string; highlights: string[]; deliverables: string[]; outcomes: string[] }>) => {
  const normalized = decodeURIComponent(slug).toLowerCase();
  const fromList =
    allServices.find((item) => item.slug === normalized) ||
    allServices.find((item) => slugify(item.label) === normalized);

  if (fromList) {
    return fromList;
  }

  if (serviceDetails[normalized]) {
    return {
      slug: normalized,
      label: titleCase(normalized),
      category: "Services",
    };
  }

  return null;
};

export async function generateStaticParams() {
  const servicesSection = await readCmsSection("services");
  return getAllServices(servicesSection).map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const servicesSection = await readCmsSection("services");
  const allServices = getAllServices(servicesSection);
  const serviceDetails = servicesSection.serviceDetails;
  const normalized = decodeURIComponent(slug).toLowerCase();
  const service = resolveService(slug, allServices, serviceDetails);
  const details = serviceDetails[normalized] ?? (service ? serviceDetails[service.slug] : null);
  const label = service?.label ?? (details ? titleCase(normalized) : null);
  const category = service?.category ?? "Services";

  if (!label) {
    return {
      title: "Service Details | Blend Services",
      description: "Explore Blend services designed for digital and experiential growth.",
    };
  }

  return {
    title: `${label} | Blend Services`,
    description: `Learn more about Blend's ${label.toLowerCase()} service in our ${category} offering.`,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const servicesSection = await readCmsSection("services");
  const allServices = getAllServices(servicesSection);
  const serviceDetails = servicesSection.serviceDetails;
  const normalized = decodeURIComponent(slug).toLowerCase();
  const service = resolveService(slug, allServices, serviceDetails);
  const details = serviceDetails[normalized] ?? (service ? serviceDetails[service.slug] : null);
  const serviceLabel = service?.label ?? (details ? titleCase(normalized) : "Service Details");
  const serviceCategory = service?.category ?? "Services";
  const tone = getServiceTone(serviceCategory);
  const deliverables = details?.deliverables?.length ? details.deliverables : ["Structured deliverables tailored to your goals."];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] text-white">
      <Navbar />
      <section className="relative pb-20 pt-28 sm:pt-36">
        <div className={`absolute left-[-10rem] top-[-10rem] h-96 w-96 rounded-full ${tone.orbSecondary} blur-3xl`} />
        <div className={`absolute bottom-[18rem] right-[-12rem] h-96 w-96 rounded-full ${tone.orbPrimary} blur-3xl`} />

        <div className="container-max relative">
          <Link
            href="/services"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/58 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All services
          </Link>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,720px)_max-content] lg:items-start lg:gap-16">
            <div className="max-w-4xl">
            {details || service ? (
              <>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-white/64">
                  <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${tone.accent}`} />
                  {serviceCategory}
                </span>
                <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                  {formatServiceLabel(serviceLabel)}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
                  {details?.summary ??
                    `We design and deliver tailored ${serviceLabel.toLowerCase()} solutions that align with your goals and elevate every moment of your project.`}
                </p>
              </>
            ) : (
              <>
                <span className="inline-flex rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-white/64">
                  Services
                </span>
                <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-6xl">
                  Service Details
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
                  We couldn&apos;t find that service. Explore our digital and experiential offerings to see how we can
                  help your team.
                </p>
              </>
            )}
            </div>

            <aside className="flex h-full items-end justify-start">
              <Link
                href="/contact"
                className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r ${tone.accent} px-8 py-3 text-sm font-bold text-[#07100e] shadow-[0_18px_42px_rgba(0,0,0,0.28)] transition-transform hover:-translate-y-0.5`}
              >
                Start a Project
              </Link>
            </aside>
          </div>

          {(details || service) && (
            <div className="mt-24 w-full rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5 sm:mt-28 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold tracking-[-0.025em]">What We Deliver</h2>
                <span className={`h-3 w-16 rounded-full bg-gradient-to-r ${tone.accent}`} />
              </div>
              <ul className="mt-6 flex flex-row flex-wrap gap-x-6 gap-y-3 text-sm leading-6 text-white/74">
                {deliverables.map((item) => (
                  <li key={item} className="flex min-w-[12rem] flex-1 items-start gap-3">
                    <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r ${tone.accent}`} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </section>
      <Footer />
    </main>
  );
}
