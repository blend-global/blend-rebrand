"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  getFirebaseAuth,
  getFirebaseClientConfigError,
  getFirebaseDb,
  getGoogleProvider,
  isFirebaseClientConfigured,
} from "@/lib/firebase/client";

type AuthContextValue = {
  authReady: boolean;
  authSubmitting: boolean;
  authUser: User | null;
  authError: string | null;
  currentUserName: string;
  clearAuthError: () => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  createAccountWithEmail: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const allowedEmailDomain = "blend.global";
const allowedEmailSuffix = `@${allowedEmailDomain}`;
const unauthorizedDomainMessage = `Use your ${allowedEmailSuffix} email address to access this website.`;

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const isAllowedEmail = (email: string | null | undefined) => normalizeEmail(email ?? "").endsWith(allowedEmailSuffix);

const getFirebaseErrorMessage = (error: unknown) => {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : null;

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "The email or password is incorrect.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/weak-password":
      return "Use a stronger password with at least 6 characters.";
    case "auth/missing-password":
      return "Enter a password to continue.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled before completion.";
    case "auth/popup-blocked":
      return "The Google sign-in popup was blocked by the browser.";
    default:
      return error instanceof Error ? error.message : "Unable to authenticate right now.";
  }
};

const createUserDocument = async (user: User, name?: string | null) => {
  const displayName = name?.trim() || user.displayName || "";

  await setDoc(
    doc(getFirebaseDb(), "users", user.uid),
    {
      uid: user.uid,
      email: user.email ?? "",
      name: displayName,
      photoURL: user.photoURL ?? "",
      providerIds: user.providerData.map((provider) => provider.providerId),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authReady, setAuthReady] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(getFirebaseClientConfigError());
  const [currentUserName, setCurrentUserName] = useState("");

  useEffect(() => {
    if (!isFirebaseClientConfigured) {
      setAuthReady(true);
      setAuthUser(null);
      setCurrentUserName("");
      return;
    }

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      void (async () => {
        if (user && !isAllowedEmail(user.email)) {
          await signOut(getFirebaseAuth());
          setAuthUser(null);
          setCurrentUserName("");
          setAuthError(unauthorizedDomainMessage);
          setAuthReady(true);
          return;
        }

        setAuthUser(user);
        setAuthError(null);
        setAuthReady(true);
      })();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCurrentUserName = async () => {
      if (!authUser) {
        setCurrentUserName("");
        return;
      }

      try {
        const snapshot = await getDoc(doc(getFirebaseDb(), "users", authUser.uid));
        if (cancelled) return;

        const firestoreName =
          snapshot.exists() && typeof snapshot.data().name === "string" ? snapshot.data().name.trim() : "";
        setCurrentUserName(firestoreName || authUser.displayName?.trim() || "");
      } catch {
        if (!cancelled) {
          setCurrentUserName(authUser.displayName?.trim() || "");
        }
      }
    };

    void loadCurrentUserName();

    return () => {
      cancelled = true;
    };
  }, [authUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      authReady,
      authSubmitting,
      authUser,
      authError,
      currentUserName,
      clearAuthError: () => setAuthError(null),
      signInWithEmail: async (email: string, password: string) => {
        if (!isFirebaseClientConfigured) return;

        setAuthSubmitting(true);
        setAuthError(null);

        try {
          if (!isAllowedEmail(email)) {
            setAuthError(unauthorizedDomainMessage);
            return;
          }

          await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
        } catch (error) {
          setAuthError(getFirebaseErrorMessage(error));
        } finally {
          setAuthSubmitting(false);
        }
      },
      createAccountWithEmail: async (name: string, email: string, password: string) => {
        if (!isFirebaseClientConfigured) return;

        setAuthSubmitting(true);
        setAuthError(null);

        try {
          const trimmedName = name.trim();
          const normalizedEmail = normalizeEmail(email);

          if (!trimmedName) {
            setAuthError("Enter your name to create an account.");
            return;
          }

          if (!isAllowedEmail(normalizedEmail)) {
            setAuthError(unauthorizedDomainMessage);
            return;
          }

          const credentials = await createUserWithEmailAndPassword(getFirebaseAuth(), normalizedEmail, password);
          await updateProfile(credentials.user, { displayName: trimmedName });
          await createUserDocument(credentials.user, trimmedName);
        } catch (error) {
          setAuthError(getFirebaseErrorMessage(error));
        } finally {
          setAuthSubmitting(false);
        }
      },
      signInWithGoogle: async () => {
        if (!isFirebaseClientConfigured) return;

        setAuthSubmitting(true);
        setAuthError(null);

        try {
          const credentials = await signInWithPopup(getFirebaseAuth(), getGoogleProvider());
          const email = credentials.user.email;

          if (!isAllowedEmail(email)) {
            await signOut(getFirebaseAuth());
            setAuthError(unauthorizedDomainMessage);
            return;
          }

          const additionalUserInfo = getAdditionalUserInfo(credentials);

          if (additionalUserInfo?.isNewUser) {
            await createUserDocument(credentials.user);
          }
        } catch (error) {
          setAuthError(getFirebaseErrorMessage(error));
        } finally {
          setAuthSubmitting(false);
        }
      },
      signOutUser: async () => {
        if (!isFirebaseClientConfigured) return;

        setAuthSubmitting(true);
        setAuthError(null);

        try {
          await signOut(getFirebaseAuth());
        } catch (error) {
          setAuthError(getFirebaseErrorMessage(error));
        } finally {
          setAuthSubmitting(false);
        }
      },
    }),
    [authError, authReady, authSubmitting, authUser, currentUserName],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSiteAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useSiteAuth must be used within an AuthProvider.");
  }

  return context;
}
