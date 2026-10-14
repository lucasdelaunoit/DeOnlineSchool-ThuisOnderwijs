import Link from "next/link";
import { ArrowIcon } from "@/components/site/arrow-icon";
import { topicsWithQuestions } from "@/lib/categories";
import { categoryId, type Question } from "@/lib/questions";

/** The topics that have questions, as tiles linking to their part of /questions. */
export function Topics({ questions }: { questions: Question[] }) {
  const topics = topicsWithQuestions(questions);

  return (
    <section aria-labelledby="topics" className="pt-16 pb-14 md:pt-24 md:pb-16">
      <div className="container-wide">
        <div className="rise flex items-end justify-between gap-6 [--i:3]">
          <h2 id="topics" className="text-h2 text-ink">
            Onderwerpen
          </h2>
          <Link href="/questions" className="group flex items-center gap-1.5 text-small font-medium no-underline">
            Alle vragen
            <ArrowIcon className="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="mt-7 grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {topics.map((topic, i) => (
            <li key={topic.name} style={{ "--i": i + 4 } as React.CSSProperties} className="rise">
              <Link
                href={`/questions#${categoryId(topic.name)}`}
                className="group flex h-full min-h-44 flex-col rounded-panel border border-line bg-white p-6 text-ink no-underline shadow-card transition-[translate,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-green/30 hover:text-ink hover:shadow-tile"
              >
                <div>
                  <h3 className="text-h3 text-ink transition-colors duration-150 group-hover:text-green-dark">
                    {topic.name}
                  </h3>
                  {topic.intro && <p className="mt-1.5 text-small text-muted">{topic.intro}</p>}
                </div>
                <span className="mt-auto flex items-center justify-between pt-6 text-meta text-muted">
                  {count(topic.questions.length)}
                  <span className="flex size-9 items-center justify-center rounded-full bg-mint text-green transition-colors duration-300 ease-out group-hover:bg-green group-hover:text-white">
                    <ArrowIcon className="size-4" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function count(n: number) {
  return n === 1 ? "1 vraag" : `${n} vragen`;
}
