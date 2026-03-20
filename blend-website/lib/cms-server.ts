import { readFile, writeFile } from "fs/promises";
import path from "path";

export const cmsSections = {
  blog: {
    label: "Blog Posts",
    filename: "blog-posts.json",
  },
  services: {
    label: "Services",
    filename: "services.json",
  },
  work: {
    label: "Case Studies",
    filename: "case-studies.json",
  },
} as const;

export type CmsSection = keyof typeof cmsSections;

export const isCmsSection = (value: string): value is CmsSection => value in cmsSections;

const getContentPath = (section: CmsSection) =>
  path.join(process.cwd(), "content", cmsSections[section].filename);

export const readCmsSection = async (section: CmsSection) => {
  const content = await readFile(getContentPath(section), "utf8");
  return JSON.parse(content);
};

export const writeCmsSection = async (section: CmsSection, data: unknown) => {
  const filepath = getContentPath(section);
  await writeFile(filepath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
};
