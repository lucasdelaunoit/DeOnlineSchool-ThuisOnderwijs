/**
 * Converts the review export of the landing pages ("Alle N landingspagina's", one
 * <article> per question) into question files for scripts/questions.ts:
 *
 *   npm run landingspaginas -- <export.html> [dir] [--checked-on YYYY-MM-DD]
 *
 * Writes <dir>/<slug>.json (default content/questions) and never overwrites an existing
 * file. Load them with `npm run db:seed` (empty database) or
 * `npm run questions -- import content/questions`.
 *
 * Everything in the export that Question (lib/questions.ts) has no place for is listed at
 * the end, not dropped silently: tags, editorial notes, the De Online School tip, ...
 * A question that does not pass validateQuestion is reported and not written.
 */
import fs from "node:fs";
import path from "node:path";
import { validateQuestion, type Block, type Question } from "@/lib/questions";

const AUDIENCE: Record<string, string> = {
  beide: "Voor leerlingen en ouders",
  leerlingen: "Voor leerlingen",
  ouders: "Voor ouders",
};

/** Not in Question: counted per kind, with the slugs. */
const unmapped = new Map<string, string[]>();
const note = (kind: string, slug: string) => unmapped.set(kind, [...(unmapped.get(kind) ?? []), slug]);

function main(args: string[]) {
  const flag = args.indexOf("--checked-on");
  const checkedOn = flag >= 0 ? args.splice(flag, 2)[1] : new Date().toISOString().slice(0, 10);
  const [file, dir = path.join(process.cwd(), "content", "questions")] = args;
  if (!file) throw new Error("Usage: landingspaginas <export.html> [dir] [--checked-on YYYY-MM-DD]");

  const html = fs.readFileSync(file, "utf8");
  const articles = [...html.matchAll(/<article id="([^"]+)">([\s\S]*?)<\/article>/g)];
  const slugByQuestion = new Map(articles.map(([, id, body]) => [text(one(body, /<h2>([\s\S]*?)<\/h2>/)), id]));

  const failed: string[] = [];
  const skipped: string[] = [];
  let written = 0;
  fs.mkdirSync(dir, { recursive: true });
  for (const [, slug, body] of articles) {
    try {
      const q = validateQuestion(convert(slug, body, checkedOn, slugByQuestion), slug);
      const target = path.join(dir, `${slug}.json`);
      if (fs.existsSync(target)) {
        skipped.push(slug);
        continue;
      }
      fs.writeFileSync(target, `${JSON.stringify(q, null, 2)}\n`);
      written++;
    } catch (e) {
      failed.push((e as Error).message);
    }
  }

  console.log(`${articles.length} article(s): ${written} written to ${dir}, ${skipped.length} already there, ${failed.length} failed.`);
  if (skipped.length) console.log(`\nAlready there (not overwritten):\n  ${skipped.join("\n  ")}`);
  if (failed.length) console.log(`\nNot converted:\n  ${failed.join("\n  ")}`);
  console.log(`\ncheckedOn set to ${checkedOn} on every question (the export has no date).`);
  if (unmapped.size) {
    console.log("\nIn the export but not in Question (not imported):");
    for (const [kind, slugs] of unmapped) {
      const list = new Set(slugs).size < 6 ? `: ${[...new Set(slugs)].join(", ")}` : "";
      console.log(`  ${kind} (${slugs.length}×)${list}`);
    }
  }
}

function convert(slug: string, body: string, checkedOn: string, slugByQuestion: Map<string, string>): Question {
  const [category, grade, audience, asked] = text(one(body, /<p class="meta">([\s\S]*?)<\/p>/)).split(" · ");
  if (!AUDIENCE[audience]) throw new Error(`${slug}: unknown audience "${audience}"`);
  if (asked) note("Times asked (meta)", slug);

  // "Title | De Online School · Description": the site adds its own name to the title.
  const seo = text(one(body, /<p class="seo"><b>SEO:<\/b>([\s\S]*?)<\/p>/));
  const [seoTitle, description] = splitOnce(seo, " · ");
  const title = seoTitle.replace(/\s*\|\s*De Online School$/, "");

  if (/<p class="tags">/.test(body)) note("Tags", slug);
  if (/<div class="notes">/.test(body)) note("Internal editorial notes (Notities redactie)", slug);

  const facts = [...(body.match(/<dl class="kc">([\s\S]*?)<\/dl>/)?.[1] ?? "").matchAll(/<dt>([\s\S]*?)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/g)].map(
    ([, label, value]) => ({ label: text(label), value: text(value) }),
  );

  const start = body.search(/<h4>/);
  const end = body.indexOf("<h3>Bronnen</h3>");
  if (start < 0 || end < 0) throw new Error(`${slug}: no sections or no sources`);

  return {
    slug,
    question: text(one(body, /<h2>([\s\S]*?)<\/h2>/)),
    ...(title ? { title } : {}),
    description,
    category,
    audience: grade === "algemeen" ? AUDIENCE[audience] : `${AUDIENCE[audience]} · ${grade}`,
    checkedOn,
    shortAnswer: inline(one(body, /<div class="kort">\s*<h3>Kort antwoord<\/h3>\s*<p>([\s\S]*?)<\/p>/), slug),
    ...(facts.length ? { facts } : {}),
    sections: sections(body.slice(start, end), slug),
    sources: sources(between(body, "<h3>Bronnen</h3>", "</ol>"), slug),
    experiences: experiences(body, slug),
    related: related(body, slug, slugByQuestion),
  };
}

/** The body between the facts and the sources: <h4> titles, each followed by blocks. */
function sections(html: string, slug: string) {
  const result: Question["sections"] = [];
  const blocks = () => result[result.length - 1].blocks;
  let rest = html;
  const element = /^\s*(?:<(h4|p|ul|ol)((?: [^>]*)?)>([\s\S]*?)<\/\1>|((?:<sup>\[\d+\]<\/sup>)+))/;
  for (let m = rest.match(element); m; rest = rest.slice(m[0].length), m = rest.match(element)) {
    const [, tag, attrs = "", inner, citations] = m;
    if (citations) {
      // Citations after a list: they belong to its last item.
      const last = blocks()[blocks().length - 1];
      if (last?.type !== "list") throw new Error(`${slug}: citations outside a paragraph or list`);
      last.items[last.items.length - 1] += ` ${inline(citations, slug)}`;
    } else if (tag === "h4") {
      result.push({ title: text(inner).replace(/^\d+\.\s*/, ""), blocks: [] });
    } else if (!result.length) {
      throw new Error(`${slug}: content before the first section`);
    } else if (attrs.includes('class="tip"')) {
      note("Tip box 'Van De Online School' (text, status and link differ per question)", slug);
    } else if (attrs.includes('class="kader"')) {
      const [, title, rest] = inner.match(/^\s*<b>([\s\S]*?)<\/b>([\s\S]*)$/) ?? [, "", inner];
      blocks().push({ type: "note", ...(title ? { title: text(title) } : {}), text: inline(rest, slug) });
    } else if (attrs.trim()) {
      throw new Error(`${slug}: unknown block <${tag}${attrs}>`);
    } else if (tag === "p") {
      blocks().push({ type: "paragraph", text: inline(inner, slug) });
    } else {
      if (tag === "ol") note("Numbered list (shown as a bullet list)", slug);
      const items = [...inner.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, item]) => inline(item, slug));
      blocks().push({ type: "list", items } satisfies Block);
    }
  }
  if (rest.trim()) throw new Error(`${slug}: could not read "${rest.trim().slice(0, 60)}…"`);
  for (const s of result) if (!s.blocks.length) throw new Error(`${slug}: section "${s.title}" is empty`);
  return result;
}

function sources(html: string, slug: string) {
  return [...html.matchAll(/<li value="(\d+)">([\s\S]*?)<\/li>/g)].map(([, n, item], i) => {
    if (Number(n) !== i + 1) throw new Error(`${slug}: source ${n} is not number ${i + 1}`);
    const url = item.match(/<a href="([^"]+)">[\s\S]*?<\/a>/);
    const source = inline(item.replace(/<a [\s\S]*?<\/a>/, ""), slug);
    return url ? { text: source, url: decode(url[1]) } : { text: source };
  });
}

/** <blockquote>Quote<footer>Name, role · context</footer></blockquote> */
function experiences(body: string, slug: string) {
  return [...body.matchAll(/<blockquote>([\s\S]*?)<footer>([\s\S]*?)<\/footer><\/blockquote>/g)].map(([, quote, footer]) => {
    const [who, context] = splitOnce(text(footer), " · ");
    const [name, role] = splitOnce(who, ", ");
    if (!name || !role) throw new Error(`${slug}: experience by "${text(footer)}" has no "name, role"`);
    return { quote: text(quote), name, role, ...(context ? { context } : {}) };
  });
}

function related(body: string, slug: string, slugByQuestion: Map<string, string>) {
  const items = [...between(body, "<h3>Andere gerelateerde vragen</h3>", "</ul>").matchAll(/<li>([\s\S]*?)<\/li>/g)];
  return items.flatMap(([, item]) => {
    const other = slugByQuestion.get(text(item));
    if (!other) note("Related question that is not in the export (link left out)", slug);
    return other ? [other] : [];
  });
}

/** HTML of a text field → the inline markup of Question: *italic* and [n]. */
function inline(html: string, slug: string) {
  const markup = html
    .replace(/<sup>\[(\d+)\]<\/sup>/g, " [$1]")
    .replace(/<(i|em)>([\s\S]*?)<\/\1>/g, "*$2*");
  const tag = markup.match(/<[^>]+>/);
  if (tag) throw new Error(`${slug}: unexpected ${tag[0]} in "${text(html).slice(0, 60)}…"`);
  return decode(markup).replace(/\s+/g, " ").trim();
}

/** Plain text: tags removed, entities decoded, whitespace collapsed. */
function text(html: string) {
  return decode(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}

function decode(s: string) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function one(html: string, pattern: RegExp) {
  const m = html.match(pattern);
  if (!m) throw new Error(`missing ${pattern.source.slice(0, 40)}`);
  return m[1];
}

function between(html: string, from: string, to: string) {
  const start = html.indexOf(from);
  return start < 0 ? "" : html.slice(start + from.length, html.indexOf(to, start));
}

function splitOnce(s: string, separator: string): [string, string] {
  const i = s.indexOf(separator);
  return i < 0 ? [s, ""] : [s.slice(0, i), s.slice(i + separator.length)];
}

try {
  main(process.argv.slice(2));
} catch (e) {
  console.error((e as Error).message);
  process.exitCode = 1;
}
