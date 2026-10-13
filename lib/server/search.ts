/**
 * Full-text search over the question pages, with SQLite FTS5 (table question_search in
 * lib/server/db.ts, kept in step with the questions by lib/server/question-store.ts).
 */
import { searchTerms, type SearchResult } from "@/lib/search";
import { getDb } from "./db";

// How much a match counts per column (bm25): the question itself, then the summary
// (description, short answer, facts, section titles), then the full explanation.
// One weight per column of question_search, the UNINDEXED ones included.
const WEIGHTS = "0, 0, 0, 0, 10, 4, 1";

/** The questions matching the most words of the query, best first. */
export function searchQuestions(query: string, max = 6): SearchResult[] {
  // Each word as a quoted prefix, so "examen" finds "examencommissie" and the words
  // can't be read as FTS5 syntax (OR, NEAR, *, quotes…). searchTerms() leaves only
  // a-z and 0-9, the quotes are a second guard.
  const terms = searchTerms(query).slice(0, 8);
  if (!terms.length) return [];
  const match = terms.map((t) => `"${t.replaceAll('"', '""')}"*`).join(" OR ");

  const rows = getDb()
    .prepare(
      `SELECT slug, question, category, answer FROM question_search
       WHERE question_search MATCH ? ORDER BY bm25(question_search, ${WEIGHTS}) LIMIT ?`,
    )
    .all(match, max) as SearchResult[];
  return rows.map((r) => ({ ...r }));
}
