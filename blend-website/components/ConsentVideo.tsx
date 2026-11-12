"use client";

import { useSyncExternalStore, type ComponentProps } from "react";
import { externalMediaAllowed, showCookiePreferences, subscribeCookiePreferences } from "@/lib/cookie-preferences";

export default function ConsentVideo(props: ComponentProps<"iframe">) {
  const allowed = useSyncExternalStore(subscribeCookiePreferences, externalMediaAllowed, () => false);
  if (allowed) return <iframe {...props} />;
  return (
    <div className={`${props.className?.replaceAll("pointer-events-none", "") ?? ""} flex items-center justify-center bg-[#10131a] p-4`}>
      <div className="max-w-xs text-center text-sm text-white/75">
        <p>Enable external video players to watch this video.</p>
        <button type="button" className="pointer-events-auto mt-3 min-h-11 rounded-full border border-white/30 px-5 text-white"
          onClick={(event) => { event.preventDefault(); event.stopPropagation(); showCookiePreferences(); }}>Video preferences</button>
      </div>
    </div>
  );
}
