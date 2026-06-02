import Image from "next/image";
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

const unsplashImage = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`;

const stockImagesBySlug: Record<string, Array<{ src: string; alt: string; label: string }>> = {
  "video-production": [
    { src: unsplashImage("photo-1492691527719-9d1e07e534b4"), alt: "Camera rig on a video production set", label: "Production" },
    { src: unsplashImage("photo-1574717024653-61fd2cf4d44d"), alt: "Editing timeline on a workstation", label: "Post" },
    { src: unsplashImage("photo-1536240478700-b869070f9279"), alt: "Video camera pointed at a studio scene", label: "Shoot" },
  ],
  photography: [
    { src: unsplashImage("photo-1516035069371-29a1b244cc32"), alt: "Professional camera in hand", label: "Coverage" },
    { src: unsplashImage("photo-1502982720700-bfff97f2ecac"), alt: "Camera lens close-up", label: "Detail" },
    { src: unsplashImage("photo-1452587925148-ce544e77e70d"), alt: "Photographer working on location", label: "Direction" },
  ],
  animation: [
    { src: unsplashImage("photo-1618005182384-a83a8bd57fbe"), alt: "Abstract motion-style digital shapes", label: "Motion" },
    { src: unsplashImage("photo-1550745165-9bc0b252726f"), alt: "Colorful digital screens", label: "Systems" },
    { src: unsplashImage("photo-1518005020951-eccb494ad742"), alt: "Abstract gradient artwork", label: "Visuals" },
  ],
  "design-creative": [
    { src: unsplashImage("photo-1497366754035-f200968a6e72"), alt: "Creative workspace with design tools", label: "Studio" },
    { src: unsplashImage("photo-1586717791821-3f44a563fa4c"), alt: "Designer reviewing a layout", label: "Brand" },
    { src: unsplashImage("photo-1518005020951-eccb494ad742"), alt: "Colorful abstract creative artwork", label: "Campaign" },
  ],
  "web-development": [
    { src: unsplashImage("photo-1515879218367-8466d910aaa4"), alt: "Code editor on a laptop screen", label: "Build" },
    { src: unsplashImage("photo-1498050108023-c5249f4df085"), alt: "Developer workspace with code", label: "Frontend" },
    { src: unsplashImage("photo-1555066931-4365d14bab8c"), alt: "Code displayed on a monitor", label: "Platform" },
  ],
  "live-streaming": [
    { src: unsplashImage("photo-1505373877841-8d25f7d46678"), alt: "Speaker presenting at a live event", label: "Broadcast" },
    { src: unsplashImage("photo-1516321318423-f06f85e504b3"), alt: "Laptop used for digital production", label: "Remote" },
    { src: unsplashImage("photo-1551818255-e6e10975bc17"), alt: "Live event audience and screen", label: "Stream" },
  ],
  "hybrid-virtual-events": [
    { src: unsplashImage("photo-1505373877841-8d25f7d46678"), alt: "Conference presentation with audience", label: "Hybrid" },
    { src: unsplashImage("photo-1587825140708-dfaf72ae4b04"), alt: "People attending a talk in an auditorium", label: "Audience" },
    { src: unsplashImage("photo-1516321318423-f06f85e504b3"), alt: "Laptop for virtual event operations", label: "Virtual" },
  ],
  "marketing-advertising-social-media": [
    { src: unsplashImage("photo-1460925895917-afdab827c52f"), alt: "Analytics dashboard on a laptop", label: "Performance" },
    { src: unsplashImage("photo-1552664730-d307ca884978"), alt: "Team planning a campaign", label: "Planning" },
    { src: unsplashImage("photo-1557838923-2985c318be48"), alt: "Marketing workspace with social content", label: "Content" },
  ],
  "event-production-management": [
    { src: unsplashImage("photo-1540575467063-178a50c2df87"), alt: "Conference audience and stage", label: "Run of Show" },
    { src: unsplashImage("photo-1501281668745-f7f57925c3b4"), alt: "Concert stage with lighting", label: "Production" },
    { src: unsplashImage("photo-1492684223066-81342ee5ff30"), alt: "Large audience at a live event", label: "Audience" },
  ],
  "venue-decor-entertainment": [
    { src: unsplashImage("photo-1519167758481-83f550bb49b3"), alt: "Styled event table setting", label: "Decor" },
    { src: unsplashImage("photo-1464366400600-7168b8af9bc3"), alt: "Event venue with tables and lighting", label: "Venue" },
    { src: unsplashImage("photo-1511795409834-ef04bbd61622"), alt: "Banquet table prepared for guests", label: "Atmosphere" },
  ],
  "rsvp-management": [
    { src: unsplashImage("photo-1516321318423-f06f85e504b3"), alt: "Laptop for guest registration workflows", label: "RSVP" },
    { src: unsplashImage("photo-1557804506-669a67965ba0"), alt: "Team coordinating details at a table", label: "Lists" },
    { src: unsplashImage("photo-1521791136064-7986c2920216"), alt: "Handshake during event coordination", label: "Guests" },
  ],
  "guest-logistics": [
    { src: unsplashImage("photo-1436491865332-7a61a109cc05"), alt: "Airport terminal for guest travel", label: "Travel" },
    { src: unsplashImage("photo-1521791136064-7986c2920216"), alt: "Guest coordination handshake", label: "Support" },
    { src: unsplashImage("photo-1557804506-669a67965ba0"), alt: "Team managing logistics plans", label: "Planning" },
  ],
  "swag-gifting": [
    { src: unsplashImage("photo-1512909006721-3d6018887383"), alt: "Gift boxes prepared for recipients", label: "Gifting" },
    { src: unsplashImage("photo-1513885535751-8b9238bd345a"), alt: "Wrapped branded-style packages", label: "Packaging" },
    { src: unsplashImage("photo-1549465220-1a8b9238cd48"), alt: "Curated gift presentation", label: "Curation" },
  ],
  "food-beverage": [
    { src: unsplashImage("photo-1555244162-803834f70033"), alt: "Catered food prepared for service", label: "Catering" },
    { src: unsplashImage("photo-1414235077428-338989a2e8c0"), alt: "Restaurant-style plated food", label: "Menu" },
    { src: unsplashImage("photo-1551218808-94e220e084d2"), alt: "Chef preparing food", label: "Service" },
  ],
  staffing: [
    { src: unsplashImage("photo-1556761175-b413da4baf72"), alt: "Team collaborating around a table", label: "Team" },
    { src: unsplashImage("photo-1521737604893-d14cc237f11d"), alt: "Professional staff in a team setting", label: "Briefing" },
    { src: unsplashImage("photo-1552664730-d307ca884978"), alt: "People coordinating work together", label: "Operations" },
  ],
  "experiential-marketing-brand-activations": [
    { src: unsplashImage("photo-1531058020387-3be344556be6"), alt: "Audience engaging at a live brand experience", label: "Activation" },
    { src: unsplashImage("photo-1505373877841-8d25f7d46678"), alt: "Speaker presenting to an audience", label: "Engagement" },
    { src: unsplashImage("photo-1527529482837-4698179dc6ce"), alt: "People gathered at a social event", label: "Experience" },
  ],
};

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
  const serviceStockImages = service ? stockImagesBySlug[service.slug] ?? [] : [];
  const carouselItems = [...serviceStockImages, ...serviceStockImages];

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
            <>
            {serviceStockImages.length > 0 && (
              <div className="relative mt-20 overflow-hidden rounded-[2rem] sm:mt-24">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#050608] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#050608] to-transparent" />
                <div className="service-carousel-track flex w-max gap-5">
                  {carouselItems.map((item, index) => (
                    <div
                      key={`${item.src}-${index}`}
                      className={`group relative h-[15rem] shrink-0 overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.045] shadow-[0_26px_70px_rgba(0,0,0,0.34)] ${
                        index % 3 === 1 ? "w-[24rem] sm:w-[31rem]" : "w-[19rem] sm:w-[25rem]"
                      }`}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 1024px) 31rem, 24rem"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/80 via-[#050608]/10 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-white/12 bg-[#050608]/66 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/76 backdrop-blur">
                          {item.label}
                        </span>
                        <span className={`h-2 w-12 rounded-full bg-gradient-to-r ${tone.accent}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 w-full rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5 sm:p-6">
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
            </>
          )}

        </div>
      </section>
      <Footer />
    </main>
  );
}
