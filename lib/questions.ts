/**
 * Question pages (/questions/[slug]): the Question type and helpers without I/O. The
 * questions are stored in the database (lib/server/questions.ts reads them,
 * scripts/questions.ts imports and exports them as JSON files of this shape).
 *
 * Text fields support two bits of inline markup:
 *   *italic*  → <em>
 *   [1]        → footnote link to source 1
 */
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

/**
 * Checks a question before it is saved: required fields, formats, and that every [n]
 * points to a source. Throws with `where` (e.g. the file name) and the problem.
 */
export function validateQuestion(q: Question, where: string): Question {
  const fail = (problem: string) => {
    throw new Error(`${where}: ${problem}`);
  };
  if (typeof q !== "object" || q === null) fail("not a question object");
  for (const key of ["slug", "question", "description", "category", "checkedOn", "shortAnswer"] as const) {
    if (typeof q[key] !== "string" || !q[key].trim()) fail(`"${key}" is missing`);
  }
  // The slug ends up in URLs and, on export, in a file name.
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(q.slug)) fail(`"slug" may only have a-z, 0-9 and single dashes`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(q.checkedOn)) fail(`"checkedOn" must be YYYY-MM-DD`);
  if (!Array.isArray(q.sections) || !q.sections.length) fail(`"sections" is missing`);
  if (!Array.isArray(q.sources)) fail(`"sources" is missing`);
  const texts = [q.shortAnswer, ...q.sections.flatMap((s) => s.blocks.flatMap((b) => ("items" in b ? b.items : [b.text])))];
  for (const [, n] of texts.join(" ").matchAll(/\[(\d+)\]/g)) {
    if (Number(n) < 1 || Number(n) > q.sources.length) fail(`cites [${n}] but has ${q.sources.length} sources`);
  }
  return q;
}
