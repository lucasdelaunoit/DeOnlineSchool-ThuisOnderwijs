import type { Metadata } from "next";
import Link from "next/link";
import { categoryId, getQuestions, type Question } from "@/lib/questions";

export const metadata: Metadata = {
  title: "Veelgestelde vragen over thuisonderwijs en de Examencommissie",
  description:
    "Duidelijke antwoorden op vragen over thuisonderwijs en de Examencommissie in Vlaanderen, met bronnen en ervaringen van leerlingen en ouders.",
};

export default function QuestionsIndex() {
  const byCategory = Map.groupBy(getQuestions(), (q) => q.category) as Map<string, Question[]>;

  return (
    <main className="container-text pt-10 pb-16 md:pt-14 md:pb-20">
      <h1 className="text-h1 text-ink">Veelgestelde vragen</h1>
      <p className="mt-3.5 max-w-[60ch] text-ink-soft">
        Over thuisonderwijs en de Examencommissie in Vlaanderen. Elk antwoord is nagekeken aan de hand van de
        officiële bronnen.
      </p>

      {[...byCategory].map(([category, questions]) => (
        <section key={category} aria-labelledby={categoryId(category)} className="mt-12">
          <h2 id={categoryId(category)} className="eyebrow font-sans">
            {category}
          </h2>
          <ul className="mt-3 border-t border-line">
            {questions.map((q) => (
              <li key={q.slug} className="border-b border-line">
                <Link
                  href={`/questions/${q.slug}`}
                  className="group flex justify-between gap-4 py-4 text-ink no-underline hover:text-green-dark"
                >
                  {q.question}
                  <span aria-hidden="true" className="text-green transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
