/**
 * The topics on the home page, in this order. `name` must match the `category` of
 * the question files exactly. A topic without questions yet shows as "Binnenkort";
 * a category that is in the question files but not here is added at the end, with
 * the default icon.
 */

export type CategoryIcon = "book" | "calendar" | "diploma" | "exam" | "home" | "review";

export type Category = { name: string; icon: CategoryIcon; intro?: string };

export const CATEGORIES: Category[] = [
  { name: "Starten met thuisonderwijs", icon: "home", intro: "Wat je regelt als je kind thuis leert." },
  { name: "Leerplicht en toezicht", icon: "book", intro: "Wat de overheid verwacht van huisonderwijs." },
  { name: "Inschrijven bij de Examencommissie", icon: "calendar", intro: "Wanneer en hoe je je inschrijft voor examens." },
  { name: "Examens en vakfiches", icon: "exam", intro: "Hoe een examen verloopt en wat je moet kennen." },
  { name: "Inzage en punten", icon: "review", intro: "Je examen opnieuw bekijken en je score laten nakijken." },
  { name: "Diploma en getuigschriften", icon: "diploma", intro: "Wat je behaalt en wat je ermee kunt." },
];

/**
 * The topics above plus any other category in use, each with its questions. Topics
 * with questions come first, so the tiles start with something to click.
 */
export function topicsWithQuestions<Q extends { category: string }>(questions: Q[]) {
  const known = new Set(CATEGORIES.map((c) => c.name));
  const extra = [...new Set(questions.map((q) => q.category))]
    .filter((name) => !known.has(name))
    .map((name): Category => ({ name, icon: "book" }));
  return [...CATEGORIES, ...extra]
    .map((category) => ({ ...category, questions: questions.filter((q) => q.category === category.name) }))
    .sort((a, b) => Number(b.questions.length > 0) - Number(a.questions.length > 0));
}
