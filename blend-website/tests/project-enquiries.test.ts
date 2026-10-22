import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  app: {},
  auth: { currentUser: { uid: "member-1", email: "member@blend.global" } as { uid: string; email: string } | null, authStateReady: vi.fn() },
  addDoc: vi.fn(), updateDoc: vi.fn(), sendEmail: vi.fn(), deleteApp: vi.fn(),
  timestamp: { sentinel: "server-time" },
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/firestore-server", () => ({ firebaseConfig: { projectId: "demo-enquiries" } }));
vi.mock("@/lib/contact-mail", () => ({ sendContactEmail: mocks.sendEmail }));
vi.mock("firebase/app", () => ({ initializeServerApp: vi.fn(() => mocks.app), deleteApp: mocks.deleteApp }));
vi.mock("firebase/auth", () => ({ getAuth: () => mocks.auth, connectAuthEmulator: vi.fn() }));
vi.mock("firebase/firestore/lite", () => ({
  getFirestore: () => ({}), collection: (_: unknown, path: string) => path,
  addDoc: mocks.addDoc, updateDoc: mocks.updateDoc, serverTimestamp: () => mocks.timestamp,
  connectFirestoreEmulator: vi.fn(),
}));

import { submitProjectEnquiry } from "@/lib/project-enquiries-server";
import { POST } from "@/app/api/contact/route";

const payload = {
  firstName: "Example", lastName: "Client", company: "Example Co", email: "client@example.com",
  contactNumber: "+27 21 448 8282", city: "Cape Town", country: "South Africa",
  service: "Photography, Video Production", services: ["photography", "video-production"],
  budget: "50k-150k", message: "Plan a product launch.", hybridDetails: "", source: "Project modal form",
};
const request = (data: unknown, token: string | null = "test-token") => new Request("http://localhost/api/contact", {
  method: "POST", headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
  body: JSON.stringify(data),
});

beforeEach(() => {
  vi.resetAllMocks();
  mocks.auth.currentUser = { uid: "member-1", email: "member@blend.global" };
  mocks.auth.authStateReady.mockResolvedValue(undefined);
  mocks.addDoc.mockResolvedValue({ id: "enquiry-1" });
  mocks.updateDoc.mockResolvedValue(undefined);
  mocks.sendEmail.mockResolvedValue(undefined);
  mocks.deleteApp.mockResolvedValue(undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("project enquiry persistence and notification", () => {
  it("stores all enquiry details, ownership and server timestamps before sending email", async () => {
    const result = await submitProjectEnquiry("test-token", payload);
    expect(mocks.addDoc).toHaveBeenCalledWith("projectEnquiries", {
      ...payload, submittedBy: "member-1", status: "new",
      createdAt: mocks.timestamp, updatedAt: mocks.timestamp, emailNotification: { status: "pending" },
    });
    expect(mocks.addDoc.mock.invocationCallOrder[0]).toBeLessThan(mocks.sendEmail.mock.invocationCallOrder[0]);
    expect(mocks.updateDoc).toHaveBeenCalledWith({ id: "enquiry-1" }, {
      emailNotification: { status: "sent" }, updatedAt: mocks.timestamp,
    });
    expect(result).toEqual({ enquiryId: "enquiry-1", emailSent: true });
    expect(mocks.deleteApp).toHaveBeenCalledWith(mocks.app);
  });

  it("does not send an email when storage fails and keeps the form in an error state", async () => {
    mocks.addDoc.mockRejectedValue(new Error("database unavailable"));
    const response = await POST(request(payload));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "We could not save your enquiry. Please try again." });
    expect(mocks.sendEmail).not.toHaveBeenCalled();
    expect(mocks.deleteApp).toHaveBeenCalled();
  });

  it("preserves the saved enquiry and reports partial success when email fails", async () => {
    mocks.sendEmail.mockRejectedValue(new Error("SMTP unavailable"));
    const response = await POST(request(payload));
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({ ok: true, enquiryId: "enquiry-1", emailSent: false });
    expect(mocks.updateDoc).toHaveBeenCalledWith({ id: "enquiry-1" }, {
      emailNotification: { status: "failed" }, updatedAt: mocks.timestamp,
    });
  });

  it("does not invite a duplicate submission if notification-status tracking fails", async () => {
    mocks.updateDoc.mockRejectedValue(new Error("status update failed"));
    const response = await POST(request(payload));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, emailSent: true });
    expect(mocks.sendEmail).toHaveBeenCalledTimes(1);
  });

  it.each([null, { uid: "outsider", email: "outsider@example.com" }])("rejects an unauthorised session", async (user) => {
    mocks.auth.currentUser = user;
    expect((await POST(request(payload))).status).toBe(401);
    expect(mocks.addDoc).not.toHaveBeenCalled();
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("requires a bearer token", async () => {
    expect((await POST(request(payload, null))).status).toBe(401);
    expect(mocks.addDoc).not.toHaveBeenCalled();
  });

  it.each([null, [], {}, { email: "invalid", message: "Test" }, { email: "client@example.com", message: " " }])("rejects invalid input before side effects", async (body) => {
    expect((await POST(request(body))).status).toBe(400);
    expect(mocks.addDoc).not.toHaveBeenCalled();
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("ignores client-supplied ownership/status, trims fields and preserves service slugs", async () => {
    const response = await POST(request({ ...payload, firstName: " Example ", services: ["photography", null, "photography", " video-production "], submittedBy: "spoofed", status: "closed" }));
    expect(response.status).toBe(200);
    expect(mocks.addDoc.mock.calls[0][1]).toMatchObject({ firstName: "Example", services: ["photography", "video-production"], submittedBy: "member-1", status: "new" });
  });
});
