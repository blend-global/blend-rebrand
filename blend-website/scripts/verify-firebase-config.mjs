import { readFile } from "node:fs/promises";

const requiredVariables = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

const missing = requiredVariables.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  console.error(`Missing Firebase environment variables: ${missing.join(", ")}`);
  process.exitCode = 1;
} else {
  const firebaserc = JSON.parse(await readFile(new URL("../.firebaserc", import.meta.url), "utf8"));
  const cliProjectId = firebaserc?.projects?.default;
  const envProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const problems = [];

  if (cliProjectId !== envProjectId) {
    problems.push(`.firebaserc targets "${cliProjectId}" but the environment targets "${envProjectId}".`);
  }

  if (authDomain !== `${envProjectId}.firebaseapp.com`) {
    problems.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN does not match the standard domain for the configured project.");
  }

  if (
    storageBucket !== `${envProjectId}.firebasestorage.app`
    && storageBucket !== `${envProjectId}.appspot.com`
  ) {
    problems.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET does not match a standard bucket name for the project.");
  }

  if (problems.length > 0) {
    problems.forEach((problem) => console.error(problem));
    process.exitCode = 1;
  } else {
    console.log(`Firebase configuration is internally consistent for project "${envProjectId}".`);
  }
}
