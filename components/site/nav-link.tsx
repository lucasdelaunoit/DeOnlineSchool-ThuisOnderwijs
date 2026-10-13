"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Header link, darker and underlined on its own section. */
export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const current = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className="nav-link text-ink-soft hover:text-ink aria-[current=page]:text-ink on-forest:text-forest-fg on-forest:hover:text-white"
    >
      {children}
    </Link>
  );
}
