"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const requiredFirebaseClientKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirebaseClientConfigured = requiredFirebaseClientKeys.length === 0;

let persistenceSetup: Promise<void> | null = null;
let authEmulatorConnected = false;
let firestoreEmulatorConnected = false;
let storageEmulatorConnected = false;

const useFirebaseEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";
const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || "127.0.0.1";
const authEmulatorPort = Number(process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT || "9099");
const firestoreEmulatorPort = Number(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || "8080");
const storageEmulatorPort = Number(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_PORT || "9199");

export function getFirebaseClientConfigError() {
  if (isFirebaseClientConfigured) return null;
  return `Missing Firebase client environment variables: ${requiredFirebaseClientKeys.join(", ")}`;
}

function getFirebaseApp() {
  if (!isFirebaseClientConfigured) {
    throw new Error(getFirebaseClientConfigError() ?? "Firebase client config is incomplete.");
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  const auth = getAuth(getFirebaseApp());

  if (useFirebaseEmulators && !authEmulatorConnected) {
    connectAuthEmulator(auth, `http://${emulatorHost}:${authEmulatorPort}`, { disableWarnings: true });
    authEmulatorConnected = true;
  }

  if (!persistenceSetup && typeof window !== "undefined") {
    persistenceSetup = setPersistence(auth, browserLocalPersistence);
  }

  return auth;
}

export function getFirebaseDb() {
  const db = getFirestore(getFirebaseApp());

  if (useFirebaseEmulators && !firestoreEmulatorConnected) {
    connectFirestoreEmulator(db, emulatorHost, firestoreEmulatorPort);
    firestoreEmulatorConnected = true;
  }

  return db;
}

export function getFirebaseStorage() {
  const storage = getStorage(getFirebaseApp());

  if (useFirebaseEmulators && !storageEmulatorConnected) {
    connectStorageEmulator(storage, emulatorHost, storageEmulatorPort);
    storageEmulatorConnected = true;
  }

  return storage;
}

export function getGoogleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}
