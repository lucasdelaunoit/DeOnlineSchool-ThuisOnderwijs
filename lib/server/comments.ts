"use server";
/**
 * Comments on a question page. The comment is saved (lib/server/reactions.ts) and shows
 * on the page at once. Editors delete one from its moderation link: `npm run reactions`.
 */
import { refresh } from "next/cache";
import { headers } from "next/headers";
import { clientIp, isEmpty, rateLimiter, textField } from "@/lib/server/mail";
import { getQuestion } from "@/lib/server/questions";
import { addReaction } from "@/lib/server/reactions";

export type CommentState = { ok: boolean; error?: "missing" | "rate" | "save"; values?: Record<string, string> };

/** Option values of the "Ik ben" select in components/question/comment-form.tsx. */
const ROLES = ["Leerling", "Ouder", "Begeleider of leerkracht"];

// At most 3 comments per 10 minutes per IP. The IP is only kept in memory, never saved.
const isLimited = rateLimiter(3, 10 * 60 * 1000);

export async function postComment(_previous: CommentState | null, form: FormData): Promise<CommentState> {
  const d = Object.fromEntries(form);
  const f = {
    slug: textField(d, "slug", 120),
    firstName: textField(d, "firstName", 80),
    role: textField(d, "role", 40),
    message: textField(d, "message", 3000),
  };

  // Honeypot: this hidden field must stay empty. Bots fill it in.
  if (!isEmpty(d.website)) return { ok: true };

  const question = await getQuestion(f.slug);
  if (!question || !f.firstName || /[\r\n]/.test(f.firstName) || !ROLES.includes(f.role) || !f.message) {
    return { ok: false, error: "missing", values: f };
  }
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
