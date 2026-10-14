"use server";
/**
 * The actions under "Ervaringen" on a question page. A shared experience is saved as a
 * reaction (lib/server/reactions.ts) and shows among the cards at once. Editors delete one
 * from its moderation link: `npm run reactions`. Hearts are in lib/server/experiences.ts.
 */
import { refresh } from "next/cache";
import { headers } from "next/headers";
import { EXPERIENCE_LENGTH } from "@/lib/questions";
import { clientIp, isEmpty, rateLimiter, textField } from "@/lib/server/mail";
import { changeLikes, pageExperiences } from "@/lib/server/experiences";
import { getQuestion } from "@/lib/server/questions";
import { addReaction } from "@/lib/server/reactions";

export type CommentState = { ok: boolean; error?: "missing" | "short" | "long" | "rate" | "save"; values?: Record<string, string> };

/** Option values of the "Ik ben" select in components/question/comment-form.tsx. */
const ROLES = ["Leerling", "Ouder", "Begeleider of leerkracht"];

// At most 3 comments and 60 hearts per 10 minutes per IP. The IP is only kept in memory, never saved.
const isLimited = rateLimiter(3, 10 * 60 * 1000);
const isLikeLimited = rateLimiter(60, 10 * 60 * 1000);

export async function postComment(_previous: CommentState | null, form: FormData): Promise<CommentState> {
  const d = Object.fromEntries(form);
  const f = {
    slug: textField(d, "slug", 120),
    firstName: textField(d, "firstName", 80),
    role: textField(d, "role", 40),
    // One over the max, so a longer message is refused instead of cut off.
    message: textField(d, "message", EXPERIENCE_LENGTH.max + 1),
  };

  // Honeypot: this hidden field must stay empty. Bots fill it in.
  if (!isEmpty(d.website)) return { ok: true };

  const question = await getQuestion(f.slug);
  if (!question || !f.firstName || /[\r\n]/.test(f.firstName) || !ROLES.includes(f.role) || !f.message) {
    return { ok: false, error: "missing", values: f };
  }
  const length = Array.from(f.message).length;
  if (length < EXPERIENCE_LENGTH.min) return { ok: false, error: "short", values: f };
  if (length > EXPERIENCE_LENGTH.max) return { ok: false, error: "long", values: f };
  if (isLimited(clientIp(await headers()))) return { ok: false, error: "rate", values: f };

  try {
    addReaction({ slug: question.slug, firstName: f.firstName, role: f.role, message: f.message });
  } catch (e) {
    console.error("thuis-onderwijs comment: could not save", e);
    return { ok: false, error: "save", values: f };
  }

  // The page shows the new reaction without a reload.
  refresh();
  return { ok: true };
}

/**
 * A heart on an experience card, or taking it back. The browser remembers which cards it
 * liked; there are no accounts, so this only keeps people from liking by accident twice.
 * Returns the new count, or null when refused. No refresh(): the cards keep their order.
 */
export async function likeExperience(slug: unknown, item: unknown, liked: unknown): Promise<number | null> {
  if (typeof slug !== "string" || typeof item !== "string" || typeof liked !== "boolean") return null;
  const question = await getQuestion(slug);
  if (!question || !pageExperiences(question).some((e) => e.key === item)) return null;
  if (isLikeLimited(clientIp(await headers()))) return null;
  return changeLikes(question.slug, item, liked ? 1 : -1);
}
