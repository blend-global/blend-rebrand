"use client";

import { motion } from "framer-motion";
import { Instagram, Linkedin } from "lucide-react";
import Reveal from "@/components/Reveal";
import { contactSection } from "@/lib/data";

export default function LetsTalk() {
  return (
    <section id="contact" className="bg-white py-12 sm:py-16">
      <div className="container-max grid gap-8 sm:gap-10 md:grid-cols-[1fr,1.1fr]">
        <Reveal className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-300 to-pink-400" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9aa0ac] sm:text-sm">
              Contact
            </p>
          </div>
          <h2 className="text-2xl font-semibold text-[#0e0e10] sm:text-3xl">
            Let<span className="text-[#2bbf7f]">s </span>
            <span className="text-[#f36fb4]">Talk</span>
          </h2>
          <p className="max-w-xl text-sm text-[#3c3f46] sm:text-base">{contactSection.subtitle}</p>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#6c6f77]">Email</span>
            <span className="text-base font-semibold sm:text-lg">{contactSection.email}</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#6c6f77]">Contact Number</span>
            <span className="text-base font-semibold sm:text-lg">{contactSection.phone}</span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-[#6c6f77]">Address</span>
            <span className="text-base font-semibold sm:text-lg">{contactSection.address}</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#6c6f77]">Socials</span>
            <div className="flex gap-3">
              {[
                { label: "Instagram", icon: Instagram },
                { label: "LinkedIn", icon: Linkedin },
              ].map((item) => (
                <motion.a
                  key={item.label}
                  href={contactSection.socials.find((social) => social.label === item.label)?.href ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white sm:h-10 sm:w-10"
                  aria-label={item.label}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <item.icon className="h-4 w-4 text-white" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="rounded-[28px] bg-white p-5 shadow-light ring-1 ring-black/5 sm:p-6">
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#6c6f77]" htmlFor="firstName">
                First name
              </label>
              <input id="firstName" name="firstName" className="input-control" placeholder="John" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#6c6f77]" htmlFor="lastName">
                Last name
              </label>
              <input id="lastName" name="lastName" className="input-control" placeholder="Doe" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#6c6f77]" htmlFor="email">
                Email address
              </label>
              <input id="email" name="email" type="email" className="input-control" placeholder="you@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#6c6f77]" htmlFor="contactNumber">
                Contact number
              </label>
              <input id="contactNumber" name="contactNumber" className="input-control" placeholder="+00 000 0000" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#6c6f77]" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="input-control"
                placeholder="Let us know what you have in mind"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <motion.button
                type="submit"
                className="pill-button pill-dark w-full px-8 md:w-auto"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Submit
              </motion.button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
