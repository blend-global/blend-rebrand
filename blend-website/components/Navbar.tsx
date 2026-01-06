"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent">
      <div className="container-max">
        <div className="mt-6 flex items-center justify-between rounded-full bg-[#0b0c13] px-4 py-3 text-white shadow-pill ring-1 ring-[#1b1d29]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-300 to-pink-400 text-sm font-semibold text-[#0c0c0f]">
              BL
            </div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              BLEND
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link href="#contact" className="pill-button pill-primary">
              Contact Us
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span className="block h-0.5 w-5 bg-white"></span>
            <span className="mt-1 block h-0.5 w-5 bg-white"></span>
            <span className="mt-1 block h-0.5 w-4 bg-white"></span>
          </button>
        </div>

        {open && (
          <div className="mt-2 rounded-3xl bg-[#0c0d13] p-4 text-white shadow-xl md:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium text-white/80">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-3 py-2 transition-colors hover:bg-white/5 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link
              href="#contact"
              className="mt-4 w-full pill-button pill-primary justify-center"
              onClick={() => setOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
