import Link from "next/link";

/**
 * Thin bar above the header on every page, pointing to /podcast. Styled like the
 * De Online School stamp (components/site/stamp.tsx): the green, pale spaced caps
 * in one weight, dotted underline on the link.
 */
export function PodcastBanner() {
  return (
    <div className="bg-green text-green-pale [--focus-ring:var(--color-white)]">
      <p className="container-wide flex items-center justify-center gap-3 py-2.5 text-center font-display text-caption font-semibold tracking-[0.1em] uppercase">
        <svg
          className="size-3.5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
        </svg>
        <span>
          De Thuisschool Podcast
          <span className="hidden md:inline">
            <span aria-hidden="true" className="mx-2.5 opacity-60">
              •
            </span>
            Volg je thuisonderwijs? Vertel je verhaal aan de micro.
          </span>
        </span>
        <span aria-hidden="true" className="opacity-60">
          •
        </span>
        <Link
          href="/podcast"
          className="whitespace-nowrap text-white underline decoration-dotted decoration-1 underline-offset-4 hover:text-green-pale"
        >
          Doe mee
        </Link>
      </p>
    </div>
  );
}
