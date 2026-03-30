import { readFile, writeFile } from "fs/promises";
import path from "path";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import type { BlogContent, CaseStudy, CmsDataMap, ServicesContent } from "@/lib/cms-types";
import { getServerFirestore, isFirestoreConfigured } from "@/lib/firestore-server";

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

const readContentFallback = async <T,>(section: CmsSection): Promise<T> => {
  const content = await readFile(getContentPath(section), "utf8");
  return JSON.parse(content);
};

const emptyBlogContent: BlogContent = {
  title: "The world of events and digital",
  cta: "View All",
  featured: [],
  posts: [],
};

const readBlogFromFirestore = async (): Promise<BlogContent | null> => {
  const db = getServerFirestore();
  const blogSettingsDoc = await getDoc(doc(db, "cmsSettings", "blog"));
  const postsSnapshot = await getDocs(query(collection(db, "blogPosts"), orderBy("order")));

  if (!blogSettingsDoc.exists() && postsSnapshot.empty) {
    return null;
  }

  const settings = blogSettingsDoc.data() as { title?: string; cta?: string } | undefined;
  const entries = postsSnapshot.docs.map((entry) => entry.data()) as Array<
    BlogContent["featured"][number] & { featured?: boolean }
  >;

  return {
    title: settings?.title ?? "The world of events and digital",
    cta: settings?.cta ?? "View All",
    featured: entries.filter((entry) => entry.featured),
    posts: entries.filter((entry) => !entry.featured),
  };
};

const writeBlogToFirestore = async (data: BlogContent) => {
  const db = getServerFirestore();
  const existing = await getDocs(collection(db, "blogPosts"));
  const nextIds = new Set([
    ...data.featured.map((item) => item.slug),
    ...data.posts.map((item) => item.slug),
  ]);

  await Promise.all(
    existing.docs
      .filter((item) => !nextIds.has(item.id))
      .map((item) => deleteDoc(doc(db, "blogPosts", item.id))),
  );

  await setDoc(doc(db, "cmsSettings", "blog"), {
    title: data.title,
    cta: data.cta,
  });

  await Promise.all([
    ...data.featured.map((item, index) =>
      setDoc(doc(db, "blogPosts", item.slug), {
        ...item,
        tags: item.tags ?? [],
        featured: true,
        order: index,
      }),
    ),
    ...data.posts.map((item, index) =>
      setDoc(doc(db, "blogPosts", item.slug), {
        ...item,
        tags: item.tags ?? [],
        featured: false,
        order: data.featured.length + index,
      }),
    ),
  ]);
};

const readServicesFromFirestore = async (): Promise<ServicesContent | null> => {
  const db = getServerFirestore();
  const settingsSnapshot = await getDocs(query(collection(db, "cmsSettings")));
  const servicesSettingsDoc = settingsSnapshot.docs.find((item) => item.id === "services");
  const servicesSnapshot = await getDocs(query(collection(db, "services"), orderBy("order")));

  if (!servicesSettingsDoc && servicesSnapshot.empty) {
    return null;
  }

  const settings = servicesSettingsDoc?.data() as
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

  const serviceDetails = Object.fromEntries(
    services.map((item) => [
      item.slug,
      {
        summary: item.summary ?? "",
        highlights: item.highlights ?? [],
        deliverables: item.deliverables ?? [],
        outcomes: item.outcomes ?? [],
      },
    ]),
  );

  return {
    servicesContent: {
      title: settings?.title ?? "Services",
      description: settings?.description ?? "",
      digitalLabel: settings?.digitalLabel ?? "Digital",
      experientialLabel: settings?.experientialLabel ?? "Experiential",
      digital: digital.map(({ label, slug }) => ({ label, slug })),
      experiential: experiential.map(({ label, slug }) => ({ label, slug })),
    },
    serviceDetails,
  };
};

const writeServicesToFirestore = async (data: ServicesContent) => {
  const db = getServerFirestore();
  const existing = await getDocs(collection(db, "services"));
  const nextIds = new Set([
    ...data.servicesContent.digital.map((item) => item.slug),
    ...data.servicesContent.experiential.map((item) => item.slug),
  ]);

  await Promise.all(
    existing.docs
      .filter((item) => !nextIds.has(item.id))
      .map((item) => deleteDoc(doc(db, "services", item.id))),
  );

  await setDoc(doc(db, "cmsSettings", "services"), {
    title: data.servicesContent.title,
    description: data.servicesContent.description,
    digitalLabel: data.servicesContent.digitalLabel,
    experientialLabel: data.servicesContent.experientialLabel,
  });

  await Promise.all([
    ...data.servicesContent.digital.map((item, index) =>
      setDoc(doc(db, "services", item.slug), {
        ...item,
        category: "digital",
        order: index,
        ...(data.serviceDetails[item.slug] ?? {
          summary: "",
          highlights: [],
          deliverables: [],
          outcomes: [],
        }),
      }),
    ),
    ...data.servicesContent.experiential.map((item, index) =>
      setDoc(doc(db, "services", item.slug), {
        ...item,
        category: "experiential",
        order: data.servicesContent.digital.length + index,
        ...(data.serviceDetails[item.slug] ?? {
          summary: "",
          highlights: [],
          deliverables: [],
          outcomes: [],
        }),
      }),
    ),
  ]);
};

const readWorkFromFirestore = async (): Promise<CaseStudy[] | null> => {
  const db = getServerFirestore();
  const workSnapshot = await getDocs(query(collection(db, "caseStudies"), orderBy("order")));

  if (workSnapshot.empty) {
    return null;
  }

  return workSnapshot.docs.map((entry) => {
    const data = entry.data();
    return {
      slug: data.slug,
      title: data.title,
      project: data.project,
      image: data.image,
      tags: data.tags ?? [],
      summary: data.summary,
      tabs: data.tabs ?? {},
    };
  }) as CaseStudy[];
};

const writeWorkToFirestore = async (data: CaseStudy[]) => {
  const db = getServerFirestore();
  const existing = await getDocs(collection(db, "caseStudies"));
  const nextIds = new Set(data.map((item) => item.slug));

  await Promise.all(
    existing.docs
      .filter((item) => !nextIds.has(item.id))
      .map((item) => deleteDoc(doc(db, "caseStudies", item.id))),
  );

  await Promise.all(
    data.map((item, index) =>
      setDoc(doc(db, "caseStudies", item.slug), {
        ...item,
        order: index,
      }),
    ),
  );
};

type ReadCmsSectionOptions = {
  fallbackToFile?: boolean;
};

const normalizeCmsReadError = (section: CmsSection, error: unknown) => {
  if (error instanceof Error) {
    return error;
  }

  const detail = error == null ? "Unknown Firestore read failure." : `Unexpected thrown value: ${String(error)}`;
  return new Error(`Failed to read CMS section "${section}" from Firestore. ${detail}`);
};

export const readCmsSection = async <T extends CmsSection>(
  section: T,
  options?: ReadCmsSectionOptions,
): Promise<CmsDataMap[T]> => {
  const fallbackToFile = options?.fallbackToFile ?? true;

  if (!isFirestoreConfigured) {
    return readContentFallback<CmsDataMap[T]>(section);
  }

  try {
    if (section === "blog") {
      const firestoreData = await readBlogFromFirestore();
      if (firestoreData) {
        return firestoreData as CmsDataMap[T];
      }

      if (fallbackToFile) {
        return (await readContentFallback("blog")) as CmsDataMap[T];
      }

      return emptyBlogContent as unknown as CmsDataMap[T];
    }

    if (section === "services") {
      const firestoreData = await readServicesFromFirestore();
      return (firestoreData ?? (await readContentFallback("services"))) as CmsDataMap[T];
    }

    const firestoreData = await readWorkFromFirestore();
    return (firestoreData ?? (await readContentFallback("work"))) as CmsDataMap[T];
  } catch (error) {
    const normalizedError = normalizeCmsReadError(section, error);

    if (fallbackToFile) {
      return readContentFallback<CmsDataMap[T]>(section);
    }

    throw normalizedError;
  }
};

export const writeCmsSection = async (section: CmsSection, data: unknown) => {
  if (!isFirestoreConfigured) {
    const filepath = getContentPath(section);
    await writeFile(filepath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    return;
  }

  if (section === "blog") {
    await writeBlogToFirestore(data as BlogContent);
    return;
  }

  if (section === "services") {
    await writeServicesToFirestore(data as ServicesContent);
    return;
  }

  await writeWorkToFirestore(data as CaseStudy[]);
};
