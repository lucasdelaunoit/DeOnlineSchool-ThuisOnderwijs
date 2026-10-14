"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { likeExperience } from "@/lib/server/comments";
import type { ExperienceItem } from "@/lib/server/experiences";

/** Cards shown at first, and added by each click on "Meer ervaringen". */
const PAGE = 6;

const SORTS = {
  newest: "Nieuwste eerst",
  oldest: "Oudste eerst",
  likes: "Meeste hartjes",
};
type Sort = keyof typeof SORTS;

/**
 * The title row with the sort menu, then the cards: a row to swipe through on phones
 * (the next card peeks in), two columns from `md`. `items` come newest first. The order
 * follows the likes from the server, not the hearts clicked here, so a card never jumps
 * away under the pointer.
 */
export function ExperienceBoard({ slug, items }: { slug: string; items: ExperienceItem[] }) {
  const [sort, setSort] = useState<Sort>("newest");
  const [shown, setShown] = useState(PAGE);
  const sorted = useMemo(() => {
    if (sort === "oldest") return items.toReversed();
    if (sort === "likes") return items.toSorted((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    return items;
  }, [items, sort]);

  const liked = useLiked();
  // Counts after a click here, until the server sends new ones with the page.
  const [counts, setCounts] = useState<Record<string, number>>({});
  // The card just liked: its heart plays the pop once.
  const [popped, setPopped] = useState<string | null>(null);
  const busy = useRef(new Set<string>());

  function toggle(e: ExperienceItem) {
    if (e.likes === undefined || busy.current.has(e.key)) return;
    const id = `${slug}/${e.key}`;
    const was = liked.has(id);
    const before = counts[e.key] ?? e.likes;
    const revert = () => {
      setLiked(id, was);
      setCounts((c) => ({ ...c, [e.key]: before }));
    };
    setLiked(id, !was);
    setCounts((c) => ({ ...c, [e.key]: Math.max(before + (was ? -1 : 1), 0) }));
    setPopped(was ? null : e.key);
    busy.current.add(e.key);
    likeExperience(slug, e.key, !was)
      .then((n) => (n === null ? revert() : setCounts((c) => ({ ...c, [e.key]: n }))))
      .catch(revert)
      .finally(() => busy.current.delete(e.key));
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div className="min-w-0">
          <h2 id="experiences" className="section-title">
            Ervaringen
          </h2>
          <p className="section-intro">
            {items.length ?
              "Echte ervaringen van leerlingen en ouders. Wat wij samenvatten, staat onder een gefingeerde naam."
            : "Nog geen ervaringen bij deze vraag. Deel als eerste de jouwe hieronder."}
          </p>
        </div>
        {items.length > 1 && (
          <label className="flex items-center gap-2.5 text-meta font-medium text-muted">
            Sorteer
            <select
              className="input w-auto py-2"
              value={sort}
              onChange={(ev) => setSort(ev.target.value as Sort)}
            >
              {Object.entries(SORTS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {items.length > 0 && (
        <ul className="-mx-5 mt-7 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0">
          {sorted.slice(0, shown).map((e) => (
            <li key={e.key} className="reveal flex w-[84%] max-w-[360px] shrink-0 snap-start md:w-auto md:max-w-none">
              <ExperienceCard
                e={e}
                likes={counts[e.key] ?? e.likes}
                liked={liked.has(`${slug}/${e.key}`)}
                popped={popped === e.key}
                onLike={() => toggle(e)}
              />
            </li>
          ))}
        </ul>
      )}

      {sorted.length > shown && (
        <button
          type="button"
          className="btn btn-light mt-6 border border-line shadow-card"
          onClick={() => setShown((n) => n + PAGE)}
        >
          Meer ervaringen ({sorted.length - shown})
        </button>
      )}
    </>
  );
}

function ExperienceCard({
  e,
  likes,
  liked,
  popped,
  onLike,
}: {
  e: ExperienceItem;
  likes?: number;
  liked: boolean;
  popped: boolean;
  onLike: () => void;
}) {
  return (
    <figure className="flex w-full flex-col rounded-quote border border-line bg-white p-5 shadow-card md:p-6">
      {/* Opening quote: a round drop with a tail, twice. */}
      <svg viewBox="0 0 34 28" aria-hidden="true" className="h-5 w-auto shrink-0 self-start fill-green-light">
        <path d="M1 21C1 12 5.5 5.5 12.5 2.5L14 5C10 7 7.5 10.5 7.2 14.05A7 7 0 1 1 1 21Z" />
        <path d="M20 21C20 12 24.5 5.5 31.5 2.5L33 5C29 7 26.5 10.5 26.2 14.05A7 7 0 1 1 20 21Z" />
      </svg>
      <blockquote className="mt-3 text-body break-words whitespace-pre-line text-ink md:text-[17px]">
        {e.quote}
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-5">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mint font-semibold text-green"
        >
          {Array.from(e.name)[0]?.toUpperCase()}
        </span>
        <span className="min-w-0 text-meta text-muted">
          <span className="block text-small font-semibold text-ink">{e.name}</span>
          {e.role}
          {e.context && ` · ${e.context}`}
          {e.date && (
            <>
              {" · "}
              <time dateTime={e.date.iso}>{e.date.label}</time>
            </>
          )}
        </span>
        <button
          type="button"
          className="like"
          aria-pressed={liked}
          aria-label={likes ? `Vind ik leuk (${likes})` : "Vind ik leuk"}
          data-pop={popped || undefined}
          disabled={likes === undefined}
          onClick={onLike}
        >
          <span className="like-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </span>
          {!!likes && <span aria-hidden="true">{likes}</span>}
        </button>
      </figcaption>
    </figure>
  );
}

/*
 * Which cards this browser liked, as "<slug>/<key>" in localStorage, so a heart stays
 * filled on the next visit. Kept in memory too, for browsers that block storage.
 */
const STORE = "thuis-onderwijs:liked";
const listeners = new Set<() => void>();
let snapshot: string | undefined;

function readLiked() {
  if (snapshot === undefined) {
    try {
      snapshot = localStorage.getItem(STORE) ?? "[]";
    } catch {
      snapshot = "[]";
    }
  }
  return snapshot;
}

function subscribe(listener: () => void) {
  const onStorage = (ev: StorageEvent) => {
    if (ev.key !== STORE) return;
    snapshot = undefined;
    listener();
  };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function useLiked() {
  const raw = useSyncExternalStore(subscribe, readLiked, () => "[]");
  return useMemo(() => new Set(parseIds(raw)), [raw]);
}

function setLiked(id: string, on: boolean) {
  const ids = parseIds(readLiked()).filter((x) => x !== id);
  if (on) ids.push(id);
  snapshot = JSON.stringify(ids);
  try {
    localStorage.setItem(STORE, snapshot);
  } catch {
    // Storage blocked or full: the heart stays filled until the page is left.
  }
  for (const l of listeners) l();
}

function parseIds(raw: string): string[] {
  try {
    const v: unknown = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
