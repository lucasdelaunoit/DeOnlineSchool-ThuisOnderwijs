import type { Question } from "@/lib/questions";
import { SITE_NAME } from "@/lib/site";
import { RichText } from "./rich-text";

/**
 * The answer in a white speech bubble, signed by the editors, on the green of the
 * podcast banner and the stamp.
 */
export function ShortAnswer({ q }: { q: Question }) {
  return (
    <section aria-labelledby="short-answer" className="bg-green [--focus-ring:var(--color-white)]">
      <div className="container-wide pt-12 pb-16 md:pt-16 md:pb-20">
        <h2 id="short-answer" className="rise text-small font-semibold text-green-pale [--i:3]">
          Kort antwoord
        </h2>
        <div className="rise mt-3 [--i:4] [--tail:49px]">
          <div className="relative rounded-panel bg-white px-6 py-5.5 md:px-8 md:py-6.5">
            <p className="text-lead text-ink">
              <RichText text={q.shortAnswer} />
            </p>
            {/* Tail and avatar are centred on the same line, --tail from the bubble's left edge. */}
            <div aria-hidden="true" className="absolute -bottom-2 left-[calc(var(--tail)-9px)] size-4.5 rotate-45 rounded-[3px] bg-white" />
          </div>
          <div className="mt-6 ml-[calc(var(--tail)-16px)] flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-full bg-green-pale font-display text-[15px] font-semibold text-green-dark"
            >
              T
            </span>
            <span className="text-small text-green-pale">De redactie van {SITE_NAME}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
