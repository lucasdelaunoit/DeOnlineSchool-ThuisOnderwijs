/**
 * Managing the questions in the database from the command line (there is no admin
 * page yet). A question is edited as a JSON file in the shape of Question
 * (lib/questions.ts), named <slug>.json:
 *
 *   npm run questions -- list
 *   npm run questions -- export [dir]          database → <dir>/<slug>.json (default content/questions)
 *   npm run questions -- import <file|dir>...  JSON files → database (adds, or replaces the same slug)
 *   npm run questions -- delete <slug>
 *   npm run db:seed                            fills an EMPTY database from content/questions/ (if it exists)
 *
 * After a change it calls POST /api/revalidate on SITE_URL with REVALIDATE_SECRET, so
 * the running site shows it. Reads .env.local and .env like Next.js does.
 */
import fs from "node:fs";
import path from "node:path";
import type { Question } from "@/lib/questions";
import { countQuestions, deleteQuestion, readQuestions, saveQuestions } from "@/lib/server/question-store";

const SEED_DIR = path.join(process.cwd(), "content", "questions");

for (const file of [".env.local", ".env"]) {
  if (fs.existsSync(file)) process.loadEnvFile(file);
}

async function main([command, ...args]: string[]) {
  switch (command) {
    case "list": {
      const questions = readQuestions();
      for (const q of questions) console.log(`${q.slug}  (${q.category})`);
      console.log(`${questions.length} question(s)`);
      return;
    }

    case "export": {
      const dir = path.resolve(args[0] ?? SEED_DIR);
      fs.mkdirSync(dir, { recursive: true });
      const questions = readQuestions();
      for (const q of questions) fs.writeFileSync(path.join(dir, `${q.slug}.json`), `${JSON.stringify(q, null, 2)}\n`);
      console.log(`Exported ${questions.length} question(s) to ${dir}`);
      return;
    }

    case "import": {
      if (!args.length) throw new Error("Usage: import <file.json|dir>...");
      const files = args.flatMap(jsonFiles);
      saveQuestions(files.map(readFile));
      console.log(`Imported ${files.length} question(s): ${files.map((f) => path.basename(f, ".json")).join(", ")}`);
      await revalidate();
      return;
    }

    case "delete": {
      if (!args[0]) throw new Error("Usage: delete <slug>");
      if (!deleteQuestion(args[0])) throw new Error(`No question "${args[0]}"`);
      console.log(`Deleted ${args[0]}`);
      await revalidate();
      return;
    }

    case "seed": {
      // Only into an empty database, so it never undoes an import or a delete. The
      // build runs it (prebuild): pages need at least one question to prerender.
      const n = countQuestions();
      if (n) {
        console.log(`Database has ${n} question(s): not seeding.`);
        return;
      }
      const files = fs.existsSync(SEED_DIR) ? jsonFiles(SEED_DIR) : [];
      saveQuestions(files.map(readFile));
      console.log(`Seeded ${files.length} question(s) from ${SEED_DIR}`);
      return;
    }

    default:
      throw new Error("Commands: list, export [dir], import <file|dir>..., delete <slug>, seed");
  }
}

function jsonFiles(target: string) {
  if (!fs.statSync(target).isDirectory()) return [target];
  return fs
    .readdirSync(target)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(target, f));
}

function readFile(file: string) {
  const question = JSON.parse(fs.readFileSync(file, "utf8")) as Question;
  if (`${question.slug}.json` !== path.basename(file)) throw new Error(`${file}: "slug" must match the file name`);
  return { question, where: file };
}

async function revalidate() {
  const site = process.env.SITE_URL?.replace(/\/$/, "");
  const secret = process.env.REVALIDATE_SECRET;
  if (!site || !secret) {
    console.log("SITE_URL or REVALIDATE_SECRET not set: the running site shows the change after the next build.");
    return;
  }
  try {
    const response = await fetch(`${site}/api/revalidate`, { method: "POST", headers: { authorization: `Bearer ${secret}` } });
    console.log(response.ok ? `${site} refreshed.` : `Could not refresh ${site}: ${response.status} ${await response.text()}`);
  } catch {
    console.log(`Could not reach ${site} to refresh it. Is the site running?`);
  }
}

main(process.argv.slice(2)).catch((e: Error) => {
  console.error(e.message);
  process.exitCode = 1;
});
