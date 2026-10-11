/**
 * De Thuisschool Podcast – verwerkt het inschrijvingsformulier.
 * Stuurt de inschrijving naar MAIL_TO en een bevestiging naar de ouder, via Resend.
 * Port van de vroegere send.php. Er wordt niets opgeslagen.
 */
import { Resend } from "resend";

// ===== INSTELLINGEN =====
// Afzender: moet op een domein staan dat in Resend geverifieerd is (DKIM), anders weigert
// Resend of belandt de mail in spam. de-online-school.be is geverifieerd.
const ONTVANGER = process.env.MAIL_TO || "paulhenri@pauldepierre.com";
const AFZENDER = process.env.MAIL_FROM || "noreply@de-online-school.be";
const AFZENDER_NM = "De Thuisschool Podcast";
const BEVESTIGING = true; // bevestigingsmail naar de ouder sturen
const TIJDZONE = "Europe/Brussels";
// =========================

function antwoord(ok: boolean, fout = "", code = 200) {
  return Response.json(
    { ok, error: fout },
    { status: code, headers: { "X-Content-Type-Options": "nosniff" } },
  );
}

// PHP's empty(): "", "0", 0, false, null, ontbrekend en lege arrays tellen als leeg.
function leeg(v: unknown) {
  if (v === undefined || v === null || v === false || v === 0 || v === "" || v === "0") return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.keys(v).length === 0;
  return false;
}

// Eenvoudige snelheidsbeperking: max. 5 inschrijvingen per 10 minuten per IP.
// In het geheugen, dus per serverproces en weg bij een herstart.
const VENSTER_MS = 10 * 60 * 1000;
const MAX_PER_VENSTER = 5;
const pogingen = new Map<string, number[]>();

function teVeel(ip: string) {
  const nu = Date.now();
  for (const [k, tijden] of pogingen) {
    const recent = tijden.filter((t) => t > nu - VENSTER_MS);
    if (recent.length) pogingen.set(k, recent);
    else pogingen.delete(k);
  }
  const tijden = pogingen.get(ip) ?? [];
  if (tijden.length >= MAX_PER_VENSTER) return true;
  tijden.push(nu);
  pogingen.set(ip, tijden);
  return false;
}

function clientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "onbekend"
  );
}

function veld(d: Record<string, unknown>, k: string, max = 300) {
  const ruw = d[k];
  let v =
    typeof ruw === "string" ? ruw
    : typeof ruw === "number" ? String(ruw)
    : ruw === true ? "1"
    : "";
  v = v.replace(/^[ \t\n\r\0\x0B]+|[ \t\n\r\0\x0B]+$/g, ""); // PHP trim()
  v = v.replace(/[\r\0]/g, "");
  return Array.from(v).slice(0, max).join(""); // mb_substr: per teken, niet per UTF-16-eenheid
}

// Gewone adressen zoals PHP's FILTER_VALIDATE_EMAIL ze aanvaardt (zonder quoted local
// parts en IP-adressen als domein, die gebruikt geen ouder).
const ATOOM = "[!#-'*+\\-/-9=?^-~]+";
const EMAIL_RE = new RegExp(
  `^${ATOOM}(?:\\.${ATOOM})*@` +
    "(?:(?:xn--)?[a-z0-9]+(?:-+[a-z0-9]+)*\\.)+(?:[a-z][a-z0-9]*|xn--[a-z0-9]+)(?:-+[a-z0-9]+)*$",
  "i",
);
function geldigEmail(e: string) {
  const [lokaal, domein] = [e.slice(0, e.lastIndexOf("@")), e.slice(e.lastIndexOf("@") + 1)];
  return (
    e.length <= 254 &&
    lokaal.length <= 64 &&
    domein.split(".").every((l) => l.length < 64) &&
    EMAIL_RE.test(e)
  );
}

// date('d/m/Y H:i') in Europe/Brussels
function tijdstip() {
  const delen = new Intl.DateTimeFormat("nl-BE", {
    timeZone: TIJDZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const p = (t: Intl.DateTimeFormatPartTypes) => delen.find((d) => d.type === t)?.value ?? "";
  return `${p("day")}/${p("month")}/${p("year")} ${p("hour")}:${p("minute")}`;
}

let resend: Resend | null = null;

async function stuur(aan: string, onderwerp: string, body: string, replyTo?: string) {
  const sleutel = process.env.RESEND_API_KEY;
  if (!sleutel) {
    console.error("thuis-onderwijs /api/inschrijven: RESEND_API_KEY not configured");
    return false;
  }
  resend ??= new Resend(sleutel);
  try {
    const { error } = await resend.emails.send({
      from: `${AFZENDER_NM} <${AFZENDER}>`,
      to: aan,
      replyTo,
      subject: onderwerp,
      text: body,
    });
    if (error) {
      console.error(`thuis-onderwijs /api/inschrijven: ${error.name}: ${error.message}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error("thuis-onderwijs /api/inschrijven:", e);
    return false;
  }
}

export async function POST(request: Request) {
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return antwoord(false, "invalid", 400);
  }
  if (typeof data !== "object" || data === null) return antwoord(false, "invalid", 400);
  const d = data as Record<string, unknown>;

  // Spamval: dit verborgen veld moet leeg zijn. Bots vullen het in.
  if (!leeg(d.website)) return antwoord(true);

  if (teVeel(clientIp(request))) return antwoord(false, "rate", 429);

  const f = {
    voornaam: veld(d, "voornaam", 80),
    leeftijd: veld(d, "leeftijd", 3),
    woonplaats: veld(d, "woonplaats", 80),
    sinds: veld(d, "sinds", 40),
    gasten: veld(d, "gasten", 80),
    tweede: veld(d, "tweede", 120),
    onderwerpen: veld(d, "onderwerpen", 400),
    verhaal: veld(d, "verhaal", 3000),
    ouder: veld(d, "ouder", 120),
    gsm: veld(d, "gsm", 40),
    email: veld(d, "email", 160),
  };
  const akkoord = !leeg(d.ok1) && !leeg(d.ok2) && !leeg(d.ok3);

  for (const k of ["voornaam", "leeftijd", "woonplaats", "sinds", "ouder", "gsm", "email"] as const) {
    if (f[k] === "") return antwoord(false, "missing:" + k, 422);
  }
  if (!geldigEmail(f.email)) return antwoord(false, "email", 422);
  if (!akkoord) return antwoord(false, "consent", 422);
  // Geen regeleinden in velden die in mailheaders komen
  for (const k of ["voornaam", "email", "ouder"] as const) {
    if (/[\r\n]/.test(f[k])) return antwoord(false, "invalid", 400);
  }

  const tekst =
    "INSCHRIJVING DE THUISSCHOOL PODCAST\n\n" +
    `Voornaam: ${f.voornaam}\n` +
    `Leeftijd: ${f.leeftijd}\n` +
    `Woonplaats: ${f.woonplaats}\n` +
    `Thuisonderwijs sinds: ${f.sinds}\n` +
    `Komt: ${f.gasten}` + (f.tweede !== "" ? ` (${f.tweede})` : "") + "\n" +
    "Wil praten over: " + (leeg(f.onderwerpen) ? "-" : f.onderwerpen) + "\n" +
    "Over mezelf: " + (leeg(f.verhaal) ? "-" : f.verhaal) + "\n\n" +
    `Ouder: ${f.ouder}\n` +
    `Gsm: ${f.gsm}\n` +
    `E-mail: ${f.email}\n\n` +
    "Toestemming deelname: ja\n" +
    "Toestemming publicatie geluid, beeld en foto's op alle kanalen: ja\n" +
    "Algemene voorwaarden en privacyverklaring (versie 7 oktober 2026): gelezen en aanvaard\n" +
    `Ontvangen op: ${tijdstip()}\n`;

  const ok = await stuur(ONTVANGER, "Inschrijving De Thuisschool Podcast - " + f.voornaam, tekst, f.email);
  if (!ok) return antwoord(false, "mail", 500);

  if (BEVESTIGING) {
    const bev =
      `Dag ${f.ouder},\n\n` +
      `Bedankt! We hebben de inschrijving van ${f.voornaam} voor De Thuisschool Podcast goed ontvangen.\n` +
      "We nemen binnenkort contact met je op om een datum af te spreken voor de opname in de Podcastcontainer in Maarkedal.\n\n" +
      "Vragen? Stuur een WhatsApp-bericht naar Emile-Henri: +32 484 56 23 87.\n\n" +
      "Tot snel aan de micro!\nEmile-Henri & Juliette\n\n" +
      "---\nDit heb je ingevuld:\n\n" + tekst;
    // Zoals in send.php: de inschrijving is al binnen, dus een mislukte bevestiging
    // wordt enkel gelogd (in stuur) en geeft geen foutmelding aan de ouder.
    await stuur(f.email, "We hebben je inschrijving ontvangen – De Thuisschool Podcast", bev, ONTVANGER);
  }

  return antwoord(true);
}
