"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

const ContactPage = () => {
  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="container-max py-12 sm:py-16 md:py-20">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-[1fr,1.2fr]">
          <Reveal className="flex flex-col justify-start gap-8">
            <div>
              <h1 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
                <span className="text-[#3aa6b4]">Let&apos;s </span>
                <span className="text-[#f26aa8]">Talk</span>
              </h1>
              <p className="mt-4 max-w-md text-sm text-[#33363f] sm:text-base">
                Have some big idea or brand to develop and need help? Then reach out we&apos;d love to hear about your
                project and provide help
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold sm:text-2xl">Email</h2>
              <p className="mt-2 text-sm text-[#33363f]">info@blend.global</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold sm:text-2xl">Contact Number</h2>
              <p className="mt-2 text-sm text-[#33363f]">+27 21 448 8282</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold sm:text-2xl">Socials</h2>
              <div className="mt-4 flex items-center gap-3">
                {[
                  { label: "Instagram", icon: Instagram },
                  { label: "Facebook", icon: Facebook },
                  { label: "LinkedIn", icon: Linkedin },
                ].map((item) => (
                  <motion.a
                    key={item.label}
                    href="#"
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black sm:h-10 sm:w-10"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <item.icon className="h-4 w-4" color="#ffffff" strokeWidth={2.2} aria-hidden="true" />
                  </motion.a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05} className="rounded-[12px] bg-white">
            <form className="grid gap-5">
              <label className="grid gap-2 text-sm font-medium text-[#33363f]">
                Company Name
                <input
                  type="text"
                  name="company"
                  className="h-12 rounded-md border border-transparent bg-[#f2f2f2] px-4 text-sm text-black outline-none focus:border-[#3aa6b4]"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-[#33363f]">
                  Email Address
                  <input
                    type="email"
                    name="email"
                    className="h-12 rounded-md border border-transparent bg-[#f2f2f2] px-4 text-sm text-black outline-none focus:border-[#3aa6b4]"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-[#33363f]">
                  <span className="flex items-center gap-2">
                    Contact Number <span className="text-xs text-[#8a8f99]">(Optional)</span>
                  </span>
                  <input
                    type="tel"
                    name="contactNumber"
                    className="h-12 rounded-md border border-transparent bg-[#f2f2f2] px-4 text-sm text-black outline-none focus:border-[#3aa6b4]"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium text-[#33363f]">
                Location
                <select
                  name="location"
                  className="h-12 rounded-md border border-transparent bg-[#f2f2f2] px-4 text-sm text-[#8a8f99] outline-none focus:border-[#3aa6b4]"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select project type
                  </option>
                  <option value="cape-town">Cape Town</option>
                  <option value="johannesburg">Johannesburg</option>
                  <option value="remote">Remote</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-[#33363f]">
                What service are you interested in?
                <select
                  name="service"
                  className="h-12 rounded-md border border-transparent bg-[#f2f2f2] px-4 text-sm text-[#8a8f99] outline-none focus:border-[#3aa6b4]"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select project type
                  </option>
                  <option value="digital">Digital</option>
                  <option value="experiential">Experiential</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-[#33363f]">
                Budget
                <select
                  name="budget"
                  className="h-12 rounded-md border border-transparent bg-[#f2f2f2] px-4 text-sm text-[#8a8f99] outline-none focus:border-[#3aa6b4]"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select project budget
                  </option>
                  <option value="under-50k">Under R50k</option>
                  <option value="50k-150k">R50k - R150k</option>
                  <option value="150k-plus">R150k+</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-[#33363f]">
                Message
                <textarea
                  name="message"
                  rows={5}
                  className="rounded-md border border-transparent bg-[#f2f2f2] px-4 py-3 text-sm text-black outline-none focus:border-[#3aa6b4]"
                />
              </label>

              <motion.button
                type="submit"
                className="mt-2 flex h-12 w-full items-center justify-center rounded-md bg-black text-sm font-semibold text-white shadow-[0_14px_30px_rgba(0,0,0,0.25)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Submit
              </motion.button>
            </form>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ContactPage;
