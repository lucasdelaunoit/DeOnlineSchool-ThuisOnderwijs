/**
 * The site's SQLite database: reactions on question pages and the question search
 * index. One file, by default data/site.db (DATABASE_PATH overrides it). Uses Node's
 * built-in node:sqlite, so there is no database server to run, but the file must be
 * on a disk that survives deploys: this does not work on serverless hosting.
 *
 * Server only. Queries are synchronous; always pass values as `?` parameters.
 */
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const FILE = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "site.db");

/**
 * Schema changes, in order. PRAGMA user_version stores how many have run, so each
 * runs once. Never edit or reorder a step that has shipped: add a new one.
 */
const MIGRATIONS = [
  `CREATE TABLE reactions (
     id INTEGER PRIMARY KEY,
     slug TEXT NOT NULL,
     first_name TEXT NOT NULL,
     role TEXT NOT NULL,
     message TEXT NOT NULL,
     approved INTEGER NOT NULL DEFAULT 0,
     created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
   );
   CREATE INDEX reactions_by_question ON reactions (slug, approved, created_at);

   -- Rebuilt from content/questions/ when the server starts (lib/server/search.ts).
   CREATE VIRTUAL TABLE question_search USING fts5(
     slug UNINDEXED, question UNINDEXED, category UNINDEXED, answer UNINDEXED,
     head, summary, body,
     tokenize = 'unicode61 remove_diacritics 2'
   );`,
];

let db: DatabaseSync | undefined;

export function getDb() {
  if (db) return db;
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const conn = new DatabaseSync(FILE);
  // WAL: readers don't wait for a writer. busy_timeout: a second process (next build
  // workers, a restart overlapping the old server) waits for the lock instead of failing.
  conn.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;");
  migrate(conn);
  db = conn;
  return db;
}

/** Runs `fn` in a transaction: all of it is saved, or none of it. */
export function transaction<T>(conn: DatabaseSync, fn: () => T): T {
  conn.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    conn.exec("COMMIT");
    return result;
  } catch (e) {
    conn.exec("ROLLBACK");
    throw e;
  }
}

function migrate(conn: DatabaseSync) {
  transaction(conn, () => {
    const { user_version: done } = conn.prepare("PRAGMA user_version").get() as { user_version: number };
    for (let i = done; i < MIGRATIONS.length; i++) conn.exec(MIGRATIONS[i]);
    if (done < MIGRATIONS.length) conn.exec(`PRAGMA user_version = ${MIGRATIONS.length}`);
  });
}
