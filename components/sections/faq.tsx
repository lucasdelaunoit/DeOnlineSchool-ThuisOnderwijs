const questions = [
  {
    q: "Moet ik goed kunnen praten?",
    a: "Nee hoor. Je hoeft niets voor te bereiden of perfect te praten. Emile-Henri en Juliette stellen de vragen, jij vertelt gewoon hoe het bij jou is.",
  },
  {
    q: "Wat als ik zenuwachtig ben?",
    a: "Dat is heel normaal, wij waren dat ook. Voor de opname maken we eerst rustig kennis en tonen we je de studio.",
  },
  { q: "Mag mijn mama of papa mee?", a: "Ja, je ouder komt mee naar de studio in Maarkedal en kan de opname volgen." },
  {
    q: "Mag ik met iemand samen komen?",
    a: "Ja. Aan tafel is plaats voor 1 of 2 gasten. Je kan dus een broer, zus, vriend of vriendin meebrengen die ook thuisonderwijs volgt.",
  },
  { q: "Kost het iets?", a: "Nee, meedoen is gratis." },
  {
    q: "Waar is de studio?",
    a: "In Maarkedal, in de Vlaamse Ardennen, op ongeveer 20 minuten rijden van Gent. Het juiste adres krijg je wanneer we een datum afspreken.",
  },
];

export function Faq() {
  return (
    <section className="section">
      <div className="wrap max-w-180">
        <span className="eyebrow">Vragen</span>
        <h2 className="section-title">Wat je misschien wil weten</h2>
        <div className="mt-5">
          {questions.map(({ q, a }) => (
            <details key={q} className="disclosure">
              <summary>{q}</summary>
              <p className="mt-2 text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
