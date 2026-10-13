import { formatDate, type Question } from "@/lib/questions";
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
        <ol className="mt-5 flex flex-col gap-1.5 text-small">
          {q.sources.map((source, i) => (
            <li
              key={i}
              id={`source-${i + 1}`}
              className="-mx-3 flex gap-3 rounded-field px-3 py-1.5 transition-colors duration-700 target:bg-green-dark"
            >
              <span className="min-w-6 font-semibold text-white tabular-nums">[{i + 1}]</span>
              <span>
                <RichText text={source.text} />
                {source.url && (
                  <>
                    {" "}
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener"
                      className="whitespace-nowrap text-white underline decoration-dotted underline-offset-4 hover:text-green-pale"
                    >
                      link ↗
                    </a>
                  </>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
