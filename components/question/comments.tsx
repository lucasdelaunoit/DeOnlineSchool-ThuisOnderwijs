import { connection } from "next/server";
import { Suspense } from "react";
import { formatDate } from "@/lib/questions";
import { approvedReactions } from "@/lib/server/reactions";
import { CommentForm } from "./comment-form";

export function Comments({ slug }: { slug: string }) {
  return (
    <section aria-labelledby="comment" className="pb-16 md:pb-24">
      <div className="container-wide">
        <div className="section-rule">
          <h2 id="comment" className="section-title">
            Reageren
          </h2>
          <p className="section-intro">Deel je ervaring of stel een vraag. We bekijken elke reactie voor ze verschijnt.</p>
          {/* Read per request, so an approved reaction shows right away. */}
          <Suspense>
            <Reactions slug={slug} />
          </Suspense>
          <div className="reveal mt-6">
            <CommentForm slug={slug} />
          </div>
        </div>
      </div>
    </section>
  );
}

async function Reactions({ slug }: { slug: string }) {
  await connection();
  const reactions = approvedReactions(slug);
  if (!reactions.length) return null;
  return (
    <ol aria-label="Reacties" className="mt-8 mb-10 flex max-w-[760px] flex-col gap-7">
      {reactions.map((r) => (
        <li key={r.id} className="border-t border-line pt-5">
          <p className="text-small text-muted">
            <span className="font-medium text-ink">{r.firstName}</span>, {r.role.toLowerCase()} ·{" "}
            <time dateTime={r.createdAt}>{formatDate(r.day)}</time>
          </p>
          <p className="mt-2 text-body whitespace-pre-line text-ink-soft">{r.message}</p>
        </li>
      ))}
    </ol>
  );
}
