import { formatDate, plainText, type Question } from "@/lib/questions";
import { RichText } from "./rich-text";

/**
 * Numbered sources on the green of the short answer; the [n] markers in the text
 * link here (#source-n).
 */
export function Sources({ q }: { q: Question }) {
  if (!q.sources.length) return null;
  return (
    <section aria-labelledby="sources" className="bg-green text-green-pale [--focus-ring:var(--color-white)]">
      <div className="container-wide py-16 md:py-20">
        <h2 id="sources" className="text-h2 text-white">
          Bronnen
        </h2>
        <p className="mt-1.5 text-small">
          Deze pagina is gebaseerd op de volgende bronnen, geraadpleegd op{" "}
          <time dateTime={q.checkedOn}>{formatDate(q.checkedOn)}</time>.
        </p>
        <ol className="mt-6 flex flex-col gap-1 text-small">
          {q.sources.map((source, i) => {
            const body = (
              <>
                <span className="min-w-6 font-semibold text-white tabular-nums">[{i + 1}]</span>
                <span className="min-w-0 flex-1">
                  <RichText text={source.text} />
                  {source.url && (
                    <span className="mt-1 flex items-center gap-1.5 text-meta text-white">
                      <span className="truncate underline decoration-green-pale/50 underline-offset-3 transition-colors group-hover:decoration-white">
                        {host(source.url)}
                      </span>
                      <ExternalIcon className="size-3.5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  )}
                </span>
              </>
            );
            return (
              <li key={i} id={`source-${i + 1}`} className="-mx-3 rounded-field transition-colors duration-700 target:bg-green-dark">
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${plainText(source.text)} (${host(source.url)}, opent in een nieuw tabblad)`}
                    className="group flex gap-3 rounded-field px-3 py-2.5 text-green-pale no-underline transition-colors duration-150 hover:bg-green-dark hover:text-green-pale"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="flex gap-3 px-3 py-2.5">{body}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** "https://www.vlaanderen.be/onderwijs/…" → "vlaanderen.be" */
function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Arrow out of a box corner: opens another site. */
function ExternalIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 13 14 6M8 6h6v6" />
    </svg>
  );
}
