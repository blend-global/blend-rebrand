import { describe, expect, it } from "vitest";
import { policyContent } from "@/lib/policies";
import zaPublishedPolicy from "@/content/policies/za-published-privacy.json";

describe("regional policies", () => {
  it("keeps UK notices free of ZA-only accreditation, company and regulator claims", () => {
    const policy = JSON.stringify(policyContent("uk", "privacy-policy"));
    expect(policy).toContain("contactEU@blend.global");
    expect(policy).toContain("ico.org.uk");
    for (const text of ["POPIA", "B-BBEE", "2017/364048/07", "Salt River"]) expect(policy).not.toContain(text);
  });
  it("preserves the published ZA company and Information Officer details", () => {
    expect(zaPublishedPolicy.html).toContain("Stephanie Karallis");
    expect(zaPublishedPolicy.html).toContain("steph@blend.global");
    expect(zaPublishedPolicy.html).toContain("2017/364048/07");
    expect(JSON.stringify(policyContent("za", "privacy-policy"))).toContain("POPIA");
  });
});
