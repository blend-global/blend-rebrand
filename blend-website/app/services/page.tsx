"use client";

import Image from "next/image";
import { Sparkles, Zap, Globe, Video, Camera, Palette, Laptop, Radio, Users, Star, Utensils, UserCheck, Megaphone } from "lucide-react";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import Reveal from "@/components/Reveal";
import Link from "next/link";
// import { Button } from "@/components/ui/button";
import Header from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import type { ServicesContent } from "@/lib/cms-types";
import { getFirebaseDb } from "@/lib/firebase/client";
import { getServiceIllustration } from "@/lib/service-illustrations";

const digitalIconBySlug = {
  "video-production": Video,
  photography: Camera,
  animation: Sparkles,
  "design-creative": Palette,
  "web-development": Laptop,
  "live-streaming": Radio,
  "hybrid-virtual-events": Globe,
  "marketing-advertising-social-media": Megaphone,
} as const;

const experientialIconBySlug = {
  "event-production-management": Zap,
  "venue-decor-entertainment": Star,
  "rsvp-management": Users,
  "guest-logistics": Star,
  "swag-gifting": Sparkles,
  "food-beverage": Utensils,
  staffing: UserCheck,
  "experiential-marketing-brand-activations": Megaphone,
} as const;

type ServiceCard = {
  slug: string;
  title: string;
  description: string;
  features: string[];
  icon: typeof Video;
  category: string;
  accent: string;
};

const fallbackIcon = Sparkles;

const displayServiceTitle = (label: string) =>
  label
    .replace(/\//g, " / ")
    .replace(/\s*&\s*/g, " & ")
    .replace(/\s{2,}/g, " ")
    .trim();

const buildServiceCards = (
  services: Array<{ label: string; slug: string }>,
  serviceDetails: Record<string, { summary: string; highlights: string[]; deliverables: string[]; outcomes: string[] }>,
  iconMap: Record<string, typeof Video>,
  category: string,
  accent: string,
): ServiceCard[] =>
  services.map((service) => {
    const details = serviceDetails[service.slug];

    return {
      slug: service.slug,
      title: displayServiceTitle(service.label),
      description: details?.summary ?? "",
      features: (details?.highlights?.length ? details.highlights : details?.deliverables ?? []).slice(0, 4),
      icon: iconMap[service.slug] ?? fallbackIcon,
      category,
      accent,
    };
  });

const ServiceListingCard = ({ service }: { service: ServiceCard }) => {
  const illustration = getServiceIllustration(service.slug);

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block h-full overflow-hidden rounded-[1.45rem] border border-white/10 bg-white/[0.055] p-2 text-white shadow-[0_18px_54px_rgba(0,0,0,0.22)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/24 hover:bg-white/[0.08]"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.2rem] bg-[#101114] p-4">
        <div className={`absolute right-[-5rem] top-[-6rem] h-48 w-48 rounded-full bg-gradient-to-br ${service.accent} opacity-30 blur-3xl`} />
        <div className="relative flex items-start justify-between gap-4">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.95rem] bg-gradient-to-br ${service.accent}`}>
            <service.icon className="h-5 w-5 text-[#07100e]" aria-hidden="true" />
          </span>
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
            {service.category}
          </span>
        </div>

        <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-[1rem] border border-white/10 bg-black/30">
          {illustration ? (
            <div className={`relative h-full w-full bg-gradient-to-br ${service.accent}`}>
              <Image
                src={illustration}
                alt=""
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-contain p-4 drop-shadow-[0_16px_34px_rgba(0,0,0,0.26)] transition-transform duration-300 group-hover:scale-[1.03]"
                aria-hidden="true"
              />
            </div>
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${service.accent} opacity-35`} />
          )}
        </div>

        <div className="relative mt-4">
          <h3 className="truncate break-normal pb-1 text-xl font-semibold leading-[1.08] tracking-[-0.035em] text-white [overflow-wrap:normal] [word-break:normal] sm:text-2xl">
            {service.title}
          </h3>
          <p
            className="mt-2 h-[3rem] min-h-[3rem] max-h-[3rem] flex-none overflow-hidden text-sm leading-6 text-white/68"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
            }}
          >
            {service.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

async function readServicesFromFirestore(): Promise<ServicesContent> {
  const db = getFirebaseDb();
  const settingsDoc = await getDoc(doc(db, "cmsSettings", "services"));
  const servicesSnapshot = await getDocs(query(collection(db, "services"), orderBy("order")));
  const settings = settingsDoc.data() as
    | {
        title?: string;
        description?: string;
        digitalLabel?: string;
        experientialLabel?: string;
      }
    | undefined;

  const services = servicesSnapshot.docs.map((entry) => entry.data()) as Array<
    ServicesContent["servicesContent"]["digital"][number] &
      ServicesContent["serviceDetails"][string] & { category?: "digital" | "experiential" }
  >;

  const digital = services.filter((item) => item.category === "digital");
  const experiential = services.filter((item) => item.category === "experiential");

  return {
    servicesContent: {
      title: settings?.title ?? "Services",
      description: settings?.description ?? "",
      digitalLabel: settings?.digitalLabel ?? "Digital",
      experientialLabel: settings?.experientialLabel ?? "Experiential",
      digital: digital.map(({ label, slug }) => ({ label, slug })),
      experiential: experiential.map(({ label, slug }) => ({ label, slug })),
    },
    serviceDetails: Object.fromEntries(
      services.map((item) => [
        item.slug,
        {
          summary: item.summary ?? "",
          highlights: item.highlights ?? [],
          deliverables: item.deliverables ?? [],
          outcomes: item.outcomes ?? [],
        },
      ]),
    ),
  };
}

const ServicesPage = () => {
  const [servicesSection, setServicesSection] = useState<ServicesContent | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    void readServicesFromFirestore()
      .then((data) => {
        setServicesSection(data);
        setLoadError(null);
      })
      .catch((error) => {
        console.error("Failed to load services from Firestore.", error);
        setServicesSection(null);
        setLoadError("Unable to load services from Firestore.");
      });
  }, []);

  const servicesContent = servicesSection?.servicesContent ?? {
    title: "Services",
    description: "",
    digitalLabel: "Digital",
    experientialLabel: "Experiential",
    digital: [],
    experiential: [],
  };
  const serviceDetails = servicesSection?.serviceDetails ?? {};
  const digitalServices = buildServiceCards(
    servicesContent.digital,
    serviceDetails,
    digitalIconBySlug,
    servicesContent.digitalLabel,
    "from-[#6bd688] to-[#22d3ee]",
  );
  const experientialServices = buildServiceCards(
    servicesContent.experiential,
    serviceDetails,
    experientialIconBySlug,
    servicesContent.experientialLabel,
    "from-[#f36fb4] to-[#78d1ff]",
  );

  return (
    <div className="min-h-screen bg-background">
      <Header isOverlay={true} />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] bg-background overflow-hidden flex items-center pt-32 sm:pt-40 sm:min-h-[70vh]">
        {/* Gradient Orbs */}
        <div className="gradient-orb gradient-orb-pink h-[240px] w-[240px] -top-28 -left-28 animate-float sm:h-[400px] sm:w-[400px] sm:-top-32 sm:-left-32" />
        <div className="gradient-orb gradient-orb-cyan h-[200px] w-[200px] top-1/2 right-0 animate-float-delayed sm:h-[300px] sm:w-[300px]" />
        
        <div className="container-custom section-padding relative z-10 py-16 sm:py-20">
          <Reveal className="max-w-3xl">

            <h1 className="mb-6 text-3xl font-bold leading-tight text-primary-foreground sm:text-4xl md:text-6xl lg:text-7xl">
              Crafting Dreams,<br />
              <span className="text-gradient">Delivering Results</span>
            </h1>
            <p className="mb-8 max-w-xl text-base text-primary-foreground/70 sm:text-lg">
              From digital innovation to unforgettable experiences, we offer comprehensive solutions that elevate your brand and captivate your audience.
            </p>
            {loadError ? (
              <p className="mt-4 text-sm font-medium text-[#ffb3d1]">
                {loadError}
              </p>
            ) : null}
          </Reveal>
        </div>
      </section>

      {/* Experiential Services Section */}
      <section className="bg-background py-14 sm:py-20 md:py-32">
        <div className="container-custom section-padding">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl md:text-4xl">Experiential</h2>
              <span className="text-pink text-2xl">✦</span>
            </div>
            <p className="mb-10 max-w-2xl text-base text-primary-foreground/70 sm:text-lg">
              Immersive experiences that create lasting memories and forge powerful emotional connections with your audience.
            </p>
          </Reveal>
          
          <div className="relative">
            <div className="pointer-events-none absolute -inset-x-6 -inset-y-10 rounded-[2rem] bg-[radial-gradient(circle_at_18%_20%,rgba(243,111,180,0.16),transparent_34%),radial-gradient(circle_at_82%_78%,rgba(120,209,255,0.12),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.045),rgba(255,255,255,0))]" />
            <div className="relative z-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {experientialServices.map((service, index) => {
                return (
                <Reveal key={service.title} delay={0.03 * index}>
                  <ServiceListingCard service={service} />
                </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Digital Services Section */}
      <section className="bg-background py-14 sm:py-20 md:py-32">
        <div className="container-custom section-padding">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl md:text-4xl">Digital</h2>
              <span className="text-accent text-2xl">✦</span>
            </div>
            <p className="mb-10 max-w-2xl text-base text-primary-foreground/70 sm:text-lg">
              Innovative digital solutions that transform your ideas into powerful visual stories and experiences.
            </p>
          </Reveal>
          
          <div className="relative">
            <div className="pointer-events-none absolute -inset-x-6 -inset-y-10 rounded-[2rem] bg-[radial-gradient(circle_at_20%_76%,rgba(107,214,136,0.14),transparent_34%),radial-gradient(circle_at_82%_24%,rgba(34,211,238,0.13),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />
            <div className="relative z-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {digitalServices.map((service, index) => {
                return (
                <Reveal key={service.title} delay={0.03 * index}>
                  <ServiceListingCard service={service} />
                </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-background py-14 sm:py-20 md:py-32">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary-foreground" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary-foreground" />
        </div>
        
        <Reveal className="container-custom section-padding relative z-10 text-center">
          <h2 className="mb-6 text-2xl font-bold text-primary-foreground sm:text-3xl md:text-5xl">
            Ready to Create Something<br />
            <span className="text-gradient">Extraordinary?</span>
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base text-primary-foreground/70 sm:text-lg">
            Let&apos;s discuss how we can bring your vision to life with our comprehensive suite of services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="w-full rounded-full bg-accent px-6 py-3 text-center text-xs font-semibold text-white shadow-[0_12px_30px_rgba(17,203,155,0.35)] transition-transform hover:scale-[1.03] sm:w-auto sm:text-sm"
            >
              Start a Project
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
