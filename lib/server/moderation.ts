"use server";
/**
 * The buttons on /moderation/[id]: approve or delete one reaction. Only works with the
 * token from the moderation link that `npm run reactions` lists (lib/server/reactions.ts).
 */
import { notFound, redirect } from "next/navigation";
import { approveReaction, deleteReaction, isValidModerationToken } from "@/lib/server/reactions";

export async function moderateReaction(form: FormData) {
  const id = Number(form.get("id"));
  const token = form.get("token");
  const decision = form.get("decision");
  if (!Number.isSafeInteger(id) || !isValidModerationToken(id, token)) notFound();

  if (decision === "approve") approveReaction(id);
  else if (decision === "delete") deleteReaction(id);
  else notFound();

  redirect(`/moderation/${id}?${new URLSearchParams({ token: String(token), done: decision })}`);
}
