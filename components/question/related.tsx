import Link from "next/link";
import { getRelated, type Question } from "@/lib/questions";

/** Hidden while there are no other questions to link to. */
export function Related({ q }: { q: Question }) {
  const related = getRelated(q);
  if (!related.length) return null;
  return (
    <section aria-labelledby="related" className="section bg-linen">
      <div className="container-text">
        <h2 id="related" className="section-title">
          Andere gerelateerde vragen
        </h2>
        <ul className="mt-5 border-t border-line-soft">
          {related.map((other) => (
            <li key={other.slug} className="border-b border-line-soft">
              <Link
                href={`/questions/${other.slug}`}
                className="group flex justify-between gap-4 py-3.75 text-ink no-underline hover:text-green-dark"
              >
                {other.question}
                <span aria-hidden="true" className="text-green transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
