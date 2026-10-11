import { Fragment } from "react";

/** Renders the inline markup of question texts: *italic* and [1] footnotes. */
export function RichText({ text }: { text: string }) {
  return text.split(/(\s*\[\d+\]|\*[^*]+\*)/).map((part, i) => {
    const cite = part.match(/^\s*\[(\d+)\]$/);
    if (cite) {
      return (
        <sup key={i} className="cite">
          <a href={`#source-${cite[1]}`} aria-label={`Bron ${cite[1]}`}>
            [{cite[1]}]
          </a>
        </sup>
      );
    }
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}
