import { isRegion, type RegionCode } from "@/lib/regions";

export const newsletterConsentVersion = "2026-11-11";
export const newsletterConsentText = "I agree to receive Blend news and marketing emails. I can withdraw my consent at any time by contacting my regional Blend team.";

export function newsletterDetails(email: string, region: RegionCode, consent: boolean) {
  const normalized = email.trim().toLowerCase();
  if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error("Enter a valid email address.");
  }
  if (!isRegion(region)) throw new Error("Choose a valid region.");
  if (consent !== true) throw new Error("Please agree to receive Blend emails before subscribing.");
  return {
    email: normalized, region, consent: true, consentText: newsletterConsentText,
    consentVersion: newsletterConsentVersion, privacyPolicy: `/${region}/privacy-policy`,
    source: "website-footer", status: "subscribed",
  } as const;
}
