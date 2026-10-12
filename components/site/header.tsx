import Link from "next/link";
import { MAIN_NAV } from "@/lib/site";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="container-wide flex items-center justify-between gap-x-6 py-4">
        <Link href="/" className="no-underline">
          <Logo />
        </Link>
        <nav aria-label="Hoofdmenu" className="flex gap-6 text-small">
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
