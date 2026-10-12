import type { Metadata } from "next";
import { HeroSearch } from "@/components/home/hero-search";
import { Topics } from "@/components/home/topics";
import { PlatformCta } from "@/components/question/platform-cta";
import { getQuestions, searchIndex } from "@/lib/questions";
import { onlineSchoolUrl, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME}: thuisonderwijs en de Examencommissie in Vlaanderen` },
  description:
    "Zoek je antwoord over thuisonderwijs en de Examencommissie in Vlaanderen. Eerst het korte antwoord, dan de uitleg en de officiële bronnen.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const questions = getQuestions();
  // Search examples: the topics, so every example finds something.
  const examples = [...new Set(questions.map((q) => q.category))].slice(0, 4);

  return (
    <>
      <main>
        <section className="border-b border-line bg-mint">
          <div className="container-wide flex flex-col items-center pt-14 pb-16 text-center md:pt-22 md:pb-24">
            <p className="eyebrow">Thuisonderwijs in Vlaanderen</p>
            <h1 className="mt-4 max-w-[20ch] text-display text-ink">Vind het antwoord op je vraag</h1>
            <p className="mt-5 max-w-[50ch] text-lead text-ink-soft">
              Over thuisonderwijs en de Examencommissie: kort uitgelegd, met de officiële bronnen erbij.
            </p>
            <div className="mt-9 w-full max-w-[640px]">
              <HeroSearch entries={searchIndex()} examples={examples} />
            </div>
          </div>
        </section>

        <Topics questions={questions} />
      </main>
      <PlatformCta href={onlineSchoolUrl("/", { campaign: "home" })} container="container-wide" />
    </>
  );
}
