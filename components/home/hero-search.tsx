"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { normalize, search, searchTerms, type SearchEntry } from "@/lib/search";

/**
 * The search box at the top of the home page (ARIA combobox). Results open under
 * the box while typing, each with the start of its short answer; arrow keys pick,
 * Enter opens. "/" focuses the box from anywhere on the page. Without JavaScript
 * the form falls back to the full list on /questions.
 *
 * While the box is empty and unfocused, the placeholder types out `prompts` one by
 * one (questions that are on the site), to show you can ask in your own words.
 */
export function HeroSearch({
  entries,
  examples,
  prompts,
}: {
  entries: SearchEntry[];
  /** Chips under the box that fill it in. */
  examples: string[];
  prompts: string[];
}) {
  const router = useRouter();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const typed = useTypedText(prompts, focused || query !== "");

  const results = search(entries, query);
  const terms = searchTerms(query);
  const searching = query.trim() !== "";
  const expanded = open && searching;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      if ((event.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) return;
      event.preventDefault();
      input.current?.focus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function update(value: string) {
    setQuery(value);
    setActive(0);
    setOpen(true);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const n = results.length;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      if (n) setActive((a) => (a + (event.key === "ArrowDown" ? 1 : n - 1)) % n);
    } else if (event.key === "Escape") {
      if (expanded) setOpen(false);
      else update("");
    }
  }

  return (
    <div>
      <form
        role="search"
        action="/questions"
        className="relative"
        onSubmit={(event) => {
          event.preventDefault();
          const entry = results[active] ?? results[0];
          if (entry) router.push(`/questions/${entry.slug}`);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
      >
        <label htmlFor={`${id}-q`} className="sr-only">
          Zoek je vraag
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-5 size-5.5 -translate-y-1/2 text-green md:left-6" />
          <input
            ref={input}
            id={`${id}-q`}
            name="q"
            type="text"
            role="combobox"
            aria-expanded={expanded}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={expanded && results.length ? `${id}-r${active}` : undefined}
            aria-describedby={`${id}-status`}
            autoComplete="off"
            enterKeyHint="search"
            spellCheck={false}
            placeholder={typed && !focused && !query ? `${typed}|` : "Typ je vraag of een trefwoord"}
            value={query}
            onChange={(event) => update(event.target.value)}
            onFocus={() => {
              setOpen(true);
              setFocused(true);
            }}
            onBlur={() => setFocused(false)}
            onKeyDown={onKeyDown}
            className="input min-h-15 rounded-full border-white pr-14 pl-13 text-body shadow-hero placeholder:text-muted hover:border-white focus-visible:border-green md:min-h-18 md:pr-38 md:pl-15 md:text-[18px]"
          />
          <button type="submit" className="btn btn-primary absolute top-1/2 right-2 min-h-11 -translate-y-1/2 px-3.5 md:right-2.5 md:min-h-13 md:px-7 md:text-body">
            <span className="sr-only md:not-sr-only">Zoeken</span>
            <span aria-hidden="true" className="md:hidden">
              →
            </span>
          </button>
        </div>

        <div
          hidden={!expanded}
          className="absolute inset-x-0 top-full z-30 mt-2.5 overflow-hidden rounded-card border border-line bg-white text-left shadow-popover"
        >
          {results.length ? (
            <ul id={`${id}-list`} role="listbox" aria-label="Gevonden vragen" className="max-h-[min(26rem,60vh)] overflow-y-auto py-1.5">
              {results.map((entry, i) => (
                <li key={entry.slug} role="presentation">
                  <Link
                    id={`${id}-r${i}`}
                    role="option"
                    aria-selected={i === active}
                    tabIndex={-1}
                    href={`/questions/${entry.slug}`}
                    onMouseEnter={() => setActive(i)}
                    className="group flex gap-4 px-5 py-3.5 text-ink no-underline aria-selected:bg-mint md:px-6"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-caption font-semibold tracking-[0.08em] text-green uppercase">
                        {entry.category}
                      </span>
                      <span className="mt-0.5 block font-medium text-ink">
                        <Highlight text={entry.question} terms={terms} />
                      </span>
                      <span className="mt-1 line-clamp-2 text-small text-muted">{entry.answer}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="self-center text-green opacity-0 transition-[opacity,translate] group-hover:translate-x-0.5 group-aria-selected:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div id={`${id}-list`} className="px-5 py-5 md:px-6">
              <p className="font-medium text-ink">Hier staat nog geen antwoord op.</p>
              <p className="mt-1 text-small text-ink-soft">
                Probeer een ander woord, of kies hieronder een onderwerp.{" "}
                <Link href="/questions" className="font-medium">
                  Alle vragen bekijken
                </Link>
              </p>
            </div>
          )}
          {results.length > 0 && (
            <div className="flex items-center justify-between gap-4 border-t border-line bg-sheet px-5 py-2.5 text-meta text-muted md:px-6">
              <span className="hidden items-center gap-1.5 md:flex">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> kiezen
                <Kbd className="ml-2">Enter</Kbd> openen
              </span>
              <Link href="/questions" className="font-medium">
                Alle vragen bekijken →
              </Link>
            </div>
          )}
        </div>
      </form>

      <p id={`${id}-status`} aria-live="polite" className="sr-only">
        {searching &&
          (results.length === 0 ? "Geen vragen gevonden"
          : results.length === 1 ? "1 vraag gevonden"
          : `${results.length} vragen gevonden`)}
      </p>

      {examples.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-small">
          <span className="mr-1 text-green-light">Populair:</span>
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                update(example);
                input.current?.focus();
              }}
              className="cursor-pointer rounded-full border border-white/20 bg-white/8 px-4 py-1.5 text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
            >
              {example}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Types out each text, pauses, erases it, then the next. Stops while `paused`. */
function useTypedText(texts: string[], paused: boolean) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (paused || !texts.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    let n = 0;
    let erasing = false;
    let timer: number;
    function tick() {
      const full = texts[i % texts.length];
      n += erasing ? -1 : 1;
      setText(full.slice(0, n));
      if (!erasing && n >= full.length) {
        if (texts.length === 1) return;
        erasing = true;
        timer = window.setTimeout(tick, 2400);
      } else if (erasing && n <= 0) {
        erasing = false;
        i++;
        timer = window.setTimeout(tick, 400);
      } else {
        timer = window.setTimeout(tick, erasing ? 22 : 55);
      }
    }
    timer = window.setTimeout(tick, 700);
    return () => window.clearTimeout(timer);
  }, [texts, paused]);
  return text;
}

/** Bold for the words that match the query. */
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  return text.split(/(\s+)/).map((part, i) =>
    terms.some((term) => normalize(part).startsWith(term)) ? (
      <mark key={i} className="bg-transparent font-semibold text-inherit">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function Kbd({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={`inline-flex min-w-5.5 items-center justify-center rounded-[5px] border border-line bg-white px-1.5 font-sans text-caption text-ink-soft ${className}`}
    >
      {children}
    </kbd>
  );
}

function SearchIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
