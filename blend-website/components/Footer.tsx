"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Mail, Phone } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function Footer() {
  const siteLinks = ["Home", "Services", "Work", "Blog"];
  const termsLinks = ["Terms Of Services", "Privacy Policy", "Cookie Policy", "Cookie Preferences"];
  const currentYear = new Date().getUTCFullYear();

  return (
    <footer className="mt-12 text-white sm:mt-16">
      <div className="bg-[#0c0c0c] py-10 sm:py-12">
        <div className="container-max flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <Reveal className="flex max-w-xs flex-col gap-3">
            <Image src="/logo.png" alt="Blend logo" width={22} height={22} className="h-6 w-6" />
            <p className="text-sm leading-6 text-white/85">
              Make Moments Matter
            </p>
          </Reveal>

          <Reveal delay={0.03} className="flex flex-col gap-3">
            <h5 className="text-lg font-semibold">Site</h5>
            <div className="flex flex-col gap-2 text-sm text-white/85">
              {siteLinks.map((link) => (
                <motion.a key={link} href="#" className="hover:text-white" whileHover={{ x: 4 }}>
                  {link}
                </motion.a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.06} className="flex flex-col gap-3">
            <h5 className="text-lg font-semibold">Terms</h5>
            <div className="flex flex-col gap-2 text-sm text-white/85">
              {termsLinks.map((link) => (
                <motion.a key={link} href="#" className="hover:text-white" whileHover={{ x: 4 }}>
                  {link}
                </motion.a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.09} className="flex max-w-sm flex-col gap-4">
            <h5 className="text-lg font-semibold">Subscribe To Newsletter</h5>
            <p className="text-sm text-white/85">
              Keep up with the latest trends and news from the world of events and digital experiences.
            </p>
            <form className="flex flex-col gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-black shadow-[0_10px_24px_rgba(0,0,0,0.25)] sm:flex-row sm:items-center sm:rounded-full sm:py-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-transparent px-2 py-2 text-sm outline-none"
              />
              <motion.button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#0c0c0c] px-5 py-2 text-sm font-semibold text-white"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Submit
              </motion.button>
            </form>
          </Reveal>
        </div>
      </div>

      <div className="bg-white py-8 text-[#0c0c0c]">
        <div className="container-max flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <Reveal className="flex flex-col gap-2">
            <h6 className="text-lg font-semibold leading-snug sm:text-xl">
              Copyright © <span suppressHydrationWarning>{currentYear}</span> Blend Global All Rights Reserved
            </h6>
            <span className="text-sm text-[#4d4d50]">B-BBEE Level 1</span>
          </Reveal>

          <Reveal delay={0.03} className="flex flex-col gap-3">
            <h6 className="text-lg font-semibold">Contact</h6>
            <div className="flex items-center gap-2 text-sm text-[#222]">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <a href="mailto:info@blend.global">info@blend.global</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#222]">
              <Phone className="h-4 w-4" aria-hidden="true" />
              <a href="tel:0214488282">0214488282</a>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="flex flex-col gap-3">
            <h6 className="text-lg font-semibold">Address</h6>
            <p className="text-sm leading-6 text-[#222]">
              33 Salt River Road,
              <br />
              Salt River, Cape Town, South Africa, 7925
            </p>
          </Reveal>

          <Reveal delay={0.09} className="flex items-center gap-3">
            {[
              { label: "Instagram", icon: Instagram, href: "https://www.instagram.com/blend.global" },
              { label: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/blend-eventlife/" },
            ].map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white sm:h-10 sm:w-10"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                <item.icon className="h-4 w-4" color="#ffffff" strokeWidth={2.2} aria-hidden="true" />
              </motion.a>
            ))}
          </Reveal>
        </div>
      </div>
    </footer>
  );
}
