import type { Question } from "@/lib/questions";

/**
 * Quotes in two columns from `md`, each under a hairline: no boxes, a hanging
 * opening mark, the person underneath. Follows the green sources band, so no
 * hairline above the section itself.
 */
export function Experiences({ q }: { q: Question }) {
  if (!q.experiences?.length) return null;
  return (
    <section aria-labelledby="experiences" className="pt-16 pb-16 md:pt-24 md:pb-24">
      <div className="container-wide">
        <h2 id="experiences" className="section-title">
          Ervaringen
        </h2>
        <p className="section-intro">Echte ervaringen, in onze woorden samengevat. De namen zijn gefingeerd.</p>
        <div className="mt-8 grid gap-x-12 gap-y-9 md:grid-cols-2">
          {q.experiences.map((e) => (
            <figure key={e.name + e.quote} className="reveal border-t border-line pt-5">
              <blockquote className="relative pl-5 text-lead text-ink">
                <span aria-hidden="true" className="absolute -top-1 left-0 font-display text-[1.5em] leading-none text-green">
                  “
                </span>
                {e.quote}
              </blockquote>
              <figcaption className="mt-3 pl-5 text-small text-muted">
                <span className="font-medium text-ink">{e.name}</span>, {e.role}
                {e.context && ` · ${e.context}`}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
