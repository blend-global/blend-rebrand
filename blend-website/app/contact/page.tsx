"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, Facebook, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import { contactSection } from "@/lib/data";

const ContactPage = () => {
  const [selectedService, setSelectedService] = useState("");
  const socials = [
    { label: "Facebook", icon: Facebook },
    { label: "Instagram", icon: Instagram },
    { label: "LinkedIn", icon: Linkedin },
  ];

  return (
    <main className="min-h-screen bg-[#0d0f15] text-white">
      <Navbar isOverlay={true} />

      <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-32 sm:pt-40 md:pt-44">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_34%_48%,rgba(120,209,255,0.18),transparent_34%),radial-gradient(circle_at_70%_45%,rgba(243,111,180,0.14),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-0 bg-black/25" />
        <div className="container-max relative z-10 pb-16 sm:pb-20">
          <div className="grid w-full gap-10 sm:gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16">
            <Reveal className="flex flex-col justify-start gap-8">
              <div>
                <h1 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
                  <span className="text-[#3aa6b4]">Let&apos;s </span>
                  <span className="text-[#f26aa8]">Talk</span>
                </h1>
                <p className="mt-4 max-w-md text-sm text-white/70 sm:text-base">
                  Have some big idea or brand to develop and need help? Then reach out we&apos;d love to hear about your
                  project and provide help
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold sm:text-2xl">Email</h2>
                <p className="mt-2 text-sm text-white/70">info@blend.global</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold sm:text-2xl">Contact Number</h2>
                <p className="mt-2 text-sm text-white/70">+27 21 448 8282</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold sm:text-2xl">Socials</h2>
                <div className="mt-4 flex items-center gap-3">
                  {socials.map((item) => (
                    <motion.a
                      key={item.label}
                      href={contactSection.socials.find((social) => social.label === item.label)?.href ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white ring-1 ring-white/20 sm:h-10 sm:w-10"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <item.icon className="h-4 w-4" color="#ffffff" strokeWidth={2.2} aria-hidden="true" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05} className="w-full">
              <form className="grid gap-5">
                <label className="grid gap-2 text-sm font-medium text-white/80">
                  Company Name
                  <input
                    type="text"
                    name="company"
                    className="h-12 rounded-md border border-white/10 bg-white/10 px-4 text-sm text-white outline-none transition focus:border-[#3aa6b4] focus:bg-white/14"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-white/80">
                  Email Address
                  <input
                    type="email"
                    name="email"
                    className="h-12 rounded-md border border-white/10 bg-white/10 px-4 text-sm text-white outline-none transition focus:border-[#3aa6b4] focus:bg-white/14"
                  />
                </label>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-white/80">
                    City
                    <input
                      type="text"
                      name="city"
                      className="h-12 rounded-md border border-white/10 bg-white/10 px-4 text-sm text-white outline-none transition focus:border-[#3aa6b4] focus:bg-white/14"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-white/80">
                    Country
                    <input
                      type="text"
                      name="country"
                      className="h-12 rounded-md border border-white/10 bg-white/10 px-4 text-sm text-white outline-none transition focus:border-[#3aa6b4] focus:bg-white/14"
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-medium text-white/80">
                  What service are you interested in?
                  <span className="relative block">
                    <select
                      name="service"
                      className="h-12 w-full appearance-none rounded-md border border-white/10 bg-white/10 py-0 pl-4 pr-16 text-sm text-white/60 outline-none transition focus:border-[#3aa6b4] focus:bg-white/14"
                      value={selectedService}
                      onChange={(event) => setSelectedService(event.target.value)}
                    >
                      <option value="" disabled>
                        Select project type
                      </option>
                      <option value="digital">Digital</option>
                      <option value="experiential">Experiential</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
                      aria-hidden="true"
                    />
                  </span>
                </label>

                {selectedService === "hybrid" ? (
                  <label className="grid gap-2 text-sm font-medium text-white/80">
                    Tell us a bit more...
                    <textarea
                      name="hybridDetails"
                      rows={4}
                      className="rounded-md border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-[#3aa6b4] focus:bg-white/14"
                    />
                  </label>
                ) : null}

                <label className="grid gap-2 text-sm font-medium text-white/80">
                  Budget
                  <span className="relative block">
                    <select
                      name="budget"
                      className="h-12 w-full appearance-none rounded-md border border-white/10 bg-white/10 py-0 pl-4 pr-16 text-sm text-white/60 outline-none transition focus:border-[#3aa6b4] focus:bg-white/14"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select project budget
                      </option>
                      <option value="under-50k">Under ZAR 50k</option>
                      <option value="50k-150k">ZAR 50k - ZAR 150k</option>
                      <option value="150k-plus">ZAR 150k+</option>
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
                      aria-hidden="true"
                    />
                  </span>
                </label>

                <label className="grid gap-2 text-sm font-medium text-white/80">
                  Message
                  <textarea
                    name="message"
                    rows={5}
                    className="rounded-md border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-[#3aa6b4] focus:bg-white/14"
                  />
                </label>

                <motion.button
                  type="submit"
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-md bg-white text-sm font-semibold text-[#101114] shadow-[0_14px_30px_rgba(0,0,0,0.25)]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Submit
                </motion.button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ContactPage;
