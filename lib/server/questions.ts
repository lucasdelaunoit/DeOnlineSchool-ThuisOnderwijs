/**
 * The questions as the pages read them: from the database, cached and tagged
 * QUESTIONS_TAG. Pages are prerendered with them; after a change through
 * scripts/questions.ts, POST /api/revalidate refreshes them without a rebuild.
 */
import { cacheLife, cacheTag } from "next/cache";
import type { Question } from "@/lib/questions";
import { readQuestions } from "./question-store";

export const QUESTIONS_TAG = "questions";

/** All questions, sorted by category and then by question. */
export async function getQuestions(): Promise<Question[]> {
  "use cache";
  cacheLife("max");
  cacheTag(QUESTIONS_TAG);
  return readQuestions();
}

export async function getQuestion(slug: string) {
  return (await getQuestions()).find((q) => q.slug === slug);
}

/** The related questions that exist, or else others from the same category. */
export async function getRelated(q: Question, max = 5) {
  const all = await getQuestions();
  const listed = (q.related ?? []).flatMap((slug) => all.filter((other) => other.slug === slug));
  const related = listed.length ? listed : all.filter((other) => other.category === q.category && other.slug !== q.slug);
  return related.slice(0, max);
}
