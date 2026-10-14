import type { Question } from "@/lib/questions";

/**
 * Quotes as cards: a row to swipe through on phones (the next card peeks in), two
 * columns from `md`. Each card ends with the person, under an initial.
 */
export function Experiences({ q }: { q: Question }) {
  if (!q.experiences?.length) return null;
  return (
    <section aria-labelledby="experiences" className="pt-12 pb-12 md:pt-24 md:pb-24">
      <div className="container-wide">
        <h2 id="experiences" className="section-title">
          Ervaringen
        </h2>
        <p className="section-intro">Echte ervaringen, in onze woorden samengevat. De namen zijn gefingeerd.</p>
        <ul className="-mx-5 mt-7 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0">
          {q.experiences.map((e) => (
            <li
              key={e.name + e.quote}
              className="reveal flex w-[84%] max-w-[360px] shrink-0 snap-start md:w-auto md:max-w-none"
            >
              <figure className="flex w-full flex-col rounded-quote border border-line bg-white p-5 shadow-card md:p-6">
                <span aria-hidden="true" className="font-display text-[44px] leading-[0.6] text-green-light">
                  “
                </span>
                <blockquote className="mt-1 text-body text-ink md:text-[17px]">{e.quote}</blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-5">
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mint font-semibold text-green"
                  >
                    {Array.from(e.name)[0]}
                  </span>
                  <span className="min-w-0 text-meta text-muted">
                    <span className="block text-small font-semibold text-ink">{e.name}</span>
                    {e.role}
                    {e.context && ` · ${e.context}`}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
