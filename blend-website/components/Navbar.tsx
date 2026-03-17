"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { MotionLink } from "@/components/MotionLink";
import { navLinks } from "@/lib/data";

interface NavbarProps {
  isOverlay?: boolean;
}

export default function Navbar({ isOverlay = false }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`${isOverlay ? "fixed left-0" : "sticky"} top-3 z-50 w-full sm:top-6`}>
      <div className="container-max">
        <div className="mt-4 sm:mt-6">
          <div className="relative rounded-r-full rounded-l-none bg-gradient-to-r from-[#6bd688] via-[#6bd688] via-40% to-[#f36fb4] p-[2px] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between rounded-r-full rounded-l-none bg-[#111216] px-4 py-2.5 text-white sm:px-5 sm:py-3">
              <div className="flex items-center gap-3 pl-1">
                <Image src="/logo.png" alt="Blend logo" width={72} height={24} className="h-5 w-auto sm:h-6" />
              </div>

              <nav className="hidden items-center gap-6 text-sm font-semibold text-white/80 md:flex lg:gap-8 lg:text-base">
                {navLinks.map((link, idx) => (
                  <MotionLink
                    key={link.label}
                    href={link.href}
                    className={`transition-colors hover:text-white ${idx === 0 ? "text-white" : ""}`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {link.label}
                  </MotionLink>
                ))}
                              <div className="hidden md:block">
                <MotionLink
                  href="/contact"
                  className="inline-flex h-10 items-center justify-center rounded-full border-2 border-black/20 bg-gradient-to-r from-[#fa5fa5] to-[#f847a6] px-5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.25)] lg:h-11 lg:px-6 lg:text-base"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Contact
                </MotionLink>
              </div>
              </nav>



              <motion.button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Toggle navigation"
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </motion.button>
            </div>
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
              className="mt-4 w-full pill-button pill-primary justify-center"
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
