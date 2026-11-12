"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ComponentProps } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  closeCookiePreferences, cookiePreferencesEvent, cookiePreferencesOpen, hasCookieChoice,
  readCookieChoice, removeLegacyCookiePreferences, saveCookiePreferences, showCookiePreferences,
  subscribeCookieDialog, subscribeCookiePreferences,
} from "@/lib/cookie-preferences";
import { readRegionChoice, subscribeRegionChoice } from "@/lib/region-preference";
import { X } from "lucide-react";

const choiceButton = "min-h-11 rounded-full border border-white/25 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-middle)] sm:px-4 sm:text-sm";

export function CookiePreferencesButton({ children = "Cookie preferences", onClick, ...props }: ComponentProps<"button">) {
  return <button type="button" {...props} onClick={(event) => {
    onClick?.(event);
    if (!event.defaultPrevented) showCookiePreferences();
  }}>{children}</button>;
}

export default function CookiePreferences() {
  const pathname = usePathname();
  const open = useSyncExternalStore(subscribeCookieDialog, cookiePreferencesOpen, () => false);
  const decided = useSyncExternalStore(subscribeCookiePreferences, hasCookieChoice, () => false);
  const selectedRegion = useSyncExternalStore(subscribeRegionChoice, readRegionChoice, () => null);
  const regional = pathname.match(/^\/(za|uk)(\/|$)/);
  // Keep the region chooser clear. Direct regional links can also offer consent.
  const eligible = Boolean(regional && (selectedRegion || !/^\/(za|uk)\/?$/.test(pathname)));

  useEffect(() => {
    removeLegacyCookiePreferences();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      clearTimeout(timer);
      const choice = readCookieChoice();
      if (choice) timer = setTimeout(() => window.dispatchEvent(new Event(cookiePreferencesEvent)), Math.min(choice.expiresAt - Date.now() + 1, 2147483647));
    };
    const unsubscribe = subscribeCookiePreferences(schedule);
    schedule();
    return () => { clearTimeout(timer); unsubscribe(); };
  }, []);

  return <>
    {eligible && !decided && <CookieBanner region={regional![1]} />}
    {open && <CookiePreferencesDialog region={regional?.[1] ?? "za"} />}
  </>;
}

function CookieBanner({ region }: { region: string }) {
  const bannerRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;
    const root = document.documentElement;
    const fit = () => root.style.setProperty("--blend-cookie-banner-height", `${Math.ceil(banner.getBoundingClientRect().height)}px`);
    const observer = new ResizeObserver(fit);
    observer.observe(banner);
    fit();
    return () => { observer.disconnect(); root.style.removeProperty("--blend-cookie-banner-height"); };
  }, []);

  return <aside ref={bannerRef} aria-label="Cookie choices" className="fixed inset-x-0 bottom-0 z-[100] border-t border-white/15 bg-[#101216]/95 text-white shadow-[0_-12px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:gap-6">
      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-semibold sm:text-base">Your cookie choices</h2>
        <p className="mt-1.5 max-w-2xl text-xs leading-5 text-white/65 sm:text-sm sm:leading-6">We use essential storage to keep Blend working. With your permission, we can also remember your region and load YouTube videos. You can change your choices at any time. <Link href={`/${region}/cookie-policy`} className="underline underline-offset-2">Cookie policy</Link></p>
      </div>
      <div className="grid grid-cols-3 gap-2 md:shrink-0">
        <button type="button" className={choiceButton} onClick={() => saveCookiePreferences({ rememberRegion: false, externalMedia: false })}>Essential only</button>
        <button type="button" className={choiceButton} onClick={() => saveCookiePreferences({ rememberRegion: true, externalMedia: true })}>Allow optional</button>
        <button type="button" className={choiceButton} onClick={showCookiePreferences}>Manage preferences</button>
      </div>
    </div>
  </aside>;
}

function CookiePreferencesDialog({ region }: { region: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [rememberRegion, setRememberRegion] = useState(() => readCookieChoice()?.rememberRegion ?? false);
  const [externalMedia, setExternalMedia] = useState(() => readCookieChoice()?.externalMedia ?? false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousBody = document.body.style.overflow;
    const previousRoot = document.documentElement.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousBody;
      document.documentElement.style.overflow = previousRoot;
    };
  }, []);

  return (
    <dialog ref={dialogRef} aria-labelledby="cookies-title" onCancel={closeCookiePreferences}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[min(34rem,calc(100%-2rem))] overflow-y-auto overscroll-contain rounded-3xl border border-white/15 bg-[#10131a] p-5 text-white shadow-2xl backdrop:bg-black/75 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <h2 id="cookies-title" className="text-2xl font-semibold">Cookie preferences</h2>
        <button type="button" onClick={closeCookiePreferences} aria-label="Close cookie preferences" className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20"><X className="size-5" /></button>
      </div>
      <p className="mt-3 text-sm leading-6 text-white/65">Optional features stay off until you choose them. Your decision is remembered for six months. <Link href={`/${region}/cookie-policy`} onClick={closeCookiePreferences} className="underline underline-offset-2">Cookie policy</Link></p>
      <div className="mt-5 space-y-3">
        <div className="rounded-2xl border border-white/15 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-medium">Essential storage</p><span className="text-xs text-white/50">Always active</span></div>
          <p className="mt-2 text-sm leading-6 text-white/65">Keeps sign-in, security, the region selected for this visit and your consent decision working.</p>
        </div>
        <label className="flex gap-3 rounded-2xl border border-white/15 p-4">
          <input type="checkbox" checked={rememberRegion} onChange={(event) => setRememberRegion(event.target.checked)} className="mt-1 size-5 shrink-0 accent-[var(--brand-start)]" />
          <span><span className="font-medium">Remember my region</span><span className="mt-2 block text-sm leading-6 text-white/65">Keep your UK or ZA selection across visits for up to six months. Turning this off keeps the selection only for the current browser session.</span></span>
        </label>
        <label className="flex gap-3 rounded-2xl border border-white/15 p-4">
          <input type="checkbox" checked={externalMedia} onChange={(event) => setExternalMedia(event.target.checked)} className="mt-1 size-5 shrink-0 accent-[var(--brand-start)]" />
          <span><span className="font-medium">External video players</span><span className="mt-2 block text-sm leading-6 text-white/65">Allow YouTube to receive connection information and use its own storage when an embedded player loads. Local photos and videos work without this.</span></span>
        </label>
      </div>
      <p className="mt-4 text-xs leading-5 text-white/50">We do not currently run analytics or advertising trackers. Newsletter consent is separate.</p>
      <div className="sticky -bottom-5 -mx-5 mt-5 grid grid-cols-2 gap-3 border-t border-white/10 bg-[#10131a] px-5 py-4 sm:-bottom-7 sm:-mx-7 sm:px-7">
        <button type="button" onClick={() => { saveCookiePreferences({ rememberRegion: false, externalMedia: false }); closeCookiePreferences(); }} className={choiceButton}>Essential only</button>
        <button type="button" onClick={() => { saveCookiePreferences({ rememberRegion, externalMedia }); closeCookiePreferences(); }} className={choiceButton}>Save preferences</button>
      </div>
    </dialog>
  );
}
