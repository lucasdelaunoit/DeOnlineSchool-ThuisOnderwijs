"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Header link, darker and bold on its own section. */
export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const current = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className="text-ink-nav no-underline hover:text-ink aria-[current=page]:font-semibold aria-[current=page]:text-ink"
    >
      {children}
    </Link>
  );
}
