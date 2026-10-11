import Link from "next/link";
import { LOGIN_URL, MAIN_NAV, SIGNUP_URL } from "@/lib/site";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="container-wide flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-3.5 md:gap-x-7">
        <Link href="/" className="no-underline">
          <Logo />
        </Link>
        <nav aria-label="Hoofdmenu" className="order-last flex w-full gap-6 text-small md:order-none md:w-auto">
          {MAIN_NAV.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
          {/* On phones the login link moves here, so the top row fits. */}
          <a href={LOGIN_URL} className="ml-auto font-medium text-ink no-underline hover:text-green md:hidden">
            Inloggen
          </a>
        </nav>
        <div className="flex items-center gap-4.5 text-small">
          <a href={LOGIN_URL} className="hidden font-medium text-ink no-underline hover:text-green md:inline">
            Inloggen
          </a>
          <a href={SIGNUP_URL} className="btn btn-dark min-h-9 px-4 md:min-h-10 md:px-5">
            Gratis proberen
          </a>
        </div>
      </div>
    </header>
  );
}
