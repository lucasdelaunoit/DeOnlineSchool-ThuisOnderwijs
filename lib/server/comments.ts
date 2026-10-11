"use server";
/**
 * Comments on a question page. Nothing is stored or shown right away: the comment is
 * mailed to the editors (MAIL_TO), who review it and add the useful ones as an
 * experience in content/questions/<slug>.json.
 */
import { headers } from "next/headers";
import { getQuestion } from "@/lib/questions";
import { MAIL_TO, clientIp, isEmpty, rateLimiter, sendMail, textField, timestamp } from "@/lib/server/mail";
import { SITE_NAME } from "@/lib/site";

export type CommentState = { ok: boolean; error?: "missing" | "rate" | "mail"; values?: Record<string, string> };

/** Option values of the "Ik ben" select in components/question/comment-form.tsx. */
const ROLES = ["Leerling", "Ouder", "Begeleider of leerkracht"];

// At most 3 comments per 10 minutes per IP.
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

  const question = getQuestion(f.slug);
  if (!question || !f.firstName || /[\r\n]/.test(f.firstName) || !ROLES.includes(f.role) || !f.message) {
    return { ok: false, error: "missing", values: f };
  }
  if (isLimited(clientIp(await headers()))) return { ok: false, error: "rate", values: f };

  // Mail body in Dutch, for the editors.
  const text =
    "NIEUWE REACTIE OP EEN VRAAGPAGINA\n\n" +
    `Vraag: ${question.question}\n` +
    `Pagina: /questions/${question.slug}\n\n` +
    `Voornaam: ${f.firstName}\n` +
    `Is: ${f.role}\n\n` +
    `${f.message}\n\n` +
    `Ontvangen op: ${timestamp()}\n`;

  const ok = await sendMail({
    source: "comment",
    fromName: SITE_NAME,
    to: MAIL_TO,
    subject: `Reactie van ${f.firstName} – ${question.title ?? question.question}`,
    text,
  });
  return ok ? { ok: true } : { ok: false, error: "mail", values: f };
}
