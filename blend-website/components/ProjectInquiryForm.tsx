"use client";

import { regionalServices } from "@/lib/regional-content";
import { useRegion } from "@/components/regions/useRegion";
import servicesData from "@/content/services.json";
import { submitContactEnquiry } from "@/lib/contact-client";
import styles from "./ProjectInquiryForm.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  contactNumber: string;
  city: string;
  country: string;
  services: string[];
  budget: string;
  message: string;
  hybridDetails: string;
};

type TextFormField = Exclude<keyof FormState, "services">;

type ProjectInquiryFormProps = {
  contained?: boolean;
  className?: string;
  initialServices?: string[];
  source?: string;
  onSuccess?: (message: string) => void;
};

const getInitialFormState = (services: string[] = []): FormState => ({
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  contactNumber: "",
  city: "",
  country: "",
  services,
  budget: "",
  message: "",
  hybridDetails: "",
});

const budgetOptions = [
  { label: "Under ZAR 50k", value: "under-50k" },
  { label: "ZAR 50k - ZAR 150k", value: "50k-150k" },
  { label: "ZAR 150k+", value: "150k-plus" },
  { label: "Still shaping it", value: "still-shaping" },
];

const steps = ["Service", "Basics", "Scope", "Send"];
const emptyServices: string[] = [];

export default function ProjectInquiryForm(props: ProjectInquiryFormProps) {
  const region = useRegion();
  return <ProjectInquiryFormContent key={region.code + JSON.stringify(props.initialServices ?? [])} {...props} />;
}

function ProjectInquiryFormContent({
  contained = false,
  className = "",
  initialServices = emptyServices,
  source = "Project inquiry form",
  onSuccess,
}: ProjectInquiryFormProps) {
  const region = useRegion();
  const [currentStep, setCurrentStep] = useState(0);
  const [formState, setFormState] = useState<FormState>(() => ({ ...getInitialFormState(initialServices), country: region.name }));
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const submissionInFlight = useRef(false);

  useEffect(() => {
    if (contained) scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [contained, currentStep]);

  const catalogue = regionalServices(region.code, servicesData).servicesContent;
  const serviceOptions = [
      {
        kind: "digital",
        category: catalogue.digitalLabel,
        items: catalogue.digital,
      },
      {
        kind: "experiential",
        category: catalogue.experientialLabel,
        items: catalogue.experiential,
      },
    ].filter((group) => group.items.length > 0);

  const selectedServices = serviceOptions
    .flatMap((group) => group.items)
    .filter((item) => formState.services.includes(item.slug));
  const selectedServicesLabel =
    selectedServices.length === 0
      ? "Choose services"
      : selectedServices.length === 1
        ? selectedServices[0].label
        : `${selectedServices.length} services selected`;
  const isHybridService =
    formState.services.includes("hybrid-virtual-events") || formState.services.includes("live-streaming");
  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateField = (field: TextFormField, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
    setStatus("idle");
    setErrorMessage("");
  };

  const toggleService = (slug: string) => {
    setFormState((current) => ({
      ...current,
      services: current.services.includes(slug)
        ? current.services.filter((selectedSlug) => selectedSlug !== slug)
        : [...current.services, slug],
    }));
    setStatus("idle");
    setErrorMessage("");
  };

  const canContinue = () => {
    if (currentStep === 0) return formState.services.length > 0;
    if (currentStep === 1) return Boolean(formState.firstName && formState.email);
    if (currentStep === 2) return Boolean(formState.budget);
    return Boolean(formState.message);
  };

  const goNext = () => {
    if (!canContinue()) return;
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const goBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionInFlight.current) return;

    if (!formState.message) {
      setErrorMessage("Add a short note before submitting.");
      setStatus("error");
      return;
    }

    submissionInFlight.current = true;
    setStatus("submitting");
    setErrorMessage("");

    try {
      const message = await submitContactEnquiry({
        ...formState,
        service: selectedServices.map((service) => service.label).join(", "),
        source,
        region: region.code,
        currency: region.currency,
      });

      setFormState({ ...getInitialFormState(initialServices), country: region.name });
      setCurrentStep(0);
      setStatus("success");
      setSuccessMessage(message);
      onSuccess?.(message);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "We could not send your message right now.");
    } finally {
      submissionInFlight.current = false;
    }
  };

  return (
    <form
      className={`${contained ? "flex min-h-0 flex-1 flex-col" : ""} overflow-hidden rounded-[28px] border border-white/14 bg-white/[0.08] shadow-[0_28px_90px_rgba(0,0,0,0.36)] backdrop-blur-xl ${className}`}
      onSubmit={handleSubmit}
      aria-busy={status === "submitting"}
    >
      <div className="shrink-0 border-b border-white/12 px-5 py-4 group-data-[compact=true]:py-2 sm:px-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-white/50">
              Step {currentStep + 1} of {steps.length}
            </p>
            <p className="mt-1 text-sm font-semibold text-white">{status === "submitting" ? "Sending your enquiry…" : steps[currentStep]}</p>
          </div>
          <div className="flex max-w-[52%] items-center gap-2 text-right text-xs font-semibold text-white/60">
            <BriefcaseBusiness className="h-4 w-4 shrink-0 text-[#52d6a1]" aria-hidden="true" />
            <span>{selectedServicesLabel}</span>
          </div>
        </div>
        <div role="progressbar" aria-label={status === "submitting" ? "Sending your enquiry" : "Project enquiry steps"}
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={status === "submitting" ? undefined : progress}
          aria-valuetext={status === "submitting" ? "Sending your enquiry" : `Step ${currentStep + 1} of ${steps.length}`}
          className="mt-4 h-2 overflow-hidden rounded-full bg-white/10 group-data-[compact=true]:mt-2 group-data-[compact=true]:h-1">
          <motion.div
            className={`${styles.progressFill} ${status === "submitting" ? styles.submitting : ""} h-full rounded-full`}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>
      </div>

      <div ref={scrollRef} data-project-form-content tabIndex={contained ? 0 : undefined}
        role={contained ? "region" : undefined} aria-label={contained ? "Project form fields" : undefined}
        className={`${contained ? "min-h-0 flex-1 overflow-y-auto overscroll-contain" : "min-h-[500px] lg:min-h-[360px]"} px-5 py-6 group-data-[compact=true]:py-3 sm:px-7`}>
        <fieldset disabled={status === "submitting"} className="min-w-0">
        <AnimatePresence mode="wait">
          {currentStep === 0 ? (
            <motion.div
              key="service"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
              className="grid gap-5"
            >
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">What can we help you create?</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Pick every service that fits your brief. You can add more context before sending.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
                {serviceOptions.map((group) => (
                  <div key={group.category} className="grid gap-3">
                    <p className="text-xs font-semibold uppercase text-white/45">{group.category}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {group.items.map((service) => {
                        const isSelected = formState.services.includes(service.slug);
                        const selectedClass =
                          group.kind === "digital"
                            ? "border-transparent bg-gradient-to-r from-[#6bd688] to-[#22d3ee] text-[#07100e] shadow-[0_16px_32px_rgba(34,211,238,0.22)]"
                            : "border-transparent bg-gradient-to-r from-[#f36fb4] to-[#78d1ff] text-[#07100e] shadow-[0_16px_32px_rgba(243,111,180,0.22)]";

                        return (
                          <button
                            key={service.slug}
                            type="button"
                            className={`flex min-h-14 cursor-pointer items-center justify-between gap-2 rounded-2xl border px-3.5 py-2.5 text-left text-[12px] font-semibold leading-tight transition sm:min-h-[3.75rem] sm:text-xs ${
                              isSelected
                                ? selectedClass
                                : "border-white/12 bg-white/[0.07] text-white/78 hover:border-white/30 hover:bg-white/[0.11]"
                            }`}
                            onClick={() => toggleService(service.slug)}
                            aria-pressed={isSelected}
                          >
                            <span>{service.label}</span>
                            {isSelected ? <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}

          {currentStep === 1 ? (
            <motion.div
              key="basics"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
              className="grid gap-7"
            >
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">Who should we talk to?</h2>
                <p className="mt-3 text-sm leading-6 text-white/65">Share the basics so the right person can follow up.</p>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First name" required>
                    <input
                      type="text"
                      name="firstName"
                      autoComplete="given-name"
                      value={formState.firstName}
                      onChange={(event) => updateField("firstName", event.target.value)}
                      className="h-13 rounded-2xl border border-white/12 bg-black/20 px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-[#52d6a1] focus:bg-black/30"
                      placeholder="Jane"
                      required
                    />
                  </Field>
                  <Field label="Last name">
                    <input
                      type="text"
                      name="lastName"
                      autoComplete="family-name"
                      value={formState.lastName}
                      onChange={(event) => updateField("lastName", event.target.value)}
                      className="h-13 rounded-2xl border border-white/12 bg-black/20 px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-[#52d6a1] focus:bg-black/30"
                      placeholder="Doe"
                    />
                  </Field>
                </div>

                <Field label="Email address" required>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formState.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className="h-13 rounded-2xl border border-white/12 bg-black/20 px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-[#52d6a1] focus:bg-black/30"
                    placeholder="jane@company.com"
                    required
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Company">
                    <input
                      type="text"
                      name="company"
                      autoComplete="organization"
                      value={formState.company}
                      onChange={(event) => updateField("company", event.target.value)}
                      className="h-13 rounded-2xl border border-white/12 bg-black/20 px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-[#52d6a1] focus:bg-black/30"
                      placeholder="Company"
                    />
                  </Field>
                  <Field label="Contact number">
                    <input
                      type="tel"
                      name="contactNumber"
                      autoComplete="tel"
                      value={formState.contactNumber}
                      onChange={(event) => updateField("contactNumber", event.target.value)}
                      className="h-13 rounded-2xl border border-white/12 bg-black/20 px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-[#52d6a1] focus:bg-black/30"
                      placeholder={region.code === "uk" ? "+44" : "+27"}
                    />
                  </Field>
                </div>
              </div>
            </motion.div>
          ) : null}

          {currentStep === 2 ? (
            <motion.div
              key="scope"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
              className="grid gap-7"
            >
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">What shape is the project in?</h2>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  A budget range and location helps us size the right response.
                </p>
              </div>

              <div className="grid gap-5">
                <div className="grid gap-3">
                  <p className="text-sm font-semibold text-white/78">Budget range</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {region.code === "uk" ? <label className="text-sm text-white/75 sm:col-span-2">Estimated budget (GBP)
                      <input className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-4 text-white" value={formState.budget} onChange={(event) => updateField("budget", event.target.value)} placeholder="e.g. GBP 10,000, or still shaping it" />
                    </label> : budgetOptions.map((budget) => {
                      const isSelected = formState.budget === budget.value;

                      return (
                        <button
                          key={budget.value}
                          type="button"
                          className={`min-h-14 rounded-2xl border px-4 text-left text-sm font-semibold transition ${
                            isSelected
                              ? "border-[#f36fb4] bg-[#f36fb4] text-[#101114] shadow-[0_16px_32px_rgba(243,111,180,0.2)]"
                              : "border-white/12 bg-white/[0.07] text-white/78 hover:border-white/30 hover:bg-white/[0.11]"
                          }`}
                          onClick={() => updateField("budget", budget.value)}
                          aria-pressed={isSelected}
                        >
                          {budget.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="City">
                    <input
                      type="text"
                      name="city"
                      autoComplete="address-level2"
                      value={formState.city}
                      onChange={(event) => updateField("city", event.target.value)}
                      className="h-13 rounded-2xl border border-white/12 bg-black/20 px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-[#52d6a1] focus:bg-black/30"
                      placeholder="Cape Town"
                    />
                  </Field>
                  <Field label="Country">
                    <input
                      type="text"
                      name="country"
                      autoComplete="country-name"
                      value={formState.country}
                      onChange={(event) => updateField("country", event.target.value)}
                      className="h-13 rounded-2xl border border-white/12 bg-black/20 px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-[#52d6a1] focus:bg-black/30"
                      placeholder="South Africa"
                    />
                  </Field>
                </div>

                {isHybridService ? (
                  <Field label="Hybrid or streaming details">
                    <textarea
                      name="hybridDetails"
                      rows={4}
                      value={formState.hybridDetails}
                      onChange={(event) => updateField("hybridDetails", event.target.value)}
                      className="resize-none rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/35 focus:border-[#52d6a1] focus:bg-black/30"
                      placeholder="Audience size, platform, venue, speaker setup..."
                    />
                  </Field>
                ) : null}
              </div>
            </motion.div>
          ) : null}

          {currentStep === 3 ? (
            <motion.div
              key="send"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
              className="grid gap-7"
            >
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">What should we know?</h2>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  A few lines are enough. Tell us the outcome, timeline, and any must-haves.
                </p>
              </div>

              <Field label="Project note" required>
                <textarea
                  name="message"
                  rows={8}
                  value={formState.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  className="resize-none rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/35 focus:border-[#52d6a1] focus:bg-black/30"
                  placeholder="We are planning..."
                  required
                />
              </Field>

              <div className="grid gap-3 rounded-2xl border border-white/12 bg-black/18 p-4 text-sm text-white/72">
                <div className="flex items-start justify-between gap-4">
                  <span>{selectedServices.length === 1 ? "Service" : "Services"}</span>
                  <div className="flex max-w-[70%] flex-wrap justify-end gap-2">
                    {selectedServices.map((service) => (
                      <span key={service.slug} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                        {service.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Budget</span>
                  <strong className="text-right text-white">
                    {region.code === "uk" ? formState.budget : budgetOptions.find((budget) => budget.value === formState.budget)?.label}
                  </strong>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        </fieldset>
      </div>

      <div className="shrink-0 border-t border-white/12 px-5 py-4 group-data-[compact=true]:py-2 sm:px-7">
        <div className={`${contained ? "" : "min-h-6"} text-sm`} aria-live="polite">
          {status === "submitting" && <p className="text-white/70">Sending your enquiry…</p>}
          {status === "success" ? (
            <p className="flex items-center gap-2 font-semibold text-[#51d498]">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {successMessage}
            </p>
          ) : null}
          {status === "error" ? <p className="font-semibold text-[#ff8ab8]">{errorMessage}</p> : null}
        </div>

        <div className={contained ? "mt-3 grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-3 group-data-[compact=true]:mt-1 sm:flex sm:items-center sm:justify-between" : "mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"}>
          <motion.button
            type="button"
            className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/14 px-3 text-sm font-semibold text-white/78 transition disabled:cursor-not-allowed disabled:opacity-35 sm:px-5"
            onClick={goBack}
            disabled={currentStep === 0 || status === "submitting"}
            whileHover={{ scale: currentStep === 0 ? 1 : 1.02 }}
            whileTap={{ scale: currentStep === 0 ? 1 : 0.97 }}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </motion.button>

          {currentStep < steps.length - 1 ? (
            <motion.button
              type="button"
              className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-3 text-sm font-semibold text-[#101114] shadow-[0_16px_34px_rgba(0,0,0,0.28)] transition disabled:cursor-not-allowed disabled:opacity-45 sm:px-6"
              onClick={goNext}
              disabled={!canContinue()}
              whileHover={{ scale: canContinue() ? 1.02 : 1 }}
              whileTap={{ scale: canContinue() ? 0.97 : 1 }}
            >
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#52d6a1] to-[#f36fb4] px-3 text-sm font-semibold text-[#101114] shadow-[0_16px_34px_rgba(82,214,161,0.22)] transition disabled:cursor-not-allowed disabled:opacity-55 sm:px-6"
              disabled={status === "submitting" || !canContinue()}
              whileHover={{ scale: status === "submitting" || !canContinue() ? 1 : 1.02 }}
              whileTap={{ scale: status === "submitting" || !canContinue() ? 1 : 0.97 }}
            >
              {status === "submitting" ? "Sending..." : "Send enquiry"}
              {status === "submitting" ? <LoaderCircle className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
            </motion.button>
          )}
        </div>
      </div>
    </form>
  );
}

type FieldProps = {
  children: React.ReactNode;
  label: string;
  required?: boolean;
};

const Field = ({ children, label, required = false }: FieldProps) => (
  <label className="grid gap-2 text-sm font-semibold text-white/78">
    <span>
      {label}
      {required ? <span className="text-[#f36fb4]"> *</span> : null}
    </span>
    {children}
  </label>
);
