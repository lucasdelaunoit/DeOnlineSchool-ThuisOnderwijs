import { formatDate, type Question } from "@/lib/questions";
import { RichText } from "./rich-text";

/** Numbered sources; the [n] markers in the text link here (#source-n). */
export function Sources({ q }: { q: Question }) {
  if (!q.sources.length) return null;
  return (
    <section aria-labelledby="sources" className="bg-sand">
      <div className="container-text pt-12 pb-13">
        <h2 id="sources" className="text-h2-small">
          Bronnen
        </h2>
        <p className="section-intro">
          Deze pagina is gebaseerd op de volgende bronnen, geraadpleegd op{" "}
          <time dateTime={q.checkedOn}>{formatDate(q.checkedOn)}</time>.
        </p>
        <ol className="mt-4.5 flex flex-col gap-1 text-small text-ink-soft">
          {q.sources.map((source, i) => (
            <li
              key={i}
              id={`source-${i + 1}`}
              className="-mx-3 flex gap-3 rounded-field px-3 py-1 transition-colors duration-700 target:bg-mint"
            >
              <span className="min-w-6 font-semibold text-green">[{i + 1}]</span>
              <span>
                <RichText text={source.text} />
                {source.url && (
                  <>
                    {" "}
                    <a href={source.url} target="_blank" rel="noopener" className="text-caption underline">
                      link
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
