"use client";

import { ArrowRight, Play, Sparkles, Zap, Globe, Video, Camera, Palette, Code, Radio, Users, Star, Utensils, UserCheck, Megaphone } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import Link from "next/link";
// import { Button } from "@/components/ui/button";
import Header from "@/components/Navbar";
import Footer from "@/components/Footer";
import { servicesContent } from "@/lib/data";

const ServicesPage = () => {
  const digitalServices = [
    {
      icon: Video,
      title: "Video Production",
      description: "From concept to final cut, we create compelling video content that tells your story and captivates audiences.",
      features: ["Corporate Videos", "Commercials", "Documentaries", "Music Videos"],
    },
    {
      icon: Camera,
      title: "Photography",
      description: "Professional photography services that capture the essence of your brand and special moments.",
      features: ["Product Shots", "Event Coverage", "Portrait Sessions", "Aerial Photography"],
    },
    {
      icon: Sparkles,
      title: "Animation",
      description: "Bring ideas to life with stunning 2D and 3D animations that engage and inspire.",
      features: ["Motion Graphics", "3D Animation", "Character Animation", "Explainer Videos"],
    },
    {
      icon: Palette,
      title: "Design & Creative",
      description: "Strategic design solutions that elevate your brand identity and visual communication.",
      features: ["Brand Identity", "UI/UX Design", "Print Design", "Packaging"],
    },
    {
      icon: Code,
      title: "Web Development",
      description: "Custom websites and digital platforms built for performance, scalability, and user experience.",
      features: ["Custom Websites", "E-commerce", "Web Apps", "CMS Solutions"],
    },
    {
      icon: Radio,
      title: "Live Streaming",
      description: "Professional live streaming services for events, conferences, and virtual experiences.",
      features: ["Multi-camera Setup", "Real-time Graphics", "Global CDN", "Interactive Features"],
    },
    {
      icon: Globe,
      title: "Hybrid & Virtual Events",
      description: "Seamlessly blend physical and digital experiences for maximum reach and engagement.",
      features: ["Virtual Platforms", "Hybrid Production", "Audience Engagement", "Analytics"],
    },
    {
      icon: Megaphone,
      title: "Marketing & Advertising",
      description: "Data-driven marketing strategies that amplify your message and drive results.",
      features: ["Social Media", "Content Strategy", "Paid Campaigns", "Influencer Marketing"],
    },
  ];

  const experientialServices = [
    {
      icon: Zap,
      title: "Event Production & Management",
      description: "End-to-end event production services that transform visions into unforgettable experiences.",
      features: ["Concept Development", "Technical Production", "Project Management", "On-site Coordination"],
    },
    {
      icon: Star,
      title: "Venue, Decor & Entertainment",
      description: "Curated venues and stunning décor that set the perfect stage for your events.",
      features: ["Venue Sourcing", "Custom Décor", "Entertainment Booking", "Lighting Design"],
    },
    {
      icon: Users,
      title: "MICE Management",
      description: "Comprehensive meetings, incentives, conferences, and exhibitions management.",
      features: ["Corporate Meetings", "Incentive Programs", "Conferences", "Trade Shows"],
    },
    {
      icon: Star,
      title: "Talent",
      description: "Access to top-tier talent for performances, hosting, and brand representation.",
      features: ["Performers", "Speakers", "Brand Ambassadors", "Celebrity Talent"],
    },
    {
      icon: Sparkles,
      title: "Luxury Experience",
      description: "Bespoke luxury experiences crafted with attention to every detail.",
      features: ["VIP Services", "Private Events", "Exclusive Access", "Concierge"],
    },
    {
      icon: Utensils,
      title: "Food & Beverage",
      description: "Culinary experiences that delight and impress, from intimate gatherings to grand celebrations.",
      features: ["Catering", "Bar Services", "Menu Design", "Chef Experiences"],
    },
    {
      icon: UserCheck,
      title: "Staffing",
      description: "Professional event staff trained to deliver exceptional service.",
      features: ["Event Staff", "Hostesses", "Security", "Technical Crew"],
    },
    {
      icon: Megaphone,
      title: "Brand Activations",
      description: "Immersive brand experiences that create lasting connections with your audience.",
      features: ["Pop-up Events", "Product Launches", "Guerilla Marketing", "Experiential Campaigns"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header isOverlay={true} />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] bg-dark overflow-hidden flex items-center pt-32 sm:pt-40 sm:min-h-[70vh]">
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
              <motion.button
                className="rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-white shadow-[0_12px_30px_rgba(17,203,155,0.35)] sm:px-6 sm:py-3 sm:text-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started
              </motion.button>
              <motion.button
                className="flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-xs font-semibold text-white/90 sm:px-6 sm:py-3 sm:text-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Play className="w-4 h-4" />
                Watch Showreel
              </motion.button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Experiential Services Section */}
      <section className="bg-dark py-14 sm:py-20 md:py-32">
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
              const slug = servicesContent.experiential.find((item) => item.label === service.title)?.slug;
              return (
              <Reveal key={service.title} delay={0.03 * index}>
                <motion.div
                key={service.title}
                className="group rounded-2xl border border-primary-foreground/10 bg-dark-surface p-5 transition-all duration-300 hover:border-pink/50 hover:shadow-lg sm:p-6"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-pink/10 transition-colors group-hover:bg-pink/20 sm:h-12 sm:w-12">
                  <service.icon className="h-5 w-5 text-pink sm:h-6 sm:w-6" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-primary-foreground transition-colors group-hover:text-pink sm:text-lg">
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
                {slug ? (
                  <Link
                    href={`/services/${slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-pink opacity-100 transition-opacity sm:text-sm sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <motion.button
                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-pink opacity-100 transition-opacity sm:text-sm sm:opacity-0 sm:group-hover:opacity-100"
                    whileHover={{ x: 4 }}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </motion.div>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Digital Services Section */}
      <section className="bg-light py-14 sm:py-20 md:py-32">
        <div className="container-custom section-padding">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">Digital</h2>
              <span className="text-accent text-2xl">✦</span>
            </div>
            <p className="mb-10 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Innovative digital solutions that transform your ideas into powerful visual stories and experiences.
            </p>
          </Reveal>
          
          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {digitalServices.map((service, index) => {
              const slug = servicesContent.digital.find((item) => item.label === service.title)?.slug;
              return (
              <Reveal key={service.title} delay={0.03 * index}>
                <motion.div
                key={service.title}
                className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-accent/50 hover:shadow-lg sm:p-6"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20 sm:h-12 sm:w-12">
                  <service.icon className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground transition-colors group-hover:text-accent sm:text-lg">
                  {service.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {service.description}
                </p>
                <ul className="space-y-1">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-[11px] text-muted-foreground sm:text-xs">
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {slug ? (
                  <Link
                    href={`/services/${slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-100 transition-opacity sm:text-sm sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <motion.button
                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-100 transition-opacity sm:text-sm sm:opacity-0 sm:group-hover:opacity-100"
                    whileHover={{ x: 4 }}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </motion.div>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-light py-14 sm:py-20 md:py-32">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-foreground" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-foreground" />
        </div>
        
        <Reveal className="container-custom section-padding relative z-10 text-center">
          <h2 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl md:text-5xl">
            Ready to Create Something<br />
            <span className="text-gradient">Extraordinary?</span>
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base text-muted-foreground sm:text-lg">
            Let&apos;s discuss how we can bring your vision to life with our comprehensive suite of services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              className="w-full rounded-full bg-black px-6 py-3 text-xs font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.2)] sm:w-auto sm:text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Start a Project
            </motion.button>
            <motion.button
              className="w-full rounded-full border border-black/15 px-6 py-3 text-xs font-semibold text-black sm:w-auto sm:text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View Our Work
            </motion.button>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
