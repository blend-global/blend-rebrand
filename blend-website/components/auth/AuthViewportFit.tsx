import type { ReactNode } from "react";

export default function AuthViewportFit({ children }: { children: ReactNode }) {
  return (
    <div style={{ alignItems: "safe center" }} className="flex h-full w-full justify-center overflow-y-auto overscroll-contain">
      <div className="w-full shrink-0">{children}</div>
    </div>
  );
}
