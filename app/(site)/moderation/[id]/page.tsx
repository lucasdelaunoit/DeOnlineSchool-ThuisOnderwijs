import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/questions";
import { moderateReaction } from "@/lib/server/moderation";
import { getQuestion } from "@/lib/server/questions";
import { getReaction, isValidModerationToken } from "@/lib/server/reactions";

// Opened from a link that `npm run reactions` lists (scripts/reactions.ts).
// Without the right token for this id it is a 404.

export const metadata: Metadata = {
  title: "Reactie modereren",
  robots: { index: false, follow: false },
  // The token is in the URL: don't pass it on to other sites.
  referrer: "no-referrer",
};

// Rendered per request, nothing to prerender: only editors open it.
export const instant = false;

export default function ModerationPage(props: PageProps<"/moderation/[id]">) {
  return (
    <main className="container-text py-16 md:py-24">
      <Moderation {...props} />
    </main>
  );
}

async function Moderation({ params, searchParams }: PageProps<"/moderation/[id]">) {
  const id = Number((await params).id);
  const { token, done } = await searchParams;
  if (!Number.isSafeInteger(id) || !isValidModerationToken(id, token)) notFound();

  const r = getReaction(id);
  if (!r) {
    return (
      <>
        <h1 className="text-h2">Reactie verwijderd</h1>
        <p className="mt-3 text-ink-soft">
          {done === "delete" ? "De reactie is verwijderd." : "Deze reactie bestaat niet meer."}
        </p>
      </>
    );
  }

  const q = await getQuestion(r.slug);
  return (
    <>
      <h1 className="text-h2">Reactie modereren</h1>
      <p className="mt-3 text-small text-muted">
        Op{" "}
        <Link href={`/questions/${r.slug}`} className="font-medium">
          {q?.question ?? r.slug}
        </Link>
      </p>

      {done === "approve" && (
        <p role="status" className="mt-6 rounded-card bg-mint px-5 py-4 text-ink">
          De reactie staat nu op de pagina.
        </p>
      )}

      <div className="mt-8 border-t border-line pt-5">
        <p className="text-small text-muted">
          <span className="font-medium text-ink">{r.firstName}</span>, {r.role.toLowerCase()} ·{" "}
          <time dateTime={r.createdAt}>{formatDate(r.day)}</time> ·{" "}
          {r.approved ? "geplaatst" : "nog niet geplaatst"}
        </p>
        <p className="mt-2 whitespace-pre-line text-ink-soft">{r.message}</p>
      </div>

      <form action={moderateReaction} className="mt-8 flex flex-wrap gap-3">
        <input type="hidden" name="id" value={r.id} />
        <input type="hidden" name="token" value={String(token)} />
        {!r.approved && (
          <button type="submit" name="decision" value="approve" className="btn btn-primary px-6">
            Plaatsen
          </button>
        )}
        <button type="submit" name="decision" value="delete" className="btn btn-light px-6">
          Verwijderen
        </button>
      </form>
      <p className="mt-3 text-small text-muted">Verwijderen is definitief.</p>
    </>
  );
}
