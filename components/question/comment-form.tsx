"use client";

import { useActionState } from "react";
import { postComment } from "@/lib/server/comments";

const ERRORS = {
  missing: "Vul je voornaam, wie je bent en je reactie in.",
  rate: "Je hebt net al enkele reacties geplaatst. Probeer het over een paar minuten opnieuw.",
  save: "Je reactie kon niet verstuurd worden. Probeer het later opnieuw.",
};

/** Works without JavaScript too: the form posts to the server action. */
export function CommentForm({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState(postComment, null);

  if (state?.ok) {
    return (
      <p role="status" className="rounded-card bg-mint px-5 py-4 text-ink">
        <strong className="font-semibold">Bedankt voor je reactie.</strong> Ze staat nu op deze pagina.
      </p>
    );
  }

  const values = state?.values;
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
        Je reactie *
        <textarea
          className="input resize-y"
          name="message"
          rows={4}
          required
          maxLength={3000}
          defaultValue={values?.message}
        />
      </label>

      {state?.error && (
        <p role="alert" className="text-small text-error">
          {ERRORS[state.error]}
        </p>
      )}

      <button type="submit" className="btn btn-primary self-start px-6" disabled={pending}>
        {pending ? "Bezig met versturen…" : "Reactie plaatsen"}
      </button>
    </form>
  );
}
