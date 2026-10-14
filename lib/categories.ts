/**
 * The topics on the home page, in this order. `name` must match the `category` of
 * the questions exactly. Only topics with questions are shown; a category that is
 * in use but not here is added at the end, without an intro.
 */

export type Category = { name: string; intro?: string };

export const CATEGORIES: Category[] = [
  { name: "Starten en keuzes", intro: "Is de Examencommissie iets voor jou, en in welke graad en richting begin je?" },
  { name: "Inschrijven, regels en diploma", intro: "Inschrijven, de regels en wat je behaalt." },
  { name: "Studiemateriaal en cursussen", intro: "Leerstof, vakfiches, cursussen en samenvattingen." },
  { name: "Examens per vak", intro: "Hoe het examen van elk vak eruitziet en hoe je je voorbereidt." },
  { name: "Examendata en resultaten", intro: "Examens plannen en wanneer je je punten krijgt." },
  { name: "Inzage en punten", intro: "Je examen opnieuw bekijken en je score laten nakijken." },
  { name: "Welzijn en motivatie", intro: "Omgaan met stress, faalangst en alleen studeren." },
  { name: "Hulp en contact", intro: "Bijles, studiegroepen, tweedehands boeken en de Examencommissie contacteren." },
];

/** The topics above plus any other category in use, each with its questions; empty ones left out. */
export function topicsWithQuestions<Q extends { category: string }>(questions: Q[]) {
  const known = new Set(CATEGORIES.map((c) => c.name));
  const extra = [...new Set(questions.map((q) => q.category))]
    .filter((name) => !known.has(name))
    .map((name): Category => ({ name }));
  return [...CATEGORIES, ...extra]
    .map((category) => ({ ...category, questions: questions.filter((q) => q.category === category.name) }))
    .filter((topic) => topic.questions.length > 0);
}
