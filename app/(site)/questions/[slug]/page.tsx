import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Comments } from "@/components/question/comments";
import { Experiences } from "@/components/question/experiences";
import { Explanation } from "@/components/question/explanation";
import { Intro } from "@/components/question/intro";
import { PlatformCta } from "@/components/question/platform-cta";
import { Related } from "@/components/question/related";
import { ShortAnswer } from "@/components/question/short-answer";
import { Sources } from "@/components/question/sources";
import { getQuestion, getQuestions, plainText } from "@/lib/questions";
import { onlineSchoolUrl } from "@/lib/site";

export function generateStaticParams() {
  return getQuestions().map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: PageProps<"/questions/[slug]">): Promise<Metadata> {
  const q = getQuestion((await params).slug);
  if (!q) return {};
  return {
    title: q.title ?? q.question,
    description: q.description,
    alternates: { canonical: `/questions/${q.slug}` },
    openGraph: { type: "article", title: q.question, description: q.description },
  };
}

export default async function QuestionPage({ params }: PageProps<"/questions/[slug]">) {
  const q = getQuestion((await params).slug);
  if (!q) notFound();

  const utm = { source: "faq", campaign: q.slug };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: plainText(q.shortAnswer) },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <main>
        <Intro q={q} />
        <ShortAnswer q={q} />
        <Explanation q={q} />
        <Sources q={q} />
        <Experiences q={q} />
        <Comments slug={q.slug} />
        <Related q={q} />
      </main>
      <PlatformCta href={onlineSchoolUrl("/", utm)} />
    </>
  );
}
