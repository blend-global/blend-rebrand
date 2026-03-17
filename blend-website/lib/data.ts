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

export const workCaseStudies = [
  {
    slug: "google",
    title: "Google",
    project: "Cloud Partner Experience",
    image: "/placeholders/work-google.svg",
    tags: ["Event Management", "Photography", "Videography"],
    summary: "A hybrid brand experience built to connect Google Cloud partners through sharp production and polished storytelling.",
    tabs: {
      Context: {
        body:
          "Google needed a flagship partner experience that felt premium in-room while still translating clearly to remote audiences across multiple markets.",
        images: ["/placeholders/work-google.svg", "/placeholders/work-deloitte.svg"],
        stats: [
          { value: "300+", label: "Attendees" },
          { value: "1.2K", label: "Remote Views" },
          { value: "4", label: "Cities Activated" },
        ],
      },
      Problem: {
        body:
          "The challenge was balancing a high-touch live environment with a digital layer that felt equally considered, not like an afterthought.",
        images: ["/placeholders/work-deloitte.svg", "/placeholders/work-google.svg"],
      },
      Process: {
        body:
          "Blend handled planning, run-of-show development, content capture, and show-day coordination so every touchpoint stayed on brand and on time.",
        images: ["/placeholders/work-google.svg", "/placeholders/work-geberit.svg"],
        stats: [
          { value: "6", label: "Production Streams" },
          { value: "18", label: "Captured Sessions" },
          { value: "2", label: "Audience Modes" },
        ],
      },
      Solution: {
        body:
          "We delivered an integrated event format combining stage design, live capture, and post-event content that extended the campaign beyond the room.",
        images: ["/placeholders/work-google.svg", "/placeholders/work-deloitte.svg"],
      },
      Takeaway: {
        body:
          "The case proved that strong event strategy and production discipline can turn one moment into a reusable content system for future partner engagement.",
        images: ["/placeholders/work-google.svg", "/placeholders/work-geberit.svg"],
      },
    },
  },
  {
    slug: "deloitte",
    title: "Deloitte",
    project: "Future Leaders Summit",
    image: "/placeholders/work-deloitte.svg",
    tags: ["Social Media", "Staffing", "Web Development"],
    summary: "A multi-layered summit campaign spanning staffing, digital touchpoints, and on-site delivery for Deloitte’s next-gen audience.",
    tabs: {
      Context: {
        body:
          "Deloitte needed a summit platform that could attract, register, and guide attendees while presenting the event as modern and credible.",
        images: ["/placeholders/work-deloitte.svg", "/placeholders/work-google.svg"],
        stats: [
          { value: "850+", label: "Registrations" },
          { value: "92%", label: "Show-Up Rate" },
          { value: "3", label: "Audience Tracks" },
        ],
      },
      Problem: {
        body:
          "The experience had to feel seamless across pre-event communication, on-site staffing, and post-event follow-up without fragmenting the brand story.",
        images: ["/placeholders/work-geberit.svg", "/placeholders/work-deloitte.svg"],
      },
      Process: {
        body:
          "Blend built the event microsite, planned social content, staffed audience-facing roles, and supported the summit journey end to end.",
        images: ["/placeholders/work-deloitte.svg", "/placeholders/work-google.svg"],
        stats: [
          { value: "12", label: "Staff On Site" },
          { value: "5", label: "Campaign Weeks" },
          { value: "1", label: "Unified Journey" },
        ],
      },
      Solution: {
        body:
          "The final experience connected registration, communications, staffing, and branded content into one coordinated system.",
        images: ["/placeholders/work-deloitte.svg", "/placeholders/work-geberit.svg"],
      },
      Takeaway: {
        body:
          "For Deloitte, the win was not just turnout but a more cohesive event journey that made every touchpoint feel deliberate.",
        images: ["/placeholders/work-deloitte.svg", "/placeholders/work-google.svg"],
      },
    },
  },
  {
    slug: "geberit",
    title: "Geberit",
    project: "Product Showcase Series",
    image: "/placeholders/work-geberit.svg",
    tags: ["Videography", "Photography", "Animation"],
    summary: "A content-led case study built around product storytelling, event capture, and motion assets for Geberit’s showcase rollout.",
    tabs: {
      Context: {
        body:
          "Geberit wanted a launch format that could show product innovation clearly while generating photo, video, and animated assets for ongoing use.",
        images: ["/placeholders/work-geberit.svg", "/placeholders/work-google.svg"],
        stats: [
          { value: "40+", label: "Assets Delivered" },
          { value: "3", label: "Content Formats" },
          { value: "2", label: "Launch Phases" },
        ],
      },
      Problem: {
        body:
          "Technical products can be difficult to present in a way that feels visually engaging without losing clarity or credibility.",
        images: ["/placeholders/work-google.svg", "/placeholders/work-geberit.svg"],
      },
      Process: {
        body:
          "We structured the showcase around key product moments, then planned capture and animation outputs around those narratives.",
        images: ["/placeholders/work-geberit.svg", "/placeholders/work-deloitte.svg"],
        stats: [
          { value: "8", label: "Hero Edits" },
          { value: "24", label: "Photo Selections" },
          { value: "6", label: "Animated Loops" },
        ],
      },
      Solution: {
        body:
          "The result was a library of launch-ready assets that worked across event recaps, sales enablement, and brand storytelling.",
        images: ["/placeholders/work-geberit.svg", "/placeholders/work-google.svg"],
      },
      Takeaway: {
        body:
          "Geberit’s case showed the value of treating production as both an event deliverable and a long-tail content engine.",
        images: ["/placeholders/work-geberit.svg", "/placeholders/work-deloitte.svg"],
      },
    },
  },
  {
    slug: "shoprite",
    title: "Shoprite",
    project: "Retail Campaign Rollout",
    image: "/placeholders/work-deloitte.svg",
    tags: ["Swag and Gifting", "Email Marketing", "Social Media"],
    summary: "A retail-facing campaign combining gifting, digital communication, and social amplification to support a broader rollout.",
    tabs: {
      Context: {
        body:
          "Shoprite needed a campaign ecosystem that could support launch messaging across stores, internal teams, and social audiences.",
        images: ["/placeholders/work-deloitte.svg", "/placeholders/work-google.svg"],
        stats: [
          { value: "25K", label: "Email Reach" },
          { value: "18", label: "Store Touchpoints" },
          { value: "3", label: "Campaign Waves" },
        ],
      },
      Problem: {
        body:
          "The challenge was maintaining consistency across physical gifting, digital messaging, and social content while working to a fast retail timeline.",
        images: ["/placeholders/work-google.svg", "/placeholders/work-deloitte.svg"],
      },
      Process: {
        body:
          "Blend coordinated campaign assets, gifting logistics, and content distribution so every phase launched with the same message and visual standard.",
        images: ["/placeholders/work-deloitte.svg", "/placeholders/work-geberit.svg"],
        stats: [
          { value: "4", label: "Audience Segments" },
          { value: "12", label: "Content Variants" },
          { value: "1", label: "Unified Campaign" },
        ],
      },
      Solution: {
        body:
          "We delivered a blended rollout strategy that turned operational complexity into a more coherent public-facing campaign.",
        images: ["/placeholders/work-deloitte.svg", "/placeholders/work-google.svg"],
      },
      Takeaway: {
        body:
          "The Shoprite project demonstrated how disciplined coordination can make mixed-format campaigns feel simple and strong to the end audience.",
        images: ["/placeholders/work-deloitte.svg", "/placeholders/work-geberit.svg"],
      },
    },
  },
] as const;

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

export const blogSection = {
  title: "The world of events and digital",
  cta: "View All",
  featured: [
    {
      title: "Sunday , 1 Jan 2026",
      date: "Sunday , 1 Jan 2026",
      description: "How can design even help?",
      excerpt: "Discover how thoughtful design transforms user experience and drives business success.",
      slug: "how-can-design-even-help",
      image: "/placeholders/blog-1.svg",
      author: {
        name: "Blend Member",
        role: "Creative Strategist",
        avatar: "/placeholders/avatar-1.svg",
      },
    },
    {
      title: "Sat , 12 Jun 2026",
      date: "Sat , 12 Jun 2026",
      description: "The thing about events",
      excerpt: "Unravel the unique aspects that make events a powerful tool for connection and impact.",
      slug: "the-thing-about-events",
      image: "/placeholders/blog-2.svg",
      author: {
        name: "Blend Member",
        role: "Experiential Director",
        avatar: "/placeholders/avatar-2.svg",
      },
    },
  ],
  posts: [
    {
      title: "FNB Christmas 2021",
      date: "Thu , 9 Nov 2026",
      excerpt: "A behind-the-scenes look at crafting a festive brand experience at scale.",
      slug: "fnb-christmas-2021",
      image: "/placeholders/blog-3.svg",
      author: {
        name: "Blend Member",
        role: "Production Lead",
        avatar: "/placeholders/avatar-3.svg",
      },
    },
    {
      title: "Work It Up",
      date: "Mon , 15 Jan 2026",
      excerpt: "How bold creative systems help campaigns stay coherent across every touchpoint.",
      slug: "work-it-up",
      image: "/placeholders/blog-4.svg",
      author: {
        name: "Blend Member",
        role: "Creative Strategist",
        avatar: "/placeholders/avatar-1.svg",
      },
    },
    {
      title: "Acer Launch 2022",
      date: "Fri , 8 Mar 2026",
      excerpt: "Lessons from delivering a product launch experience that balanced precision and energy.",
      slug: "acer-launch-2022",
      image: "/placeholders/blog-5.svg",
      author: {
        name: "Blend Member",
        role: "Experiential Director",
        avatar: "/placeholders/avatar-2.svg",
      },
    },
    {
      title: "Women in Tech event",
      date: "Wed , 10 Apr 2026",
      excerpt: "Designing an event format that felt insightful, welcoming, and worth talking about.",
      slug: "women-in-tech-event",
      image: "/placeholders/blog-6.svg",
      author: {
        name: "Blend Member",
        role: "Production Lead",
        avatar: "/placeholders/avatar-3.svg",
      },
    },
    {
      title: "View all",
      slug: "view-all",
      image: "/placeholders/blog-7.svg",
    }, // Maybe we'll omit linking this one
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
