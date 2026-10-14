"use client";

import { useActionState, useState } from "react";
import { EXPERIENCE_LENGTH } from "@/lib/questions";
import { postComment } from "@/lib/server/comments";

const ERRORS = {
  missing: "Vul je voornaam, wie je bent en je ervaring in.",
  short: `Je ervaring is te kort: schrijf minstens ${EXPERIENCE_LENGTH.min} tekens.`,
  long: `Je ervaring is te lang: hou het bij ${EXPERIENCE_LENGTH.max} tekens.`,
  rate: "Je hebt net al enkele ervaringen gedeeld. Probeer het over een paar minuten opnieuw.",
  save: "Je ervaring kon niet verstuurd worden. Probeer het later opnieuw.",
};

/** Works without JavaScript too: the form posts to the server action. */
export function CommentForm({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState(postComment, null);
  // Characters typed, counted like the server does (per character, not per UTF-16 unit).
  const [length, setLength] = useState<number | null>(null);

  if (state?.ok) {
    return (
      <p role="status" className="rounded-card bg-mint px-5 py-4 text-ink">
        <strong className="font-semibold">Bedankt om je ervaring te delen.</strong> Ze staat nu bij de andere ervaringen.
      </p>
    );
  }

  const values = state?.values;
  const typed = length ?? Array.from(values?.message ?? "").length;
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="slug" value={slug} />
      {/* Honeypot: hidden from people, bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <label className="field">
          Voornaam *
          <input
            className="input"
            type="text"
            name="firstName"
            required
            maxLength={80}
            autoComplete="given-name"
            defaultValue={values?.firstName}
          />
        </label>
        <label className="field">
          Ik ben *
          <select className="input" name="role" required defaultValue={values?.role ?? "Leerling"}>
            <option>Leerling</option>
            <option>Ouder</option>
            <option>Begeleider of leerkracht</option>
          </select>
        </label>
      </div>
      <label className="field">
        Je ervaring *
        <textarea
          className="input resize-y"
          name="message"
          rows={4}
          required
          minLength={EXPERIENCE_LENGTH.min}
          maxLength={EXPERIENCE_LENGTH.max}
          aria-describedby="message-length"
          defaultValue={values?.message}
          onChange={(e) => setLength(Array.from(e.target.value).length)}
        />
      </label>
      {/* Outside the label, so it is not read as part of the field's name. */}
      <p id="message-length" className="-mt-2.5 self-end text-meta text-muted tabular-nums">
        {typed < EXPERIENCE_LENGTH.min ?
          `Minstens ${EXPERIENCE_LENGTH.min} tekens${typed ? ` · nog ${EXPERIENCE_LENGTH.min - typed}` : ""}`
        : `${typed} / ${EXPERIENCE_LENGTH.max}`}
      </p>

      {state?.error && (
        <p role="alert" className="text-small text-error">
          {ERRORS[state.error]}
        </p>
      )}

      <button type="submit" className="btn btn-primary self-start px-6" disabled={pending}>
        {pending ? "Bezig met versturen…" : "Ervaring delen"}
      </button>
    </form>
  );
}
