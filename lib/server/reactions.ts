/**
 * Reactions on question pages (table reactions in lib/server/db.ts). A new reaction is
 * saved unapproved and mailed to the editors with a moderation link
 * (/moderation/<id>?token=…). Only approved reactions show on the page.
 *
 * Not a "use server" file on purpose: these functions must not be callable from the
 * browser. The form and moderation actions are in comments.ts and moderation.ts.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { getDb } from "./db";

export type Reaction = {
  id: number;
  slug: string;
  firstName: string;
  role: string;
  message: string;
  approved: boolean;
  /** ISO timestamp, UTC. */
  createdAt: string;
  /** The day it was posted in Belgium, YYYY-MM-DD (for formatDate). */
  day: string;
};

type Row = { id: number; slug: string; first_name: string; role: string; message: string; approved: number; created_at: string };

const COLUMNS = "id, slug, first_name, role, message, approved, created_at";

export function addReaction(r: { slug: string; firstName: string; role: string; message: string }) {
  const { lastInsertRowid } = getDb()
    .prepare("INSERT INTO reactions (slug, first_name, role, message) VALUES (?, ?, ?, ?)")
    .run(r.slug, r.firstName, r.role, r.message);
  return Number(lastInsertRowid);
}

/** Approved reactions on a question, oldest first. */
export function approvedReactions(slug: string) {
  const rows = getDb()
    .prepare(`SELECT ${COLUMNS} FROM reactions WHERE slug = ? AND approved = 1 ORDER BY created_at, id`)
    .all(slug) as Row[];
  return rows.map(toReaction);
}

export function getReaction(id: number) {
  const row = getDb().prepare(`SELECT ${COLUMNS} FROM reactions WHERE id = ?`).get(id) as Row | undefined;
  return row && toReaction(row);
}

export function approveReaction(id: number) {
  getDb().prepare("UPDATE reactions SET approved = 1 WHERE id = ?").run(id);
}

/** Removes it for good: for spam, and when someone asks to have their reaction deleted. */
export function deleteReaction(id: number) {
  getDb().prepare("DELETE FROM reactions WHERE id = ?").run(id);
}

/**
 * The secret part of a moderation link: an HMAC of the id, so a link only works for
 * its own reaction and can't be guessed. Null when MODERATION_SECRET isn't set.
 */
export function moderationToken(id: number) {
  const secret = process.env.MODERATION_SECRET;
  if (!secret || secret.length < 32) return null;
  return createHmac("sha256", secret).update(`reaction:${id}`).digest("base64url");
}

export function isValidModerationToken(id: number, token: unknown) {
  const expected = moderationToken(id);
  if (!expected || typeof token !== "string") return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// en-CA formats dates as YYYY-MM-DD.
const brusselsDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Brussels" });

function toReaction(row: Row): Reaction {
  return {
    id: row.id,
    slug: row.slug,
    firstName: row.first_name,
    role: row.role,
    message: row.message,
    approved: row.approved === 1,
    createdAt: row.created_at,
    day: brusselsDay.format(new Date(row.created_at)),
  };
}
