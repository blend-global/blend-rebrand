"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { MotionLink } from "@/components/MotionLink";
import { navLinks } from "@/lib/data";

interface NavbarProps {
  isOverlay?: boolean;
}

export default function Navbar({ isOverlay = false }: NavbarProps) {
  const headerRef = useRef<HTMLElement>(null);
  const hideMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [isOnLightBackground, setIsOnLightBackground] = useState(false);
  const [desktopMenuVisible, setDesktopMenuVisible] = useState(true);

  useEffect(() => {
    const getRgb = (color: string) => {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!match) return null;

      const alpha = match[4] ? Number(match[4]) : 1;
      if (alpha < 0.2) return null;

      return {
        r: Number(match[1]),
        g: Number(match[2]),
        b: Number(match[3]),
      };
    };

    const updateNavbarTone = () => {
      const header = headerRef.current;
      if (!header) return;

      const headerBounds = header.getBoundingClientRect();
      const sampleX = window.innerWidth / 2;
      const sampleY = Math.min(window.innerHeight - 1, headerBounds.top + headerBounds.height / 2);
      const backgroundElement = document
        .elementsFromPoint(sampleX, sampleY)
        .find((element) => !header.contains(element));
      let element: Element | null = backgroundElement ?? null;

      while (element) {
        const rgb = getRgb(window.getComputedStyle(element).backgroundColor);

        if (rgb) {
          const luminance = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
          setIsOnLightBackground(luminance > 170);
          return;
        }

        element = element.parentElement;
      }

      setIsOnLightBackground(false);
    };

    const scheduleUpdate = () => requestAnimationFrame(updateNavbarTone);

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  useEffect(() => {
    hideMenuTimeout.current = setTimeout(() => {
      setDesktopMenuVisible(false);
    }, 2200);

    return () => {
      if (hideMenuTimeout.current) {
        clearTimeout(hideMenuTimeout.current);
      }
    };
  }, []);

  const showDesktopMenu = () => {
    if (hideMenuTimeout.current) {
      clearTimeout(hideMenuTimeout.current);
    }

    setDesktopMenuVisible(true);
  };

  const hideDesktopMenu = () => {
    hideMenuTimeout.current = setTimeout(() => {
      setDesktopMenuVisible(false);
    }, 1800);
  };

  const menuTextColor = isOnLightBackground ? "rgba(16, 17, 20, 0.82)" : "rgba(255, 255, 255, 0.82)";
  const activeMenuTextColor = isOnLightBackground ? "#101114" : "#ffffff";
  const hoverMenuTextColor = isOnLightBackground ? "#101114" : "#ffffff";
  const toneTransition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] } as const;

  return (
    <header ref={headerRef} className={`${isOverlay ? "fixed left-0" : "sticky"} top-3 z-50 w-full sm:top-6`}>
      <div className="container-max">
        <div className="mt-4 sm:mt-6">
          <div className="flex items-center justify-between gap-5">
            <MotionLink
              href="/"
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111216]/92 shadow-[0_14px_36px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur sm:h-16 sm:w-16 md:h-20 md:w-20"
              aria-label="Blend home"
              onMouseEnter={showDesktopMenu}
              onMouseLeave={hideDesktopMenu}
              onFocus={showDesktopMenu}
              onBlur={hideDesktopMenu}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Image src="/logo.png" alt="Blend logo" width={89} height={93} className="h-9 w-auto sm:h-11 md:h-14" priority />
            </MotionLink>

            <motion.div
              className="hidden md:block"
              onMouseEnter={showDesktopMenu}
              onMouseLeave={hideDesktopMenu}
              onFocus={showDesktopMenu}
              onBlur={hideDesktopMenu}
              initial={{ opacity: 1, x: 0 }}
              animate={{
                opacity: desktopMenuVisible ? 1 : 0,
                x: desktopMenuVisible ? 0 : 12,
                pointerEvents: desktopMenuVisible ? "auto" : "none",
              }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-6 px-3 py-2.5 text-white lg:gap-8 lg:px-4">
                <motion.nav
                  className="flex items-center gap-6 text-sm font-semibold lg:gap-8 lg:text-base"
                  animate={{ color: menuTextColor }}
                  transition={toneTransition}
                >
                  {navLinks.map((link, idx) => (
                    <MotionLink
                      key={link.label}
                      href={link.href}
                      className="group relative inline-flex py-2"
                      animate={{ color: idx === 0 ? activeMenuTextColor : menuTextColor }}
                      transition={toneTransition}
                      whileHover={{ y: -3, scale: 1.04, color: hoverMenuTextColor }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {link.label}
                      <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-[#6bd688] via-[#78d1ff] to-[#f36fb4] opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100" />
                    </MotionLink>
                  ))}
                </motion.nav>
                <MotionLink
                  href="/contact"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#6bd688] via-[#78d1ff] to-[#22d3ee] px-5 text-sm font-bold text-[#07100e] shadow-[0_12px_28px_rgba(120,209,255,0.28)] ring-1 ring-white/25 lg:h-11 lg:px-6 lg:text-base"
                  whileHover={{
                    y: -3,
                    scale: 1.05,
                    boxShadow: "0 18px 36px rgba(120, 209, 255, 0.42)",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  Contact
                </MotionLink>
              </div>
            </motion.div>

            <motion.button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#111216]/92 text-white shadow-[0_14px_36px_rgba(0,0,0,0.35)] md:hidden"
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </motion.button>
          </div>
        </div>

        {open && (
          <div className="mt-2 rounded-3xl bg-[#0c0d13] p-3 text-white shadow-xl md:hidden sm:p-4">
            <nav className="flex flex-col gap-3 text-sm font-medium text-white/80">
              {navLinks.map((link) => (
                <MotionLink
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-3 py-2 transition-colors hover:bg-white/5 hover:text-white"
                  onClick={() => setOpen(false)}
                  whileHover={{ x: 4 }}
                >
                  {link.label}
                </MotionLink>
              ))}
            </nav>
            <MotionLink
              href="/contact"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#6bd688] via-[#78d1ff] to-[#22d3ee] px-5 py-3 text-sm font-bold text-[#07100e]"
              onClick={() => setOpen(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Contact Us
            </MotionLink>
          </div>
        )}
      </div>
    </header>
  );
}
