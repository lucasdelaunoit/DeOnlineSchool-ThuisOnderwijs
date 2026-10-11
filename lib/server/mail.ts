/**
 * Shared by the forms that send mail: podcast sign-ups (app/api/podcast-signup) and
 * comments on question pages (lib/server/comments.ts). Server only.
 */
import { Resend } from "resend";

/** Receives sign-ups and comments. */
export const MAIL_TO = process.env.MAIL_TO || "paulhenri@pauldepierre.com";
// Sender: must be on a domain verified in Resend (DKIM), otherwise Resend refuses it
// or it ends up in spam. de-online-school.be is verified.
const MAIL_FROM = process.env.MAIL_FROM || "noreply@de-online-school.be";
const TIME_ZONE = "Europe/Brussels";

/** Like PHP's empty(): "", "0", 0, false, null, undefined and empty arrays/objects. */
export function isEmpty(v: unknown) {
  if (v === undefined || v === null || v === false || v === 0 || v === "" || v === "0") return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.keys(v).length === 0;
  return false;
}

/** A trimmed text field, cut to `max` characters. */
export function textField(data: Record<string, unknown>, key: string, max = 300) {
  const raw = data[key];
  let v =
    typeof raw === "string" ? raw
    : typeof raw === "number" ? String(raw)
    : raw === true ? "1"
    : "";
  v = v.replace(/^[ \t\n\r\0\x0B]+|[ \t\n\r\0\x0B]+$/g, ""); // PHP trim()
  v = v.replace(/[\r\0]/g, "");
  return Array.from(v).slice(0, max).join(""); // per character, not per UTF-16 unit
}

/**
 * Simple rate limit: at most `max` attempts per `windowMs` per IP. Returns a function
 * that is true when the IP is over the limit. In memory, so per server process and
 * reset on restart.
 */
export function rateLimiter(max: number, windowMs: number) {
  const attempts = new Map<string, number[]>();
  return function isLimited(ip: string) {
    const now = Date.now();
    for (const [key, times] of attempts) {
      const recent = times.filter((t) => t > now - windowMs);
      if (recent.length) attempts.set(key, recent);
      else attempts.delete(key);
    }
    const times = attempts.get(ip) ?? [];
    if (times.length >= max) return true;
    times.push(now);
    attempts.set(ip, times);
    return false;
  };
}

export function clientIp(headers: Headers) {
  return (
    headers.get("cf-connecting-ip")?.trim() ||
    headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

/** Now as dd/mm/yyyy hh:mm in Brussels time, for the mail body. */
export function timestamp() {
  const parts = new Intl.DateTimeFormat("nl-BE", {
    timeZone: TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const p = (t: Intl.DateTimeFormatPartTypes) => parts.find((d) => d.type === t)?.value ?? "";
  return `${p("day")}/${p("month")}/${p("year")} ${p("hour")}:${p("minute")}`;
}

let resend: Resend | null = null;

/** Sends a plain-text mail via Resend. Failures are logged under `source` and return false. */
export async function sendMail({
  source,
  fromName,
  to,
  subject,
  text,
  replyTo,
}: {
  source: string;
  fromName: string;
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error(`thuis-onderwijs ${source}: RESEND_API_KEY not configured`);
    return false;
  }
  resend ??= new Resend(key);
  try {
    const { error } = await resend.emails.send({
      from: `${fromName} <${MAIL_FROM}>`,
      to,
      replyTo,
      subject,
      text,
    });
    if (error) {
      console.error(`thuis-onderwijs ${source}: ${error.name}: ${error.message}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`thuis-onderwijs ${source}:`, e);
    return false;
  }
}
