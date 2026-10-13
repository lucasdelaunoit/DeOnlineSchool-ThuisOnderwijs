import Link from "next/link";
import { categoryId, formatDate, type Question } from "@/lib/questions";

/**
 * Breadcrumb, the question and the meta line, on forest like the home page hero
 * (data-tone="forest" turns the header forest too).
 */
export function Intro({ q }: { q: Question }) {
  return (
    <section data-tone="forest" className="bg-forest text-white [--focus-ring:var(--color-white)]">
      <div className="container-wide pt-10 pb-16 md:pt-16 md:pb-24">
        <nav aria-label="Kruimelpad" className="rise">
          <ol className="flex flex-wrap items-center gap-2 text-small text-forest-fg">
            <li>
              <Link href="/questions" className="text-forest-fg no-underline hover:text-white">
                Veelgestelde vragen
              </Link>
            </li>
            <li aria-hidden="true" className="text-green-light/60">
              /
            </li>
            <li>
              <Link href={`/questions#${categoryId(q.category)}`} className="text-forest-fg no-underline hover:text-white">
                {q.category}
              </Link>
            </li>
          </ol>
        </nav>
        <h1 className="rise mt-5 text-h1 [--i:1]">{q.question}</h1>
        <p className="rise mt-5 flex flex-wrap items-center gap-x-2.5 text-small text-forest-fg [--i:2]">
          {q.audience && (
            <>
              <span>{q.audience}</span>
              <span aria-hidden="true" className="size-1 rounded-full bg-green-light" />
            </>
          )}
          <span>
            Laatst gecontroleerd op <time dateTime={q.checkedOn}>{formatDate(q.checkedOn)}</time>
          </span>
        </p>
      </div>
    </section>
  );
}
