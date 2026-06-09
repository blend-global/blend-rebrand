import { NextResponse } from "next/server";
import { sendContactEmail, type ContactFormPayload } from "@/lib/contact-mail";

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
  budget: sanitize(data.budget),
  message: sanitize(data.message),
  hybridDetails: sanitize(data.hybridDetails),
  source: sanitize(data.source),
});

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as Record<string, unknown>;
    const payload = getPayload(data);

    if (!payload.email || !emailPattern.test(payload.email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    if (!payload.message) {
      return NextResponse.json({ error: "Add a message before submitting." }, { status: 400 });
    }

    await sendContactEmail(payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form submission failed:", error);

    return NextResponse.json({ error: "We could not send your message right now." }, { status: 500 });
  }
}
