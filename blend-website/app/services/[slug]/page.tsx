import Link from "next/link";
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

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white">
      <Navbar />
      <section className="container-max pb-20 pt-16 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="max-w-3xl">
            {details || service ? (
              <>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60 sm:text-sm">
                  {serviceCategory}
                </span>
                <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                  {serviceLabel}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
                  {details?.summary ??
                    `We design and deliver tailored ${serviceLabel.toLowerCase()} solutions that align with your goals and elevate every moment of your project.`}
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-white/70">
                  {(details?.highlights ?? []).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/75"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60 sm:text-sm">
                  Services
                </span>
                <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                  Service Details
                </h1>
                <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
                  We couldn&apos;t find that service. Explore our digital and experiential offerings to see how we can
                  help your team.
                </p>
              </>
            )}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <h2 className="text-lg font-semibold">What We Deliver</h2>
            <div className="mt-4 flex flex-col gap-2 text-sm text-white/80">
              {details?.deliverables?.length ? (
                details.deliverables.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-green-300 to-pink-400" />
                    <span>{item}</span>
                  </div>
                ))
              ) : (
                <span>Structured deliverables tailored to your goals.</span>
              )}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Need this service?</p>
              <p className="mt-2 text-sm text-white/80">
                Tell us about your goals and we&apos;ll craft the right scope.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-white/15 bg-[#111114] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_10px_25px_rgba(0,0,0,0.35)]"
              >
                Start a Project
              </Link>
            </div>
          </div>
        </div>

        {(details || service) && (
          <>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-lg font-semibold">Outcomes</h2>
                <div className="mt-4 space-y-2 text-sm text-white/75">
                  {(details?.outcomes ?? []).map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-lg font-semibold">How We Work</h2>
                <ol className="mt-4 space-y-3 text-sm text-white/75">
                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-xs">
                      1
                    </span>
                    <div>
                      <div className="font-semibold text-white">Discover</div>
                      <p className="text-white/70">Align on goals, audience, and success metrics.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-xs">
                      2
                    </span>
                    <div>
                      <div className="font-semibold text-white">Design</div>
                      <p className="text-white/70">Craft the creative, production plan, and deliverables.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-xs">
                      3
                    </span>
                    <div>
                      <div className="font-semibold text-white">Deliver</div>
                      <p className="text-white/70">Execute with precision and optimize for impact.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 via-white/0 to-white/5 p-6">
              <div>
                <h3 className="text-lg font-semibold">Explore more services</h3>
                <p className="text-sm text-white/70">
                  Browse the full list to find the right blend of digital and experiential support.
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white"
              >
                View All Services
              </Link>
            </div>
          </>
        )}
      </section>
      <Footer />
    </main>
  );
}
