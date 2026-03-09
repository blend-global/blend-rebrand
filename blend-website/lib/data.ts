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

export const servicesContent = {
  title: "Services",
  description: "We're here to turn challenges into unforgettable moments.",
  digitalLabel: "Digital",
  experientialLabel: "Experiential",
  digital: [
    { label: "Video Production", slug: "video-production" },
    { label: "Photography", slug: "photography" },
    { label: "Animation", slug: "animation" },
    { label: "Design & Creative", slug: "design-creative" },
    { label: "Web Development", slug: "web-development" },
    { label: "Live Streaming", slug: "live-streaming" },
    { label: "Hybrid & Virtual Events", slug: "hybrid-virtual-events" },
    { label: "Marketing/Advertising/Social Media", slug: "marketing-advertising-social-media" },
  ],
  experiential: [
    { label: "Event Production & Management", slug: "event-production-management" },
    { label: "Venue/Decor/Entertainment", slug: "venue-decor-entertainment" },
    { label: "RSVP Management", slug: "rsvp-management" },
    { label: "Guest Logistics", slug: "guest-logistics" },
    { label: "Swag & Gifting", slug: "swag-gifting" },
    { label: "Food & Beverage", slug: "food-beverage" },
    { label: "Staffing", slug: "staffing" },
    { label: "Experiential Marketing & Brand Activations", slug: "experiential-marketing-brand-activations" },
  ],
};

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

export const serviceDetails: Record<
  string,
  {
    summary: string;
    highlights: string[];
    deliverables: string[];
    outcomes: string[];
  }
> = {
  "video-production": {
    summary:
      "Story-first video production for launches, campaigns, and brand narratives. We handle pre-production through final delivery with cinematic craft and reliable timelines.",
    highlights: ["Creative direction", "Multi-camera production", "On-location + studio", "Post-production + grading"],
    deliverables: ["Campaign films", "Social cut-downs", "Product demos", "Testimonial edits"],
    outcomes: ["Higher watch time", "Clearer product messaging", "Consistent brand storytelling"],
  },
  photography: {
    summary:
      "Professional photography that captures your brand, people, and spaces with polish and consistency across every channel.",
    highlights: ["Brand-led art direction", "Event coverage", "Product + lifestyle", "Rapid selects + edits"],
    deliverables: ["Curated photo library", "Web + social assets", "Press-ready exports", "Event highlight set"],
    outcomes: ["Stronger visual identity", "More reusable content", "Faster content production"],
  },
  animation: {
    summary:
      "Motion design and animation that simplify complex ideas, energize campaigns, and elevate presentations.",
    highlights: ["2D + 3D motion", "Explainer storytelling", "Brand motion systems", "Sound + VO coordination"],
    deliverables: ["Explainer videos", "Animated ads", "UI motion kits", "Looping social assets"],
    outcomes: ["Improved comprehension", "Higher engagement", "Sharper brand perception"],
  },
  "design-creative": {
    summary:
      "Strategic design and creative direction that unifies your brand across digital, print, and experiential touchpoints.",
    highlights: ["Brand systems", "Campaign identity", "Presentation design", "Print + collateral"],
    deliverables: ["Brand guidelines", "Marketing toolkits", "Pitch decks", "Print-ready files"],
    outcomes: ["Consistent brand voice", "Faster campaign rollout", "Elevated customer trust"],
  },
  "web-development": {
    summary:
      "High-performance websites and platforms built for speed, accessibility, and growth.",
    highlights: ["UX-led builds", "Responsive engineering", "SEO-ready architecture", "Analytics integration"],
    deliverables: ["Marketing websites", "Landing pages", "CMS builds", "Performance optimization"],
    outcomes: ["Improved conversions", "Better search visibility", "Faster load times"],
  },
  "live-streaming": {
    summary:
      "Broadcast-quality live streams for conferences, launches, and hybrid experiences that perform reliably.",
    highlights: ["Multi-camera switching", "Live graphics + lower thirds", "Remote speaker support", "Redundant streaming"],
    deliverables: ["Live event streams", "Recorded sessions", "Highlight reels", "Engagement tools"],
    outcomes: ["Wider audience reach", "Stable streams", "Higher attendee satisfaction"],
  },
  "hybrid-virtual-events": {
    summary:
      "Hybrid and virtual events designed to connect audiences across locations with smooth production and interaction.",
    highlights: ["Platform selection", "Remote speaker ops", "Audience engagement", "Technical rehearsals"],
    deliverables: ["Hybrid event production", "Virtual event experiences", "Run of show", "Post-event assets"],
    outcomes: ["Increased attendance", "Global reach", "Actionable event insights"],
  },
  "marketing-advertising-social-media": {
    summary:
      "Integrated marketing and social media that turns campaign goals into measurable outcomes.",
    highlights: ["Campaign strategy", "Content calendars", "Paid media assets", "Community engagement"],
    deliverables: ["Campaign kits", "Social content", "Ad creatives", "Performance reports"],
    outcomes: ["Higher engagement", "Improved lead quality", "Consistent brand momentum"],
  },
  "event-production-management": {
    summary:
      "End-to-end event production that keeps every moving part aligned, on time, and on brand.",
    highlights: ["Production planning", "Vendor coordination", "On-site management", "Budget stewardship"],
    deliverables: ["Run of show", "Production schedules", "Vendor briefs", "Post-event wrap"],
    outcomes: ["Seamless execution", "Reduced event risk", "Better attendee experience"],
  },
  "venue-decor-entertainment": {
    summary:
      "Venue sourcing, decor, and entertainment that create a signature atmosphere for your audience.",
    highlights: ["Venue sourcing", "Stage + set design", "Entertainment booking", "Lighting + styling"],
    deliverables: ["Venue shortlist", "Decor concepts", "Entertainment lineup", "Production layouts"],
    outcomes: ["Elevated guest perception", "Memorable environments", "Cohesive event branding"],
  },
  "rsvp-management": {
    summary:
      "Smart RSVP workflows that streamline invites, confirmations, and guest communications.",
    highlights: ["Invitation systems", "Guest segmentation", "Automated reminders", "Check-in tooling"],
    deliverables: ["RSVP landing pages", "Guest lists", "Check-in reports", "Attendance analytics"],
    outcomes: ["Higher attendance", "Reduced admin load", "Clearer guest insights"],
  },
  "guest-logistics": {
    summary:
      "Guest logistics planned and executed to ensure smooth arrivals, movement, and on-site comfort.",
    highlights: ["Travel coordination", "On-site hospitality", "Shuttle planning", "Guest support"],
    deliverables: ["Guest itineraries", "Transport plans", "Hospitality desk setup", "On-site staffing"],
    outcomes: ["Lower friction", "Better guest satisfaction", "Improved event flow"],
  },
  "swag-gifting": {
    summary:
      "Thoughtful swag and gifting programs that reinforce your brand and leave a lasting impression.",
    highlights: ["Gift curation", "Branding + packaging", "Fulfillment planning", "Quality sourcing"],
    deliverables: ["Swag concepts", "Vendor sourcing", "Packaging designs", "Delivery schedule"],
    outcomes: ["Stronger brand recall", "Higher recipient delight", "Consistent brand presentation"],
  },
  "food-beverage": {
    summary:
      "Food and beverage experiences curated to match the tone, audience, and brand story of your event.",
    highlights: ["Menu curation", "Catering coordination", "Dietary planning", "Bar + service flow"],
    deliverables: ["Menu proposals", "Catering plans", "Service staffing", "On-site coordination"],
    outcomes: ["Elevated event experience", "Reduced service issues", "Better guest satisfaction"],
  },
  staffing: {
    summary:
      "Professional event staffing aligned to your event needs, brand tone, and operational standards.",
    highlights: ["Staff sourcing", "Training + briefing", "Uniform + brand alignment", "On-site supervision"],
    deliverables: ["Staffing plan", "Shift schedules", "On-site leads", "Post-event staffing report"],
    outcomes: ["Reliable execution", "Improved guest service", "Consistent brand presence"],
  },
  "experiential-marketing-brand-activations": {
    summary:
      "Immersive brand activations that spark attention, drive engagement, and create real-world impact.",
    highlights: ["Concept development", "Production design", "Audience engagement", "Measurement planning"],
    deliverables: ["Activation concepts", "Production plans", "Engagement mechanics", "Post-activation report"],
    outcomes: ["Higher foot traffic", "Stronger brand affinity", "Shareable moments"],
  },
};

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

export const testimonials = {
  title: "What people are saying about us",
  items: [
    {
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
      name: "Toby Louli",
      role: "Software Tester",
      avatar: "/placeholders/avatar-1.svg",
    },
    {
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
      name: "April Sui",
      role: "Coordinator",
      avatar: "/placeholders/avatar-2.svg",
    },
    {
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
      name: "Charlie Johnson",
      role: "Event Planner",
      avatar: "/placeholders/avatar-3.svg",
    },
  ],
};

export const blogSection = {
  title: "The world of events and digital",
  cta: "View All",
  featured: [
    {
      title: "Sunday , 1 Jan 2023",
      description: "How can design even help?",
      image: "/placeholders/blog-1.svg",
    },
    {
      title: "Sat , 12 Jun 2023",
      description: "The thing about events",
      image: "/placeholders/blog-2.svg",
    },
  ],
  posts: [
    { title: "FNB Christmas 2021", image: "/placeholders/blog-3.svg" },
    { title: "Work It Up", image: "/placeholders/blog-4.svg" },
    { title: "Acer Launch 2022", image: "/placeholders/blog-5.svg" },
    { title: "Women in Tech event", image: "/placeholders/blog-6.svg" },
    { title: "View all", image: "/placeholders/blog-7.svg" },
  ],
};

export const contactSection = {
  title: "Let's Talk",
  subtitle: "Reach out to us for any inquiries, collaborations, or to start your next big project.",
  email: "info@blend.com",
  phone: "+00 000 0000",
  address: "20 Viola Road Table View, Cape Town",
  socials: [
    { label: "Twitter", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
};

export const footerContent = {
  terms: "Terms / Policies",
  siteLinks: ["Home", "Our Services", "Our Work", "Blog", "Contact"],
  newsletterLabel: "Subscribe to Newsletter",
  copyright: "Copyright (c) Blend. All rights reserved",
  bbee: "B-BBEE Level 1 contributor",
};
