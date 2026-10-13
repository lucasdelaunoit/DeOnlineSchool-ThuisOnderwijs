/**
 * Reading and writing the questions table, and keeping the search index (question_search)
 * in step with it. Plain synchronous code without Next.js imports, so the CLI in
 * scripts/questions.ts can use it too. Pages read through lib/server/questions.ts,
 * which caches.
 */
import { plainText, validateQuestion, type Question } from "@/lib/questions";
import { getDb, transaction } from "./db";

type Row = {
  slug: string;
  question: string;
  title: string | null;
  description: string;
  category: string;
  audience: string | null;
  checked_on: string;
  short_answer: string;
  facts: string | null;
  sections: string;
  sources: string;
  experiences: string | null;
  related: string | null;
};

/** All questions, sorted by category and then by question. */
export function readQuestions(): Question[] {
  const rows = getDb().prepare("SELECT * FROM questions").all() as Row[];
  return rows
    .map(toQuestion)
    .sort((a, b) => a.category.localeCompare(b.category, "nl") || a.question.localeCompare(b.question, "nl"));
}

export function countQuestions() {
  return (getDb().prepare("SELECT count(*) AS n FROM questions").get() as { n: number }).n;
}

/**
 * Saves the questions (new or replacing the one with the same slug) after checking
 * each, and rebuilds the search index. All or nothing: one invalid question saves none.
 */
export function saveQuestions(questions: { question: Question; where: string }[]) {
  for (const { question, where } of questions) validateQuestion(question, where);
  const db = getDb();
  const upsert = db.prepare(
    `INSERT INTO questions (slug, question, title, description, category, audience, checked_on, short_answer,
       facts, sections, sources, experiences, related, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
     ON CONFLICT (slug) DO UPDATE SET
       question = excluded.question, title = excluded.title, description = excluded.description,
       category = excluded.category, audience = excluded.audience, checked_on = excluded.checked_on,
       short_answer = excluded.short_answer, facts = excluded.facts, sections = excluded.sections,
       sources = excluded.sources, experiences = excluded.experiences, related = excluded.related,
       updated_at = excluded.updated_at`,
  );
  transaction(db, () => {
    for (const { question: q } of questions) {
      upsert.run(
        q.slug,
        q.question,
        q.title ?? null,
        q.description,
        q.category,
        q.audience ?? null,
        q.checkedOn,
        q.shortAnswer,
        json(q.facts),
        JSON.stringify(q.sections),
        JSON.stringify(q.sources),
        json(q.experiences),
        json(q.related),
      );
    }
    reindex();
  });
}

/** Deletes a question; true if it existed. Its reactions stay in the reactions table. */
export function deleteQuestion(slug: string) {
  const db = getDb();
  return transaction(db, () => {
    const { changes } = db.prepare("DELETE FROM questions WHERE slug = ?").run(slug);
    reindex();
    return changes > 0;
  });
}

// Rebuilds question_search from the questions table. Cheap at this size, and simpler
// than updating single rows. Runs inside the caller's transaction.
function reindex() {
  const db = getDb();
  const insert = db.prepare(
    "INSERT INTO question_search (slug, question, category, answer, head, summary, body) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );
  db.exec("DELETE FROM question_search");
  for (const q of readQuestions()) {
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
}

function bodyText(q: Question) {
  return q.sections
    .flatMap((s) => s.blocks.flatMap((b) => (b.type === "list" ? b.items : [b.type === "note" ? `${b.title ?? ""} ${b.text}` : b.text])))
    .map(plainText)
    .join("\n");
}

function json(value: unknown[] | undefined) {
  return value === undefined ? null : JSON.stringify(value);
}

// Same key order as the Question type, so exported files diff cleanly. Optional fields
// are left out when NULL, so a question reads back exactly as it was imported (and the
// result is a plain object, as cached functions require).
function toQuestion(row: Row): Question {
  const parse = (value: string | null) => (value === null ? undefined : JSON.parse(value));
  const q = {
    slug: row.slug,
    question: row.question,
    title: row.title ?? undefined,
    description: row.description,
    category: row.category,
    audience: row.audience ?? undefined,
    checkedOn: row.checked_on,
    shortAnswer: row.short_answer,
    facts: parse(row.facts),
    sections: JSON.parse(row.sections),
    sources: JSON.parse(row.sources),
    experiences: parse(row.experiences),
    related: parse(row.related),
  };
  return Object.fromEntries(Object.entries(q).filter(([, v]) => v !== undefined)) as Question;
}
