import nodemailer from "nodemailer";

export type ContactFormPayload = {
  firstName?: string;
  lastName?: string;
  company?: string;
  email: string;
  contactNumber?: string;
  city?: string;
  country?: string;
  service?: string;
  budget?: string;
  message: string;
  hybridDetails?: string;
  source?: string;
};

type RequiredEnvKey = "SMTP_HOST" | "SMTP_PORT" | "SMTP_USER" | "SMTP_PASS";

const getRequiredEnv = (key: RequiredEnvKey) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing ${key} environment variable`);
  }

  return value;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatLabel = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase())
    .trim();

const getDisplayName = (payload: ContactFormPayload) => {
  const fullName = [payload.firstName, payload.lastName].filter(Boolean).join(" ").trim();

  return fullName || payload.company || payload.email;
};

const getRows = (payload: ContactFormPayload) =>
  Object.entries(payload)
    .filter(([, value]) => typeof value === "string" && value.trim().length > 0)
    .map(([key, value]) => ({ label: formatLabel(key), value: value.trim() }));

export async function sendContactEmail(payload: ContactFormPayload) {
  const smtpPort = Number(getRequiredEnv("SMTP_PORT"));
  const fromEmail = process.env.CONTACT_EMAIL_FROM || process.env.SMTP_USER || "website@blend.global";
  const toEmail = process.env.CONTACT_EMAIL_TO || "info@blend.global";
  const displayName = getDisplayName(payload);
  const rows = getRows(payload);

  const transporter = nodemailer.createTransport({
    host: getRequiredEnv("SMTP_HOST"),
    port: smtpPort,
    secure: process.env.SMTP_SECURE === "true" || smtpPort === 465,
    auth: {
      user: getRequiredEnv("SMTP_USER"),
      pass: getRequiredEnv("SMTP_PASS"),
    },
  });

  const text = rows.map(({ label, value }) => `${label}: ${value}`).join("\n");
  const htmlRows = rows
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:700;color:#111827;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#374151;">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join("");

  await transporter.sendMail({
    from: `"Blend Website" <${fromEmail}>`,
    to: toEmail,
    replyTo: payload.email,
    subject: `New contact enquiry from ${displayName}`,
    text,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827;">
        <h1 style="font-size:20px;margin:0 0 16px;">New contact enquiry</h1>
        <table style="border-collapse:collapse;width:100%;max-width:720px;">${htmlRows}</table>
      </div>
    `,
  });
}
