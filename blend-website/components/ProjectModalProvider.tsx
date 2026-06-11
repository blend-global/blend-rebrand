"use client";

import ProjectInquiryForm from "@/components/ProjectInquiryForm";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

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

  const openProjectModal = (options?: ProjectModalOptions) => {
    setInitialServices(options?.services ?? []);
    setIsOpen(true);
  };

  const closeProjectModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeProjectModal();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const value = useMemo(() => ({ openProjectModal, closeProjectModal }), []);

  return (
    <ProjectModalContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-[120] flex overflow-y-auto bg-[#050608]/88 px-4 py-4 text-white backdrop-blur-xl sm:px-6 lg:items-center lg:justify-center lg:overflow-y-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
          >
            <button className="fixed inset-0 h-full w-full cursor-default" type="button" onClick={closeProjectModal}>
              <span className="sr-only">Close project form</span>
            </button>

            <motion.div
              className="relative z-10 mx-auto my-auto w-full max-w-6xl lg:max-h-[calc(100svh-2rem)]"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-white/50">Start a project</p>
                  <h2 id="project-modal-title" className="mt-1 text-2xl font-semibold sm:text-3xl">
                    Tell us what you need
                  </h2>
                </div>
                <motion.button
                  type="button"
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/14 bg-white/10 text-white shadow-[0_14px_34px_rgba(0,0,0,0.28)]"
                  onClick={closeProjectModal}
                  aria-label="Close project form"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>

              <ProjectInquiryForm initialServices={initialServices} source="Project modal form" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ProjectModalContext.Provider>
  );
}
