import { searchQuestions } from "@/lib/server/search";

/** GET /api/search?q=… → SearchResult[] (lib/search.ts), for the home page search box. */
export function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") ?? "").slice(0, 200);
  return Response.json(searchQuestions(q));
}
