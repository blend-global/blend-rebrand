"use client";

import styles from "./UkServiceModal.module.css";
import Image from "next/image";
import { X } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ukContent } from "@/lib/regional-content";
import { regions } from "@/lib/regions";
import { getServiceIllustration } from "@/lib/service-illustrations";

type UkService = (typeof ukContent.services)[number];
const UkServiceModalContext = createContext<((slug: string) => void) | null>(null);

export const useUkServiceModal = () => useContext(UkServiceModalContext);

export function UkServiceDialog({ service, onClose }: { service: UkService; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const illustration = getServiceIllustration(service.slug);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      id="uk-service-dialog"
      aria-labelledby="uk-service-title"
      aria-describedby="uk-service-description"
      aria-modal="true"
      className={`${styles.dialog} fixed inset-0 m-auto rounded-[2rem] border border-white/15 bg-[#101114] p-0 text-white shadow-[0_30px_100px_rgba(0,0,0,0.6)] backdrop:bg-black/75 backdrop:backdrop-blur-sm`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
    >
      <div className={styles.shell}>
        <div className={styles.header}>
          <button type="button" onClick={onClose} aria-label="Close service details" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#101114] text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-middle)]">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className={styles.content}>
          {illustration && <div className={`${styles.illustration} overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--brand-start)] via-[var(--brand-middle)] to-[var(--brand-end)]`}>
            <Image src={illustration} alt="" fill sizes="(min-width: 640px) 560px, 90vw" className="object-contain p-3 sm:p-4" aria-hidden="true" />
          </div>}
          <div className="min-w-0">
            <h2 id="uk-service-title" className={`${styles.title} font-semibold tracking-[-0.035em]`}>{service.label}</h2>
            <p id="uk-service-description" className={`${styles.description} text-white/70`}>{service.summary}</p>
          </div>
        </div>
        <div className={styles.footer}>
          <a href={regions.uk.bookingUrl} target="_blank" rel="noreferrer" data-uk-action className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[var(--brand-start)] via-[var(--brand-middle)] to-[var(--brand-end)] px-7 text-sm font-bold text-[var(--brand-button-ink)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-middle)] sm:w-auto">Book a Call ↗</a>
        </div>
      </div>
    </dialog>
  );
}

export default function UkServiceModalProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);
  const service = ukContent.services.find((entry) => entry.slug === slug);
  const openService = (next: string) => {
    if (ukContent.services.some((entry) => entry.slug === next)) setSlug(next);
  };

  return (
    <UkServiceModalContext.Provider value={openService}>
      {children}
      {service && createPortal(<UkServiceDialog key={service.slug} service={service} onClose={() => setSlug(null)} />, document.body)}
    </UkServiceModalContext.Provider>
  );
}
