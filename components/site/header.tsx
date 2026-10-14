import Link from "next/link";
import { MAIN_NAV } from "@/lib/site";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper on-forest:border-transparent on-forest:bg-forest">
      <div className="container-wide flex items-center justify-center gap-x-6 py-5 md:justify-between md:py-6">
        <Link href="/" className="no-underline">
          <Logo />
        </Link>
        {/* Phones show only the logo, centred; the podcast banner above links to the podcast. */}
        <nav aria-label="Hoofdmenu" className="hidden gap-8 text-body md:flex">
          {MAIN_NAV.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
