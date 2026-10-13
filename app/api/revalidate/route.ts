import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { QUESTIONS_TAG } from "@/lib/server/questions";

/**
 * POST /api/revalidate with `Authorization: Bearer <REVALIDATE_SECRET>`: the pages show
 * the questions as they are in the database now. Called by scripts/questions.ts after
 * an import or delete.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || secret.length < 32) return new Response("REVALIDATE_SECRET not configured", { status: 503 });
  if (!sameSecret(request.headers.get("authorization") ?? "", `Bearer ${secret}`)) {
    return new Response("Unauthorized", { status: 401 });
  }
  // expire 0: the next visit gets the new content, not the old one one last time.
  revalidateTag(QUESTIONS_TAG, { expire: 0 });
  return Response.json({ revalidated: true });
}

// Compares hashes, so the time taken says nothing about the secret, its length included.
function sameSecret(a: string, b: string) {
  const hash = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(hash(a), hash(b));
}
