import "server-only";

import { getApp, getApps, initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirestoreConfigured = missingKeys.length === 0;
let firestoreEmulatorConnected = false;

const useFirebaseEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";
const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || "127.0.0.1";
const firestoreEmulatorPort = Number(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || "8080");

function getServerFirebaseApp() {
  if (!isFirestoreConfigured) {
    throw new Error(`Missing Firebase config: ${missingKeys.join(", ")}`);
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getServerFirestore() {
  const db = getFirestore(getServerFirebaseApp());

  if (useFirebaseEmulators && !firestoreEmulatorConnected) {
    connectFirestoreEmulator(db, emulatorHost, firestoreEmulatorPort);
    firestoreEmulatorConnected = true;
  }

  return db;
}
