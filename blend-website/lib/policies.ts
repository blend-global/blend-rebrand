import { regions, type RegionCode } from "@/lib/regions";

export const policySlugs = ["privacy-policy", "cookie-policy", "terms-of-use"] as const;
export type PolicySlug = (typeof policySlugs)[number];
export const policyUpdated = "11 November 2026";
type Section = { title: string; paragraphs: string[]; link?: { label: string; href: string } };

export function policyContent(region: RegionCode, slug: PolicySlug): { title: string; intro: string; sections: Section[] } {
  const contact = regions[region];
  if (slug === "privacy-policy") return {
    title: "Privacy policy",
    intro: `This notice explains how the Blend ${contact.name} website handles the information you share through this website.`,
    sections: [
      { title: "Contacting Blend", paragraphs: [region === "uk"
        ? `For questions about this website or your information, contact our UK team at ${contact.email} or ${contact.phone}.`
        : `The South African company is BLEND Concepts (Pty) Ltd., registration 2017/364048/07. Our published company privacy policy and Information Officer details are preserved below. For website enquiries, contact ${contact.email} or ${contact.phone}.`] },
      { title: "Information you provide", paragraphs: ["When you sign in, Firebase processes your account email, account identifier and, where provided, name and profile image. Passwords are handled by Firebase Authentication; we do not include passwords in project enquiries or newsletter records.", "A project enquiry contains the contact details, organisation, services, budget and brief you enter, together with your selected region and account identifier. Newsletter sign-ups contain your email, region, consent wording, consent version and submission time. Please avoid including sensitive personal information in a brief."] },
      { title: "How we use information", paragraphs: ["We use account information to provide and protect website access, and enquiry information to respond to your request and discuss a potential project. These activities support your request for services and our legitimate interest in running the website.", "Newsletter marketing is optional and based on your separate opt-in. Submitting an enquiry or signing in does not subscribe you. You may withdraw newsletter consent at any time by contacting your regional team. Withdrawal does not affect the lawfulness of processing before withdrawal."] },
      { title: "Storage and service providers", paragraphs: ["Website accounts, enquiries and newsletter sign-ups use Google Firebase. Enquiry notifications are sent through our configured email service to the appropriate Blend team. Website hosting and these service providers may process information outside your country; applicable data protection safeguards are required for such processing.", "Booking a call takes you to HubSpot. Google sign-in and external video players have their own privacy notices. External video players load here only if you enable them in cookie preferences. We do not sell the newsletter list."] },
      { title: "How long information is kept", paragraphs: ["We retain enquiry and account information while needed to manage your request, an ongoing relationship, security or applicable record-keeping obligations. Newsletter details are retained while you subscribe. Contact us to withdraw consent or request deletion; information that must be retained for a legal reason may be kept for that purpose."] },
      { title: "Your choices and rights", paragraphs: [region === "uk"
        ? "Under applicable UK data protection law, you may request access, correction or deletion of your personal information and, where applicable, restriction, portability or objection to processing. You may withdraw consent and object to direct marketing. Email the UK team to exercise these rights. You can also complain to the Information Commissioner’s Office."
        : "Under POPIA, you may request access to your personal information, ask for correction or deletion where applicable, object to processing and withdraw consent. Our published company policy below describes these rights and how to contact our Information Officer. You may also contact South Africa’s Information Regulator."] , link: region === "uk" ? { label: "Contact the ICO", href: "https://ico.org.uk/make-a-complaint/data-protection-complaints/" } : { label: "Contact the Information Regulator", href: "https://inforegulator.org.za/complaints/" } },
      { title: "Cookies and updates", paragraphs: ["Our cookie policy explains browser storage and external video choices. Changes to this website notice will appear here with an updated date. If you need more detail about a particular use of your information, contact your regional Blend team."] },
    ],
  };
  if (slug === "cookie-policy") return {
    title: "Cookie policy",
    intro: "We use browser storage to keep the website working and record your choices. Remembering your region across visits and external video players are optional and stay off until you allow them.",
    sections: [
      { title: "Region preference", paragraphs: ["The blend-region-session cookie keeps the region you explicitly select for the current browser session. Only if you allow “Remember my region” do we also set blend-region-preference across visits, for no longer than your current six-month consent period. Visiting a page alone does not record a regional choice. You can change region with the UK/ZA selector."] },
      { title: "Sign-in storage", paragraphs: ["Firebase Authentication uses browser storage to maintain your sign-in across visits. Signing out ends the active account session. Clearing browser site data also removes locally stored authentication information; you may need to sign in again."] },
      { title: "Your cookie preferences", paragraphs: ["The blend-cookie-preferences-v2 cookie records your region-memory and external-video choices, the consent version, the decision time and its expiry. Both accepting and rejecting optional storage are remembered for 180 days (approximately six months). We request a new decision after expiry or if the purposes change. If cookies are blocked, an explicit choice applies only in memory during the current page session."] },
      { title: "External video players", paragraphs: ["Some case studies can use YouTube embeds. Enabling external video players lets YouTube receive connection information and use its own storage when the player loads. Choosing essential storage only prevents those embeds from loading. Locally hosted photos and videos do not require this opt-in.", "Changing the setting stops embedded players here; it cannot erase storage already set by another provider. Clear that provider’s site data through your browser if needed."], link: { label: "Google’s privacy policy", href: "https://policies.google.com/privacy" } },
      { title: "Analytics, advertising and external links", paragraphs: ["This website does not currently install analytics or advertising trackers. Links to HubSpot booking and social networks open services with their own storage policies. Your Blend preference does not control those separate websites."] },
      { title: "Managing storage", paragraphs: [`A banner offers Essential only, Allow optional and Manage preferences after region selection. You can browse without accepting optional storage. Use Cookie preferences below or in the footer to change either optional setting. Your browser settings can block or remove site storage; this may also reset your region choice or sign-in. Questions can be sent to ${contact.email}.`] },
    ],
  };
  return {
    title: "Terms of use",
    intro: `These terms concern use of the Blend ${contact.name} website. A project’s scope, fees and delivery terms are agreed separately.`,
    sections: [
      { title: "Using this website", paragraphs: ["Use the website lawfully and provide accurate information when contacting us. Do not interfere with its operation, attempt unauthorised access, upload harmful material or submit another person’s information without authority. Keep your account credentials private."] },
      { title: "Project enquiries and bookings", paragraphs: ["Sending an enquiry, selecting a service or booking a call requests a conversation. It does not itself confirm availability, a price or an engagement. The relevant Blend team will confirm the contracting entity, scope, responsibilities, payment arrangements and other project terms in writing."] },
      { title: "Content and third-party brands", paragraphs: ["Website designs, copy, images and films belong to Blend or their respective licensors. Client names and logos belong to their owners. Viewing the website does not grant permission to republish or commercially reuse this material; contact us for permission."] },
      { title: "External services", paragraphs: ["Booking links, social networks and enabled third-party video players are provided by other organisations. Their own terms and privacy policies apply when you use them. We do not control their availability or content."] },
      { title: "Availability and your rights", paragraphs: ["We aim to keep the website accurate and available, but content and services can change and interruptions may occur. Please confirm important project information directly with us. Nothing in these website terms excludes rights or responsibilities that applicable law does not allow to be excluded."] },
      { title: "Privacy and contact", paragraphs: [`Our regional privacy and cookie policies explain how the website handles personal information and storage. For website or project questions, contact ${contact.email} or ${contact.phone}.`] },
    ],
  };
}
