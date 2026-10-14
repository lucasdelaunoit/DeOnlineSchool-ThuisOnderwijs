import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { PlatformCta } from "@/components/question/platform-cta";
import { ArrowIcon } from "@/components/site/arrow-icon";
import { topicsWithQuestions } from "@/lib/categories";
import { categoryId, plainText } from "@/lib/questions";
import { getQuestions } from "@/lib/server/questions";
import { onlineSchoolUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Veelgestelde vragen over thuisonderwijs en de Examencommissie",
  description:
    "Duidelijke antwoorden op vragen over thuisonderwijs en de Examencommissie in Vlaanderen, met bronnen en ervaringen van leerlingen en ouders.",
};

// The browser bar matches the hero, which the header sits on here.
export const viewport: Viewport = { themeColor: "#1f3a31" };

export default async function QuestionsIndex() {
  const questions = await getQuestions();
  const topics = topicsWithQuestions(questions);

  return (
    <>
      <main>
        {/* data-tone="forest" also turns the header forest (on-forest: in styles/site/theme.css). */}
        <section data-tone="forest" className="bg-forest text-white [--focus-ring:var(--color-white)]">
          <div className="container-wide pt-10 pb-16 md:pt-16 md:pb-24">
            <p className="rise text-small font-semibold text-green-light">Veelgestelde vragen</p>
            <h1 className="rise mt-3 max-w-[22ch] text-h1 [--i:1]">
              Alles over thuisonderwijs en de Examencommissie
            </h1>
            <p className="rise mt-5 max-w-[56ch] text-lead text-forest-fg [--i:2]">
              {count(questions.length)} in {topics.length} onderwerpen. Elk antwoord is nagekeken aan de hand van de
              officiële bronnen.
            </p>
          </div>
        </section>

        <div className="container-wide grid gap-10 pt-10 pb-16 md:pt-14 md:pb-24 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          <nav aria-labelledby="topics-nav" className="rise [--i:3] lg:sticky lg:top-8 lg:self-start">
            <h2 id="topics-nav" className="eyebrow lg:px-3">
              Onderwerpen
            </h2>
            {/* A row of chips that scrolls sideways on small screens, a list beside the questions on large ones. */}
            <ul className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:-mx-6 md:px-6 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
              {topics.map((topic) => (
                <li key={topic.name} className="shrink-0">
                  <a
                    href={`#${categoryId(topic.name)}`}
                    className="flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-small whitespace-nowrap text-ink-soft no-underline transition-colors duration-150 hover:border-green/30 hover:text-green-dark lg:justify-between lg:rounded-field lg:border-transparent lg:bg-transparent lg:px-3 lg:whitespace-normal lg:hover:border-transparent lg:hover:bg-white"
                  >
                    {topic.name}
                    <span className="text-meta text-muted tabular-nums">{topic.questions.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-14 md:gap-16">
            {topics.map((topic, i) => {
              const id = categoryId(topic.name);
              // The first topic is on screen at load and rises in with the hero; the rest as they scroll in.
              const entrance = (n: number) =>
                i === 0
                  ? { className: "rise", style: { "--i": Math.min(n, 10) } as React.CSSProperties }
                  : { className: "reveal" };
              return (
                <section key={topic.name} id={id} aria-labelledby={`${id}-title`} className="group/topic">
                  <div {...entrance(3)}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 id={`${id}-title`} className="text-h2 text-ink">
                        {topic.name}
                      </h2>
                      <span className="shrink-0 text-meta text-muted">{count(topic.questions.length)}</span>
                    </div>
                    {topic.intro && <p className="section-intro">{topic.intro}</p>}
                  </div>

                  <ul className="mt-5 divide-y divide-line overflow-hidden rounded-panel border border-line bg-white shadow-card transition-[border-color,box-shadow] duration-700 group-target/topic:border-green/40 group-target/topic:shadow-tile">
                    {topic.questions.map((q, j) => (
                      <li key={q.slug} {...entrance(j + 4)}>
                        <Link
                          href={`/questions/${q.slug}`}
                          className="group flex items-center gap-4 px-5 py-4 text-ink no-underline transition-colors duration-150 hover:bg-sheet hover:text-ink md:px-6 md:py-4.5"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium text-ink transition-colors duration-150 group-hover:text-green-dark">
                              {q.question}
                            </span>
                            <span className="mt-0.5 line-clamp-1 text-small text-muted">{plainText(q.shortAnswer)}</span>
                          </span>
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mint text-green transition-colors duration-300 ease-out group-hover:bg-green group-hover:text-white">
                            <ArrowIcon className="size-4" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <PlatformCta href={onlineSchoolUrl("/", { campaign: "questions" })} />
    </>
  );
}

function count(n: number) {
  return n === 1 ? "1 vraag" : `${n} vragen`;
}
