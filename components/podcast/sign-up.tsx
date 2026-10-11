import { ONLINE_SCHOOL_URL } from "@/lib/podcast-links";

// Element ids are used by public/js/main.js (validation, sending, result panels).

const topics = [
  "Mijn dag thuis",
  "Waarom we kozen voor thuisonderwijs",
  "Vrienden en sociaal leven",
  "Hobby's en sport",
  "De examencommissie",
  "Leren op mijn eigen tempo",
];

const legend = "mb-3.5 p-0 font-display text-[1.25rem] font-extrabold";
const resultPanel = "mt-7 rounded-panel border-2 bg-surface p-5 md:p-7";
const chipButton =
  "cursor-pointer rounded-full border-[1.5px] border-line bg-transparent px-4 py-2 font-bold focus-visible:outline-3 focus-visible:outline-leaf";

export function SignUp() {
  return (
    <section className="section" id="signup">
      <div className="wrap max-w-180">
        <span className="eyebrow">Inschrijven</span>
        <h2 className="section-title">Kom aan onze micro!</h2>
        <p className="lead">
          Vul dit samen met je mama of papa in. Druk daarna op versturen en je inschrijving komt meteen bij ons binnen.
        </p>

        <form id="form" className="mt-7 rounded-panel border border-line bg-surface p-5 md:p-8" noValidate>
          {/* Honeypot against bots */}
          <div className="absolute! -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
            <label className="label" htmlFor="website">
              Laat dit veld leeg
            </label>
            <input className="input" id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <fieldset className="mb-7">
            <legend className={legend}>Over jou</legend>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="field">
                <label className="label" htmlFor="first-name">
                  Voornaam
                </label>
                <input className="input" id="first-name" type="text" required autoComplete="given-name" />
              </div>
              <div className="field">
                <label className="label" htmlFor="age">
                  Leeftijd
                </label>
                <input className="input" id="age" type="number" min={6} max={20} required />
              </div>
              <div className="field">
                <label className="label" htmlFor="town">
                  Woonplaats
                </label>
                <input className="input" id="town" type="text" required />
              </div>
              <div className="field">
                <label className="label" htmlFor="since">
                  Thuisonderwijs sinds
                </label>
                <select className="input" id="since" required>
                  <option value="">Kies…</option>
                  <option>Minder dan 1 jaar</option>
                  <option>1 tot 3 jaar</option>
                  <option>Meer dan 3 jaar</option>
                  <option>Altijd al</option>
                </select>
              </div>
              <div className="field col-span-full">
                <label className="label" htmlFor="guests">
                  Kom je alleen of met iemand?
                </label>
                <select className="input" id="guests">
                  <option>Alleen</option>
                  <option>Met een broer of zus</option>
                  <option>Met een vriend of vriendin die ook thuisonderwijs volgt</option>
                </select>
              </div>
              <div className="field col-span-full">
                <label className="label" htmlFor="second-guest">
                  Naam en leeftijd van de tweede gast <small>(als je niet alleen komt)</small>
                </label>
                <input className="input" id="second-guest" type="text" />
              </div>
            </div>
          </fieldset>

          <fieldset className="mb-7">
            <legend className={legend}>Waarover wil je graag praten?</legend>
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2" id="topics">
              {topics.map((t) => (
                <label key={t} className="check">
                  <input type="checkbox" value={t} />
                  {t}
                </label>
              ))}
            </div>
            <div className="field mt-4">
              <label className="label" htmlFor="story">
                Vertel ons iets over jezelf <small>(mag kort)</small>
              </label>
              <textarea
                className="input min-h-27.5 resize-y"
                id="story"
                placeholder="Bijvoorbeeld: ik leer thuis met mijn twee zussen en ik ben gek op paarden…"
              ></textarea>
            </div>
          </fieldset>

          <fieldset className="mb-7">
            <legend className={legend}>Gegevens van je ouder</legend>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="field">
                <label className="label" htmlFor="parent">
                  Naam ouder
                </label>
                <input className="input" id="parent" type="text" required autoComplete="name" />
              </div>
              <div className="field">
                <label className="label" htmlFor="phone">
                  Gsm-nummer
                </label>
                <input className="input" id="phone" type="tel" required autoComplete="tel" />
              </div>
              <div className="field col-span-full">
                <label className="label" htmlFor="email">
                  E-mailadres
                </label>
                <input className="input" id="email" type="email" required autoComplete="email" />
              </div>
            </div>
          </fieldset>

          <div className="grid gap-3 rounded-xl bg-canvas p-4">
            <label className="check">
              <input type="checkbox" id="consent-1" required />
              Ik ben de ouder en ik geef toestemming dat mijn kind meedoet aan De Thuisschool Podcast.
            </label>
            <label className="check">
              <input type="checkbox" id="consent-2" required />
              Ik geef toestemming dat de opname (geluid en beeld) en foto&apos;s van de opname verschijnen op Spotify,
              YouTube, Facebook, TikTok, Instagram en de website van de Online School.
            </label>
          </div>
          <Terms />
          <label className="check mt-3.5 rounded-xl border-[1.5px] border-leaf bg-leaf-tint px-4 py-3.5">
            <input type="checkbox" id="consent-3" required />
            Ik heb de algemene voorwaarden en de privacyverklaring gelezen en ik ga ermee akkoord.
          </label>
          <p className="mt-3 font-bold text-onair" id="err" hidden></p>
          <div className="mt-5.5 flex flex-wrap items-center gap-3">
            {/* leading-[normal]: a <button> keeps the browser's line height, unlike the <a> buttons */}
            <button
              className="btn btn-main leading-[normal] disabled:cursor-wait disabled:opacity-60"
              type="submit"
              id="submitbtn"
            >
              Verstuur mijn inschrijving
            </button>
            <span className="note" id="sending" aria-live="polite"></span>
          </div>
        </form>

        <div className={`${resultPanel} border-accent`} id="sent" hidden tabIndex={-1}>
          <h3 className="text-[1.5rem]">
            Bedankt, <span id="sname"></span>! 🎉
          </h3>
          <p className="mt-2">
            Je inschrijving is goed aangekomen. Je mama of papa krijgt zo meteen een bevestiging per e-mail. We nemen
            binnenkort contact op om een datum te prikken.
          </p>
          <p className="mt-2">
            Tot snel aan de micro!
            <br />
            <b>Emile-Henri &amp; Juliette</b>
          </p>
          <p className="note mt-3">Geen bevestiging gekregen? Kijk even in je spammap.</p>
        </div>

        <div className={`${resultPanel} border-leaf`} id="result" hidden>
          <h3 className="text-[1.5rem]">
            Bijna klaar, <span id="rname"></span>!
          </h3>
          <p className="mt-2">
            Automatisch versturen lukte even niet. Geen zorgen: je gegevens staan klaar. Verstuur je inschrijving via
            e-mail of WhatsApp. Pas als je in die app op <b>versturen</b> drukt, komt ze bij ons aan.
          </p>
          <div className="mt-4.5 flex flex-wrap gap-3">
            <a className="btn btn-mail" id="mailbtn" href="#" target="_blank" rel="noopener">
              Verstuur via e-mail
            </a>
            <a className="btn btn-wa" id="wabtn" href="#" target="_blank" rel="noopener">
              Verstuur via WhatsApp
            </a>
          </div>
          <p className="note mt-3.5">
            {"Werkt geen van beide knoppen? Kopieer dan de tekst hieronder en stuur ze naar "}
            <b className="select-all">paulhenri@pauldepierre.com</b>
            {" of via WhatsApp naar "}
            <b className="select-all">+32 472 60 92 00</b>.
          </p>
          <pre
            className="mt-4.5 mb-[1em] max-h-75 overflow-auto rounded-xl bg-canvas p-4 font-sans text-[.95rem] whitespace-pre-wrap [word-break:break-word]"
            id="summary"
          ></pre>
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <button className={chipButton} type="button" id="copy">
              Kopieer tekst
            </button>
            <span className="note" id="copied" aria-live="polite"></span>
            <button className={chipButton} type="button" id="edit">
              Iets aanpassen
            </button>
          </div>
          <p className="mt-5 border-t border-line pt-4 text-muted">
            {"Op zoek naar meer structuur in je thuisonderwijs? Kijk eens bij "}
            <a className="font-bold text-leaf underline" href={ONLINE_SCHOOL_URL} target="_blank" rel="noopener">
              De Online School
            </a>
            , nu gratis in beta.
          </p>
        </div>
      </div>
    </section>
  );
}

function Terms() {
  return (
    <details
      className="disclosure mt-6 overflow-hidden rounded-xl border-[1.5px] border-line p-0"
      id="terms"
    >
      <summary className="bg-canvas px-4 py-3.5 text-[1.05rem]">Lees de algemene voorwaarden en privacyverklaring</summary>
      <div className="terms-body">
        <p>Versie van 7 oktober 2026. Deze voorwaarden gelden voor de inschrijving en de deelname aan De Thuisschool Podcast.</p>
        <h4>1. Wie is verantwoordelijk?</h4>
        <p>
          De Thuisschool Podcast is een project van Emile-Henri en Juliette, onder verantwoordelijkheid van hun ouder
          Paul-Henri, in samenwerking met de Online School. Contact over je gegevens: paulhenri@pauldepierre.com.
        </p>
        <h4>2. Welke gegevens verzamelen we?</h4>
        <ul>
          <li>
            Van het kind: voornaam, leeftijd, woonplaats, ervaring met thuisonderwijs en wat het zelf vertelt in het
            formulier.
          </li>
          <li>Van de ouder: naam, gsm-nummer en e-mailadres.</li>
          <li>Bij deelname: geluids- en beeldopnames en foto&apos;s van de opname.</li>
        </ul>
        <h4>3. Waarvoor gebruiken we ze?</h4>
        <p>
          Alleen om contact op te nemen, een opname in te plannen en de aflevering te maken en te publiceren. We verkopen
          je gegevens niet en geven ze niet door voor reclame.
        </p>
        <h4>4. Op welke basis?</h4>
        <p>
          Op basis van de toestemming van de ouder of voogd. Voor kinderen jonger dan 13 jaar is die toestemming in België
          verplicht. We vragen ook voor oudere kinderen altijd de toestemming van een ouder.
        </p>
        <h4>5. Publicatie en beeldrecht</h4>
        <p>
          De aflevering verschijnt op Spotify, YouTube, Facebook, TikTok, Instagram en de website van de Online School. In
          de aflevering gebruiken we enkel de voornaam van het kind, nooit de achternaam, het adres of de school. Op vraag
          kan de ouder de aflevering bekijken voor ze gepubliceerd wordt.
        </p>
        <h4>6. Hoe lang bewaren we de gegevens?</h4>
        <p>
          Gegevens van wie uiteindelijk niet deelneemt, wissen we binnen 6 maanden. Van deelnemers bewaren we de
          contactgegevens zolang de aflevering online staat, zodat we je kunnen bereiken over je aflevering.
        </p>
        <h4>7. Je rechten</h4>
        <p>
          Je mag je gegevens altijd inkijken, laten verbeteren of laten wissen, en je toestemming intrekken. Stuur daarvoor
          een e-mail naar paulhenri@pauldepierre.com. Trek je je toestemming in na publicatie, dan halen we de aflevering
          of het fragment binnen 30 dagen weg van onze eigen kanalen. Kopieën die anderen al gedeeld of gedownload hebben,
          kunnen we niet controleren.
        </p>
        <p>
          Ben je niet tevreden over hoe we met je gegevens omgaan, dan kan je een klacht indienen bij de
          Gegevensbeschermingsautoriteit (gegevensbeschermingsautoriteit.be).
        </p>
        <h4>8. Versturen van je inschrijving</h4>
        <p>
          Je inschrijving wordt via onze website per e-mail naar ons verstuurd en niet op de website bewaard. Lukt dat niet
          en verstuur je ze zelf via e-mail of WhatsApp, dan gelden ook de privacyregels van je e-maildienst of van
          WhatsApp.
        </p>
        <h4>9. Deelname</h4>
        <p>
          Meedoen is gratis en vrijwillig, en er is geen vergoeding. Een kind mag altijd stoppen, ook tijdens de opname. De
          ouder blijft verantwoordelijk voor het kind tijdens het bezoek aan de studio. Wij kiezen welke inschrijvingen we
          uitnodigen, en we mogen een opname inkorten of monteren.
        </p>
      </div>
    </details>
  );
}
