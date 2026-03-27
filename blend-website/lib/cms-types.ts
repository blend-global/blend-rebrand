export type BlogAuthor = {
  name: string;
  role: string;
  avatar: string;
};

export type BlogEntry = {
  title: string;
  date?: string;
  description?: string;
  excerpt?: string;
  body?: string;
  slug: string;
  image: string;
  author?: BlogAuthor;
  tags?: string[];
};

export type BlogContent = {
  title: string;
  cta: string;
  featured: BlogEntry[];
  posts: BlogEntry[];
};

export type ServiceLink = {
  label: string;
  slug: string;
};

export type ServiceDetail = {
  summary: string;
  highlights: string[];
  deliverables: string[];
  outcomes: string[];
};

export type ServicesContent = {
  servicesContent: {
    title: string;
    description: string;
    digitalLabel: string;
    experientialLabel: string;
    digital: ServiceLink[];
    experiential: ServiceLink[];
  };
  serviceDetails: Record<string, ServiceDetail>;
};

export type CaseStudyStat = {
  value: string;
  label: string;
};

export type CaseStudyTab = {
  body: string;
  images: string[];
  stats?: CaseStudyStat[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  project: string;
  image: string;
  tags: string[];
  summary: string;
  tabs: Record<string, CaseStudyTab>;
};

export type CmsDataMap = {
  blog: BlogContent;
  services: ServicesContent;
  work: CaseStudy[];
};
