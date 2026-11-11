import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(), pathname: "/za", choice: null as null | "za" | "uk", isNewUser: true,
  create: vi.fn(), google: vi.fn(), profile: vi.fn(), setDoc: vi.fn(),
}));
vi.stubGlobal("React", React);
vi.mock("next/navigation", () => ({ usePathname: () => mocks.pathname, useRouter: () => ({ replace: mocks.replace }) }));
vi.mock("@/lib/region-preference", () => ({ readRegionChoice: () => mocks.choice }));
vi.mock("@/lib/firebase/client", () => ({
  getFirebaseAuth: () => ({}), getFirebaseDb: () => ({}), getGoogleProvider: () => ({}),
  getFirebaseClientConfigError: () => null, isFirebaseClientConfigured: true,
}));
vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: mocks.create, getAdditionalUserInfo: () => ({ isNewUser: mocks.isNewUser }),
  onAuthStateChanged: vi.fn(), signInWithEmailAndPassword: vi.fn(), signInWithPopup: mocks.google,
  signOut: vi.fn(), updateProfile: mocks.profile,
}));
vi.mock("firebase/firestore", () => ({ doc: vi.fn(), getDoc: vi.fn(), serverTimestamp: vi.fn(), setDoc: mocks.setDoc }));

import { AuthProvider, useSiteAuth } from "@/components/auth/AuthProvider";
const captureAuth = vi.fn<(value: ReturnType<typeof useSiteAuth>) => void>();
function Consumer() { captureAuth(useSiteAuth()); return null; }
const getAuth = () => captureAuth.mock.calls.at(-1)![0];

beforeEach(() => {
  vi.clearAllMocks();
  mocks.pathname = "/za";
  mocks.choice = null;
  mocks.isNewUser = true;
  const credentials = { user: { uid: "new-user", email: "example@blend.global", providerData: [] } };
  mocks.create.mockResolvedValue(credentials);
  mocks.google.mockResolvedValue(credentials);
  mocks.profile.mockResolvedValue(undefined);
  mocks.setDoc.mockResolvedValue(undefined);
  renderToStaticMarkup(React.createElement(AuthProvider, null, React.createElement(Consumer)));
});

describe("new account region selection", () => {
  it("returns a new email account without a choice to the chooser", async () => {
    await getAuth().createAccountWithEmail("Example", "example@blend.global", "test-password");
    expect(mocks.replace).toHaveBeenCalledWith("/");
  });
  it("returns a new Google account without a choice to the chooser", async () => {
    await getAuth().signInWithGoogle();
    expect(mocks.replace).toHaveBeenCalledWith("/");
  });
  it("retains an explicit choice made before signup", async () => {
    mocks.choice = "uk";
    await getAuth().createAccountWithEmail("Example", "example@blend.global", "test-password");
    expect(mocks.replace).not.toHaveBeenCalled();
  });
  it("leaves existing Google accounts and CMS signup in their current flow", async () => {
    mocks.isNewUser = false;
    await getAuth().signInWithGoogle();
    expect(mocks.replace).not.toHaveBeenCalled();
    mocks.pathname = "/cms";
    renderToStaticMarkup(React.createElement(AuthProvider, null, React.createElement(Consumer)));
    await getAuth().createAccountWithEmail("Example", "example@blend.global", "test-password");
    expect(mocks.replace).not.toHaveBeenCalled();
  });
});
