import Link from "next/link";

/** Thin bar above the header on every page, pointing to /podcast. */
export function PodcastBanner() {
  return (
    <div className="bg-ink text-ink-fg [--focus-ring:var(--color-white)]">
      <p className="container-wide flex items-center justify-center gap-2.5 py-2 text-center text-meta">
        <svg
          className="size-4 shrink-0 text-green-pale"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
        </svg>
        <span>
          <span className="font-semibold text-white">De Thuisschool Podcast</span>
          <span className="hidden sm:inline"> · Volg je thuisonderwijs? Vertel je verhaal aan de micro.</span>
        </span>
        <Link href="/podcast" className="font-semibold whitespace-nowrap text-white underline hover:text-green-pale">
          Doe mee <span aria-hidden="true">→</span>
        </Link>
      </p>
    </div>
  );
}
