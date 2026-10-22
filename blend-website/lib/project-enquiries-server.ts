import "server-only";

import { deleteApp, initializeServerApp, type FirebaseServerApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { addDoc, collection, connectFirestoreEmulator, getFirestore, serverTimestamp, updateDoc } from "firebase/firestore/lite";
import { firebaseConfig } from "@/lib/firestore-server";
import { sendContactEmail, type ContactFormPayload } from "@/lib/contact-mail";

export class EnquiryAuthenticationError extends Error {}

const emulatorApps = new WeakSet<FirebaseServerApp>();

// Continue the caller's Firebase session, so writes are checked by Firestore
// rules. This uses the existing Firebase configuration, not an admin credential.
export async function submitProjectEnquiry(token: string, payload: ContactFormPayload) {
  const app = initializeServerApp(firebaseConfig, { authIdToken: token });

  try {
    const auth = getAuth(app);
    const db = getFirestore(app);

    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" && !emulatorApps.has(app)) {
      const host = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || "127.0.0.1";
      connectAuthEmulator(auth, `http://${host}:${process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT || "9099"}`, { disableWarnings: true });
      connectFirestoreEmulator(db, host, Number(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || "8080"));
      emulatorApps.add(app);
    }

    await auth.authStateReady();
    const user = auth.currentUser;
    if (!user?.email?.toLowerCase().endsWith("@blend.global")) {
      throw new EnquiryAuthenticationError("Sign in with your @blend.global account before submitting.");
    }

    // Persist before attempting SMTP: an email failure must never lose a lead.
    const enquiry = await addDoc(collection(db, "projectEnquiries"), {
      ...payload,
      services: payload.services ?? [],
      submittedBy: user.uid,
      status: "new",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      emailNotification: { status: "pending" },
    });

    let emailSent = false;
    try {
      await sendContactEmail(payload);
      emailSent = true;
    } catch {
      // Keep personal details and SMTP errors out of the server log.
      console.error("Enquiry saved; email notification failed.", { enquiryId: enquiry.id });
    }

    try {
      await updateDoc(enquiry, {
        emailNotification: { status: emailSent ? "sent" : "failed" },
        updatedAt: serverTimestamp(),
      });
    } catch {
      // The enquiry is already durable. Do not encourage a duplicate submission
      // merely because notification-status tracking could not be updated.
      console.error("Unable to update enquiry email status.", { enquiryId: enquiry.id });
    }

    return { enquiryId: enquiry.id, emailSent };
  } finally {
    // Server apps are reference counted; concurrent requests with the same token
    // retain their own reference until their work finishes.
    await deleteApp(app).catch(() => undefined);
  }
}
