import type { Question } from "@/lib/questions";
import { SITE_NAME } from "@/lib/site";
import { RichText } from "./rich-text";

/** The answer in a speech bubble, signed by the editors. */
export function ShortAnswer({ q }: { q: Question }) {
  return (
    <section aria-labelledby="short-answer" className="bg-mint">
      <div className="container-text pt-12 pb-14">
        <h2 id="short-answer" className="eyebrow mb-4.5 font-sans">
          Kort antwoord
        </h2>
        <div className="relative rounded-panel bg-white px-6 py-6 shadow-card md:px-7.5 md:py-6.5">
          <p className="font-display text-lead font-medium text-ink">
            <RichText text={q.shortAnswer} />
          </p>
          <div aria-hidden="true" className="absolute -bottom-2.5 left-10 size-5 rotate-45 bg-white" />
        </div>
        <div className="mt-5.5 ml-6.5 flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-full bg-green font-display text-[15px] font-semibold text-white"
          >
            T
          </span>
          <span className="text-meta text-ink-soft">De redactie van {SITE_NAME}</span>
        </div>
      </div>
    </section>
  );
}
