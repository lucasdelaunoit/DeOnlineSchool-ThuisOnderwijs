/**
 * Full-text search over the question pages, with SQLite FTS5 (table question_search in
 * lib/server/db.ts). The JSON files in content/questions/ stay the source: the index
 * is rebuilt from them the first time this server process searches.
 */
import { getQuestions, plainText, type Question } from "@/lib/questions";
import { searchTerms, type SearchResult } from "@/lib/search";
import { getDb, transaction } from "./db";

// How much a match counts per column (bm25): the question itself, then the summary
// (description, short answer, facts, section titles), then the full explanation.
// One weight per column of question_search, the UNINDEXED ones included.
const WEIGHTS = "0, 0, 0, 0, 10, 4, 1";

let indexed = false;

/** The questions matching the most words of the query, best first. */
export function searchQuestions(query: string, max = 6): SearchResult[] {
  // Each word as a quoted prefix, so "examen" finds "examencommissie" and the words
  // can't be read as FTS5 syntax (OR, NEAR, *, quotes…). searchTerms() leaves only
  // a-z and 0-9, the quotes are a second guard.
  const terms = searchTerms(query).slice(0, 8);
  if (!terms.length) return [];
  const match = terms.map((t) => `"${t.replaceAll('"', '""')}"*`).join(" OR ");

  const db = getDb();
  if (!indexed) {
    reindex();
    indexed = true;
  }
  return db
    .prepare(
      `SELECT slug, question, category, answer FROM question_search
       WHERE question_search MATCH ? ORDER BY bm25(question_search, ${WEIGHTS}) LIMIT ?`,
    )
    .all(match, max) as SearchResult[];
}

function reindex() {
  const db = getDb();
  const insert = db.prepare(
    "INSERT INTO question_search (slug, question, category, answer, head, summary, body) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );
  transaction(db, () => {
    db.exec("DELETE FROM question_search");
    for (const q of getQuestions()) {
      insert.run(
        q.slug,
        q.question,
        q.category,
        plainText(q.shortAnswer),
        `${q.question} ${q.title ?? ""}`,
        [
          q.category,
          q.description,
          plainText(q.shortAnswer),
          ...q.sections.map((s) => s.title),
          ...(q.facts ?? []).map((f) => `${f.label} ${f.value}`),
        ].join("\n"),
        bodyText(q),
      );
    }
  });
}

function bodyText(q: Question) {
  return q.sections
    .flatMap((s) => s.blocks.flatMap((b) => (b.type === "list" ? b.items : [b.type === "note" ? `${b.title ?? ""} ${b.text}` : b.text])))
    .map(plainText)
    .join("\n");
}
