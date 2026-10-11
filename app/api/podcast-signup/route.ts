/**
 * De Thuisschool Podcast – handles the sign-up form (public/js/main.js posts here).
 * Mails the sign-up to MAIL_TO and a confirmation to the parent, via Resend.
 * Port of the former send.php. Nothing is stored.
 */
import { MAIL_TO, clientIp, isEmpty, rateLimiter, sendMail, textField, timestamp } from "@/lib/server/mail";

// ===== SETTINGS =====
// Recipient, sender and Resend key: see lib/server/mail.ts and .env.example.
const FROM_NAME = "De Thuisschool Podcast";
const SEND_CONFIRMATION = true; // confirmation mail to the parent
// ====================

function reply(ok: boolean, error = "", status = 200) {
  return Response.json({ ok, error }, { status, headers: { "X-Content-Type-Options": "nosniff" } });
}

// At most 5 sign-ups per 10 minutes per IP.
const isLimited = rateLimiter(5, 10 * 60 * 1000);

// Ordinary addresses as accepted by PHP's FILTER_VALIDATE_EMAIL (without quoted local
// parts and IP addresses as domain, which no parent uses).
const ATOM = "[!#-'*+\\-/-9=?^-~]+";
const EMAIL_RE = new RegExp(
  `^${ATOM}(?:\\.${ATOM})*@` +
    "(?:(?:xn--)?[a-z0-9]+(?:-+[a-z0-9]+)*\\.)+(?:[a-z][a-z0-9]*|xn--[a-z0-9]+)(?:-+[a-z0-9]+)*$",
  "i",
);
function isValidEmail(e: string) {
  const [local, domain] = [e.slice(0, e.lastIndexOf("@")), e.slice(e.lastIndexOf("@") + 1)];
  return (
    e.length <= 254 &&
    local.length <= 64 &&
    domain.split(".").every((label) => label.length < 64) &&
    EMAIL_RE.test(e)
  );
}

function send(to: string, subject: string, text: string, replyTo?: string) {
  return sendMail({ source: "/api/podcast-signup", fromName: FROM_NAME, to, subject, text, replyTo });
}

export async function POST(request: Request) {
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return reply(false, "invalid", 400);
  }
  if (typeof data !== "object" || data === null) return reply(false, "invalid", 400);
  const d = data as Record<string, unknown>;

  // Honeypot: this hidden field must stay empty. Bots fill it in.
  if (!isEmpty(d.website)) return reply(true);

  if (isLimited(clientIp(request.headers))) return reply(false, "rate", 429);

  const f = {
    firstName: textField(d, "firstName", 80),
    age: textField(d, "age", 3),
    town: textField(d, "town", 80),
    since: textField(d, "since", 40),
    guests: textField(d, "guests", 80),
    secondGuest: textField(d, "secondGuest", 120),
    topics: textField(d, "topics", 400),
    story: textField(d, "story", 3000),
    parent: textField(d, "parent", 120),
    phone: textField(d, "phone", 40),
    email: textField(d, "email", 160),
  };
  const consented = !isEmpty(d.consent1) && !isEmpty(d.consent2) && !isEmpty(d.consent3);

  for (const k of ["firstName", "age", "town", "since", "parent", "phone", "email"] as const) {
    if (f[k] === "") return reply(false, "missing:" + k, 422);
  }
  if (!isValidEmail(f.email)) return reply(false, "email", 422);
  if (!consented) return reply(false, "consent", 422);
  // No line breaks in fields that end up in mail headers
  for (const k of ["firstName", "email", "parent"] as const) {
    if (/[\r\n]/.test(f[k])) return reply(false, "invalid", 400);
  }

  // Mail body in Dutch: it is read by the hosts and the parent.
  const text =
    "INSCHRIJVING DE THUISSCHOOL PODCAST\n\n" +
    `Voornaam: ${f.firstName}\n` +
    `Leeftijd: ${f.age}\n` +
    `Woonplaats: ${f.town}\n` +
    `Thuisonderwijs sinds: ${f.since}\n` +
    `Komt: ${f.guests}` + (f.secondGuest !== "" ? ` (${f.secondGuest})` : "") + "\n" +
    "Wil praten over: " + (isEmpty(f.topics) ? "-" : f.topics) + "\n" +
    "Over mezelf: " + (isEmpty(f.story) ? "-" : f.story) + "\n\n" +
    `Ouder: ${f.parent}\n` +
    `Gsm: ${f.phone}\n` +
    `E-mail: ${f.email}\n\n` +
    "Toestemming deelname: ja\n" +
    "Toestemming publicatie geluid, beeld en foto's op alle kanalen: ja\n" +
    "Algemene voorwaarden en privacyverklaring (versie 7 oktober 2026): gelezen en aanvaard\n" +
    `Ontvangen op: ${timestamp()}\n`;

  const ok = await send(MAIL_TO, "Inschrijving De Thuisschool Podcast - " + f.firstName, text, f.email);
  if (!ok) return reply(false, "mail", 500);

  if (SEND_CONFIRMATION) {
    const confirmation =
      `Dag ${f.parent},\n\n` +
      `Bedankt! We hebben de inschrijving van ${f.firstName} voor De Thuisschool Podcast goed ontvangen.\n` +
      "We nemen binnenkort contact met je op om een datum af te spreken voor de opname in de Podcastcontainer in Maarkedal.\n\n" +
      "Vragen? Stuur een WhatsApp-bericht naar Emile-Henri: +32 484 56 23 87.\n\n" +
      "Tot snel aan de micro!\nEmile-Henri & Juliette\n\n" +
      "---\nDit heb je ingevuld:\n\n" + text;
    // As in send.php: the sign-up is already in, so a failed confirmation is only
    // logged (in sendMail) and doesn't show an error to the parent.
    await send(f.email, "We hebben je inschrijving ontvangen – De Thuisschool Podcast", confirmation, MAIL_TO);
  }

  return reply(true);
}
