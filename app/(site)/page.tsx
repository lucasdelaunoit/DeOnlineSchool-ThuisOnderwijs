import type { Metadata, Viewport } from "next";
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

// The browser bar matches the hero, which the header sits on here.
export const viewport: Viewport = { themeColor: "#1f3a31" };

export default function HomePage() {
  const questions = getQuestions();
  const prompts = questions.slice(0, 6).map((q) => q.title ?? q.question);

  return (
    <>
      <main>
        {/* data-tone="forest" also turns the header forest (on-forest: in styles/site/theme.css). */}
        <section data-tone="forest" className="relative z-20 bg-forest text-white [--focus-ring:var(--color-white)]">
          <div className="container-wide flex flex-col items-center pt-16 pb-20 text-center md:pt-28 md:pb-32">
            <h1 className="rise max-w-[20ch] text-display">
              Je vragen over thuisonderwijs, <span className="text-green-light">helder beantwoord.</span>
            </h1>
            <p className="rise mt-6 max-w-[46ch] text-lead text-forest-fg [--i:1]">
              Over leerplicht, de Examencommissie en je diploma in Vlaanderen. Kort uitgelegd, met de officiële bronnen
              erbij.
            </p>
            <div className="rise mt-10 w-full max-w-[680px] text-left [--i:2] md:mt-12">
              <HeroSearch entries={searchIndex()} prompts={prompts} />
            </div>
          </div>
        </section>

        <Topics questions={questions} />
      </main>
      <PlatformCta href={onlineSchoolUrl("/", { campaign: "home" })} container="container-wide" />
    </>
  );
}
