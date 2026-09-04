"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { MotionLink } from "@/components/MotionLink";
import { navLinks } from "@/lib/data";

export default function Navbar() {
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
    <header ref={headerRef} className="fixed left-0 top-3 z-50 w-full sm:top-6">
      <div className="nav-container">
        <div className="mt-4 sm:mt-6">
          <div className="flex items-center justify-between gap-5">
            <MotionLink
              href="/"
              prefetch
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

            <div
              className="relative hidden md:block"
              onMouseEnter={showDesktopMenu}
              onMouseLeave={hideDesktopMenu}
            >
              <motion.button
                type="button"
                className="absolute bottom-0 right-0 top-0 z-10 my-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#111216]/92 text-white shadow-[0_14px_36px_rgba(0,0,0,0.35)]"
                onClick={showDesktopMenu}
                onFocus={showDesktopMenu}
                onBlur={hideDesktopMenu}
                aria-label="Show navigation"
                animate={{
                  opacity: desktopMenuVisible ? 0 : 1,
                  scale: desktopMenuVisible ? 0.92 : 1,
                  pointerEvents: desktopMenuVisible ? "none" : "auto",
                }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </motion.button>

              <motion.div
                onFocus={showDesktopMenu}
                onBlur={hideDesktopMenu}
                initial={{ opacity: 1, x: 0 }}
                animate={{
                  opacity: desktopMenuVisible ? 1 : 0,
                  x: desktopMenuVisible ? 0 : 12,
                  pointerEvents: desktopMenuVisible ? "auto" : "none",
                }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-6 px-3 py-2.5 text-white lg:gap-8 lg:px-4"
              >
                <motion.nav
                  className="flex items-center gap-6 text-sm font-semibold lg:gap-8 lg:text-base"
                  animate={{ color: menuTextColor }}
                  transition={toneTransition}
                >
                  {navLinks.map((link, idx) => (
                    <MotionLink
                      key={link.label}
                      href={link.href}
                      prefetch
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
                  prefetch
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
              </motion.div>
            </div>

            <motion.button
              type="button"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border bg-[#111216]/92 text-white shadow-[0_14px_36px_rgba(0,0,0,0.35)] md:hidden ${
                open ? "border-[#f2c94c] ring-2 ring-[#f2c94c]/40" : "border-white/10"
              }`}
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              whileTap={{ scale: 0.95 }}
            >
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </motion.button>
          </div>
        </div>

        {open && (
          <motion.div
            className="fixed inset-0 z-[-1] flex flex-col bg-[#050608]/98 px-4 pb-8 pt-[5.75rem] text-white shadow-xl backdrop-blur md:hidden sm:pt-[7rem]"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="flex flex-1 flex-col justify-center gap-6 text-3xl font-semibold tracking-[-0.04em] text-white/86">
              {navLinks.map((link) => (
                <MotionLink
                  key={link.label}
                  href={link.href}
                  prefetch
                  className="rounded-2xl px-2 py-3 transition-colors hover:bg-white/5 hover:text-white"
                  onClick={() => setOpen(false)}
                  whileHover={{ x: 4 }}
                >
                  {link.label}
                </MotionLink>
              ))}
            </nav>
            <MotionLink
              href="/contact"
              prefetch
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#6bd688] via-[#78d1ff] to-[#22d3ee] px-5 py-4 text-base font-bold text-[#07100e]"
              onClick={() => setOpen(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Contact Us
            </MotionLink>
          </motion.div>
        )}
      </div>
    </header>
  );
}
