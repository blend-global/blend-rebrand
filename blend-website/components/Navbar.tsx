"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-6 z-40 w-full bg-transparent">
      <div className="container-max">
        <div className="mt-6">
          <div className="relative rounded-r-full rounded-l-none bg-gradient-to-r from-[#6bd688] via-[#6bd688] via-40% to-[#f36fb4] p-[2px] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between rounded-r-full rounded-l-none bg-[#111216] px-5 py-3 text-white">
              <div className="flex items-center gap-3 pl-1">
                <Image src="/logo.png" alt="Blend logo" width={72} height={24} className="h-6 w-auto" />
              </div>

              <nav className="hidden items-center gap-8 text-base font-semibold text-white/80 md:flex">
                {navLinks.map((link, idx) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`transition-colors hover:text-white ${idx === 0 ? "text-white" : ""}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="hidden md:block">
                <Link
                  href="#contact"
                  className="inline-flex h-11 items-center justify-center rounded-full border-2 border-black/20 bg-gradient-to-r from-[#fa5fa5] to-[#f847a6] px-6 text-base font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.25)]"
                >
                  Contact
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
          </div>
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
