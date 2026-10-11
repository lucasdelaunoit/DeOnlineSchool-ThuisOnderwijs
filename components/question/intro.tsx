import Link from "next/link";
import { categoryId, formatDate, type Question } from "@/lib/questions";

/** Breadcrumb, the question and the meta line. */
export function Intro({ q }: { q: Question }) {
  return (
    <section className="container-text pt-11 pb-10 md:pt-13 md:pb-11">
      <nav aria-label="Kruimelpad">
        <ol className="flex flex-wrap gap-1.5 text-meta text-muted">
          <li>
            <Link href="/questions" className="text-muted underline hover:text-ink">
              Veelgestelde vragen
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link href={`/questions#${categoryId(q.category)}`} className="text-muted underline hover:text-ink">
              {q.category}
            </Link>
          </li>
        </ol>
      </nav>
      <h1 className="mt-4 text-h1 text-ink">{q.question}</h1>
      <p className="mt-3.5 text-meta text-muted">
        {q.audience && `${q.audience} · `}
        Laatst gecontroleerd op <time dateTime={q.checkedOn}>{formatDate(q.checkedOn)}</time>
      </p>
    </section>
  );
}
