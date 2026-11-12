"use client";

import ProjectInquiryForm from "@/components/ProjectInquiryForm";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { createContext, type ReactNode, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from "react";

type ProjectModalOptions = {
  services?: string[];
};

type ProjectModalContextValue = {
  openProjectModal: (options?: ProjectModalOptions) => void;
  closeProjectModal: () => void;
};

const ProjectModalContext = createContext<ProjectModalContextValue | null>(null);

export const useProjectModal = () => {
  const context = useContext(ProjectModalContext);

  if (!context) {
    throw new Error("useProjectModal must be used inside ProjectModalProvider");
  }

  return context;
};

export default function ProjectModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialServices, setInitialServices] = useState<string[]>([]);

  const openProjectModal = useCallback((options?: ProjectModalOptions) => {
    setInitialServices(options?.services ?? []);
    setIsOpen(true);
  }, []);

  const closeProjectModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(() => ({ openProjectModal, closeProjectModal }), [openProjectModal, closeProjectModal]);

  return (
    <ProjectModalContext.Provider value={value}>
      {children}
      {isOpen && <ProjectDialog initialServices={initialServices} onClose={closeProjectModal} />}
    </ProjectModalContext.Provider>
  );
}

function ProjectDialog({ initialServices, onClose }: { initialServices: string[]; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (confirmation) doneRef.current?.focus();
  }, [confirmation]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const root = document.documentElement;
    const body = document.body;
    const { scrollX, scrollY } = window;
    const previousRootOverflow = root.style.overflow;
    const previousScrollBehavior = root.style.scrollBehavior;
    const previousBody = {
      overflow: body.style.overflow, position: body.style.position,
      top: body.style.top, left: body.style.left, width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    if (scrollbarWidth > 0) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbarWidth}px`;
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `${-scrollY}px`;
    body.style.left = `${-scrollX}px`;
    body.style.width = "100%";

    // Follow the visible viewport when a phone keyboard reduces the usable space.
    const viewport = window.visualViewport;
    const fit = () => {
      const height = viewport?.height ?? window.innerHeight;
      dialog.style.height = `${height}px`;
      dialog.style.top = `${viewport?.offsetTop ?? 0}px`;
      dialog.dataset.compact = String(height < 500);
    };
    fit();
    window.addEventListener("resize", fit);
    viewport?.addEventListener("resize", fit);
    viewport?.addEventListener("scroll", fit);
    dialog.showModal();
    return () => {
      dialog.close();
      window.removeEventListener("resize", fit);
      viewport?.removeEventListener("resize", fit);
      viewport?.removeEventListener("scroll", fit);
      Object.assign(body.style, previousBody);
      root.style.overflow = previousRootOverflow;
      root.style.scrollBehavior = "auto";
      window.scrollTo(scrollX, scrollY);
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, []);

  return createPortal(
    <dialog ref={dialogRef} aria-modal="true" aria-labelledby="project-modal-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = [...event.currentTarget.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex="0"]',
        )].filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls.at(-1);
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }}
      className="group fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-[#050608]/88 p-3 text-white backdrop-blur-xl open:flex open:items-center open:justify-center data-[compact=true]:p-2 sm:p-4 lg:px-6">
      <motion.div key={confirmation ? "confirmation" : "form"} className={confirmation
        ? "relative isolate flex max-h-full w-full max-w-sm flex-col overflow-y-auto rounded-3xl border border-white/10 bg-[#101216] p-6 text-center shadow-[0_30px_100px_rgba(0,0,0,0.5)] sm:p-8"
        : "flex h-full min-h-0 w-full max-w-6xl flex-col"}
        initial={reducedMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
        {!confirmation && <div className="mb-3 flex shrink-0 items-start justify-between gap-4 group-data-[compact=true]:mb-2">
          <div>
            <p className="text-xs font-semibold uppercase text-white/50 group-data-[compact=true]:hidden">Start a project</p>
            <h2 id="project-modal-title" className="mt-1 text-xl font-semibold group-data-[compact=true]:mt-0 group-data-[compact=true]:text-lg sm:text-3xl">Tell us what you need</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close project form"
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/14 bg-white/10 text-white">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>}
        {confirmation ? <div className="py-2">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-secondary)] to-[var(--brand-end)]" />
          <button type="button" onClick={onClose} aria-label="Close confirmation"
            className="absolute right-2 top-2 flex size-11 items-center justify-center rounded-full text-white/50 transition hover:bg-white/5 hover:text-white">
            <X className="size-5" aria-hidden="true" />
          </button>
          <motion.div initial={reducedMotion ? false : { scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }} className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-start)] ring-1 ring-[var(--brand-primary)]/25">
            <svg viewBox="0 0 40 40" className="size-9" fill="none" aria-hidden="true">
              <motion.path d="m11 21 6 6 13-14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                initial={reducedMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.1 }} />
            </svg>
          </motion.div>
          <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">Enquiry received</p>
          <h2 id="project-modal-title" className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-[1.75rem]">Thanks for reaching out.</h2>
          <p role="status" className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/60">Your enquiry is with our team.<br />We’ll be in touch soon.</p>
          <button ref={doneRef} type="button" onClick={onClose}
            data-uk-action className="mt-6 min-h-12 w-full rounded-full bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-middle)] to-[var(--brand-end)] px-6 text-sm font-semibold text-[var(--brand-button-ink)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-middle)]">Done</button>
        </div> : <ProjectInquiryForm contained initialServices={initialServices} source="Project modal form" onSuccess={setConfirmation} />}
      </motion.div>
    </dialog>, document.body,
  );
}
