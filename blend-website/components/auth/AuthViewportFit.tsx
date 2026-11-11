"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

export default function AuthViewportFit({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const fit = () => {
      const available = viewport.clientHeight;
      const height = content.offsetHeight;
      if (available > 0 && height > 0) setScale(Math.min(1, available / height));
    };
    const observer = new ResizeObserver(fit);
    observer.observe(viewport);
    observer.observe(content);
    fit();
    return () => {
      observer.disconnect();
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, []);

  return (
    <div ref={viewportRef} className="relative h-full w-full">
      <div ref={contentRef} className="absolute left-1/2 top-1/2 w-full origin-center" style={{ transform: `translate(-50%, -50%) scale(${scale ?? 1})`, visibility: scale === null ? "hidden" : "visible" }}>
        {children}
      </div>
    </div>
  );
}
