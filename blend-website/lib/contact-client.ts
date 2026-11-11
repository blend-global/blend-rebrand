"use client";

import { isRegion, regions } from "@/lib/regions";
import { getFirebaseAuth } from "@/lib/firebase/client";

export async function submitContactEnquiry(payload: Record<string, unknown>) {
  const auth = getFirebaseAuth();
  await auth.authStateReady();
  if (!auth.currentUser) throw new Error("Sign in before submitting your enquiry.");

  const code = window.location.pathname.split("/")[1];
  const region = isRegion(code) ? code : "za";
  const token = await auth.currentUser.getIdToken();
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ...payload, region, currency: regions[region].currency }),
  });
  const result = (await response.json()) as { error?: string; message?: string };
  if (!response.ok) throw new Error(result.error || "We could not save your enquiry. Please try again.");
  return result.message || "Thanks, your enquiry has been saved and sent.";
}
