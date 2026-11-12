import { describe, expect, it } from "vitest";
import { newsletterDetails } from "@/lib/newsletter";

describe("newsletter opt-in", () => {
  it("normalizes the email and attributes explicit consent to the correct branch", () => {
    expect(newsletterDetails(" Reader@Example.com ", "uk", true)).toMatchObject({
      email: "reader@example.com", region: "uk", consent: true, privacyPolicy: "/uk/privacy-policy",
    });
    expect(newsletterDetails("reader@example.com", "za", true).privacyPolicy).toBe("/za/privacy-policy");
  });
  it("rejects subscriptions without explicit consent", () => {
    expect(() => newsletterDetails("reader@example.com", "uk", false)).toThrow("agree");
  });
  it.each(["", "not-an-email", "a b@example.com", "reader@example", "a".repeat(250) + "@example.com"])("rejects invalid email %s", (email) => {
    expect(() => newsletterDetails(email, "uk", true)).toThrow("valid email");
  });
});
