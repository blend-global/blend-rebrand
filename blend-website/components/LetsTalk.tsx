"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { type FormEvent, useState } from "react";
import Reveal from "@/components/Reveal";
import { contactSection } from "@/lib/data";

export default function LetsTalk() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          contactNumber: formData.get("contactNumber"),
          message: formData.get("message"),
          source: "Homepage contact form",
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "We could not send your message right now.");
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "We could not send your message right now.");
    }
  };

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
                { label: "Facebook", icon: Facebook },
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
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#6c6f77]" htmlFor="firstName">
                First name
              </label>
              <input id="firstName" name="firstName" className="input-control" placeholder="John" autoComplete="given-name" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#6c6f77]" htmlFor="lastName">
                Last name
              </label>
              <input id="lastName" name="lastName" className="input-control" placeholder="Doe" autoComplete="family-name" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#6c6f77]" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-control"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#6c6f77]" htmlFor="contactNumber">
                Contact number
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                className="input-control"
                placeholder="+00 000 0000"
                autoComplete="tel"
              />
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
                required
              />
            </div>
            <div className="md:col-span-2 min-h-5 text-sm" aria-live="polite">
              {status === "success" ? <p className="font-semibold text-[#2bbf7f]">Thanks, your message has been sent.</p> : null}
              {status === "error" ? <p className="font-semibold text-[#c92f6d]">{errorMessage}</p> : null}
            </div>
            <div className="md:col-span-2 flex justify-end">
              <motion.button
                type="submit"
                className="pill-button pill-dark w-full px-8 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                disabled={status === "submitting"}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {status === "submitting" ? "Sending..." : "Submit"}
              </motion.button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
