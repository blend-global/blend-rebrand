import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mail = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("nodemailer", () => ({ default: { createTransport: () => ({ sendMail: mail.send }) } }));
import { sendContactEmail } from "@/lib/contact-mail";

beforeEach(() => {
  vi.stubEnv("SMTP_HOST", "smtp.example.com");
  vi.stubEnv("SMTP_PORT", "587");
  vi.stubEnv("SMTP_USER", "website@example.com");
  vi.stubEnv("SMTP_PASS", "test-password");
  vi.stubEnv("CONTACT_EMAIL_TO", "");
  vi.stubEnv("CONTACT_EMAIL_TO_UK", "");
  vi.stubEnv("CONTACT_EMAIL_TO_ZA", "");
  mail.send.mockResolvedValue({});
});
afterEach(() => vi.unstubAllEnvs());

describe("branch enquiry notification routing", () => {
  it("sends UK enquiries to the published UK inbox", async () => {
    await sendContactEmail({ region: "uk", currency: "GBP", email: "client@example.com", message: "A UK brief" });
    expect(mail.send).toHaveBeenCalledWith(expect.objectContaining({ to: "contactEU@blend.global", subject: "[UK] New contact enquiry from client@example.com" }));
  });
  it("retains the South African default for legacy enquiries", async () => {
    await sendContactEmail({ email: "client@example.com", message: "A brief" });
    expect(mail.send).toHaveBeenCalledWith(expect.objectContaining({ to: "info@blend.global" }));
  });
  it("honours the branch override before the shared inbox override", async () => {
    vi.stubEnv("CONTACT_EMAIL_TO", "shared@example.com");
    vi.stubEnv("CONTACT_EMAIL_TO_UK", "uk@example.com");
    await sendContactEmail({ region: "uk", email: "client@example.com", message: "A brief" });
    expect(mail.send).toHaveBeenCalledWith(expect.objectContaining({ to: "uk@example.com" }));
    await sendContactEmail({ region: "za", email: "client@example.com", message: "A brief" });
    expect(mail.send).toHaveBeenLastCalledWith(expect.objectContaining({ to: "shared@example.com" }));
  });
});
