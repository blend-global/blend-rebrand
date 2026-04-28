"use client";

import { ArrowRight, Play, Sparkles, Zap, Globe, Video, Camera, Palette, Code, Radio, Users, Star, Utensils, UserCheck, Megaphone } from "lucide-react";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import Reveal from "@/components/Reveal";
import Link from "next/link";
// import { Button } from "@/components/ui/button";
import Header from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import type { ServicesContent } from "@/lib/cms-types";
import { getFirebaseDb } from "@/lib/firebase/client";

const digitalIconBySlug = {
  "video-production": Video,
  photography: Camera,
  animation: Sparkles,
  "design-creative": Palette,
  "web-development": Code,
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
): ServiceCard[] =>
  services.map((service) => {
    const details = serviceDetails[service.slug];

    return {
      slug: service.slug,
      title: displayServiceTitle(service.label),
      description: details?.summary ?? "",
      features: (details?.highlights?.length ? details.highlights : details?.deliverables ?? []).slice(0, 4),
      icon: iconMap[service.slug] ?? fallbackIcon,
    };
  });

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
  const digitalServices = buildServiceCards(servicesContent.digital, serviceDetails, digitalIconBySlug);
  const experientialServices = buildServiceCards(
    servicesContent.experiential,
    serviceDetails,
    experientialIconBySlug,
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
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/80 sm:mb-6 sm:text-sm">
              <Sparkles className="w-4 h-4" />
              Our Services
            </span>
            <h1 className="mb-6 text-3xl font-bold leading-tight text-primary-foreground sm:text-4xl md:text-6xl lg:text-7xl">
              Crafting Dreams,<br />
              <span className="text-gradient">Delivering Results</span>
            </h1>
            <p className="mb-8 max-w-xl text-base text-primary-foreground/70 sm:text-lg">
              From digital innovation to unforgettable experiences, we offer comprehensive solutions that elevate your brand and captivate your audience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-white shadow-[0_12px_30px_rgba(17,203,155,0.35)] transition-transform hover:scale-[1.03] sm:px-6 sm:py-3 sm:text-sm"
              >
                Get Started
              </Link>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-xs font-semibold text-white/90 transition-transform hover:scale-[1.03] sm:px-6 sm:py-3 sm:text-sm"
              >
                <Play className="w-4 h-4" />
                Watch Showreel
              </a>
            </div>
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
          
          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {experientialServices.map((service, index) => {
              return (
              <Reveal key={service.title} delay={0.03 * index}>
                <div
                key={service.title}
                className="group rounded-2xl border border-primary-foreground/10 bg-dark-surface p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-pink/50 hover:shadow-lg sm:p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-pink/10 transition-colors group-hover:bg-pink/20 sm:h-12 sm:w-12">
                  <service.icon className="h-5 w-5 text-pink sm:h-6 sm:w-6" />
                </div>
                <h3 className="mb-2 min-h-[3.5rem] text-base font-semibold leading-snug text-primary-foreground transition-colors group-hover:text-pink sm:min-h-[4rem] sm:text-lg">
                  {service.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-primary-foreground/60">
                  {service.description}
                </p>
                <ul className="space-y-1">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-[11px] text-primary-foreground/50 sm:text-xs">
                      <span className="w-1 h-1 rounded-full bg-pink" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-pink opacity-100 transition-opacity sm:text-sm sm:opacity-0 sm:group-hover:opacity-100"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              </Reveal>
              );
            })}
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
          
          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {digitalServices.map((service, index) => {
              return (
              <Reveal key={service.title} delay={0.03 * index}>
                <div
                key={service.title}
                className="group rounded-2xl border border-primary-foreground/10 bg-dark-surface p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-lg sm:p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20 sm:h-12 sm:w-12">
                  <service.icon className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
                </div>
                <h3 className="mb-2 min-h-[3.5rem] text-base font-semibold leading-snug text-primary-foreground transition-colors group-hover:text-accent sm:min-h-[4rem] sm:text-lg">
                  {service.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-primary-foreground/60">
                  {service.description}
                </p>
                <ul className="space-y-1">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-[11px] text-primary-foreground/50 sm:text-xs">
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-100 transition-opacity sm:text-sm sm:opacity-0 sm:group-hover:opacity-100"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              </Reveal>
              );
            })}
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
            <Link
              href="/work"
              className="w-full rounded-full border border-primary-foreground/20 px-6 py-3 text-center text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.03] sm:w-auto sm:text-sm"
            >
              View Our Work
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
