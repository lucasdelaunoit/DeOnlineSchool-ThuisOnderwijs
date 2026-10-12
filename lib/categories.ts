/**
 * Home page tiles: an icon and a one-line intro per category. Keyed by the exact
 * `category` of the question files; a category missing here still gets a tile,
 * with the default icon and no intro.
 */

export type CategoryIcon = "book" | "calendar" | "diploma" | "exam" | "home" | "review";

export const CATEGORIES: Record<string, { icon: CategoryIcon; intro?: string }> = {
  "Inzage en punten": { icon: "review", intro: "Je examen opnieuw bekijken en je score laten nakijken." },
};

export function categoryMeta(category: string) {
  return CATEGORIES[category] ?? { icon: "book" as const };
}
