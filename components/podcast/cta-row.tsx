import type { ReactNode } from "react";

/** Main button plus a short muted line, closing most sections. */
export function CtaRow({ href = "#signup", label, children }: { href?: string; label: string; children: ReactNode }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-4.5 gap-y-3.5">
      <a className="btn btn-main" href={href}>
        {label}
      </a>
      <span className="font-semibold text-muted">{children}</span>
    </div>
  );
}
