"use client";

import Image from "next/image";
import { useState } from "react";
import { Chrome, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";

type AuthMode = "signin" | "signup";

type CmsAuthCardProps = {
  authReady: boolean;
  isConfigured: boolean;
  error: string | null;
  submitting: boolean;
  onEmailSignIn: (email: string, password: string) => Promise<void>;
  onEmailCreateAccount: (name: string, email: string, password: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
};

export default function CmsAuthCard({
  authReady,
  isConfigured,
  error,
  submitting,
  onEmailSignIn,
  onEmailCreateAccount,
  onGoogleSignIn,
}: CmsAuthCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("signin");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "signup") {
      await onEmailCreateAccount(name, email, password);
      return;
    }

    await onEmailSignIn(email, password);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-[32px] border border-white/10 bg-[#12161f]/95 p-6 shadow-[0_32px_120px_rgba(0,0,0,0.38)] backdrop-blur sm:p-7">
      <div className="mb-6 space-y-3">
        <div className="inline-flex size-20 items-center justify-center rounded-[28px] bg-[#ff4fb3]/12">
          <Image src="/logo.png" alt="Blend Global" width={44} height={46} className="h-11 w-auto" priority />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff4fb3]">CMS Access</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {mode === "signup" ? "Create your account" : "Sign in to continue"}
          </h1>
          <p className="text-sm leading-6 text-white/60">
            {mode === "signup"
              ? "Create a Firebase account with email and password, or continue with Google."
              : "Authenticate with Firebase to access the Blend CMS."}
          </p>
        </div>
      </div>

      {!isConfigured ? (
        <div className="rounded-3xl border border-[#ff4fb3]/18 bg-[#ff4fb3]/8 px-4 py-4 text-sm leading-6 text-[#ffc1e4]">
          {error ?? "Firebase is not configured for this environment yet."}
        </div>
      ) : !authReady ? (
        <div className="rounded-3xl border border-white/10 bg-[#0f1218] px-4 py-5 text-sm text-white/70">
          <div className="flex items-center gap-3">
            <LoaderCircle className="size-4 animate-spin text-[#ff78c5]" />
            Checking your authentication state...
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 rounded-full border border-white/10 bg-[#0f1218] p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "signin" ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "signup" ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
            >
              Create account
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" ? (
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Name</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 focus-within:border-[#ff4fb3]/60">
                  <UserRound className="size-4 text-white/40" />
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    className="cms-auth-input w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                  />
                </div>
              </label>
            ) : null}

            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Email</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 focus-within:border-[#ff4fb3]/60">
                <Mail className="size-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@blendglobal.com"
                  autoComplete="email"
                  className="cms-auth-input w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#10131a] px-4 py-3 focus-within:border-[#ff4fb3]/60">
                <LockKeyhole className="size-4 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="cms-auth-input w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
              {mode === "signup" ? "Create account with email" : "Sign in with email"}
            </button>
          </form>

          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-white/28">
            <span className="h-px flex-1 bg-white/10" />
            Or
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={() => void onGoogleSignIn()}
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-[#10131a] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <LoaderCircle className="size-4 animate-spin" /> : <Chrome className="size-4" />}
            Continue with Google
          </button>

          {error ? (
            <p className="rounded-2xl border border-[#ff4fb3]/18 bg-[#ff4fb3]/8 px-4 py-3 text-sm leading-6 text-[#ffc1e4]">
              {error}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
