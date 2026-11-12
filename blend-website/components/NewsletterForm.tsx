"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import Link from "@/components/regions/RegionLink";
import { useRegion } from "@/components/regions/useRegion";
import { getFirebaseDb } from "@/lib/firebase/client";
import { newsletterConsentText, newsletterDetails } from "@/lib/newsletter";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function NewsletterForm() {
  const region = useRegion();
  const emailId = useId();
  const busy = useRef(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || state === "saved") return;
    try {
      const details = newsletterDetails(email, region.code, consent);
      busy.current = true;
      setState("saving");
      setMessage("Saving your subscription…");
      await addDoc(collection(getFirebaseDb(), "newsletterSubscriptions"), {
        ...details, createdAt: serverTimestamp(),
      });
      setEmail("");
      setState("saved");
      setMessage("Thanks — you’re subscribed to Blend news.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error && !busy.current ? error.message : "We couldn’t save your subscription. Please try again.");
    } finally {
      busy.current = false;
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3" aria-busy={state === "saving"}>
      <label htmlFor={emailId} className="sr-only">Newsletter email address</label>
      <div className="flex flex-col gap-2 rounded-2xl bg-white p-2 text-black sm:flex-row sm:rounded-full">
        <input id={emailId} type="email" name="email" autoComplete="email" required maxLength={254}
          value={email} onChange={(event) => setEmail(event.target.value)} disabled={state === "saving" || state === "saved"}
          placeholder="Enter email" className="min-h-11 w-full min-w-0 rounded-xl bg-transparent px-3 text-base outline-offset-2" />
        <button type="submit" disabled={state === "saving" || state === "saved"}
          className="min-h-11 shrink-0 rounded-full bg-[#0c0c0c] px-5 text-sm font-semibold text-white disabled:opacity-60">
          {state === "saving" ? "Saving…" : state === "saved" ? "Subscribed" : "Subscribe"}
        </button>
      </div>
      <label className="flex items-start gap-2 text-xs leading-5 text-white/70">
        <input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)}
          disabled={state === "saving" || state === "saved"} className="mt-1 size-4 shrink-0 accent-[#6bd688]" />
        <span>{newsletterConsentText} <Link href="/privacy-policy" className="underline underline-offset-2">Privacy policy</Link></span>
      </label>
      <p role={state === "error" ? "alert" : "status"} className="text-sm leading-5 text-white/85">{message}</p>
    </form>
  );
}
