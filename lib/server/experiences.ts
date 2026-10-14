/**
 * The cards under "Ervaringen" on a question page: the curated experiences from the
 * question file plus the reactions visitors posted (lib/server/reactions.ts), and the
 * hearts on them (table likes in lib/server/db.ts).
 *
 * Not a "use server" file on purpose, like reactions.ts: the like action is in comments.ts.
 */
import { createHash } from "node:crypto";
import { formatDate, type Question } from "@/lib/questions";
import { getDb } from "./db";
import { approvedReactions } from "./reactions";

export type ExperienceItem = {
  /** Unique on its page, stable across edits elsewhere: "r<id>" or "q<hash>". */
  key: string;
  quote: string;
  name: string;
  role: string;
  context?: string;
  /** Reactions only: when it was posted. */
  date?: { iso: string; label: string };
  /** Undefined until read from the database (the prerendered cards). */
  likes?: number;
};

/** The curated experiences, in file order, without likes: safe to prerender. */
export function curatedExperiences(q: Question): ExperienceItem[] {
  return (q.experiences ?? []).map((e) => ({
    key: `q${createHash("sha256").update(e.quote).digest("base64url").slice(0, 10)}`,
    quote: e.quote,
    name: e.name,
    role: e.role,
    context: e.context,
  }));
}

/**
 * All cards on a question, with their likes, newest first: reactions from the latest
 * down, then the curated ones (they have no date, so they count as the oldest).
 */
export function pageExperiences(q: Question): ExperienceItem[] {
  const reactions: ExperienceItem[] = approvedReactions(q.slug)
    .reverse()
    .map((r) => ({
      key: `r${r.id}`,
      quote: r.message,
      name: r.firstName,
      role: r.role,
      date: { iso: r.createdAt, label: formatDate(r.day) },
    }));
  const likes = likeCounts(q.slug);
  return [...reactions, ...curatedExperiences(q)].map((e) => ({ ...e, likes: likes.get(e.key) ?? 0 }));
}

function likeCounts(slug: string) {
  const rows = getDb().prepare("SELECT item, count FROM likes WHERE slug = ?").all(slug) as {
    item: string;
    count: number;
  }[];
  return new Map(rows.map((r) => [r.item, r.count]));
}

/** Adds or takes back one heart; never below 0. Returns the new count. */
export function changeLikes(slug: string, item: string, delta: 1 | -1) {
  const row = getDb()
    .prepare(
      `INSERT INTO likes (slug, item, count) VALUES (?, ?, max(?, 0))
       ON CONFLICT (slug, item) DO UPDATE SET count = max(count + ?, 0)
       RETURNING count`,
    )
    .get(slug, item, delta, delta) as { count: number };
  return row.count;
}
