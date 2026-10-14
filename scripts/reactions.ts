/**
 * The latest reactions, newest first, each with its moderation link (to delete it, or
 * to place an older one that was saved unapproved), for when the mail got lost:
 *
 *   npm run reactions [-- <count>]     default 20
 *
 * Reads .env.local and .env like Next.js does (MODERATION_SECRET, SITE_URL, DATABASE_PATH).
 */
import fs from "node:fs";
import { moderationToken, recentReactions } from "@/lib/server/reactions";

for (const file of [".env.local", ".env"]) {
  if (fs.existsSync(file)) process.loadEnvFile(file);
}

const site = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
const reactions = recentReactions(Number(process.argv[2]) || 20);
for (const r of reactions) {
  const token = moderationToken(r.id);
  const status = r.approved ? "" : "  (not placed)";
  console.log(`#${r.id}  ${r.createdAt}  ${r.firstName} (${r.role}) on /questions/${r.slug}${status}`);
  console.log(`  ${r.message.replace(/\s+/g, " ").slice(0, 200)}`);
  console.log(`  ${token ? `${site}/moderation/${r.id}?token=${token}` : "no link: MODERATION_SECRET not set"}\n`);
}
console.log(`${reactions.length} reaction(s)`);
