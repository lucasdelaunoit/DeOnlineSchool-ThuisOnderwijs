import { cacheLife } from "next/cache";
import { SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  // Extra room at the bottom on phones, so the floating stamp doesn't cover the last line.
  return (
    <footer className="bg-ink text-ink-fg">
      <div className="container-wide flex flex-wrap justify-between gap-x-8 gap-y-2 pt-6 pb-[calc(84px+env(safe-area-inset-bottom,0px))] text-meta md:py-6">
        <span>
          © <CurrentYear /> {SITE_NAME}
        </span>
        <span>Deze pagina is informatief. Bij twijfel geldt de officiële informatie van de Vlaamse overheid.</span>
      </div>
    </footer>
  );
}

// Cached, so the footer stays part of the static shell; refreshed daily.
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
