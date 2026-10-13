import Link from "next/link";
import { topicsWithQuestions, type CategoryIcon } from "@/lib/categories";
import { categoryId, type Question } from "@/lib/questions";

/**
 * Topic tiles. Pulled up over the bottom of the hero: the heading sits on the dark
 * green, the tiles straddle the edge (the hero leaves room with its bottom padding).
 */
export function Topics({ questions }: { questions: Question[] }) {
  const topics = topicsWithQuestions(questions);

  return (
    <section aria-labelledby="topics" className="relative z-10 -mt-24">
      <div className="container-wide">
        <h2 id="topics" className="flex items-center gap-4 text-caption font-semibold tracking-[0.14em] text-green-light uppercase">
          <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
          Of blader per onderwerp
          <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
        </h2>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-3">
          {topics.map((topic) => (
            <li key={topic.name}>
              {topic.questions.length ? (
                <Link
                  href={`/questions#${categoryId(topic.name)}`}
                  className="group flex h-full flex-col rounded-card border border-line bg-white p-4 text-ink sm:rounded-panel sm:p-6 no-underline shadow-card transition-[translate,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-green/40 hover:text-ink hover:shadow-tile"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="flex size-10 items-center justify-center rounded-[12px] bg-mint text-green transition-colors group-hover:bg-green group-hover:text-white sm:size-12 sm:rounded-[14px]">
                      <Icon name={topic.icon} />
                    </span>
                    <span className="hidden rounded-full bg-paper px-2.5 py-0.5 text-meta font-medium text-ink-soft sm:inline">
                      {count(topic.questions.length)}
                    </span>
                  </span>
                  <h3 className="mt-3.5 text-body leading-snug font-semibold text-ink sm:mt-5 sm:text-h3">{topic.name}</h3>
                  {topic.intro && <p className="mt-1.5 hidden text-small text-muted sm:block">{topic.intro}</p>}
                  <span className="mt-auto flex items-center gap-1.5 pt-3 text-meta font-semibold text-green sm:pt-5 sm:text-small">
                    <span className="sm:hidden">{count(topic.questions.length)}</span>
                    <span className="hidden sm:inline">Bekijk de vragen</span>
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              ) : (
                <div className="flex h-full flex-col rounded-card border border-dashed border-line-strong/40 bg-sheet p-4 sm:rounded-panel sm:p-6">
                  <span className="flex items-start justify-between gap-3">
                    <span className="flex size-10 items-center justify-center rounded-[12px] bg-sand text-muted sm:size-12 sm:rounded-[14px]">
                      <Icon name={topic.icon} />
                    </span>
                    <span className="hidden rounded-full border border-line px-2.5 py-0.5 text-meta text-muted sm:inline">
                      Binnenkort
                    </span>
                  </span>
                  <h3 className="mt-3.5 text-body leading-snug font-semibold text-ink-soft sm:mt-5 sm:text-h3">{topic.name}</h3>
                  {topic.intro && <p className="mt-1.5 hidden text-small text-muted sm:block">{topic.intro}</p>}
                  <span className="mt-auto pt-3 text-meta text-muted sm:hidden">Binnenkort</span>
                </div>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center">
          <Link href="/questions" className="text-small font-semibold">
            Alle veelgestelde vragen <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}

function count(n: number) {
  return n === 1 ? "1 vraag" : `${n} vragen`;
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
      className="size-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
