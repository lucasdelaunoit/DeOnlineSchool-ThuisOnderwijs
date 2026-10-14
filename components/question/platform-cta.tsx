import { ArrowIcon } from "@/components/site/arrow-icon";

/**
 * Recommendation of De Online School, a separate platform: worded as a tip, never
 * as "our school". On forest, like the heroes, with rings echoing the stamp. `href`
 * carries the page's UTM tags.
 */
export function PlatformCta({ href }: { href: string }) {
  return (
    <aside aria-labelledby="platform" className="pb-12 md:pb-24">
      <div className="container-wide">
        <div className="reveal relative flex flex-wrap items-center justify-between gap-x-8 gap-y-6 overflow-hidden rounded-panel bg-forest px-6 py-7 text-white [--focus-ring:var(--color-white)] md:px-10 md:py-9">
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-20 size-60 rounded-full border border-forest-line" />
          <div aria-hidden="true" className="pointer-events-none absolute -top-36 -right-36 size-92 rounded-full border border-forest-line/60" />
          <div className="relative min-w-0 flex-[1_1_360px]">
            <p className="text-small font-semibold text-green-light">Tip voor je voorbereiding</p>
            <h2 id="platform" className="mt-1.5 text-h2-small text-white">
              Studeren voor de examens van de Examencommissie?
            </h2>
            <p className="mt-2 max-w-[52ch] text-small text-forest-fg">
              De Online School heeft lessen, oefeningen en een oefenexamen per vak, volgens de vakfiche. Nu gratis in
              beta.
            </p>
          </div>
          <a href={href} target="_blank" rel="noopener" className="btn btn-light relative w-full sm:w-auto">
            Bekijk De Online School <ArrowIcon className="size-4" />
          </a>
        </div>
      </div>
    </aside>
  );
}
