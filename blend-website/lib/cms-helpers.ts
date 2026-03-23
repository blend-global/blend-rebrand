import type { BlogContent, BlogEntry, CaseStudy, ServicesContent } from "@/lib/cms-types";

export type BlogListItem = {
  title: string;
  date: string;
  excerpt: string;
  image: string;
  tags: string[];
  slug: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
};

const inferBlogTags = (post: BlogEntry) => {
  if (post.tags?.length) {
    return post.tags;
  }

  if (post.slug === "how-can-design-even-help") return ["Web Development"];
  if (post.slug === "fnb-christmas-2021" || post.slug === "acer-launch-2022") return ["Digital Marketing"];
  if (post.slug === "women-in-tech-event" || post.slug === "the-thing-about-events") return ["Social Media"];
  return ["Web Development"];
};

export const getBlogListItems = (blogSection: BlogContent): BlogListItem[] => [
  ...blogSection.featured
    .filter((post) => post.date && post.excerpt && post.author && post.description)
    .map((post) => ({
      title: post.description ?? post.title,
      date: post.date ?? "",
      excerpt: post.excerpt ?? "",
      image: post.image,
      tags: inferBlogTags(post),
      slug: post.slug,
      author: post.author!,
    })),
  ...blogSection.posts
    .filter((post) => post.slug !== "view-all" && post.author && post.date && post.excerpt)
    .map((post) => ({
      title: post.title,
      date: post.date ?? "",
      excerpt: post.excerpt ?? "",
      image: post.image,
      tags: inferBlogTags(post),
      slug: post.slug,
      author: post.author!,
    })),
];

export const getAllServices = (services: ServicesContent) => [
  ...services.servicesContent.digital.map((service) => ({
    ...service,
    category: services.servicesContent.digitalLabel,
  })),
  ...services.servicesContent.experiential.map((service) => ({
    ...service,
    category: services.servicesContent.experientialLabel,
  })),
];

export const getLatestCaseStudies = (caseStudies: CaseStudy[], limit = 3) => caseStudies.slice(0, limit);
