/**
 * Question search on the home page. Runs in the browser over a small index built
 * on the server (searchIndex() in lib/questions.ts), so it must not import Node APIs.
 */

export type SearchEntry = {
  slug: string;
  question: string;
  category: string;
  /** The short answer as plain text, shown under the result. */
  answer: string;
  /** Normalized question and title: a match here ranks higher. */
  head: string;
  /** Normalized description, short answer, section titles and facts. */
  body: string;
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

/**
 * Entries matching the most words of the query, best first. A word matches the
 * start of a word in the entry, so "examen" finds "examencommissie".
 */
export function search(entries: SearchEntry[], query: string, max = 6) {
  const terms = searchTerms(query);
  if (!terms.length) return [];

  return entries
    .map((entry) => {
      let score = 0;
      for (const term of terms) {
        const re = new RegExp(`(^| )${term}`);
        if (re.test(entry.head)) score += 3;
        else if (re.test(entry.body)) score += 1;
      }
      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.question.localeCompare(b.entry.question, "nl"))
    .slice(0, max)
    .map(({ entry }) => entry);
}
