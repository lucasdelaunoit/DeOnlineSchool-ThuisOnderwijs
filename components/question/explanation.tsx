import type { Block, Question } from "@/lib/questions";
import { RichText } from "./rich-text";

/** Key facts as small cards, then the numbered sections. */
export function Explanation({ q }: { q: Question }) {
  return (
    <section aria-labelledby="explanation" className="pt-12 pb-12 md:pt-24 md:pb-24">
      <div className="container-wide">
        <h2 id="explanation" className="section-title">
          Uitgebreide uitleg
        </h2>

        {q.facts?.length ? (
          // flex-grow fills every row, so a short last row leaves no empty space.
          <dl className="mt-6 flex flex-wrap gap-2.5">
            {q.facts.map((fact, i) => (
              <div
                key={fact.label}
                style={{ "--i": i } as React.CSSProperties}
                className="reveal flex-[1_1_150px] rounded-card border border-line bg-white px-4 py-3.5 shadow-card md:flex-[1_1_190px]"
              >
                <dt className="text-meta text-muted">{fact.label}</dt>
                <dd className="mt-1 font-display text-[17px] leading-snug font-semibold text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="prose">
          {q.sections.map((section, i) => (
            <div key={section.title}>
              <h3 className="reveal flex gap-3">
                <span className="text-green tabular-nums">{i + 1}.</span>
                <span>{section.title}</span>
              </h3>
              {section.blocks.map((block, j) => (
                <BlockView key={j} block={block} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p>
          <RichText text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <aside className="rounded-card bg-mint px-5 py-4 text-[16px]">
          {block.title && <strong>{block.title} </strong>}
          <RichText text={block.text} />
        </aside>
      );
  }
}
