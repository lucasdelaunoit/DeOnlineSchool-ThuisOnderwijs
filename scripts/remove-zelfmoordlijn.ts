/**
 * One-off: removes every mention of the Zelfmoordlijn (1813) from the questions in the
 * database. The questions live in the database, not in content/questions/ (that is only
 * the seed), so editing the JSON files does not change a running site.
 *
 *   npm run remove-zelfmoordlijn -- --dry-run   shows what would change, saves nothing
 *   npm run remove-zelfmoordlijn
 *
 * Per question: drops the sentence that mentions it, drops its source and renumbers the
 * [n] after it. Works on what is in the database, so later imports are kept. Copies the
 * database to <db>.before-remove-zelfmoordlijn-<time>.db first, then saves all or nothing
 * and calls POST /api/revalidate like scripts/questions.ts. Running it twice is harmless.
 * Reads .env.local and .env like Next.js does.
 */
import fs from "node:fs";
import path from "node:path";
import type { Block, Question } from "@/lib/questions";
import { getDb } from "@/lib/server/db";
import { readQuestions, saveQuestions } from "@/lib/server/question-store";

for (const file of [".env.local", ".env"]) {
  if (fs.existsSync(file)) process.loadEnvFile(file);
}

const MENTION = /zelfmoord|zelfdoding/i;
// The sentence with the mention and the space before it. "awel.be." still ends a
// sentence, which is fine: the mention is never in the same sentence.
const SENTENCE = /\s*[^.!?]*(?:zelfmoord|zelfdoding)[^.!?]*[.!?]/gi;
const LEFTOVER = /zelfmoord|zelfdoding|1813/i;

async function main(dryRun: boolean) {
  const changed: Question[] = [];
  for (const q of readQuestions()) {
    const fixed = clean(q);
    if (!fixed) continue;
    if (LEFTOVER.test(JSON.stringify(fixed))) throw new Error(`${q.slug}: still mentions it after cleaning; fix it by hand`);
    changed.push(fixed);
    console.log(`${q.slug}: ${q.sources.length - fixed.sources.length} source(s) removed`);
  }
  if (!changed.length) {
    console.log("No question mentions the Zelfmoordlijn: nothing to do.");
    return;
  }
  if (dryRun) {
    console.log(`Dry run: ${changed.length} question(s) would change. Nothing saved.`);
    return;
  }

  const db = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "site.db");
  const backup = `${db.replace(/\.db$/, "")}.before-remove-zelfmoordlijn-${new Date().toISOString().replace(/\D/g, "").slice(0, 14)}.db`;
  getDb().prepare("VACUUM INTO ?").run(backup);
  console.log(`Backup: ${backup}`);

  saveQuestions(changed.map((question) => ({ question, where: question.slug })));
  console.log(`Saved ${changed.length} question(s).`);
  await revalidate();
}

/** The question without the mentions, or undefined if it has none. */
function clean(q: Question): Question | undefined {
  const removed = q.sources.flatMap((s, i) => (MENTION.test(`${s.text} ${s.url ?? ""}`) ? [i + 1] : []));
  if (!removed.length && !MENTION.test(JSON.stringify(q))) return undefined;

  // [n] of a removed source disappears; the ones after it move down.
  const text = (t: string) =>
    t
      .replace(SENTENCE, "")
      .replace(/\s*\[(\d+)\]/g, (cite, n) => {
        const i = Number(n);
        if (removed.includes(i)) return "";
        const shift = removed.filter((r) => r < i).length;
        return shift ? cite.replace(n, String(i - shift)) : cite;
      })
      .trim();
  const block = (b: Block): Block =>
    b.type === "list"
      ? { ...b, items: b.items.map(text) }
      : b.type === "note"
        ? { ...b, ...(b.title === undefined ? {} : { title: text(b.title) }), text: text(b.text) }
        : { ...b, text: text(b.text) };

  return {
    ...q,
    description: text(q.description),
    shortAnswer: text(q.shortAnswer),
    ...(q.facts && { facts: q.facts.map((f) => ({ label: text(f.label), value: text(f.value) })) }),
    sections: q.sections.map((s) => ({ title: text(s.title), blocks: s.blocks.map(block) })),
    sources: q.sources.filter((_, i) => !removed.includes(i + 1)),
  };
}

async function revalidate() {
  const site = process.env.SITE_URL?.replace(/\/$/, "");
  const secret = process.env.REVALIDATE_SECRET;
  if (!site || !secret) {
    console.log("SITE_URL or REVALIDATE_SECRET not set: restart or rebuild the site to show the change.");
    return;
  }
  try {
    const response = await fetch(`${site}/api/revalidate`, { method: "POST", headers: { authorization: `Bearer ${secret}` } });
    console.log(response.ok ? `${site} refreshed.` : `Could not refresh ${site}: ${response.status} ${await response.text()}`);
  } catch {
    console.log(`Could not reach ${site} to refresh it. Is the site running?`);
  }
}

main(process.argv.includes("--dry-run")).catch((e: Error) => {
  console.error(e.message);
  process.exitCode = 1;
});
