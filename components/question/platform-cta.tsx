import { ArrowIcon } from "@/components/site/arrow-icon";

/**
 * Recommendation of De Online School, a separate platform: worded as a tip, never
 * as "our school". `href` carries the page's UTM tags.
 */
export function PlatformCta({ href }: { href: string }) {
  return (
    <aside aria-labelledby="platform" className="pb-16 md:pb-24">
      <div className="container-wide">
        <div className="reveal flex flex-wrap items-center justify-between gap-x-8 gap-y-5 rounded-panel border border-line bg-white px-6 py-6 md:px-8 md:py-7">
          <div className="min-w-0 flex-[1_1_360px]">
            <p className="text-small font-semibold text-green">Tip voor je voorbereiding</p>
            <h2 id="platform" className="mt-1.5 text-h2-small text-ink">
              Studeren voor de examens van de Examencommissie?
            </h2>
            <p className="mt-1.5 text-small text-ink-soft">
              De Online School heeft lessen, oefeningen en een oefenexamen per vak, volgens de vakfiche. Nu gratis in
              beta.
            </p>
          </div>
          <a href={href} target="_blank" rel="noopener" className="btn btn-primary">
            Bekijk De Online School <ArrowIcon className="size-4" />
          </a>
        </div>
      </div>
    </aside>
  );
}
