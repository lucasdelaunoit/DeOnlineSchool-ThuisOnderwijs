import { connection } from "next/server";
import { Suspense } from "react";
import { formatDate } from "@/lib/questions";
import { approvedReactions, type Reaction } from "@/lib/server/reactions";
import { CommentForm } from "./comment-form";

/** The reactions as cards, then the form in its own panel. */
export function Comments({ slug }: { slug: string }) {
  return (
    <section aria-labelledby="comment" className="pb-12 md:pb-24">
      <div className="container-wide">
        <div className="section-rule">
          <h2 id="comment" className="section-title">
            Reageren
          </h2>
          <p className="section-intro">Deel je ervaring of stel een vraag aan andere leerlingen en ouders.</p>
          {/* Read per request, so a new reaction shows right away. */}
          <Suspense>
            <Reactions slug={slug} />
          </Suspense>
          <div className="reveal mt-8 max-w-[760px] rounded-panel border border-line bg-sheet p-6 md:p-8">
            <h3 className="text-h3 text-ink">Schrijf een reactie</h3>
            <div className="mt-5">
              <CommentForm slug={slug} />
            </div>
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
    <div className="mt-8 max-w-[760px]">
      <p className="text-meta font-medium tracking-wide text-muted uppercase">
        {reactions.length === 1 ? "1 reactie" : `${reactions.length} reacties`}
      </p>
      <ol aria-label="Reacties" className="mt-3 flex flex-col gap-3">
        {reactions.map((r) => (
          <ReactionCard key={r.id} r={r} />
        ))}
      </ol>
    </div>
  );
}

function ReactionCard({ r }: { r: Reaction }) {
  return (
    <li className="rounded-quote border border-line bg-white p-5 shadow-card md:p-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-mint font-semibold text-green"
        >
          {Array.from(r.firstName)[0]?.toUpperCase()}
        </span>
        <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="font-semibold text-ink">{r.firstName}</span>
          <span className="rounded-full bg-sand px-2.5 py-0.5 text-meta text-ink-soft">{r.role}</span>
          <time dateTime={r.createdAt} className="text-meta text-muted">
            {formatDate(r.day)}
          </time>
        </div>
      </div>
      <p className="mt-3 text-body break-words whitespace-pre-line text-ink-soft md:pl-13">{r.message}</p>
    </li>
  );
}
