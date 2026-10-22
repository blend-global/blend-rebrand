import { NextResponse } from "next/server";
import type { ContactFormPayload } from "@/lib/contact-mail";
import { EnquiryAuthenticationError, submitProjectEnquiry } from "@/lib/project-enquiries-server";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitize = (value: unknown) => (typeof value === "string" ? value.trim().slice(0, 2000) : "");

const getPayload = (data: Record<string, unknown>): ContactFormPayload => ({
  firstName: sanitize(data.firstName),
  lastName: sanitize(data.lastName),
  company: sanitize(data.company),
  email: sanitize(data.email),
  contactNumber: sanitize(data.contactNumber),
  city: sanitize(data.city),
  country: sanitize(data.country),
  service: sanitize(data.service),
  services: Array.isArray(data.services)
    ? [...new Set(data.services.filter((value): value is string => typeof value === "string").map(sanitize).filter(Boolean))].slice(0, 16)
    : [],
  budget: sanitize(data.budget),
  message: sanitize(data.message),
  hybridDetails: sanitize(data.hybridDetails),
  source: sanitize(data.source),
});

export async function POST(request: Request) {
  try {
    let data: unknown;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json({ error: "Enter valid enquiry details." }, { status: 400 });
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return NextResponse.json({ error: "Enter valid enquiry details." }, { status: 400 });
    }
    const payload = getPayload(data as Record<string, unknown>);

    if (!payload.email || payload.email.length > 254 || !emailPattern.test(payload.email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    if (!payload.message) {
      return NextResponse.json({ error: "Add a message before submitting." }, { status: 400 });
    }

    const token = request.headers.get("authorization")?.match(/^Bearer\s+(\S+)$/i)?.[1];
    if (!token) {
      return NextResponse.json({ error: "Sign in before submitting your enquiry." }, { status: 401 });
    }

    const result = await submitProjectEnquiry(token, payload);

    return NextResponse.json({
      ok: true,
      ...result,
      message: result.emailSent
        ? "Thanks, your enquiry has been saved and sent."
        : "Thanks, your enquiry has been saved. The email notification could not be sent, but we have your details.",
    }, { status: result.emailSent ? 200 : 202 });
  } catch (error) {
    if (error instanceof EnquiryAuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Unable to save project enquiry.");

    return NextResponse.json({ error: "We could not save your enquiry. Please try again." }, { status: 500 });
  }
}
