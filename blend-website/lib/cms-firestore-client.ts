"use client";

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
import { getFirebaseDb } from "@/lib/firebase/client";

export type CmsSection = keyof CmsDataMap;

async function readFallbackSection<T extends CmsSection>(section: T): Promise<CmsDataMap[T]> {
  const response = await fetch(`/api/cms/${section}`, { cache: "no-store" });
  const payload = (await response.json()) as { data?: CmsDataMap[T]; error?: string };

  if (!response.ok || !payload.data) {
    throw new Error(payload.error ?? `Unable to load ${section} content.`);
  }

  return payload.data;
}

async function withFallback<T extends CmsSection>(
  section: T,
  reader: () => Promise<CmsDataMap[T]>,
  shouldFallback?: (data: CmsDataMap[T]) => boolean,
): Promise<CmsDataMap[T]> {
  try {
    const data = await reader();
    if (shouldFallback?.(data)) {
      return readFallbackSection(section);
    }
    return data;
  } catch {
    return readFallbackSection(section);
  }
}

async function readBlogSection(): Promise<BlogContent> {
  const db = getFirebaseDb();
  const settingsDoc = await getDoc(doc(db, "cmsSettings", "blog"));
  const postsSnapshot = await getDocs(query(collection(db, "blogPosts"), orderBy("order")));
  const settings = settingsDoc.data() as { title?: string; cta?: string } | undefined;
  const entries = postsSnapshot.docs.map((entry) => entry.data()) as Array<
    BlogContent["featured"][number] & { featured?: boolean }
  >;

  return {
    title: settings?.title ?? "The world of events and digital",
    cta: settings?.cta ?? "View All",
    featured: entries.filter((entry) => entry.featured),
    posts: entries.filter((entry) => !entry.featured),
  };
}

async function writeBlogSection(data: BlogContent) {
  const db = getFirebaseDb();
  const existing = await getDocs(collection(db, "blogPosts"));
  const nextIds = new Set([...data.featured.map((item) => item.slug), ...data.posts.map((item) => item.slug)]);

  await Promise.all(
    existing.docs.filter((item) => !nextIds.has(item.id)).map((item) => deleteDoc(doc(db, "blogPosts", item.id))),
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
}

async function readServicesSection(): Promise<ServicesContent> {
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

async function writeServicesSection(data: ServicesContent) {
  const db = getFirebaseDb();
  const existing = await getDocs(collection(db, "services"));
  const nextIds = new Set([
    ...data.servicesContent.digital.map((item) => item.slug),
    ...data.servicesContent.experiential.map((item) => item.slug),
  ]);

  await Promise.all(
    existing.docs.filter((item) => !nextIds.has(item.id)).map((item) => deleteDoc(doc(db, "services", item.id))),
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
}

async function readWorkSection(): Promise<CaseStudy[]> {
  const db = getFirebaseDb();
  const workSnapshot = await getDocs(query(collection(db, "caseStudies"), orderBy("order")));

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
}

async function writeWorkSection(data: CaseStudy[]) {
  const db = getFirebaseDb();
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
}

export async function readCmsSectionClient<T extends CmsSection>(section: T): Promise<CmsDataMap[T]> {
  if (section === "blog") {
    return withFallback(
      section,
      async () => (await readBlogSection()) as CmsDataMap[T],
      (data) => {
        const blogData = data as BlogContent;
        return blogData.featured.length === 0 && blogData.posts.length === 0;
      },
    );
  }

  if (section === "services") {
    return withFallback(
      section,
      async () => (await readServicesSection()) as CmsDataMap[T],
      (data) => {
        const servicesData = data as ServicesContent;
        return (
          servicesData.servicesContent.digital.length === 0 &&
          servicesData.servicesContent.experiential.length === 0
        );
      },
    );
  }

  return withFallback(
    section,
    async () => (await readWorkSection()) as CmsDataMap[T],
    (data) => (data as CaseStudy[]).length === 0,
  );
}

export async function writeCmsSectionClient<T extends CmsSection>(section: T, data: CmsDataMap[T]) {
  if (section === "blog") {
    await writeBlogSection(data as BlogContent);
    return;
  }

  if (section === "services") {
    await writeServicesSection(data as ServicesContent);
    return;
  }

  await writeWorkSection(data as CaseStudy[]);
}

export async function deleteCmsEntryClient(
  section: Exclude<CmsSection, "services"> | "services",
  slug: string,
  options?: { deleteSettings?: boolean },
) {
  const db = getFirebaseDb();

  if (section === "blog") {
    await deleteDoc(doc(db, "blogPosts", slug));
    if (options?.deleteSettings) {
      await deleteDoc(doc(db, "cmsSettings", "blog"));
    }
    return;
  }

  if (section === "services") {
    await deleteDoc(doc(db, "services", slug));
    if (options?.deleteSettings) {
      await deleteDoc(doc(db, "cmsSettings", "services"));
    }
    return;
  }

  await deleteDoc(doc(db, "caseStudies", slug));
}
