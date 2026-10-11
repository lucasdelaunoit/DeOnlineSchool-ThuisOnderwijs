import type { Question } from "@/lib/questions";

export function Experiences({ q }: { q: Question }) {
  if (!q.experiences?.length) return null;
  return (
    <section aria-labelledby="experiences" className="section bg-paper">
      <div className="container-text">
        <h2 id="experiences" className="section-title">
          Ervaringen
        </h2>
        <p className="section-intro">Echte ervaringen, in onze woorden samengevat. De namen zijn gefingeerd.</p>
        <div className="mt-7 flex flex-col gap-3.5">
          {q.experiences.map((e) => (
            <figure
              key={e.name + e.quote}
              className="grid grid-cols-[32px_minmax(0,1fr)] gap-x-3.5 gap-y-1.5 rounded-quote bg-white px-5 py-5 shadow-card md:px-6.5 md:py-5.5"
            >
              <span aria-hidden="true" className="font-display text-[42px] leading-[0.9] font-semibold text-green">
                “
              </span>
              <blockquote className="text-[15px] leading-relaxed text-ink-soft">{e.quote}</blockquote>
              <figcaption className="col-start-2 text-meta text-muted">
                <strong className="font-semibold text-ink">{e.name}</strong>, {e.role}
                {e.context && ` · ${e.context}`}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
