/**
 * Question pages (/questions/[slug]). One JSON file per question in content/questions/,
 * named after its slug.
 *
 * Text fields support two bits of inline markup:
 *   *italic*  → <em>
 *   [1]        → footnote link to source 1
 */
import fs from "node:fs";
import path from "node:path";

export type Block =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "note"; title?: string; text: string };

export type Question = {
  slug: string;
  /** The full question: the h1 and the FAQ structured data. */
  question: string;
  /** Shorter <title> for search results. Falls back to `question`. */
  title?: string;
  /** Meta description, ±150 characters. */
  description: string;
  /** Groups questions on /questions and in the breadcrumb. */
  category: string;
  /** Shown under the title, e.g. "Voor leerlingen en ouders". */
  audience?: string;
  /** ISO date (YYYY-MM-DD) the content and sources were last checked. */
  checkedOn: string;
  shortAnswer: string;
  /** Key figures shown as a strip above the explanation. */
  facts?: { label: string; value: string }[];
  sections: { title: string; blocks: Block[] }[];
  /** Numbered in order: the first is [1]. */
  sources: { text: string; url?: string }[];
  experiences?: { quote: string; name: string; role: string; context?: string }[];
  /** Slugs of other questions. Unknown slugs are skipped. */
  related?: string[];
};

const DIR = path.join(process.cwd(), "content", "questions");

let cache: Question[] | undefined;

/** All questions, sorted by category and then by question. */
export function getQuestions(): Question[] {
  cache ??= fs
    .readdirSync(DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => parse(file, fs.readFileSync(path.join(DIR, file), "utf8")))
    .sort((a, b) => a.category.localeCompare(b.category, "nl") || a.question.localeCompare(b.question, "nl"));
  return cache;
}

export function getQuestion(slug: string) {
  return getQuestions().find((q) => q.slug === slug);
}

/** The related questions that exist, or else others from the same category. */
export function getRelated(q: Question, max = 5) {
  const all = getQuestions();
  const listed = (q.related ?? []).flatMap((slug) => all.filter((other) => other.slug === slug));
  const related = listed.length ? listed : all.filter((other) => other.category === q.category && other.slug !== q.slug);
  return related.slice(0, max);
}

export function categoryId(category: string) {
  return category
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** "2026-10-10" → "10 oktober 2026" */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("nl-BE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}

/** Text without inline markup, for metadata and structured data. */
export function plainText(text: string) {
  return text
    .replace(/\s*\[\d+\]/g, "")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();
}

// Fails the build with the file name when a question file is incomplete.
function parse(file: string, raw: string): Question {
  const q = JSON.parse(raw) as Question;
  const fail = (problem: string) => {
    throw new Error(`content/questions/${file}: ${problem}`);
  };
  for (const key of ["slug", "question", "description", "category", "checkedOn", "shortAnswer"] as const) {
    if (typeof q[key] !== "string" || !q[key].trim()) fail(`"${key}" is missing`);
  }
  if (`${q.slug}.json` !== file) fail(`"slug" must match the file name`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(q.checkedOn)) fail(`"checkedOn" must be YYYY-MM-DD`);
  if (!Array.isArray(q.sections) || !q.sections.length) fail(`"sections" is missing`);
  if (!Array.isArray(q.sources)) fail(`"sources" is missing`);
  const texts = [q.shortAnswer, ...q.sections.flatMap((s) => s.blocks.flatMap((b) => ("items" in b ? b.items : [b.text])))];
  for (const [, n] of texts.join(" ").matchAll(/\[(\d+)\]/g)) {
    if (Number(n) < 1 || Number(n) > q.sources.length) fail(`cites [${n}] but has ${q.sources.length} sources`);
  }
  return q;
}
