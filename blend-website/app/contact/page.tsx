"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import StartProjectButton from "@/components/StartProjectButton";
import { contactSection } from "@/lib/data";
import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Sparkles } from "lucide-react";

const ContactPage = () => {
  const socials = [
    { label: "Facebook", icon: Facebook },
    { label: "Instagram", icon: Instagram },
    { label: "LinkedIn", icon: Linkedin },
  ];

  return (
    <main className="min-h-screen bg-[#0d0f15] text-white">
      <Navbar />

      <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-32 sm:pt-40 md:pt-44">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_32%,rgba(82,214,161,0.2),transparent_32%),radial-gradient(circle_at_78%_22%,rgba(243,111,180,0.18),transparent_30%),linear-gradient(135deg,rgba(58,166,180,0.1),transparent_48%)]" />
        <div className="pointer-events-none absolute inset-0 bg-black/35" />

        <div className="container-max relative z-10 pb-16 sm:pb-20">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start lg:gap-14">
            <Reveal className="flex flex-col justify-start gap-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80">
                  <Sparkles className="h-4 w-4 text-[#52d6a1]" aria-hidden="true" />
                  Contact Blend
                </span>
                <h1 className="mt-6 text-4xl font-semibold sm:text-5xl md:text-6xl">
                  <span className="text-[#52d6a1]">Let&apos;s </span>
                  <span className="text-[#f36fb4]">Talk</span>
                </h1>
                <p className="mt-5 max-w-md text-base leading-7 text-white/72">
                  Reach out directly, or start a project brief and we&apos;ll route it to the right team.
                </p>
              </div>

              <div className="grid gap-4 text-sm text-white/75">
                <a
                  className="flex items-center gap-3 transition hover:text-white"
                  href={`mailto:${contactSection.email}`}
                  aria-label={`Email ${contactSection.email}`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                    <Mail className="h-4 w-4 text-[#52d6a1]" aria-hidden="true" />
                  </span>
                  {contactSection.email}
                </a>
                <a
                  className="flex items-center gap-3 transition hover:text-white"
                  href={`tel:${contactSection.phone.replaceAll(" ", "")}`}
                  aria-label={`Call ${contactSection.phone}`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                    <Phone className="h-4 w-4 text-[#f36fb4]" aria-hidden="true" />
                  </span>
                  {contactSection.phone}
                </a>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                    <MapPin className="h-4 w-4 text-[#3aa6b4]" aria-hidden="true" />
                  </span>
                  Cape Town, South Africa
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white/80">Socials</h2>
                <div className="mt-4 flex items-center gap-3">
                  {socials.map((item) => (
                    <motion.a
                      key={item.label}
                      href={contactSection.socials.find((social) => social.label === item.label)?.href ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white ring-1 ring-white/20"
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <item.icon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05} className="w-full">
              <div className="rounded-[28px] border border-white/14 bg-white/[0.08] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.36)] backdrop-blur-xl sm:p-8">
                <p className="text-xs font-semibold uppercase text-white/45">Project enquiries</p>
                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Have a brief ready?</h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/68 sm:text-base">
                  Open the guided project form to select services, share budget context, and send the essentials without
                  leaving this page.
                </p>
                <StartProjectButton className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#52d6a1] via-[#3aa6b4] to-[#f36fb4] px-6 text-sm font-bold text-[#07100e] shadow-[0_16px_34px_rgba(82,214,161,0.22)] sm:w-auto">
                  Start a project
                </StartProjectButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ContactPage;
