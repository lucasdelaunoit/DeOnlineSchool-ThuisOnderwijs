import type { Block, Question } from "@/lib/questions";
import { RichText } from "./rich-text";

/** Key facts and the numbered sections. */
export function Explanation({ q }: { q: Question }) {
  return (
    <section aria-labelledby="explanation" className="section bg-sheet">
      <div className="container-text">
        <h2 id="explanation" className="section-title">
          Uitgebreide uitleg
        </h2>

        {q.facts?.length ? (
          <dl className="mt-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))] border-t-2 border-b border-t-ink border-b-line">
            {q.facts.map((fact) => (
              <div key={fact.label} className="py-3.5 pr-4">
                <dt className="text-caption text-muted">{fact.label}</dt>
                <dd className="mt-0.5 text-[15px] font-semibold text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="prose">
          {q.sections.map((section, i) => (
            <div key={section.title}>
              <h3>
                {i + 1}. {section.title}
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
        <aside className="rounded-card bg-sand px-5 py-4 text-[15px]">
          {block.title && <strong>{block.title} </strong>}
          <RichText text={block.text} />
        </aside>
      );
  }
}
