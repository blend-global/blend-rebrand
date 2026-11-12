// Run against the disposable demo project in the Auth + Firestore emulators.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const project = "demo-blend-review";
const base = `http://127.0.0.1:8080/v1/projects/${project}/databases/(default)/documents`;
const consentText = "I agree to receive Blend news and marketing emails. I can withdraw my consent at any time by contacting my regional Blend team.";
const valid = { email: "reader@example.com", region: "uk", consent: true, consentText,
  consentVersion: "2026-11-11", privacyPolicy: "/uk/privacy-policy", source: "website-footer", status: "subscribed" };
const fields = (data) => Object.fromEntries(Object.entries(data).map(([key, value]) => [key,
  typeof value === "boolean" ? { booleanValue: value } : { stringValue: value },
]));
let checks = 0;
async function create(data, expected, token) {
  const id = randomUUID();
  const response = await fetch(`${base}:commit`, {
    method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ writes: [{ update: { name: `projects/${project}/databases/(default)/documents/newsletterSubscriptions/${id}`, fields: fields(data) },
      updateTransforms: [{ fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" }], currentDocument: { exists: false } }] }),
  });
  assert.equal(response.status, expected, `create ${JSON.stringify(data)}: ${await response.text()}`);
  checks++;
  return id;
}
async function account(email) {
  const response = await fetch("http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "Disposable-test-only-123!", returnSecureToken: true }),
  });
  assert.equal(response.status, 200);
  return (await response.json()).idToken;
}

const id = await create(valid, 200);
await create({ ...valid, region: "za", privacyPolicy: "/za/privacy-policy" }, 200);
for (const patch of [
  { consent: false }, { email: "bad" }, { email: "bad space@example.com" }, { email: "Reader@example.com" },
  { email: `${"a".repeat(250)}@example.com` }, { region: "ae" }, { privacyPolicy: "/za/privacy-policy" },
  { status: "confirmed" }, { consentText: "" }, { consentVersion: "old" }, { source: "unknown" }, { unexpected: "field" },
]) await create({ ...valid, ...patch }, 403);
const { consent, ...withoutConsent } = valid;
void consent;
await create(withoutConsent, 403);

const member = await account(`newsletter-${randomUUID()}@blend.global`);
const outsider = await account(`newsletter-${randomUUID()}@example.com`);
for (const [token, expected] of [[undefined, 403], [outsider, 403], [member, 200]]) {
  const response = await fetch(`${base}/newsletterSubscriptions/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  assert.equal(response.status, expected, "subscriber details must stay private");
  checks++;
}
for (const method of ["PATCH", "DELETE"]) {
  const response = await fetch(`${base}/newsletterSubscriptions/${id}`, {
    method, headers: { Authorization: `Bearer ${member}`, "Content-Type": "application/json" },
    ...(method === "PATCH" ? { body: JSON.stringify({ fields: fields({ ...valid, email: "changed@example.com" }) }) } : {}),
  });
  assert.equal(response.status, 403, "browser clients must not change existing subscriber records");
  checks++;
}
console.log(`Newsletter Firestore rules: ${checks} checks passed.`);
