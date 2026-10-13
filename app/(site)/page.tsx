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
  // Chips: topics that have questions, so every chip finds something.
  const examples = [...new Set(questions.map((q) => q.category))].slice(0, 4);
  const prompts = questions.slice(0, 6).map((q) => q.title ?? q.question);

  return (
    <>
      <main>
        <section className="relative bg-forest text-white [--focus-ring:var(--color-white)]">
          <Bubbles />
          <div className="relative container-wide flex flex-col items-center pt-16 pb-40 text-center md:pt-24 md:pb-44">
            <p className="eyebrow text-green-light">Thuisonderwijs en de Examencommissie in Vlaanderen</p>
            <h1 className="mt-5 max-w-[16ch] text-display">
              Vind het{" "}
              <span className="relative inline-block">
                antwoord
                <Underline />
              </span>{" "}
              op je vraag
            </h1>
            <p className="mt-6 max-w-[46ch] text-lead text-white/75">
              Kort en duidelijk uitgelegd, met de officiële bronnen erbij.
            </p>
            <div className="mt-10 w-full max-w-[680px]">
              <HeroSearch entries={searchIndex()} examples={examples} prompts={prompts} />
            </div>
          </div>
        </section>

        <Topics questions={questions} />
      </main>
      <PlatformCta href={onlineSchoolUrl("/", { campaign: "home" })} container="container-wide" />
    </>
  );
}

/** Hand-drawn stroke under a word of the title. */
function Underline() {
  return (
    <svg
      className="absolute -bottom-[0.12em] left-0 h-[0.22em] w-full text-green-light"
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 8.5C40 3.5 120 1.5 198 6" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Two outlined speech bubbles in the corners of the hero: questions and answers.
 * Clipped here rather than on the hero, so the search results can hang below it.
 */
function Bubbles() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full overflow-hidden text-white/[0.07]"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1440 640"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M-60 120h300a40 40 0 0 1 40 40v150a40 40 0 0 1-40 40H90l-70 60v-60h-80z" />
      <text x="110" y="295" fill="currentColor" stroke="none" fontSize="150" fontWeight="700" fontFamily="var(--font-display)">
        ?
      </text>
      <path d="M1160 330h320v190h-90v60l-70-60h-160a40 40 0 0 1-40-40v-110a40 40 0 0 1 40-40z" />
      <path d="M1200 400h180M1200 440h120" strokeLinecap="round" strokeWidth="6" />
    </svg>
  );
}
