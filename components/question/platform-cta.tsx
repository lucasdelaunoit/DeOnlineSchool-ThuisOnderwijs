/**
 * Recommendation of De Online School, a separate platform: worded as a tip, never
 * as "our school". `href` carries the page's UTM tags; `container` matches the
 * width of the page above it.
 */
export function PlatformCta({ href, container = "container-text" }: { href: string; container?: string }) {
  return (
    <aside aria-labelledby="platform" className="py-12 md:py-14">
      <div className={container}>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 rounded-panel border border-line bg-white px-6 py-6 shadow-card md:px-8 md:py-7">
          <div className="min-w-0 flex-[1_1_360px]">
            <p className="eyebrow">Tip voor je voorbereiding</p>
            <h2 id="platform" className="mt-1.5 text-h2-small text-ink">
              Studeren voor de examens van de Examencommissie?
            </h2>
            <p className="mt-1.5 text-small text-ink-soft">
              De Online School heeft lessen, oefeningen en een oefenexamen per vak, volgens de vakfiche. Nu gratis in
              beta.
            </p>
          </div>
          <a href={href} target="_blank" rel="noopener" className="btn btn-primary">
            Bekijk De Online School <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
