import blogPostsData from "@/content/blog-posts.json";
import caseStudiesData from "@/content/case-studies.json";
import servicesData from "@/content/services.json";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/work" },
  { label: "Blog", href: "/blog" },
];

export const heroContent = {
  title: "Empowering Connections Globally",
  subtitleLines: [
    "Creating quality experiences globally, blending events, digital marketing, and community engagement.",
    "Empowering connections and fostering innovation in every project.",
  ],
  cta: "Contact Us",
  media: "/placeholders/hero-placeholder.svg",
};

export const logos = [
  { src: "/client-logos/05.-Deloitte-Logo.svg", alt: "Deloitte" },
  { src: "/client-logos/06.-Zip-Zap-Logo.svg", alt: "Zip Zap" },
  { src: "/client-logos/07.-Shoprite-Logo.svg", alt: "Shoprite" },
  { src: "/client-logos/08.-Empact-Group-Logo.svg", alt: "Empact Group" },
  { src: "/client-logos/09.-2U-Logo.svg", alt: "2U" },
  { src: "/client-logos/10.-Geberit-Logo.svg", alt: "Geberit" },
  { src: "/client-logos/11.-YouTube-Logo.svg", alt: "YouTube" },
  { src: "/client-logos/12.-Google-Cloud-Logo.svg", alt: "Google Cloud" },
];

export const aboutContent = {
  title: "About Us",
  description:
    "Spanning across the EMEA/META regions, our specialised experience in events & marketing is what keeps our clients returning time and again.",
  statLabel: "Continents",
  statValue: "3+",
  media: "/placeholders/about-placeholder.svg",
};

export const servicesContent = servicesData.servicesContent;

export const allServices = [
  ...servicesContent.digital.map((service) => ({
    ...service,
    category: servicesContent.digitalLabel,
  })),
  ...servicesContent.experiential.map((service) => ({
    ...service,
    category: servicesContent.experientialLabel,
  })),
];

export const serviceDetails = servicesData.serviceDetails;

export const featuredService = {
  title: "Video Production",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  cta: "Start A Project",
  media: "/placeholders/video-placeholder.svg",
};

export const digitalServicesCTA = {
  title: "Give your business the edge with our Digital Services",
  services: servicesContent.digital,
};

export const latestWork = {
  title: "Our Latest Work",
  cta: "View Case Studies",
  items: [
    {
      client: "Google",
      tags: ["event management", "production"],
      image: "/placeholders/work-google.svg",
    },
    {
      client: "Deloitte",
      tags: ["event management", "logistics"],
      image: "/placeholders/work-deloitte.svg",
    },
    {
      client: "Geberit",
      tags: ["logistics", "production"],
      image: "/placeholders/work-geberit.svg",
    },
  ],
};

export const workCaseStudies = caseStudiesData;

export const testimonials = {
  title: "What people are saying about us",
  items: [
    {
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
      name: "Blend Member",
      role: "Software Tester",
      avatar: "/placeholders/avatar-1.svg",
    },
    {
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
      name: "Blend Member",
      role: "Coordinator",
      avatar: "/placeholders/avatar-2.svg",
    },
    {
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
      name: "Blend Member",
      role: "Event Planner",
      avatar: "/placeholders/avatar-3.svg",
    },
  ],
};

export const blogSection = blogPostsData;

export const contactSection = {
  title: "Let's Talk",
  subtitle: "Reach out to us for any inquiries, collaborations, or to start your next big project.",
  email: "info@blend.com",
  phone: "+00 000 0000",
  address: "20 Viola Road Table View, Cape Town",
  socials: [
    { label: "Twitter", href: "#" },
    { label: "Instagram", href: "https://www.instagram.com/blend.global" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/blend-eventlife/" },
  ],
};

export const footerContent = {
  terms: "Terms / Policies",
  siteLinks: ["Home", "Our Services", "Our Work", "Blog", "Contact"],
  newsletterLabel: "Subscribe to Newsletter",
  copyright: "Copyright (c) Blend. All rights reserved",
  bbee: "B-BBEE Level 1 contributor",
};
