import Link from "next/link";

// Placeholder until the landing page is designed.
export default function HomePage() {
  return (
    <main className="container-text pt-14 pb-20 md:pt-20">
      <h1 className="text-h1 text-ink">Thuisonderwijs in Vlaanderen</h1>
      <p className="mt-4 max-w-[60ch] text-ink-soft">
        Antwoorden op je vragen over thuisonderwijs en de Examencommissie, en De Thuisschool Podcast.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/questions" className="btn btn-dark">
          Veelgestelde vragen
        </Link>
        <Link href="/podcast" className="btn border border-line-strong bg-white text-ink hover:text-ink">
          De Thuisschool Podcast
        </Link>
      </div>
    </main>
  );
}
