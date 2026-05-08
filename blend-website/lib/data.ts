import blogPostsData from "@/content/blog-posts.json";
import caseStudiesData from "@/content/case-studies.json";
import servicesData from "@/content/services.json";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/work" },
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
  { src: "/new-client-logos/Into%20Africa.svg", alt: "Into Africa" },
  { src: "/new-client-logos/Deloitte.svg", alt: "Deloitte" },
  { src: "/new-client-logos/MS%20Dell%20Foundation.svg", alt: "MS Dell Foundation" },
  { src: "/new-client-logos/Cruz.svg", alt: "Cruz" },
  { src: "/new-client-logos/Geberit.svg", alt: "Geberit" },
  { src: "/new-client-logos/Huawei.svg", alt: "Huawei" },
  { src: "/new-client-logos/Heineken.svg", alt: "Heineken" },
  { src: "/new-client-logos/JSE.svg", alt: "JSE" },
  { src: "/new-client-logos/Google%20Cloud.svg", alt: "Google Cloud" },
  { src: "/new-client-logos/ZipZap.svg", alt: "ZipZap" },
  { src: "/new-client-logos/Empact.svg", alt: "Empact" },
  { src: "/new-client-logos/Liquid.svg", alt: "Liquid" },
  { src: "/new-client-logos/Ecolab.svg", alt: "Ecolab" },
  { src: "/new-client-logos/Red-Moon.svg", alt: "Red Moon" },
  { src: "/new-client-logos/Ecoflow.svg", alt: "Ecoflow" },
  { src: "/new-client-logos/Stanford.svg", alt: "Stanford" },
  { src: "/new-client-logos/Standard%20Bank.svg", alt: "Standard Bank" },
  { src: "/new-client-logos/Hollywoodbets.svg", alt: "Hollywoodbets" },
  { src: "/new-client-logos/Google.svg", alt: "Google" },
  { src: "/new-client-logos/Normet.svg", alt: "Normet" },
  { src: "/new-client-logos/YouTube.svg", alt: "YouTube" },
  { src: "/new-client-logos/Mesh.svg", alt: "Mesh" },
  { src: "/new-client-logos/Uber.svg", alt: "Uber" },
  { src: "/new-client-logos/Red%20Rocket.svg", alt: "Red Rocket" },
  { src: "/new-client-logos/Shoprite.svg", alt: "Shoprite" },
  { src: "/new-client-logos/AutoTrader.svg", alt: "AutoTrader" },
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
  siteLinks: ["Home", "Our Services", "Our Work", "Contact"],
  newsletterLabel: "Subscribe to Newsletter",
  copyright: "Copyright (c) Blend. All rights reserved",
  bbee: "B-BBEE Level 1 contributor",
};
