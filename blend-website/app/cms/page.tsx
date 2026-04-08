"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { motion } from "framer-motion";
import {
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  AlertTriangle,
  ChevronDown,
  Copy,
  MoreHorizontal,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useSiteAuth } from "@/components/auth/AuthProvider";
import { deleteCmsEntryClient, readCmsSectionClient, writeCmsSectionClient } from "@/lib/cms-firestore-client";
import { getFirebaseStorage } from "@/lib/firebase/client";

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
  body?: string;
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

type DeleteDialogState = {
  section: Exclude<CmsSection, "services"> | "services";
  slug: string;
  label: string;
};

type BlogCreateForm = {
  featured: boolean;
  title: string;
  slug: string;
  date: string;
  coverImageFile: File | null;
  coverImageName: string;
  description: string;
  excerpt: string;
  body: string;
  authorAvatar: string;
};

type ServiceCreateForm = {
  collection: "digital" | "experiential";
  label: string;
  slug: string;
  summary: string;
  highlights: string[];
  deliverables: string[];
  outcomes: string[];
};

type WorkCreateForm = {
  title: string;
  project: string;
  slug: string;
  image: string;
  summary: string;
  tags: string[];
  tabs: Record<string, CaseStudyTab>;
};

type CardMenuState = {
  key: string;
  target: string;
} | null;

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

const defaultWorkCreateForm = (): WorkCreateForm => {
  const initial = defaultCaseStudy();

  return {
    title: "",
    project: "",
    slug: "",
    image: initial.image,
    summary: "",
    tags: [...initial.tags],
    tabs: structuredClone(initial.tabs),
  };
};

const cloneData = <T,>(data: T) => structuredClone(data);

const slugifyText = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const ensureUniqueValue = (baseValue: string, exists: (value: string) => boolean, fallback: string) => {
  const normalizedBase = slugifyText(baseValue) || slugifyText(fallback) || "item";

  if (!exists(normalizedBase)) return normalizedBase;

  let suffix = 2;
  let nextValue = `${normalizedBase}-${suffix}`;
  while (exists(nextValue)) {
    suffix += 1;
    nextValue = `${normalizedBase}-${suffix}`;
  }
  return nextValue;
};

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

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#ff4fb3]/60 [color-scheme:dark]"
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

function RichTextEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const runCommand = (command: string, commandValue?: string) => {
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML ?? "");
  };

  const toolbarItems = [
    { label: "B", command: "bold" },
    { label: "I", command: "italic" },
    { label: "U", command: "underline" },
    { label: "H2", command: "formatBlock", commandValue: "<h2>" },
    { label: "Bullet", command: "insertUnorderedList" },
    { label: "Number", command: "insertOrderedList" },
    { label: "Quote", command: "formatBlock", commandValue: "<blockquote>" },
    { label: "Clear", command: "removeFormat" },
  ] as const;

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{label}</span>
      <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#10131a]">
        <div className="flex flex-wrap gap-2 border-b border-white/8 px-3 py-3">
          {toolbarItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => runCommand(item.command, "commandValue" in item ? item.commandValue : undefined)}
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/10 bg-[#0d1016] px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => onChange(editorRef.current?.innerHTML ?? "")}
          className="min-h-[260px] px-4 py-4 text-sm leading-7 text-white outline-none"
          data-placeholder="Write the body content here..."
        />
      </div>
      <p className="text-xs text-white/40">Add headings, lists, emphasis, and longer-form body content.</p>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
  action,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
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
      {footer ? <div className="mt-6 flex justify-end">{footer}</div> : null}
    </div>
  );
}

function ModalShell({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#090a0d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,79,179,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(94,234,212,0.1),_transparent_30%)]" />
      <div className="relative min-h-screen px-4 py-6 sm:px-6 lg:px-8 2xl:px-10">
        <div className="mx-auto w-full max-w-7xl rounded-[30px] border border-white/10 bg-[#10131a]/92 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur">
          <div className="sticky top-0 z-10 mb-0 flex items-start justify-between gap-4 rounded-t-[30px] border-b border-white/8 bg-[#10131a]/96 px-6 py-6 sm:px-8">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            {description ? <p className="text-sm leading-6 text-white/60">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-[#0d1016] text-white/70 transition hover:border-white/20 hover:text-white"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
          </div>
          <div className="cms-scrollbar max-h-[calc(100vh-8.5rem)] overflow-y-auto px-6 py-6 sm:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function FullPageComposer({
  eyebrow,
  title,
  description,
  children,
  onClose,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#090a0d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,79,179,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(94,234,212,0.12),_transparent_30%)]" />
      <div className="relative min-h-screen px-4 py-6 sm:px-6 lg:px-8 2xl:px-10">
        <div className="mx-auto flex w-full max-w-7xl items-start justify-between gap-4 rounded-[30px] border border-white/10 bg-[#10131a]/92 px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ff4fb3]">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-[#0d1016] text-white/70 transition hover:border-white/20 hover:text-white"
            aria-label="Close creation page"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mx-auto mt-6 w-full max-w-7xl rounded-[30px] border border-white/10 bg-[#12161f] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

function ContentCard({
  title,
  subtitle,
  meta,
  isActive,
  onSelect,
  menuOpen,
  onToggleMenu,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  isActive: boolean;
  onSelect?: () => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`relative rounded-[24px] border p-4 transition ${
        isActive ? "border-[#ff4fb3]/50 bg-[#171c27]" : "border-white/8 bg-[#0f1218]"
      }`}
    >
      <div className="flex items-start gap-4">
        {onSelect ? (
          <button type="button" onClick={onSelect} className="flex-1 cursor-pointer text-left">
            <p className="text-sm font-semibold text-white">{title}</p>
            {subtitle ? <p className="mt-1 text-sm text-white/55">{subtitle}</p> : null}
            {meta ? <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/35">{meta}</p> : null}
          </button>
        ) : (
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-white">{title}</p>
            {subtitle ? <p className="mt-1 text-sm text-white/55">{subtitle}</p> : null}
            {meta ? <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/35">{meta}</p> : null}
          </div>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={onToggleMenu}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-[#10131a] text-white/70 transition hover:border-white/20 hover:text-white"
            aria-label="Open item actions"
          >
            <MoreHorizontal className="size-4" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-[180px] rounded-[22px] border border-white/10 bg-[#10131a] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
              <button
                type="button"
                onClick={onEdit}
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                <Pencil className="size-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={onDuplicate}
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                <Copy className="size-4" />
                Duplicate
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm text-[#ff9fd4] transition hover:bg-[#ff4fb3]/10 hover:text-white"
              >
                <Trash2 className="size-4" />
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>
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
  const safeValues = values ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...safeValues, ""])}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-white/25 hover:text-white"
        >
          <Plus className="size-3.5" />
          {addLabel}
        </button>
      </div>
      <div className="space-y-2.5">
        {safeValues.map((item, index) => (
          <div key={`${label}-${index}`} className="flex items-center gap-2">
            <input
              value={item}
              onChange={(event) => {
                const nextValues = [...safeValues];
                nextValues[index] = event.target.value;
                onChange(nextValues);
              }}
              className="w-full rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#ff4fb3]/60"
            />
            <button
              type="button"
              onClick={() => onChange(safeValues.filter((_, valueIndex) => valueIndex !== index))}
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
  const {
    authReady,
    authSubmitting,
    authUser,
    currentUserName,
    clearAuthError,
    signOutUser,
  } = useSiteAuth();
  const [activeSection, setActiveSection] = useState<CmsSection>("blog");
  const [selectedEntry, setSelectedEntry] = useState("featured:0");
  const [selectedWorkTab, setSelectedWorkTab] = useState("Context");
  const [data, setData] = useState<CmsDataMap["blog"] | CmsDataMap["services"] | CmsDataMap["work"] | null>(null);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState | null>(null);
  const [cardMenu, setCardMenu] = useState<CardMenuState>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [blogCreateForm, setBlogCreateForm] = useState<BlogCreateForm>({
    featured: false,
    title: "",
    slug: "",
    date: "",
    coverImageFile: null,
    coverImageName: "",
    description: "",
    excerpt: "",
    body: "",
    authorAvatar: "/placeholders/avatar-1.svg",
  });
  const [serviceCreateForm, setServiceCreateForm] = useState<ServiceCreateForm>({
    collection: "digital",
    label: "",
    slug: "",
    summary: "",
    highlights: [""],
    deliverables: [""],
    outcomes: [""],
  });
  const [workCreateForm, setWorkCreateForm] = useState<WorkCreateForm>({
    ...defaultWorkCreateForm(),
  });
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const cardMenuRef = useRef<HTMLDivElement | null>(null);

  const activeSectionConfig = useMemo(
    () => sections.find((section) => section.id === activeSection) ?? sections[0],
    [activeSection],
  );

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [authUser?.photoURL, authUser?.uid]);

  useEffect(() => {
    setCardMenu(null);
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
  }, [activeSection]);

  useEffect(() => {
    if (!profileMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (profileMenuRef.current?.contains(event.target as Node)) return;
      setProfileMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [profileMenuOpen]);

  useEffect(() => {
    if (!cardMenu) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (cardMenuRef.current?.contains(event.target as Node)) return;
      setCardMenu(null);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCardMenu(null);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [cardMenu]);

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = window.setTimeout(() => {
      setToastMessage(null);
    }, 2800);

    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  useEffect(() => {
    let cancelled = false;

    const loadSection = async () => {
      if (!authReady) {
        setLoading(true);
        return;
      }

      setLoading(true);
      setMessage(null);
      setData(null);

      try {
        if (cancelled) return;
        const payload = await readCmsSectionClient(activeSection);

        const isValidPayload =
          (activeSection === "blog" && isBlogContent(payload)) ||
          (activeSection === "services" && isServicesContent(payload)) ||
          (activeSection === "work" && isCaseStudies(payload));

        if (!isValidPayload) {
          setMessage("The CMS data shape for this section is invalid.");
          setData(null);
          setLoading(false);
          return;
        }

        setData(payload);
        setSelectedEntry(getDefaultSelection(activeSection, payload as CmsDataMap[CmsSection]));
        if (activeSection === "work") {
          setSelectedWorkTab("Context");
        }
        setLoading(false);
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "Unable to load content.");
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
      await writeCmsSectionClient(activeSection, data as CmsDataMap[CmsSection]);
      setMessage(`${activeSectionConfig.label} saved.`);
      setToastMessage(`${activeSectionConfig.label} saved.`);
      setEditDialogOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save content.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNew = () => {
    if (!data) return;

    if (activeSection === "blog") {
      setBlogCreateForm({
        featured: false,
        title: "",
        slug: "",
        date: "",
        coverImageFile: null,
        coverImageName: "",
        description: "",
        excerpt: "",
        body: "",
        authorAvatar: "/placeholders/avatar-1.svg",
      });
    }

    if (activeSection === "services") {
      setServiceCreateForm({
        collection: "digital",
        label: "",
        slug: "",
        summary: "",
        highlights: [""],
        deliverables: [""],
        outcomes: [""],
      });
    }

    if (activeSection === "work") {
      setWorkCreateForm(defaultWorkCreateForm());
      setSelectedWorkTab("Context");
    }

    setCreateDialogOpen(true);
  };

  const openDeleteDialog = (section: DeleteDialogState["section"], slug: string, label: string) => {
    setCardMenu(null);
    setDeleteDialog({ section, slug, label });
  };

  const duplicateBlogItem = (kind: "featured" | "posts", index: number) => {
    if (!blogData) return;

    const item = kind === "featured" ? blogData.featured[index] : blogData.posts[index];
    if (!item) return;

    const existingSlugs = new Set([...blogData.featured, ...blogData.posts].map((entry) => entry.slug));
    const nextSlug = ensureUniqueValue(`${item.slug}-copy`, (value) => existingSlugs.has(value), item.title);
    const nextItem = {
      ...cloneData(item),
      title: item.title.includes("Copy") ? item.title : `${item.title} Copy`,
      slug: nextSlug,
    };

    updateCurrentData((current) => {
      const nextData = cloneData(current as BlogContent);
      const collection = kind === "featured" ? nextData.featured : nextData.posts;
      collection.splice(index + 1, 0, nextItem);
      return nextData;
    });

    setSelectedEntry(`${kind}:${index + 1}`);
    setCardMenu(null);
  };

  const duplicateServiceItem = (kind: "digital" | "experiential", slug: string) => {
    if (!servicesData) return;

    const collection =
      kind === "digital" ? servicesData.servicesContent.digital : servicesData.servicesContent.experiential;
    const itemIndex = collection.findIndex((item) => item.slug === slug);
    if (itemIndex < 0) return;
    const item = collection[itemIndex];

    const allSlugs = new Set([
      ...servicesData.servicesContent.digital.map((entry) => entry.slug),
      ...servicesData.servicesContent.experiential.map((entry) => entry.slug),
    ]);
    const nextSlug = ensureUniqueValue(`${item.slug}-copy`, (value) => allSlugs.has(value), item.label);

    updateCurrentData((current) => {
      const nextData = cloneData(current as ServicesContent);
      const nextCollection =
        kind === "digital" ? nextData.servicesContent.digital : nextData.servicesContent.experiential;
      nextCollection.splice(itemIndex + 1, 0, {
        label: item.label.includes("Copy") ? item.label : `${item.label} Copy`,
        slug: nextSlug,
      });
      nextData.serviceDetails[nextSlug] = cloneData(
        nextData.serviceDetails[slug] ?? defaultServiceDetail(),
      ) as ServiceDetail;
      return nextData;
    });

    setSelectedEntry(`${kind}:${nextSlug}`);
    setCardMenu(null);
  };

  const duplicateWorkItem = (slug: string) => {
    if (!workData) return;

    const itemIndex = workData.findIndex((item) => item.slug === slug);
    if (itemIndex < 0) return;
    const item = workData[itemIndex];
    const nextSlug = ensureUniqueValue(`${item.slug}-copy`, (value) => workData.some((entry) => entry.slug === value), item.title);
    const nextItem = {
      ...cloneData(item),
      title: item.title.includes("Copy") ? item.title : `${item.title} Copy`,
      slug: nextSlug,
    };

    updateCurrentData((current) => {
      const nextData = cloneData(current as CaseStudy[]);
      nextData.splice(itemIndex + 1, 0, nextItem);
      return nextData;
    });

    setSelectedEntry(nextSlug);
    setSelectedWorkTab("Context");
    setCardMenu(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog) return;

    setDeleting(true);
    setMessage(null);

    try {
      await deleteCmsEntryClient(deleteDialog.section, deleteDialog.slug);
      const payload = await readCmsSectionClient(activeSection);

      setData(payload);
      setSelectedEntry(getDefaultSelection(activeSection, payload as CmsDataMap[CmsSection]));
      if (activeSection === "work") {
        setSelectedWorkTab("Context");
      }
      setMessage(`${deleteDialog.label} deleted.`);
      setDeleteDialog(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete content.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateBlog = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!blogData) return;

    setCreateSubmitting(true);
    setMessage(null);

    const collection = blogCreateForm.featured ? "featured" : "posts";
    const existingSlugs = new Set([...blogData.featured, ...blogData.posts].map((item) => item.slug));
    const nextSlug = ensureUniqueValue(
      blogCreateForm.slug || blogCreateForm.title,
      (value) => existingSlugs.has(value),
      "blog-post",
    );

    try {
      let coverImageUrl = "/placeholders/blog-1.svg";

      if (blogCreateForm.coverImageFile) {
        const fileExtension = blogCreateForm.coverImageFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const storageRef = ref(getFirebaseStorage(), `cms/blog-covers/${nextSlug}-${Date.now()}.${fileExtension}`);
        await uploadBytes(storageRef, blogCreateForm.coverImageFile);
        coverImageUrl = await getDownloadURL(storageRef);
      }

      const nextItem: BlogEntry = {
        title: blogCreateForm.title.trim() || "Untitled Post",
        slug: nextSlug,
        date: blogCreateForm.date.trim(),
        image: coverImageUrl,
        description: blogCreateForm.description.trim(),
        excerpt: blogCreateForm.excerpt.trim(),
        body: blogCreateForm.body.trim(),
        author: {
          name: currentUserName || authUser?.displayName?.trim() || authUser?.email?.split("@")[0] || "Blend Member",
          role: "",
          avatar: blogCreateForm.authorAvatar.trim() || "/placeholders/avatar-1.svg",
        },
      };

      const nextData = cloneData(blogData);
      nextData[collection].push(nextItem);
      await writeCmsSectionClient("blog", nextData);
      setData(nextData);

      const nextIndex = (collection === "featured" ? blogData.featured.length : blogData.posts.length).toString();
      setSelectedEntry(`${collection}:${nextIndex}`);
      setCreateDialogOpen(false);
      setMessage("Blog post created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload the cover image.");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleCreateService = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!servicesData) return;

    setCreateSubmitting(true);
    setMessage(null);

    const collection = serviceCreateForm.collection;
    const existingSlugs = new Set([
      ...servicesData.servicesContent.digital.map((item) => item.slug),
      ...servicesData.servicesContent.experiential.map((item) => item.slug),
    ]);
    const nextSlug = ensureUniqueValue(
      serviceCreateForm.slug || serviceCreateForm.label,
      (value) => existingSlugs.has(value),
      "service",
    );

    try {
      const highlights = serviceCreateForm.highlights.map((item) => item.trim()).filter(Boolean);
      const deliverables = serviceCreateForm.deliverables.map((item) => item.trim()).filter(Boolean);
      const outcomes = serviceCreateForm.outcomes.map((item) => item.trim()).filter(Boolean);

      const nextData = cloneData(servicesData);
      nextData.servicesContent[collection].push({
        label: serviceCreateForm.label.trim() || "New Service",
        slug: nextSlug,
      });
      nextData.serviceDetails[nextSlug] = {
        summary: serviceCreateForm.summary.trim(),
        highlights,
        deliverables,
        outcomes,
      };
      await writeCmsSectionClient("services", nextData);
      setData(nextData);

      setSelectedEntry(`${collection}:${nextSlug}`);
      setCreateDialogOpen(false);
      setMessage("Service created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create service.");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleCreateWork = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!workData) return;

    setCreateSubmitting(true);
    setMessage(null);

    const nextSlug = ensureUniqueValue(
      workCreateForm.slug || workCreateForm.title,
      (value) => workData.some((item) => item.slug === value),
      "case-study",
    );

    const nextTabs = Object.fromEntries(
      Object.entries(workCreateForm.tabs).map(([tabName, tab]) => [
        tabName,
        {
          body: tab.body.trim(),
          images: tab.images.map((item) => item.trim()).filter(Boolean),
          ...(tab.stats
            ? {
                stats: tab.stats.filter((stat) => stat.label.trim() || stat.value.trim()).map((stat) => ({
                  label: stat.label.trim(),
                  value: stat.value.trim(),
                })),
              }
            : {}),
        },
      ]),
    );

    const nextItem: CaseStudy = {
      ...defaultCaseStudy(),
      title: workCreateForm.title.trim() || "New Case Study",
      project: workCreateForm.project.trim() || "Project Name",
      slug: nextSlug,
      image: workCreateForm.image.trim() || "/placeholders/work-google.svg",
      summary: workCreateForm.summary.trim() || defaultCaseStudy().summary,
      tags: workCreateForm.tags.map((item) => item.trim()).filter(Boolean),
      tabs: nextTabs,
    };

    try {
      const nextData = cloneData(workData);
      nextData.push(nextItem);
      await writeCmsSectionClient("work", nextData);
      setData(nextData);

      setSelectedEntry(nextSlug);
      setSelectedWorkTab("Context");
      setCreateDialogOpen(false);
      setMessage("Case study created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create case study.");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const saveButton = (
    <button
      type="button"
      onClick={handleSave}
      disabled={saving}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Save className="size-4" />
      {saving ? "Saving..." : "Save Changes"}
    </button>
  );

  const handleSignOut = async () => {
    setMessage(null);
    setProfileMenuOpen(false);
    clearAuthError();

    try {
      await signOutUser();
      setData(null);
      setSelectedEntry("featured:0");
    } catch {
      // Auth errors are surfaced by the shared provider.
    }
  };

  const blogData = activeSection === "blog" && isBlogContent(data) ? data : null;
  const servicesData = activeSection === "services" && isServicesContent(data) ? data : null;
  const workData = activeSection === "work" && isCaseStudies(data) ? data : null;
  const authEmail = authUser?.email?.trim() ?? "";
  const userInitial = authEmail.charAt(0).toUpperCase() || "U";
  const avatarUrl = authUser?.photoURL?.trim() ?? "";
  const showAvatarImage = Boolean(avatarUrl) && !avatarLoadFailed;

  if (!authUser) return null;

  const renderBlogEditor = () => {
    if (!blogData) return null;

    return (
      <Panel title="Blog Content" description="Browse your blog items and manage them from the action menu.">
        <div className="space-y-5" ref={cardMenu?.key.startsWith("blog:") ? cardMenuRef : undefined}>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Featured Posts</p>
            <div className="space-y-3">
              {blogData.featured.map((post, itemIndex) => (
                <ContentCard
                  key={`featured-${post.slug}-${itemIndex}`}
                  title={post.description || post.title}
                  subtitle={post.slug}
                  meta="Featured"
                  isActive={false}
                  
                  menuOpen={cardMenu?.key === `blog:featured:${itemIndex}`}
                  onToggleMenu={() =>
                    setCardMenu((current) =>
                      current?.key === `blog:featured:${itemIndex}`
                        ? null
                        : { key: `blog:featured:${itemIndex}`, target: `featured:${itemIndex}` },
                    )
                  }
                  onEdit={() => {
                    setSelectedEntry(`featured:${itemIndex}`);
                    setEditDialogOpen(true);
                    setCardMenu(null);
                  }}
                  onDuplicate={() => duplicateBlogItem("featured", itemIndex)}
                  onDelete={() => openDeleteDialog("blog", post.slug, post.title)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-5" ref={cardMenu?.key.startsWith("blog:") ? cardMenuRef : undefined}>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Posts</p>
              <div className="space-y-3">
                {blogData.posts.map((post, itemIndex) => (
                  <ContentCard
                    key={`post-${post.slug}-${itemIndex}`}
                    title={post.title}
                    subtitle={post.slug}
                    meta="Post"
                    isActive={false}
                    
                    menuOpen={cardMenu?.key === `blog:posts:${itemIndex}`}
                    onToggleMenu={() =>
                      setCardMenu((current) =>
                        current?.key === `blog:posts:${itemIndex}`
                          ? null
                          : { key: `blog:posts:${itemIndex}`, target: `posts:${itemIndex}` },
                      )
                    }
                    onEdit={() => {
                      setSelectedEntry(`posts:${itemIndex}`);
                      setEditDialogOpen(true);
                      setCardMenu(null);
                    }}
                    onDuplicate={() => duplicateBlogItem("posts", itemIndex)}
                    onDelete={() => openDeleteDialog("blog", post.slug, post.title)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>
    );
  };

  const renderServicesEditor = () => {
    if (!servicesData) return null;

    return (
      <Panel title="Service Content" description="Browse your services and open the action menu to manage them.">
        <div className="space-y-5" ref={cardMenu?.key.startsWith("services:") ? cardMenuRef : undefined}>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              {servicesData.servicesContent.digitalLabel}
            </p>
            <div className="space-y-3">
              {servicesData.servicesContent.digital.map((service) => (
                <ContentCard
                  key={`digital-${service.slug}`}
                  title={service.label}
                  subtitle={service.slug}
                  meta="Digital"
                  isActive={false}
                  
                  menuOpen={cardMenu?.key === `services:digital:${service.slug}`}
                  onToggleMenu={() =>
                    setCardMenu((current) =>
                      current?.key === `services:digital:${service.slug}`
                        ? null
                        : { key: `services:digital:${service.slug}`, target: `digital:${service.slug}` },
                    )
                  }
                  onEdit={() => {
                    setSelectedEntry(`digital:${service.slug}`);
                    setEditDialogOpen(true);
                    setCardMenu(null);
                  }}
                  onDuplicate={() => duplicateServiceItem("digital", service.slug)}
                  onDelete={() => openDeleteDialog("services", service.slug, service.label)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-5" ref={cardMenu?.key.startsWith("services:") ? cardMenuRef : undefined}>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                {servicesData.servicesContent.experientialLabel}
              </p>
              <div className="space-y-3">
                {servicesData.servicesContent.experiential.map((service) => (
                  <ContentCard
                    key={`experiential-${service.slug}`}
                    title={service.label}
                    subtitle={service.slug}
                    meta="Experiential"
                    isActive={false}
                    
                    menuOpen={cardMenu?.key === `services:experiential:${service.slug}`}
                    onToggleMenu={() =>
                      setCardMenu((current) =>
                        current?.key === `services:experiential:${service.slug}`
                          ? null
                          : { key: `services:experiential:${service.slug}`, target: `experiential:${service.slug}` },
                      )
                    }
                    onEdit={() => {
                      setSelectedEntry(`experiential:${service.slug}`);
                      setEditDialogOpen(true);
                      setCardMenu(null);
                    }}
                    onDuplicate={() => duplicateServiceItem("experiential", service.slug)}
                    onDelete={() => openDeleteDialog("services", service.slug, service.label)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>
    );
  };

  const renderWorkEditor = () => {
    if (!workData) return null;

    return (
      <Panel title="Case Studies" description="Browse your case studies and open the action menu to edit them.">
        <div className="space-y-3" ref={cardMenu?.key.startsWith("work:") ? cardMenuRef : undefined}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Projects</p>
          <div className="space-y-3">
            {workData.map((item) => (
              <ContentCard
                key={item.slug}
                title={item.title}
                subtitle={item.project}
                meta={item.slug}
                isActive={false}
                
                menuOpen={cardMenu?.key === `work:${item.slug}`}
                onToggleMenu={() =>
                  setCardMenu((current) =>
                    current?.key === `work:${item.slug}` ? null : { key: `work:${item.slug}`, target: item.slug },
                  )
                }
                onEdit={() => {
                  setSelectedEntry(item.slug);
                  setSelectedWorkTab("Context");
                  setEditDialogOpen(true);
                  setCardMenu(null);
                }}
                onDuplicate={() => duplicateWorkItem(item.slug)}
                onDelete={() => openDeleteDialog("work", item.slug, item.title)}
              />
            ))}
          </div>
        </div>
      </Panel>
    );
  };

  const renderBlogEditDialog = () => {
    if (!blogData || !editDialogOpen) return null;
    const [kind, rawIndex] = selectedEntry.split(":");
    const index = Number(rawIndex);
    const selectedPost =
      kind === "featured" ? blogData.featured[index] : kind === "posts" ? blogData.posts[index] : null;
    if (!selectedPost || (kind !== "featured" && kind !== "posts")) return null;

    return (
      <ModalShell
        title="Edit Blog Post"
        description="Update the selected post and save your changes when you're done."
        onClose={() => setEditDialogOpen(false)}
      >
        <div className="space-y-6">
          <Panel title="Post Editor" description="Edit the selected post just like a CMS entry.">
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
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Slug</span>
                <div className="flex gap-2">
                  <input
                    value={selectedPost.slug}
                    onChange={(event) =>
                      updateCurrentData((current) => {
                        const nextData = cloneData(current as BlogContent);
                        const collection = kind === "featured" ? nextData.featured : nextData.posts;
                        collection[index] = { ...collection[index], slug: event.target.value };
                        return nextData;
                      })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#ff4fb3]/60"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateCurrentData((current) => {
                        const nextData = cloneData(current as BlogContent);
                        const collection = kind === "featured" ? nextData.featured : nextData.posts;
                        collection[index] = { ...collection[index], slug: slugifyText(collection[index].title) };
                        return nextData;
                      })
                    }
                    className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
                  >
                    Generate
                  </button>
                </div>
              </label>
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
              <RichTextEditor
                label="Body"
                value={selectedPost.body ?? ""}
                onChange={(value) =>
                  updateCurrentData((current) => {
                    const nextData = cloneData(current as BlogContent);
                    const collection = kind === "featured" ? nextData.featured : nextData.posts;
                    collection[index] = { ...collection[index], body: value };
                    return nextData;
                  })
                }
              />
            </div>
          </Panel>
          <Panel title="Author" description="Metadata shown on blog cards and detail pages." footer={saveButton}>
            <div className="rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Author Name</p>
              <p className="mt-2 text-sm text-white">
                {selectedPost.author?.name ||
                  currentUserName ||
                  authUser?.displayName?.trim() ||
                  authUser?.email?.split("@")[0] ||
                  "Blend Member"}
              </p>
            </div>
          </Panel>
        </div>
      </ModalShell>
    );
  };

  const renderServicesEditDialog = () => {
    if (!servicesData || !editDialogOpen) return null;
    const [kind, slug] = selectedEntry.split(":");
    const selectedService =
      kind === "digital"
        ? servicesData.servicesContent.digital.find((item) => item.slug === slug)
        : kind === "experiential"
          ? servicesData.servicesContent.experiential.find((item) => item.slug === slug)
          : null;
    const selectedDetails = slug ? servicesData.serviceDetails[slug] : null;
    if (!selectedService || !selectedDetails || (kind !== "digital" && kind !== "experiential")) return null;

    return (
      <ModalShell
        title="Edit Service"
        description="Update the service card and its long-form detail content."
        onClose={() => setEditDialogOpen(false)}
      >
        <div className="space-y-6">
          <Panel title="Service Card" description="Controls the service listing entry and slug used for the detail page.">
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
                    if (itemIndex >= 0) collection[itemIndex] = { ...collection[itemIndex], label: value };
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
          <Panel title="Service Detail" description="This content powers the service detail page." footer={saveButton}>
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
      </ModalShell>
    );
  };

  const renderWorkEditDialog = () => {
    if (!workData || !editDialogOpen) return null;
    const selectedCaseStudy = workData.find((item) => item.slug === selectedEntry) ?? null;
    if (!selectedCaseStudy) return null;
    const availableTabs = Object.keys(selectedCaseStudy.tabs);
    const activeTabName = availableTabs.includes(selectedWorkTab) ? selectedWorkTab : availableTabs[0] ?? "Context";
    const activeTab = selectedCaseStudy.tabs[activeTabName];
    if (!activeTab) return null;

    return (
      <ModalShell
        title="Edit Case Study"
        description="Update the case study card and its tabbed detail sections."
        onClose={() => setEditDialogOpen(false)}
      >
        <div className="space-y-6">
          <Panel title="Case Study Details" description="Top-level content used on both the work listing and the case study detail page.">
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
          <Panel title="Case Study Section" description="Switch between content tabs and edit one section at a time." footer={saveButton}>
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
                <p className="mt-1 text-sm text-white/55">Edit the {activeTabName.toLowerCase()} section for this case study.</p>
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
        </div>
      </ModalShell>
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

            <div className="relative self-end sm:self-auto" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((current) => !current)}
                className="cursor-pointer rounded-full border border-white/10 bg-[#0d1016] p-1.5 transition hover:border-white/25"
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
                aria-label="Open profile menu"
              >
                {showAvatarImage ? (
                  <div className="relative size-10 overflow-hidden rounded-full border border-white/10 bg-white/5">
                    <Image
                      src={avatarUrl}
                      alt={authEmail ? `${authEmail} profile picture` : "User profile picture"}
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized
                      onError={() => setAvatarLoadFailed(true)}
                    />
                  </div>
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-[#171c27] text-sm font-semibold text-white">
                    {userInitial}
                  </div>
                )}
              </button>

              {profileMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 min-w-[260px] rounded-[24px] border border-white/10 bg-[#10131a]/96 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur">
                  <div className="rounded-2xl border border-white/8 bg-[#0d1016] px-4 py-3 text-sm text-white/70">
                    {authUser.email ?? "Authenticated user"}
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleSignOut()}
                    disabled={authSubmitting}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-[#0d1016] px-4 py-3 text-sm font-semibold text-white transition hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </button>
                </div>
              ) : null}
            </div>
          </nav>

          <SectionHeading
            eyebrow="Content Studio"
            title="Visual CMS"
            description="Update your website using simple forms and clear editing panels, without touching code."
          />

          <div className="mt-10 space-y-6">
            <div className="rounded-[30px] border border-white/10 bg-[#10131a] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div>
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
                    onClick={handleCreateNew}
                    disabled={loading || saving || !data}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Plus className="size-4" />
                    New
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

        {deleteDialog ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#12161f] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#ff4fb3]/12 text-[#ff9fd4]">
                  <AlertTriangle className="size-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-white">Delete item?</h2>
                  <p className="text-sm leading-6 text-white/60">
                    This will permanently delete <span className="text-white">{deleteDialog.label}</span> from
                    Firestore.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteDialog(null)}
                  disabled={deleting}
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-[#0d1016] px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ff4fb3]/30 px-4 py-2.5 text-sm font-semibold text-[#ff9fd4] transition hover:border-[#ff4fb3]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 className="size-4" />
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {createDialogOpen && activeSection === "blog" ? (
          <FullPageComposer
            eyebrow="New Entry"
            title="Create Blog Post"
            description="Add a new featured post or blog post before refining the rest of the content."
            onClose={() => setCreateDialogOpen(false)}
          >
            <form className="space-y-8" onSubmit={handleCreateBlog}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Featured Post</span>
                  <button
                    type="button"
                    onClick={() =>
                      setBlogCreateForm((current) => ({
                        ...current,
                        featured: !current.featured,
                      }))
                    }
                    className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                      blogCreateForm.featured
                        ? "border-[#ff4fb3]/50 bg-[#171c27] text-white"
                        : "border-white/10 bg-[#10131a] text-white/70"
                    }`}
                    aria-pressed={blogCreateForm.featured}
                  >
                    <span>{blogCreateForm.featured ? "Yes, show as featured" : "No, regular blog post"}</span>
                    <span
                      className={`relative h-6 w-11 rounded-full transition ${
                        blogCreateForm.featured ? "bg-[#ff4fb3]" : "bg-white/12"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 size-5 rounded-full bg-white transition ${
                          blogCreateForm.featured ? "left-[22px]" : "left-0.5"
                        }`}
                      />
                    </span>
                  </button>
                </label>
                <DateField
                  label="Date"
                  value={blogCreateForm.date}
                  onChange={(value) => setBlogCreateForm((current) => ({ ...current, date: value }))}
                />
                <Field
                  label="Title"
                  value={blogCreateForm.title}
                  onChange={(value) =>
                    setBlogCreateForm((current) => ({
                      ...current,
                      title: value,
                      slug: current.slug ? current.slug : slugifyText(value),
                    }))
                  }
                />
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Slug</span>
                  <div className="flex gap-2">
                    <input
                      value={blogCreateForm.slug}
                      onChange={(event) =>
                        setBlogCreateForm((current) => ({
                          ...current,
                          slug: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#ff4fb3]/60"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setBlogCreateForm((current) => ({
                          ...current,
                          slug: slugifyText(current.title),
                        }))
                      }
                      className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
                    >
                      Generate
                    </button>
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Cover Image</span>
                  <input
                    id="blog-cover-image"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setBlogCreateForm((current) => ({
                        ...current,
                        coverImageFile: file,
                        coverImageName: file?.name ?? "",
                      }));
                    }}
                    className="sr-only"
                  />
                  <label
                    htmlFor="blog-cover-image"
                    className="block cursor-pointer rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 transition hover:border-[#ff4fb3]/40 hover:bg-[#111520]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="truncate text-sm font-semibold text-white">
                        {blogCreateForm.coverImageName || "Upload a cover image"}
                      </p>
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/65">
                        {blogCreateForm.coverImageName ? "Ready" : "Browse"}
                      </div>
                    </div>
                  </label>
                </label>
                <Field
                  label="Headline"
                  value={blogCreateForm.description}
                  onChange={(value) => setBlogCreateForm((current) => ({ ...current, description: value }))}
                />
              </div>

              <TextAreaField
                label="Excerpt"
                value={blogCreateForm.excerpt}
                onChange={(value) => setBlogCreateForm((current) => ({ ...current, excerpt: value }))}
                rows={4}
              />

              <RichTextEditor
                label="Body"
                value={blogCreateForm.body}
                onChange={(value) => setBlogCreateForm((current) => ({ ...current, body: value }))}
              />

              <div className="rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Author Name</p>
                <p className="mt-2 text-sm text-white">
                  {currentUserName || authUser?.displayName?.trim() || authUser?.email?.split("@")[0] || "Blend Member"}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={createSubmitting}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/12 bg-[#0d1016] px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createSubmitting ? "Creating..." : "Create Post"}
                </button>
              </div>
            </form>
          </FullPageComposer>
        ) : null}

        {createDialogOpen && activeSection === "services" ? (
          <FullPageComposer
            eyebrow="New Entry"
            title="Create Service"
            description="Set up a new service card and its starting detail summary."
            onClose={() => setCreateDialogOpen(false)}
          >
            <form className="space-y-8" onSubmit={handleCreateService}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Collection</span>
                  <div className="relative">
                    <select
                      value={serviceCreateForm.collection}
                      onChange={(event) =>
                        setServiceCreateForm((current) => ({
                          ...current,
                          collection: event.target.value as ServiceCreateForm["collection"],
                        }))
                      }
                      className="w-full appearance-none rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-[#ff4fb3]/60"
                    >
                      <option value="digital">Digital</option>
                      <option value="experiential">Experiential</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/65" />
                  </div>
                </label>
                <Field
                  label="Service Name"
                  value={serviceCreateForm.label}
                  onChange={(value) =>
                    setServiceCreateForm((current) => ({
                      ...current,
                      label: value,
                      slug: current.slug ? current.slug : slugifyText(value),
                    }))
                  }
                />
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Slug</span>
                  <div className="flex gap-2">
                    <input
                      value={serviceCreateForm.slug}
                      onChange={(event) =>
                        setServiceCreateForm((current) => ({
                          ...current,
                          slug: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#ff4fb3]/60"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setServiceCreateForm((current) => ({
                          ...current,
                          slug: slugifyText(current.label),
                        }))
                      }
                      className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
                    >
                      Generate
                    </button>
                  </div>
                </label>
              </div>

              <TextAreaField
                label="Summary"
                value={serviceCreateForm.summary}
                onChange={(value) => setServiceCreateForm((current) => ({ ...current, summary: value }))}
                rows={5}
              />

              <div className="grid gap-5 lg:grid-cols-3">
                <ArrayEditor
                  label="Highlights"
                  values={serviceCreateForm.highlights}
                  onChange={(value) => setServiceCreateForm((current) => ({ ...current, highlights: value }))}
                  addLabel="Add Highlight"
                />
                <ArrayEditor
                  label="Deliverables"
                  values={serviceCreateForm.deliverables}
                  onChange={(value) => setServiceCreateForm((current) => ({ ...current, deliverables: value }))}
                  addLabel="Add Deliverable"
                />
                <ArrayEditor
                  label="Outcomes"
                  values={serviceCreateForm.outcomes}
                  onChange={(value) => setServiceCreateForm((current) => ({ ...current, outcomes: value }))}
                  addLabel="Add Outcome"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateDialogOpen(false)}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/12 bg-[#0d1016] px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition"
                >
                  Create Service
                </button>
              </div>
            </form>
          </FullPageComposer>
        ) : null}

        {createDialogOpen && activeSection === "work" ? (
          <FullPageComposer
            eyebrow="New Entry"
            title="Create Case Study"
            description="Create the full case study, including the listing card and every detail section."
            onClose={() => setCreateDialogOpen(false)}
          >
            <form className="space-y-8" onSubmit={handleCreateWork}>
              <Panel
                title="Case Study Details"
                description="Top-level content used on both the work listing and the case study detail page."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Client Name"
                    value={workCreateForm.title}
                    onChange={(value) =>
                      setWorkCreateForm((current) => ({
                        ...current,
                        title: value,
                        slug: current.slug ? current.slug : slugifyText(value),
                      }))
                    }
                  />
                  <Field
                    label="Project Name"
                    value={workCreateForm.project}
                    onChange={(value) => setWorkCreateForm((current) => ({ ...current, project: value }))}
                  />
                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Slug</span>
                    <div className="flex gap-2">
                      <input
                        value={workCreateForm.slug}
                        onChange={(event) =>
                          setWorkCreateForm((current) => ({
                            ...current,
                            slug: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#ff4fb3]/60"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setWorkCreateForm((current) => ({
                            ...current,
                            slug: slugifyText(current.title),
                          }))
                        }
                        className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
                      >
                        Generate
                      </button>
                    </div>
                  </label>
                  <Field
                    label="Hero Image"
                    value={workCreateForm.image}
                    onChange={(value) => setWorkCreateForm((current) => ({ ...current, image: value }))}
                  />
                </div>
                <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_1fr]">
                  <ArrayEditor
                    label="Tags"
                    values={workCreateForm.tags}
                    onChange={(value) => setWorkCreateForm((current) => ({ ...current, tags: value }))}
                    addLabel="Add Tag"
                  />
                  <TextAreaField
                    label="Summary"
                    value={workCreateForm.summary}
                    onChange={(value) => setWorkCreateForm((current) => ({ ...current, summary: value }))}
                    rows={4}
                  />
                </div>
              </Panel>

              <Panel title="Case Study Sections" description="Fill out each tab exactly as it should appear in Firestore.">
                <div className="mb-5 flex flex-wrap gap-2">
                  {Object.keys(workCreateForm.tabs).map((tabName) => {
                    const isActive = tabName === selectedWorkTab;
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
                    <p className="text-sm font-semibold text-white">{selectedWorkTab}</p>
                    <p className="mt-1 text-sm text-white/55">
                      Add the body, images, and stats for the {selectedWorkTab.toLowerCase()} section.
                    </p>
                  </div>
                  <TextAreaField
                    label="Body Copy"
                    value={workCreateForm.tabs[selectedWorkTab]?.body ?? ""}
                    onChange={(value) =>
                      setWorkCreateForm((current) => ({
                        ...current,
                        tabs: {
                          ...current.tabs,
                          [selectedWorkTab]: {
                            ...current.tabs[selectedWorkTab],
                            body: value,
                          },
                        },
                      }))
                    }
                  />
                  <ArrayEditor
                    label="Images"
                    values={workCreateForm.tabs[selectedWorkTab]?.images ?? []}
                    onChange={(value) =>
                      setWorkCreateForm((current) => ({
                        ...current,
                        tabs: {
                          ...current.tabs,
                          [selectedWorkTab]: {
                            ...current.tabs[selectedWorkTab],
                            images: value,
                          },
                        },
                      }))
                    }
                    addLabel="Add Image"
                  />
                  <StatsEditor
                    values={workCreateForm.tabs[selectedWorkTab]?.stats ?? []}
                    onChange={(value) =>
                      setWorkCreateForm((current) => ({
                        ...current,
                        tabs: {
                          ...current.tabs,
                          [selectedWorkTab]: {
                            ...current.tabs[selectedWorkTab],
                            stats: value,
                          },
                        },
                      }))
                    }
                  />
                </div>
              </Panel>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateDialogOpen(false)}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/12 bg-[#0d1016] px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition"
                >
                  Create Case Study
                </button>
              </div>
            </form>
          </FullPageComposer>
        ) : null}

        {editDialogOpen && activeSection === "blog" ? renderBlogEditDialog() : null}
        {editDialogOpen && activeSection === "services" ? renderServicesEditDialog() : null}
        {editDialogOpen && activeSection === "work" ? renderWorkEditDialog() : null}

        {toastMessage ? (
          <div className="pointer-events-none fixed bottom-6 right-6 z-[60]">
            <div className="rounded-2xl border border-[#ff4fb3]/25 bg-[#12161f]/96 px-4 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur">
              <p className="text-sm font-semibold text-white">{toastMessage}</p>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
