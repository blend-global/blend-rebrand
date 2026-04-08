"use client";

import CmsAuthCard from "@/components/cms/CmsAuthCard";
import { isFirebaseClientConfigured } from "@/lib/firebase/client";
import { useSiteAuth } from "@/components/auth/AuthProvider";

export default function SiteAuthGate({ children }: { children: React.ReactNode }) {
  const {
    authReady,
    authSubmitting,
    authUser,
    authError,
    signInWithEmail,
    createAccountWithEmail,
    signInWithGoogle,
  } = useSiteAuth();

  if (!authUser) {
    return (
      <main className="min-h-screen bg-[#090a0d] text-white">
        <section className="relative overflow-hidden pb-16 pt-12 sm:pt-16 md:pt-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,79,179,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(94,234,212,0.12),_transparent_30%)]" />
          <div className="relative mx-auto flex min-h-[70vh] w-full max-w-6xl items-center px-4 sm:px-6 lg:px-8 2xl:px-10">
            <CmsAuthCard
              authReady={authReady}
              isConfigured={isFirebaseClientConfigured}
              error={authError}
              submitting={authSubmitting}
              eyebrow="Website Access"
              signInTitle="Sign in to view Blend"
              signInDescription="Sign in with your @blend.global email to access the Blend website."
              signUpTitle="Create website access"
              signUpDescription="Create a Firebase account with your @blend.global email, or continue with Google."
              onEmailSignIn={signInWithEmail}
              onEmailCreateAccount={createAccountWithEmail}
              onGoogleSignIn={signInWithGoogle}
            />
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
