"use client";

import { getFirebaseAuth } from "@/lib/firebase/client";

export async function submitContactEnquiry(payload: Record<string, unknown>) {
  const auth = getFirebaseAuth();
  await auth.authStateReady();
  if (!auth.currentUser) throw new Error("Sign in before submitting your enquiry.");

  const token = await auth.currentUser.getIdToken();
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const result = (await response.json()) as { error?: string; message?: string };
  if (!response.ok) throw new Error(result.error || "We could not save your enquiry. Please try again.");
  return result.message || "Thanks, your enquiry has been saved and sent.";
}
