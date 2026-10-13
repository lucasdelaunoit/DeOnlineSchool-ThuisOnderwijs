"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowIcon } from "@/components/site/arrow-icon";
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
export function HeroSearch({ entries, prompts }: { entries: SearchEntry[]; prompts: string[] }) {
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
        <div className="group/field relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted transition-colors group-focus-within/field:text-green md:left-5.5" />
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
            placeholder={typed && !focused && !query ? typed : "Typ je vraag of een trefwoord"}
            value={query}
            onChange={(event) => update(event.target.value)}
            onFocus={() => {
              setOpen(true);
              setFocused(true);
            }}
            onBlur={() => setFocused(false)}
            onKeyDown={onKeyDown}
            className="input min-h-15 rounded-full border-white pr-14 pl-13 text-body shadow-hero transition-[box-shadow,border-color] duration-300 ease-out placeholder:text-muted hover:border-white focus-visible:border-white focus-visible:shadow-[var(--shadow-hero),0_0_0_5px_color-mix(in_srgb,var(--color-green-light)_45%,transparent)] focus-visible:outline-none md:min-h-17 md:pr-36 md:pl-14 md:text-[17px]"
          />
          <button type="submit" className="btn btn-primary absolute top-1/2 right-2 min-h-11 -translate-y-1/2 px-3.5 md:min-h-12.5 md:px-6">
            <span className="sr-only md:not-sr-only">Zoeken</span>
            <ArrowIcon className="size-5 md:hidden" />
          </button>
        </div>

        <div
          hidden={!expanded}
          className="absolute inset-x-0 top-full z-30 mt-3 origin-top overflow-hidden rounded-panel border border-line bg-white text-left shadow-popover transition-[opacity,translate,scale] duration-250 ease-out starting:-translate-y-1.5 starting:scale-[0.99] starting:opacity-0"
        >
          {results.length ? (
            <ul id={`${id}-list`} role="listbox" aria-label="Gevonden vragen" className="max-h-[min(26rem,60vh)] overflow-y-auto py-2">
              {results.map((entry, i) => (
                <li key={entry.slug} role="presentation">
                  <Link
                    id={`${id}-r${i}`}
                    role="option"
                    aria-selected={i === active}
                    tabIndex={-1}
                    href={`/questions/${entry.slug}`}
                    onMouseEnter={() => setActive(i)}
                    className="group flex gap-4 px-5 py-3.5 text-ink no-underline transition-colors duration-150 aria-selected:bg-mint md:px-6"
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
                    <ArrowIcon className="size-4.5 shrink-0 -translate-x-1 self-center text-green opacity-0 transition-[opacity,translate] duration-200 ease-out group-aria-selected:translate-x-0 group-aria-selected:opacity-100" />
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
        </div>
      </form>

      <p id={`${id}-status`} aria-live="polite" className="sr-only">
        {searching &&
          (results.length === 0 ? "Geen vragen gevonden"
          : results.length === 1 ? "1 vraag gevonden"
          : `${results.length} vragen gevonden`)}
      </p>

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

function SearchIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
