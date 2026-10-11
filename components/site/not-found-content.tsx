import Link from "next/link";

export function NotFoundContent() {
  return (
    <main className="container-text pt-14 pb-20 md:pt-20">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-h1 text-ink">Deze pagina bestaat niet (meer)</h1>
      <p className="mt-4 max-w-[60ch] text-ink-soft">
        Misschien is de link verouderd of zit er een tikfout in het adres. Je antwoord staat vast tussen de
        veelgestelde vragen.
      </p>
      <Link href="/questions" className="btn btn-dark mt-8">
        Naar de veelgestelde vragen
      </Link>
    </main>
  );
}
