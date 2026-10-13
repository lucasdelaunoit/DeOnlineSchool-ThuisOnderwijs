import type { Block, Question } from "@/lib/questions";
import { RichText } from "./rich-text";

/** Key facts in a flat framed strip, then the numbered sections. */
export function Explanation({ q }: { q: Question }) {
  return (
    <section aria-labelledby="explanation" className="pt-16 pb-16 md:pt-24 md:pb-24">
      <div className="container-wide">
        <h2 id="explanation" className="section-title">
          Uitgebreide uitleg
        </h2>

        {q.facts?.length ? (
          // gap-px over a line-coloured background draws the dividers; flex-grow fills
          // every row, so a short last row leaves no empty cell. Framed, no shadow.
          <dl className="reveal mt-6 flex flex-wrap gap-px overflow-hidden rounded-card border border-rule bg-rule">
            {q.facts.map((fact) => (
              <div key={fact.label} className="flex-auto bg-paper px-4.5 py-3.5">
                <dt className="text-meta text-muted">{fact.label}</dt>
                <dd className="mt-0.5 font-medium whitespace-nowrap text-ink">{fact.value}</dd>
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
