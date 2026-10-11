/** Green band pointing to De Online School. `href` carries the page's UTM tags. */
export function PlatformCta({ href }: { href: string }) {
  return (
    <section aria-labelledby="platform" className="bg-green text-white [--focus-ring:var(--color-white)]">
      <div className="container-text flex flex-wrap items-center justify-between gap-x-8 gap-y-5 py-11">
        <div className="min-w-0 flex-[1_1_380px]">
          <p className="eyebrow text-green-pale">Ons online platform</p>
          <h2 id="platform" className="mt-1.5 text-h2-small">
            De Examencommissie geeft geen les. Wij wel.
          </h2>
          <p className="mt-1.5 text-small text-green-pale">
            Lessen, oefeningen en een oefenexamen per vak, volgens de vakfiche.
          </p>
        </div>
        <a href={href} target="_blank" rel="noopener" className="btn btn-light">
          Schrijf je gratis in <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
