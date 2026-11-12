"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { readRegionChoice, subscribeRegionChoice } from "@/lib/region-preference";
import AuthViewportFit from "@/components/auth/AuthViewportFit";
import RegionSwitcher from "@/components/regions/RegionSwitcher";
import CmsAuthCard from "@/components/cms/CmsAuthCard";
import { isFirebaseClientConfigured } from "@/lib/firebase/client";
import { useSiteAuth } from "@/components/auth/AuthProvider";
import { CookiePreferencesButton } from "@/components/CookiePreferences";

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

  const pathname = usePathname();
  const router = useRouter();
  const choice = useSyncExternalStore(subscribeRegionChoice, readRegionChoice, () => null);
  const needsChoice = /^\/(za|uk)\/?$/.test(pathname) && !authUser && !choice;
  useEffect(() => {
    if (authReady && needsChoice) router.replace("/");
  }, [authReady, needsChoice, router]);

  if (needsChoice) return null;
  // Policies must remain readable before sign-in or newsletter consent.
  if (pathname === "/" || /^\/(za|uk)\/(privacy-policy|cookie-policy|terms-of-use)\/?$/.test(pathname)) return <>{children}</>;

  if (!authUser) {
    return (
      <main style={{ height: "calc(100dvh - var(--blend-cookie-banner-height, 0px))" }} className="relative flex min-h-0 flex-col overflow-hidden bg-[#090a0d] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(var(--brand-highlight-rgb),0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(var(--brand-mint-rgb),0.12),_transparent_30%)]" />
        <div className="relative z-10 flex h-[4.5rem] shrink-0 items-center justify-between gap-4 px-4 sm:px-8">{ /^\/(za|uk)(\/|$)/.test(pathname) && <>
          <CookiePreferencesButton className="min-h-11 text-xs text-white/55 underline underline-offset-4 hover:text-white" />
          <RegionSwitcher />
        </> }</div>
        <section className="relative min-h-0 flex-1 px-4 pb-4 sm:px-6 sm:pb-6">
          <AuthViewportFit>
            <CmsAuthCard
              compact
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
          </AuthViewportFit>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
