import { cacheLife } from "next/cache";
import { SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-night text-night-fg">
      <div className="container-wide flex flex-wrap justify-between gap-x-8 gap-y-2 py-6 text-meta">
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
