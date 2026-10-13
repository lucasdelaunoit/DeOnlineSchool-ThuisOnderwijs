"use server";
/**
 * Comments on a question page. The comment is saved unapproved (lib/server/reactions.ts)
 * and mailed to the editors (MAIL_TO) with a link to approve or delete it. It shows on
 * the page once approved.
 */
import { headers } from "next/headers";
import { MAIL_TO, clientIp, isEmpty, rateLimiter, sendMail, textField, timestamp } from "@/lib/server/mail";
import { getQuestion } from "@/lib/server/questions";
import { addReaction, moderationToken } from "@/lib/server/reactions";
import { SITE_NAME } from "@/lib/site";

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
  const requestHeaders = await headers();
  if (isLimited(clientIp(requestHeaders))) return { ok: false, error: "rate", values: f };

  let id: number;
  try {
    id = addReaction({ slug: question.slug, firstName: f.firstName, role: f.role, message: f.message });
  } catch (e) {
    console.error("thuis-onderwijs comment: could not save", e);
    return { ok: false, error: "save", values: f };
  }

  const token = moderationToken(id);
  if (!token) console.error("thuis-onderwijs comment: MODERATION_SECRET not configured (at least 32 characters)");
  const link = token ? `${siteUrl(requestHeaders)}/moderation/${id}?token=${token}` : "(geen link: MODERATION_SECRET ontbreekt)";

  // Mail body in Dutch, for the editors. The reaction is saved, so a failed mail is
  // only logged (by sendMail): the editors can still find it in the database.
  await sendMail({
    source: "comment",
    fromName: SITE_NAME,
    to: MAIL_TO,
    subject: `Reactie van ${f.firstName} – ${question.title ?? question.question}`,
    text:
      "NIEUWE REACTIE OP EEN VRAAGPAGINA\n\n" +
      `Vraag: ${question.question}\n` +
      `Pagina: /questions/${question.slug}\n\n` +
      `Voornaam: ${f.firstName}\n` +
      `Is: ${f.role}\n\n` +
      `${f.message}\n\n` +
      `Ontvangen op: ${timestamp()}\n\n` +
      `Plaatsen of verwijderen: ${link}\n`,
  });
  return { ok: true };
}

/** SITE_URL, or else the address this request came in on. */
function siteUrl(requestHeaders: Headers) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const proto = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
