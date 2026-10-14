import Link from "next/link";
import { ArrowIcon } from "@/components/site/arrow-icon";
import type { Question } from "@/lib/questions";
import { getRelated } from "@/lib/server/questions";

/** Hidden while there are no other questions to link to. */
export async function Related({ q }: { q: Question }) {
  const related = await getRelated(q);
  if (!related.length) return null;
  return (
    <section aria-labelledby="related" className="pb-12 md:pb-24">
      <div className="container-wide">
        <div className="section-rule">
          <h2 id="related" className="section-title">
            Andere gerelateerde vragen
          </h2>
          <ul className="mt-5 border-t border-line">
            {related.map((other) => (
              <li key={other.slug} className="border-b border-line">
                <Link
                  href={`/questions/${other.slug}`}
                  className="group flex items-center justify-between gap-4 py-4 text-ink no-underline hover:text-green-dark"
                >
                  {other.question}
                  <ArrowIcon className="size-4 shrink-0 text-green transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
