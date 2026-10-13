/**
 * Shared by the home page search box (in the browser) and the search index on the
 * server (lib/server/search.ts), so it must not import Node APIs.
 */

/** One search result, as /api/search returns it. */
export type SearchResult = {
  slug: string;
  question: string;
  category: string;
  /** The short answer as plain text, shown under the result. */
  answer: string;
};

// Words that say nothing about the subject, so "wat is een inzage" searches for "inzage".
const STOPWORDS = new Set(
  "aan als bij dat de die dit een en er hoe het hoeveel ik in is je kan kun kunnen mag met moet na naar niet of om op te tot van voor waar wanneer wat welke wie wij zijn".split(
    " ",
  ),
);

/** Lowercase, without accents or punctuation: "Één examen?" → "een examen" */
export function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** The words of a query that count: without stopwords, unless that leaves nothing. */
export function searchTerms(query: string) {
  const words = normalize(query).split(" ").filter(Boolean);
  const terms = words.filter((w) => !STOPWORDS.has(w));
  return terms.length ? terms : words;
}
