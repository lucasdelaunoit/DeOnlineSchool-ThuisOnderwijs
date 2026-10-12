import Link from "next/link";
import { categoryMeta, type CategoryIcon } from "@/lib/categories";
import { categoryId, type Question } from "@/lib/questions";

const SHOWN = 3;

/** A tile per category with its first questions. */
export function Topics({ questions }: { questions: Question[] }) {
  const byCategory = Map.groupBy(questions, (q) => q.category) as Map<string, Question[]>;

  return (
    <section aria-labelledby="topics" className="pt-12 md:pt-14">
      <div className="container-wide">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h2 id="topics" className="section-title">
            Onderwerpen
          </h2>
          <Link href="/questions" className="text-small font-semibold">
            Alle vragen <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...byCategory].map(([category, items]) => {
            const { icon, intro } = categoryMeta(category);
            const href = `/questions#${categoryId(category)}`;
            return (
              <li
                key={category}
                className="flex flex-col rounded-card border border-line bg-white p-5 shadow-card transition-colors hover:border-line-strong/50 md:p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-mint text-green">
                  <Icon name={icon} />
                </span>
                <h3 className="mt-4 text-h3 text-ink">
                  <Link href={href} className="text-ink no-underline hover:text-green-dark">
                    {category}
                  </Link>
                </h3>
                {intro && <p className="mt-1 text-small text-muted">{intro}</p>}
                <ul className="mt-4 flex-1 border-t border-line">
                  {items.slice(0, SHOWN).map((q) => (
                    <li key={q.slug} className="border-b border-line">
                      <Link
                        href={`/questions/${q.slug}`}
                        className="group flex justify-between gap-3 py-2.5 text-small text-ink-soft no-underline hover:text-green-dark"
                      >
                        {q.title ?? q.question}
                        <span aria-hidden="true" className="text-green transition-transform group-hover:translate-x-0.5">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={href} className="mt-4 text-meta font-semibold">
                  {items.length === 1 ? "1 vraag" : `Alle ${items.length} vragen`} <span aria-hidden="true">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const PATHS: Record<CategoryIcon, string> = {
  book: "M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5z",
  calendar: "M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 10h16M8 3v4M16 3v4",
  diploma: "M4 5h16v10H4zM8 9h8M8 12h5M15 15v6l2-1.5 2 1.5v-6",
  exam: "M7 3h10v18H7zM10 8h4M10 12h4M10 16h2",
  home: "M4 11 12 4l8 7v9H4zM10 20v-5h4v5",
  review: "M6 3h8l4 4v6M14 3v4h4M6 3v18h6M9 11h6M9 15h3M17.5 20.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 20l1.5 1.5",
};

function Icon({ name }: { name: CategoryIcon }) {
  return (
    <svg
      className="size-5.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
