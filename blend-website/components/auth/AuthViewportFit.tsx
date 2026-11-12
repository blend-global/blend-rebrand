import type { ReactNode } from "react";

export default function AuthViewportFit({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-y-auto overscroll-contain [align-items:safe_center]">
      <div className="w-full shrink-0">{children}</div>
    </div>
  );
}
