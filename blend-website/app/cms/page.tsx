"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import CmsAuthCard from "@/components/cms/CmsAuthCard";
import {
  getFirebaseAuth,
  getFirebaseClientConfigError,
  getFirebaseDb,
  getGoogleProvider,
  isFirebaseClientConfigured,
} from "@/lib/firebase/client";

type CmsSection = "blog" | "services" | "work";

type BlogAuthor = {
  name: string;
  role: string;
  avatar: string;
};

type BlogEntry = {
  title: string;
  date?: string;
  description?: string;
  excerpt?: string;
  slug: string;
  image: string;
  author?: BlogAuthor;
};

type BlogContent = {
  title: string;
  cta: string;
  featured: BlogEntry[];
  posts: BlogEntry[];
};

type ServiceLink = {
  label: string;
  slug: string;
};

type ServiceDetail = {
  summary: string;
  highlights: string[];
  deliverables: string[];
  outcomes: string[];
};

type ServicesContent = {
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

type CaseStudyStat = {
  value: string;
  label: string;
};

type CaseStudyTab = {
  body: string;
  images: string[];
  stats?: CaseStudyStat[];
};

type CaseStudy = {
  slug: string;
  title: string;
  project: string;
  image: string;
  tags: string[];
  summary: string;
  tabs: Record<string, CaseStudyTab>;
};

type CmsDataMap = {
  blog: BlogContent;
  services: ServicesContent;
  work: CaseStudy[];
};

type SectionConfig = {
  id: CmsSection;
  label: string;
  description: string;
  icon: typeof FileText;
};

const sections: SectionConfig[] = [
  {
    id: "blog",
    label: "Blog Posts",
    description: "Featured stories, post cards, and author metadata.",
    icon: FileText,
  },
  {
    id: "services",
    label: "Services",
    description: "Service taxonomy, labels, and detail content.",
    icon: LayoutDashboard,
  },
  {
    id: "work",
    label: "Case Studies",
    description: "Project cards, tabs, images, and stats.",
    icon: FolderKanban,
  },
];

const defaultServiceLink = (index: number): ServiceLink => ({
  label: `New Service ${index}`,
  slug: `new-service-${index}`,
});

const defaultServiceDetail = (): ServiceDetail => ({
  summary: "",
  highlights: [""],
  deliverables: [""],
  outcomes: [""],
});

const defaultCaseStudy = (): CaseStudy => ({
  slug: "new-case-study",
  title: "New Case Study",
  project: "Project Name",
  image: "/placeholders/work-google.svg",
  tags: ["New Tag"],
  summary: "Add a short summary for the work page and case study detail header.",
  tabs: {
    Context: {
      body: "",
      images: ["/placeholders/work-google.svg"],
      stats: [{ value: "", label: "" }],
    },
    Problem: {
      body: "",
      images: ["/placeholders/work-deloitte.svg"],
    },
    Process: {
      body: "",
      images: ["/placeholders/work-geberit.svg"],
      stats: [{ value: "", label: "" }],
    },
    Solution: {
      body: "",
      images: ["/placeholders/work-google.svg"],
    },
    Takeaway: {
      body: "",
      images: ["/placeholders/work-deloitte.svg"],
    },
  },
});

const cloneData = <T,>(data: T) => structuredClone(data);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isBlogContent = (value: unknown): value is BlogContent =>
  isRecord(value) && Array.isArray(value.featured) && Array.isArray(value.posts);

const isServicesContent = (value: unknown): value is ServicesContent =>
  isRecord(value) &&
  isRecord(value.servicesContent) &&
  isRecord(value.serviceDetails) &&
  Array.isArray(value.servicesContent.digital) &&
  Array.isArray(value.servicesContent.experiential);

const isCaseStudies = (value: unknown): value is CaseStudy[] =>
  Array.isArray(value);

const getDefaultSelection = (section: CmsSection, data: CmsDataMap[CmsSection]) => {
  if (section === "blog") {
    const blogData = data as BlogContent;
    if (blogData.featured[0]) return "featured:0";
    if (blogData.posts[0]) return "posts:0";
    return "settings";
  }

  if (section === "services") {
    const serviceData = data as ServicesContent;
    if (serviceData.servicesContent.digital[0]) {
      return `digital:${serviceData.servicesContent.digital[0].slug}`;
    }
    if (serviceData.servicesContent.experiential[0]) {
      return `experiential:${serviceData.servicesContent.experiential[0].slug}`;
    }
    return "settings";
  }

  const workData = data as CaseStudy[];
  return workData[0]?.slug ?? "new-case-study";
};

const getFirebaseErrorMessage = (error: unknown) => {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : null;

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "The email or password is incorrect.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/weak-password":
      return "Use a stronger password with at least 6 characters.";
    case "auth/missing-password":
      return "Enter a password to continue.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled before completion.";
    case "auth/popup-blocked":
      return "The Google sign-in popup was blocked by the browser.";
    default:
      return error instanceof Error ? error.message : "Unable to authenticate right now.";
  }
};

const createUserDocument = async (user: User, name?: string | null) => {
  const displayName = name?.trim() || user.displayName || "";

  await setDoc(
    doc(getFirebaseDb(), "users", user.uid),
    {
      uid: user.uid,
      email: user.email ?? "",
      name: displayName,
      photoURL: user.photoURL ?? "",
      providerIds: user.providerData.map((provider) => provider.providerId),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff4fb3]">{eyebrow}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
      <p className="max-w-2xl text-sm leading-6 text-white/65 sm:text-base">{description}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#ff4fb3]/60"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#ff4fb3]/60"
      />
    </label>
  );
}

function Panel({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#12161f] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description ? <p className="max-w-2xl text-sm leading-6 text-white/55">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function ArrayEditor({
  label,
  values,
  onChange,
  addLabel,
}: {
  label: string;
  values: string[];
  onChange: (nextValues: string[]) => void;
  addLabel: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-white/25 hover:text-white"
        >
          <Plus className="size-3.5" />
          {addLabel}
        </button>
      </div>
      <div className="space-y-2.5">
        {values.map((item, index) => (
          <div key={`${label}-${index}`} className="flex items-center gap-2">
            <input
              value={item}
              onChange={(event) => {
                const nextValues = [...values];
                nextValues[index] = event.target.value;
                onChange(nextValues);
              }}
              className="w-full rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#ff4fb3]/60"
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, valueIndex) => valueIndex !== index))}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#0f1218] text-white/70 transition hover:border-[#ff4fb3]/40 hover:text-white"
              aria-label={`Remove ${label} item ${index + 1}`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsEditor({
  values,
  onChange,
}: {
  values: CaseStudyStat[];
  onChange: (nextValues: CaseStudyStat[]) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Stats</span>
        <button
          type="button"
          onClick={() => onChange([...values, { value: "", label: "" }])}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-white/25 hover:text-white"
        >
          <Plus className="size-3.5" />
          Add Stat
        </button>
      </div>
      <div className="space-y-3">
        {values.map((stat, index) => (
          <div
            key={`stat-${index}`}
            className="grid gap-3 rounded-2xl border border-white/8 bg-[#0f1218] p-3 sm:grid-cols-[1fr_1.2fr_auto]"
          >
            <Field
              label="Value"
              value={stat.value}
              onChange={(value) => {
                const nextValues = [...values];
                nextValues[index] = { ...nextValues[index], value };
                onChange(nextValues);
              }}
            />
            <Field
              label="Label"
              value={stat.label}
              onChange={(value) => {
                const nextValues = [...values];
                nextValues[index] = { ...nextValues[index], label: value };
                onChange(nextValues);
              }}
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, valueIndex) => valueIndex !== index))}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-[#10131a] px-4 text-white/70 transition hover:border-[#ff4fb3]/40 hover:text-white"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CmsPage() {
  const [activeSection, setActiveSection] = useState<CmsSection>("blog");
  const [selectedEntry, setSelectedEntry] = useState("featured:0");
  const [selectedWorkTab, setSelectedWorkTab] = useState("Context");
  const [data, setData] = useState<CmsDataMap["blog"] | CmsDataMap["services"] | CmsDataMap["work"] | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(getFirebaseClientConfigError());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const activeSectionConfig = useMemo(
    () => sections.find((section) => section.id === activeSection) ?? sections[0],
    [activeSection],
  );

  useEffect(() => {
    if (!isFirebaseClientConfigured) {
      setAuthReady(true);
      setAuthUser(null);
      return;
    }

    const auth = getFirebaseAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthError(null);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadSection = async () => {
      if (!authReady) {
        setLoading(true);
        return;
      }

      if (!authUser) {
        setLoading(false);
        setData(null);
        setMessage(null);
        return;
      }

      setLoading(true);
      setMessage(null);
      setData(null);

      try {
        const response = await fetch(`/api/cms/${activeSection}`);
        const payload = (await response.json()) as { data?: unknown; error?: string };

        if (cancelled) return;

        if (!response.ok || !payload.data) {
          setMessage(payload.error ?? "Unable to load content.");
          setData(null);
          setLoading(false);
          return;
        }

        const isValidPayload =
          (activeSection === "blog" && isBlogContent(payload.data)) ||
          (activeSection === "services" && isServicesContent(payload.data)) ||
          (activeSection === "work" && isCaseStudies(payload.data));

        if (!isValidPayload) {
          setMessage("The CMS data shape for this section is invalid.");
          setData(null);
          setLoading(false);
          return;
        }

        setData(payload.data);
        setSelectedEntry(getDefaultSelection(activeSection, payload.data as CmsDataMap[CmsSection]));
        if (activeSection === "work") {
          setSelectedWorkTab("Context");
        }
        setLoading(false);
      } catch {
        if (!cancelled) {
          setMessage("Unable to load content.");
          setData(null);
          setLoading(false);
        }
      }
    };

    void loadSection();

    return () => {
      cancelled = true;
    };
  }, [activeSection, authReady, authUser]);

  const updateCurrentData = (updater: (current: CmsDataMap[CmsSection]) => CmsDataMap[CmsSection]) => {
    setData((current) => {
      if (!current) return current;
      return updater(current as CmsDataMap[CmsSection]);
    });
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/cms/${activeSection}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok) {
        setMessage(payload.error ?? "Unable to save content.");
      } else {
        setMessage(`${activeSectionConfig.label} saved.`);
      }
    } catch {
      setMessage("Unable to save content.");
    } finally {
      setSaving(false);
    }
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    if (!isFirebaseClientConfigured) return;

    setAuthSubmitting(true);
    setAuthError(null);

    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    } catch (error) {
      setAuthError(getFirebaseErrorMessage(error));
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleEmailCreateAccount = async (name: string, email: string, password: string) => {
    if (!isFirebaseClientConfigured) return;

    setAuthSubmitting(true);
    setAuthError(null);

    try {
      const trimmedName = name.trim();

      if (!trimmedName) {
        setAuthError("Enter your name to create an account.");
        return;
      }

      const credentials = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      await updateProfile(credentials.user, { displayName: trimmedName });
      await createUserDocument(credentials.user, trimmedName);
    } catch (error) {
      setAuthError(getFirebaseErrorMessage(error));
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseClientConfigured) return;

    setAuthSubmitting(true);
    setAuthError(null);

    try {
      const credentials = await signInWithPopup(getFirebaseAuth(), getGoogleProvider());
      const additionalUserInfo = getAdditionalUserInfo(credentials);

      if (additionalUserInfo?.isNewUser) {
        await createUserDocument(credentials.user);
      }
    } catch (error) {
      setAuthError(getFirebaseErrorMessage(error));
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (!isFirebaseClientConfigured) return;

    setAuthSubmitting(true);
    setMessage(null);

    try {
      await signOut(getFirebaseAuth());
      setData(null);
      setSelectedEntry("featured:0");
    } catch (error) {
      setAuthError(getFirebaseErrorMessage(error));
    } finally {
      setAuthSubmitting(false);
    }
  };

  const blogData = activeSection === "blog" && isBlogContent(data) ? data : null;
  const servicesData = activeSection === "services" && isServicesContent(data) ? data : null;
  const workData = activeSection === "work" && isCaseStudies(data) ? data : null;

  if (!authUser) {
    return (
      <main className="min-h-screen bg-[#090a0d] text-white">
        <section className="relative overflow-hidden pb-16 pt-12 sm:pt-16 md:pt-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,79,179,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(94,234,212,0.12),_transparent_30%)]" />
          <div className="relative mx-auto flex min-h-[70vh] w-full max-w-6xl items-center px-4 sm:px-6 lg:px-8 2xl:px-10">
            <CmsAuthCard
              authReady={authReady}
              isConfigured={isFirebaseClientConfigured}
              error={authError}
              submitting={authSubmitting}
              onEmailSignIn={handleEmailSignIn}
              onEmailCreateAccount={handleEmailCreateAccount}
              onGoogleSignIn={handleGoogleSignIn}
            />
          </div>
        </section>
      </main>
    );
  }

  const renderBlogEditor = () => {
    if (!blogData) return null;

    const [kind, rawIndex] = selectedEntry.split(":");
    const index = Number(rawIndex);
    const selectedPost =
      kind === "featured"
        ? blogData.featured[index]
        : kind === "posts"
          ? blogData.posts[index]
          : null;

    return (
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Panel title="Content Map" description="Browse collections, add items, and choose what to edit.">
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setSelectedEntry("settings")}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                selectedEntry === "settings"
                  ? "border-[#ff4fb3]/50 bg-[#171c27] text-white"
                  : "border-white/8 bg-[#0f1218] text-white/70 hover:border-white/18 hover:text-white"
              }`}
            >
              <p className="text-sm font-semibold">Page Settings</p>
              <p className="mt-1 text-xs text-white/45">Section title and CTA</p>
            </button>

            <div className="space-y-2">
              {blogData.featured.map((post, itemIndex) => (
                <button
                  key={`featured-${post.slug}-${itemIndex}`}
                  type="button"
                    onClick={() => setSelectedEntry(`featured:${itemIndex}`)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      selectedEntry === `featured:${itemIndex}`
                        ? "border-[#ff4fb3]/50 bg-[#171c27]"
                        : "border-white/8 bg-[#0f1218] hover:border-white/18"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{post.description || post.title}</p>
                    <p className="mt-1 text-xs text-white/45">{post.slug}</p>
                  </button>
                ))}
            </div>

            <div className="space-y-2">
              {blogData.posts.map((post, itemIndex) => (
                <button
                  key={`post-${post.slug}-${itemIndex}`}
                  type="button"
                    onClick={() => setSelectedEntry(`posts:${itemIndex}`)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      selectedEntry === `posts:${itemIndex}`
                        ? "border-[#ff4fb3]/50 bg-[#171c27]"
                        : "border-white/8 bg-[#0f1218] hover:border-white/18"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{post.title}</p>
                    <p className="mt-1 text-xs text-white/45">{post.slug}</p>
                  </button>
                ))}
            </div>
          </div>
        </Panel>

        {selectedEntry === "settings" ? (
          <Panel title="Blog Settings" description="These fields drive the listing page header and CTA.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Page Title"
                value={blogData.title}
                onChange={(value) =>
                  updateCurrentData((current) => ({
                    ...(cloneData(current as BlogContent) as BlogContent),
                    title: value,
                  }))
                }
              />
              <Field
                label="CTA Label"
                value={blogData.cta}
                onChange={(value) =>
                  updateCurrentData((current) => ({
                    ...(cloneData(current as BlogContent) as BlogContent),
                    cta: value,
                  }))
                }
              />
            </div>
          </Panel>
        ) : selectedPost ? (
          <div className="space-y-6">
            <Panel
              title="Post Editor"
              description="Edit the selected post just like a CMS entry."
              action={
                <button
                  type="button"
                  onClick={() => {
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as BlogContent);
                      if (kind === "featured") {
                        nextData.featured.splice(index, 1);
                      } else {
                        nextData.posts.splice(index, 1);
                      }
                      return nextData;
                    });
                    setSelectedEntry("settings");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#ff4fb3]/30 px-4 py-2 text-sm text-[#ff9fd4] transition hover:border-[#ff4fb3]/60 hover:text-white"
                >
                  <Trash2 className="size-4" />
                  Delete
                </button>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Card Title"
                  value={selectedPost.title}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as BlogContent);
                      const collection = kind === "featured" ? nextData.featured : nextData.posts;
                      collection[index] = { ...collection[index], title: value };
                      return nextData;
                    })
                  }
                />
                <Field
                  label="Slug"
                  value={selectedPost.slug}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as BlogContent);
                      const collection = kind === "featured" ? nextData.featured : nextData.posts;
                      collection[index] = { ...collection[index], slug: value };
                      return nextData;
                    })
                  }
                />
                <Field
                  label="Date"
                  value={selectedPost.date ?? ""}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as BlogContent);
                      const collection = kind === "featured" ? nextData.featured : nextData.posts;
                      collection[index] = { ...collection[index], date: value };
                      return nextData;
                    })
                  }
                />
                <Field
                  label="Image Path"
                  value={selectedPost.image}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as BlogContent);
                      const collection = kind === "featured" ? nextData.featured : nextData.posts;
                      collection[index] = { ...collection[index], image: value };
                      return nextData;
                    })
                  }
                />
              </div>

              <div className="mt-4 space-y-4">
                <Field
                  label="Headline"
                  value={selectedPost.description ?? ""}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as BlogContent);
                      const collection = kind === "featured" ? nextData.featured : nextData.posts;
                      collection[index] = { ...collection[index], description: value };
                      return nextData;
                    })
                  }
                />
                <TextAreaField
                  label="Excerpt"
                  value={selectedPost.excerpt ?? ""}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as BlogContent);
                      const collection = kind === "featured" ? nextData.featured : nextData.posts;
                      collection[index] = { ...collection[index], excerpt: value };
                      return nextData;
                    })
                  }
                  rows={4}
                />
              </div>
            </Panel>

            <Panel title="Author" description="Metadata shown on blog cards and detail pages.">
              <div className="grid gap-4 md:grid-cols-3">
                <Field
                  label="Name"
                  value={selectedPost.author?.name ?? ""}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as BlogContent);
                      const collection = kind === "featured" ? nextData.featured : nextData.posts;
                      collection[index] = {
                        ...collection[index],
                        author: {
                          name: value,
                          role: collection[index].author?.role ?? "",
                          avatar: collection[index].author?.avatar ?? "",
                        },
                      };
                      return nextData;
                    })
                  }
                />
                <Field
                  label="Role"
                  value={selectedPost.author?.role ?? ""}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as BlogContent);
                      const collection = kind === "featured" ? nextData.featured : nextData.posts;
                      collection[index] = {
                        ...collection[index],
                        author: {
                          name: collection[index].author?.name ?? "",
                          role: value,
                          avatar: collection[index].author?.avatar ?? "",
                        },
                      };
                      return nextData;
                    })
                  }
                />
                <Field
                  label="Avatar Path"
                  value={selectedPost.author?.avatar ?? ""}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as BlogContent);
                      const collection = kind === "featured" ? nextData.featured : nextData.posts;
                      collection[index] = {
                        ...collection[index],
                        author: {
                          name: collection[index].author?.name ?? "",
                          role: collection[index].author?.role ?? "",
                          avatar: value,
                        },
                      };
                      return nextData;
                    })
                  }
                />
              </div>
            </Panel>
          </div>
        ) : null}
      </div>
    );
  };

  const renderServicesEditor = () => {
    if (!servicesData) return null;

    const [kind, slug] = selectedEntry.split(":");
    const selectedService =
      kind === "digital"
        ? servicesData.servicesContent.digital.find((item) => item.slug === slug)
        : kind === "experiential"
          ? servicesData.servicesContent.experiential.find((item) => item.slug === slug)
          : null;

    const selectedDetails = slug ? servicesData.serviceDetails[slug] : null;

    return (
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Panel title="Service Collections" description="Manage categories, service cards, and long-form detail content.">
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setSelectedEntry("settings")}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                selectedEntry === "settings"
                  ? "border-[#ff4fb3]/50 bg-[#171c27] text-white"
                  : "border-white/8 bg-[#0f1218] text-white/70 hover:border-white/18 hover:text-white"
              }`}
            >
              <p className="text-sm font-semibold">Page Settings</p>
              <p className="mt-1 text-xs text-white/45">Title, description, and category labels</p>
            </button>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                  {servicesData.servicesContent.digitalLabel}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const nextIndex = servicesData.servicesContent.digital.length + 1;
                    const nextService = defaultServiceLink(nextIndex);
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as ServicesContent);
                      nextData.servicesContent.digital.push(nextService);
                      nextData.serviceDetails[nextService.slug] = defaultServiceDetail();
                      return nextData;
                    });
                    setSelectedEntry(`digital:${nextService.slug}`);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-2.5 py-1 text-xs text-white/75"
                >
                  <Plus className="size-3.5" />
                  Add
                </button>
              </div>
              {servicesData.servicesContent.digital.map((service) => (
                <button
                  key={`digital-${service.slug}`}
                  type="button"
                    onClick={() => setSelectedEntry(`digital:${service.slug}`)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      selectedEntry === `digital:${service.slug}`
                        ? "border-[#ff4fb3]/50 bg-[#171c27]"
                        : "border-white/8 bg-[#0f1218] hover:border-white/18"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{service.label}</p>
                    <p className="mt-1 text-xs text-white/45">{service.slug}</p>
                  </button>
                ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                  {servicesData.servicesContent.experientialLabel}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const nextIndex = servicesData.servicesContent.experiential.length + 1;
                    const nextService = defaultServiceLink(nextIndex);
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as ServicesContent);
                      nextData.servicesContent.experiential.push(nextService);
                      nextData.serviceDetails[nextService.slug] = defaultServiceDetail();
                      return nextData;
                    });
                    setSelectedEntry(`experiential:${nextService.slug}`);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-2.5 py-1 text-xs text-white/75"
                >
                  <Plus className="size-3.5" />
                  Add
                </button>
              </div>
              {servicesData.servicesContent.experiential.map((service) => (
                <button
                  key={`experiential-${service.slug}`}
                  type="button"
                    onClick={() => setSelectedEntry(`experiential:${service.slug}`)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      selectedEntry === `experiential:${service.slug}`
                        ? "border-[#ff4fb3]/50 bg-[#171c27]"
                        : "border-white/8 bg-[#0f1218] hover:border-white/18"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{service.label}</p>
                    <p className="mt-1 text-xs text-white/45">{service.slug}</p>
                  </button>
                ))}
            </div>
          </div>
        </Panel>

        {selectedEntry === "settings" ? (
          <Panel title="Service Page Settings" description="Edit the service page heading and category labels.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Page Title"
                value={servicesData.servicesContent.title}
                onChange={(value) =>
                  updateCurrentData((current) => {
                    const nextData = cloneData(current as ServicesContent);
                    nextData.servicesContent.title = value;
                    return nextData;
                  })
                }
              />
              <Field
                label="Digital Label"
                value={servicesData.servicesContent.digitalLabel}
                onChange={(value) =>
                  updateCurrentData((current) => {
                    const nextData = cloneData(current as ServicesContent);
                    nextData.servicesContent.digitalLabel = value;
                    return nextData;
                  })
                }
              />
              <Field
                label="Experiential Label"
                value={servicesData.servicesContent.experientialLabel}
                onChange={(value) =>
                  updateCurrentData((current) => {
                    const nextData = cloneData(current as ServicesContent);
                    nextData.servicesContent.experientialLabel = value;
                    return nextData;
                  })
                }
              />
            </div>
            <div className="mt-4">
              <TextAreaField
                label="Description"
                value={servicesData.servicesContent.description}
                onChange={(value) =>
                  updateCurrentData((current) => {
                    const nextData = cloneData(current as ServicesContent);
                    nextData.servicesContent.description = value;
                    return nextData;
                  })
                }
              />
            </div>
          </Panel>
        ) : selectedService && selectedDetails ? (
          <div className="space-y-6">
            <Panel
              title="Service Card"
              description="Controls the service listing entry and slug used for the detail page."
              action={
                <button
                  type="button"
                  onClick={() => {
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as ServicesContent);
                      const collection =
                        kind === "digital" ? nextData.servicesContent.digital : nextData.servicesContent.experiential;
                      const itemIndex = collection.findIndex((item) => item.slug === slug);
                      if (itemIndex >= 0) {
                        const removedSlug = collection[itemIndex].slug;
                        collection.splice(itemIndex, 1);
                        delete nextData.serviceDetails[removedSlug];
                      }
                      return nextData;
                    });
                    setSelectedEntry("settings");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#ff4fb3]/30 px-4 py-2 text-sm text-[#ff9fd4] transition hover:border-[#ff4fb3]/60 hover:text-white"
                >
                  <Trash2 className="size-4" />
                  Delete
                </button>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Label"
                  value={selectedService.label}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as ServicesContent);
                      const collection =
                        kind === "digital" ? nextData.servicesContent.digital : nextData.servicesContent.experiential;
                      const itemIndex = collection.findIndex((item) => item.slug === slug);
                      if (itemIndex >= 0) {
                        collection[itemIndex] = { ...collection[itemIndex], label: value };
                      }
                      return nextData;
                    })
                  }
                />
                <Field
                  label="Slug"
                  value={selectedService.slug}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as ServicesContent);
                      const collection =
                        kind === "digital" ? nextData.servicesContent.digital : nextData.servicesContent.experiential;
                      const itemIndex = collection.findIndex((item) => item.slug === slug);
                      if (itemIndex >= 0) {
                        const previousSlug = collection[itemIndex].slug;
                        collection[itemIndex] = { ...collection[itemIndex], slug: value };
                        nextData.serviceDetails[value] = nextData.serviceDetails[previousSlug] ?? defaultServiceDetail();
                        if (previousSlug !== value) {
                          delete nextData.serviceDetails[previousSlug];
                          setSelectedEntry(`${kind}:${value}`);
                        }
                      }
                      return nextData;
                    })
                  }
                />
              </div>
            </Panel>

            <Panel title="Service Detail" description="This content powers the service detail page.">
              <TextAreaField
                label="Summary"
                value={selectedDetails.summary}
                onChange={(value) =>
                  updateCurrentData((current) => {
                    const nextData = cloneData(current as ServicesContent);
                    nextData.serviceDetails[slug] = { ...nextData.serviceDetails[slug], summary: value };
                    return nextData;
                  })
                }
              />

              <div className="mt-5 grid gap-5 lg:grid-cols-3">
                <ArrayEditor
                  label="Highlights"
                  values={selectedDetails.highlights}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as ServicesContent);
                      nextData.serviceDetails[slug] = { ...nextData.serviceDetails[slug], highlights: value };
                      return nextData;
                    })
                  }
                  addLabel="Add Highlight"
                />
                <ArrayEditor
                  label="Deliverables"
                  values={selectedDetails.deliverables}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as ServicesContent);
                      nextData.serviceDetails[slug] = { ...nextData.serviceDetails[slug], deliverables: value };
                      return nextData;
                    })
                  }
                  addLabel="Add Deliverable"
                />
                <ArrayEditor
                  label="Outcomes"
                  values={selectedDetails.outcomes}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as ServicesContent);
                      nextData.serviceDetails[slug] = { ...nextData.serviceDetails[slug], outcomes: value };
                      return nextData;
                    })
                  }
                  addLabel="Add Outcome"
                />
              </div>
            </Panel>
          </div>
        ) : null}
      </div>
    );
  };

  const renderWorkEditor = () => {
    if (!workData) return null;

    const selectedCaseStudy = workData.find((item) => item.slug === selectedEntry) ?? null;
    const availableTabs = selectedCaseStudy ? Object.keys(selectedCaseStudy.tabs) : [];
    const activeTabName =
      selectedCaseStudy && availableTabs.includes(selectedWorkTab) ? selectedWorkTab : availableTabs[0] ?? "Context";
    const activeTab = selectedCaseStudy?.tabs[activeTabName];

    return (
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Panel title="Case Study Library" description="Manage projects, card content, and tabbed detail sections.">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Projects</p>
              <button
                type="button"
                onClick={() => {
                  let nextSlug = "new-case-study";
                  let suffix = 1;
                  while (workData.some((item) => item.slug === nextSlug)) {
                    nextSlug = `new-case-study-${suffix}`;
                    suffix += 1;
                  }

                  const nextCaseStudy = { ...defaultCaseStudy(), slug: nextSlug, title: "New Case Study" };

                  updateCurrentData((current) => {
                    const nextData = cloneData(current as CaseStudy[]);
                    nextData.push(nextCaseStudy);
                    return nextData;
                  });
                  setSelectedEntry(nextSlug);
                  setSelectedWorkTab("Context");
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-2.5 py-1 text-xs text-white/75"
              >
                <Plus className="size-3.5" />
                Add
              </button>
            </div>
            {workData.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => {
                  setSelectedEntry(item.slug);
                  setSelectedWorkTab("Context");
                }}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  selectedEntry === item.slug
                    ? "border-[#ff4fb3]/50 bg-[#171c27]"
                    : "border-white/8 bg-[#0f1218] hover:border-white/18"
                }`}
              >
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs text-white/45">{item.project}</p>
              </button>
            ))}
          </div>
        </Panel>

        {selectedCaseStudy ? (
          <div className="space-y-6">
            <Panel
              title="Case Study Details"
              description="Top-level content used on both the work listing and the case study detail page."
              action={
                <button
                  type="button"
                  onClick={() => {
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as CaseStudy[]);
                      const itemIndex = nextData.findIndex((item) => item.slug === selectedEntry);
                      if (itemIndex >= 0) nextData.splice(itemIndex, 1);
                      return nextData;
                    });
                    setSelectedEntry(workData[0]?.slug ?? "new-case-study");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#ff4fb3]/30 px-4 py-2 text-sm text-[#ff9fd4] transition hover:border-[#ff4fb3]/60 hover:text-white"
                >
                  <Trash2 className="size-4" />
                  Delete
                </button>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Client Name"
                  value={selectedCaseStudy.title}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as CaseStudy[]);
                      const itemIndex = nextData.findIndex((item) => item.slug === selectedEntry);
                      if (itemIndex >= 0) nextData[itemIndex] = { ...nextData[itemIndex], title: value };
                      return nextData;
                    })
                  }
                />
                <Field
                  label="Slug"
                  value={selectedCaseStudy.slug}
                  onChange={(value) => {
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as CaseStudy[]);
                      const itemIndex = nextData.findIndex((item) => item.slug === selectedEntry);
                      if (itemIndex >= 0) nextData[itemIndex] = { ...nextData[itemIndex], slug: value };
                      return nextData;
                    });
                    setSelectedEntry(value);
                  }}
                />
                <Field
                  label="Project Name"
                  value={selectedCaseStudy.project}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as CaseStudy[]);
                      const itemIndex = nextData.findIndex((item) => item.slug === selectedEntry);
                      if (itemIndex >= 0) nextData[itemIndex] = { ...nextData[itemIndex], project: value };
                      return nextData;
                    })
                  }
                />
                <Field
                  label="Hero Image"
                  value={selectedCaseStudy.image}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as CaseStudy[]);
                      const itemIndex = nextData.findIndex((item) => item.slug === selectedEntry);
                      if (itemIndex >= 0) nextData[itemIndex] = { ...nextData[itemIndex], image: value };
                      return nextData;
                    })
                  }
                />
              </div>

              <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_1fr]">
                <ArrayEditor
                  label="Tags"
                  values={selectedCaseStudy.tags}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as CaseStudy[]);
                      const itemIndex = nextData.findIndex((item) => item.slug === selectedEntry);
                      if (itemIndex >= 0) nextData[itemIndex] = { ...nextData[itemIndex], tags: value };
                      return nextData;
                    })
                  }
                  addLabel="Add Tag"
                />
                <TextAreaField
                  label="Summary"
                  value={selectedCaseStudy.summary}
                  onChange={(value) =>
                    updateCurrentData((current) => {
                      const nextData = cloneData(current as CaseStudy[]);
                      const itemIndex = nextData.findIndex((item) => item.slug === selectedEntry);
                      if (itemIndex >= 0) nextData[itemIndex] = { ...nextData[itemIndex], summary: value };
                      return nextData;
                    })
                  }
                />
              </div>
            </Panel>

            {selectedCaseStudy && activeTab ? (
              <Panel
                title="Case Study Section"
                description="Switch between content tabs and edit one section at a time."
              >
                <div className="mb-5 flex flex-wrap gap-2">
                  {availableTabs.map((tabName) => {
                    const isActive = tabName === activeTabName;

                    return (
                      <button
                        key={tabName}
                        type="button"
                        onClick={() => setSelectedWorkTab(tabName)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          isActive
                            ? "border-[#111827] bg-white text-[#111827]"
                            : "border-white/12 bg-[#0f1218] text-white/70 hover:border-white/18 hover:text-white"
                        }`}
                      >
                        {tabName}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-5">
                  <div className="rounded-[22px] border border-white/8 bg-[#0f1218] px-4 py-3">
                    <p className="text-sm font-semibold text-white">{activeTabName}</p>
                    <p className="mt-1 text-sm text-white/55">
                      Edit the {activeTabName.toLowerCase()} section for this case study.
                    </p>
                  </div>

                  <TextAreaField
                    label="Body Copy"
                    value={activeTab.body}
                    onChange={(value) =>
                      updateCurrentData((current) => {
                        const nextData = cloneData(current as CaseStudy[]);
                        const itemIndex = nextData.findIndex((item) => item.slug === selectedEntry);
                        if (itemIndex >= 0) {
                          nextData[itemIndex].tabs[activeTabName] = {
                            ...nextData[itemIndex].tabs[activeTabName],
                            body: value,
                          };
                        }
                        return nextData;
                      })
                    }
                  />

                  <ArrayEditor
                    label="Images"
                    values={activeTab.images}
                    onChange={(value) =>
                      updateCurrentData((current) => {
                        const nextData = cloneData(current as CaseStudy[]);
                        const itemIndex = nextData.findIndex((item) => item.slug === selectedEntry);
                        if (itemIndex >= 0) {
                          nextData[itemIndex].tabs[activeTabName] = {
                            ...nextData[itemIndex].tabs[activeTabName],
                            images: value,
                          };
                        }
                        return nextData;
                      })
                    }
                    addLabel="Add Image"
                  />

                  <StatsEditor
                    values={activeTab.stats ?? []}
                    onChange={(value) =>
                      updateCurrentData((current) => {
                        const nextData = cloneData(current as CaseStudy[]);
                        const itemIndex = nextData.findIndex((item) => item.slug === selectedEntry);
                        if (itemIndex >= 0) {
                          nextData[itemIndex].tabs[activeTabName] = {
                            ...nextData[itemIndex].tabs[activeTabName],
                            stats: value,
                          };
                        }
                        return nextData;
                      })
                    }
                  />
                </div>
              </Panel>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#090a0d] text-white">
      <section className="relative overflow-hidden pb-16 pt-12 sm:pt-16 md:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,79,179,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(94,234,212,0.12),_transparent_30%)]" />
        <div className="relative w-full px-4 sm:px-6 lg:px-8 2xl:px-10">
          <nav className="mb-10 flex flex-col gap-4 rounded-[30px] border border-white/10 bg-[#10131a]/92 px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[#ff4fb3]/12">
                <Image src="/logo.png" alt="Blend CMS" width={24} height={25} className="h-6 w-auto" priority />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ff4fb3]">Blend CMS</p>
                <p className="mt-1 text-sm text-white/58">Authenticated editing workspace</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full border border-white/10 bg-[#0d1016] px-4 py-2 text-sm text-white/70">
                {authUser.email ?? "Authenticated user"}
              </div>

              <button
                type="button"
                onClick={() => void handleSignOut()}
                disabled={authSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-[#0d1016] px-4 py-3 text-sm font-semibold text-white transition hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut className="size-4" />
                Sign Out
              </button>
            </div>
          </nav>

          <SectionHeading
            eyebrow="Content Studio"
            title="Visual CMS"
            description="Edit site content through structured forms, collection panels, and item-focused editors instead of raw JSON."
          />

          <div className="mt-10 space-y-6">
            <div className="rounded-[30px] border border-white/10 bg-[#10131a] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-[#ff4fb3]/12 text-[#ff78c5]">
                      <Sparkles className="size-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff4fb3]">
                        {activeSectionConfig.label}
                      </p>
                      <p className="mt-1 text-sm text-white/55">{activeSectionConfig.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sections.map((section) => {
                    const isActive = section.id === activeSection;
                    const Icon = section.icon;

                    return (
                      <motion.button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                          isActive
                            ? "border-[#ff4fb3]/50 bg-[#171c27] text-white"
                            : "border-white/10 bg-[#0d1016] text-white/70 hover:border-white/20 hover:text-white"
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="size-4" />
                        {section.label}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:ml-auto lg:justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading || saving || !data}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save className="size-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {loading ? (
                <Panel title="Loading" description="Fetching the current content for this section.">
                  <div className="grid gap-3">
                    <div className="h-20 animate-pulse rounded-3xl bg-white/6" />
                    <div className="h-56 animate-pulse rounded-3xl bg-white/6" />
                  </div>
                </Panel>
              ) : null}

              {!loading && activeSection === "blog" ? renderBlogEditor() : null}
              {!loading && activeSection === "services" ? renderServicesEditor() : null}
              {!loading && activeSection === "work" ? renderWorkEditor() : null}

              {message ? (
                <p className="text-sm text-white/68">{message}</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
