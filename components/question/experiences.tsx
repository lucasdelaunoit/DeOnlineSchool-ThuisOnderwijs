import { connection } from "next/server";
import { Suspense } from "react";
import type { Question } from "@/lib/questions";
import { curatedExperiences, pageExperiences } from "@/lib/server/experiences";
import { CommentForm } from "./comment-form";
import { ExperienceBoard } from "./experience-board";

/**
 * The curated experiences and the ones visitors shared, as one set of cards with hearts
 * (components/question/experience-board.tsx), then the form to share one.
 */
export function Experiences({ q }: { q: Question }) {
  return (
    <section aria-labelledby="experiences" className="pt-12 pb-12 md:pt-24 md:pb-24">
      <div className="container-wide">
        {/* The curated cards are prerendered; shared ones and the likes are read per request. */}
        <Suspense fallback={<ExperienceBoard slug={q.slug} items={curatedExperiences(q)} />}>
          <LiveExperiences q={q} />
        </Suspense>
        <div className="reveal mt-10 rounded-panel border border-line bg-sheet p-6 md:p-8">
          <h3 className="text-h3 text-ink">Deel je ervaring</h3>
          <p className="mt-1 text-small text-muted">Ze verschijnt meteen hierboven, met je voornaam.</p>
          <div className="mt-5">
            <CommentForm slug={q.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}

async function LiveExperiences({ q }: { q: Question }) {
  await connection();
  return <ExperienceBoard slug={q.slug} items={pageExperiences(q)} />;
}
