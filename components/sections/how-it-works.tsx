import { CtaRow } from "@/components/cta-row";
import { ONLINE_SCHOOL_URL } from "@/lib/links";

const steps = [
  { title: "Je schrijft je in", text: "Samen met je mama of papa vul je het formulier hieronder in." },
  { title: "We maken kennis", text: "We nemen contact op met je ouders om een datum te prikken." },
  {
    title: "Opname in de studio",
    text: "In Maarkedal schuif je met 1 of 2 gasten aan tafel bij Emile-Henri en Juliette.",
  },
  { title: "Jouw aflevering is online", text: "Je verhaal is te horen en te zien op al onze kanalen." },
];

const platforms = ["Spotify", "YouTube", "Facebook", "TikTok", "Instagram"];

const pill = "rounded-full border-[1.5px] bg-canvas px-4 py-1.5 text-[.95rem] font-bold";

export function HowItWorks() {
  return (
    <section className="section" id="hoe">
      <div className="wrap">
        <span className="eyebrow">Hoe werkt het?</span>
        <h2 className="section-title">Van inschrijving tot aflevering</h2>
        <ol className="mt-8 grid grid-cols-1 gap-5.5 [counter-reset:step] md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.title}
              className="min-w-0 [counter-increment:step] before:mb-3 before:grid before:size-11 before:place-items-center before:rounded-full before:bg-ink before:font-display before:text-[1.2rem] before:font-extrabold before:text-canvas before:content-[counter(step)]"
            >
              <h3 className="text-[1.15rem]">{step.title}</h3>
              <p className="mt-1 text-[.98rem] text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="lead mt-9">Te horen en te zien op:</p>
        <div className="mt-5.5 flex flex-wrap gap-2.5">
          {platforms.map((p) => (
            <span key={p} className={`${pill} border-line`}>
              {p}
            </span>
          ))}
          <a
            className={`${pill} border-leaf text-leaf hover:bg-leaf hover:text-white`}
            href={ONLINE_SCHOOL_URL}
            target="_blank"
            rel="noopener"
          >
            Website van De Online School ↗
          </a>
        </div>
        <figure className="mt-9">
          <img
            className="block aspect-video w-full rounded-card object-cover object-[50%_60%]"
            src="/images/studio-podcastcontainer.jpg"
            alt="Emile-Henri aan de ronde tafel in de Podcastcontainer, met micro's, schermen, studiolampen en de mengtafel"
          />
          <figcaption className="mt-2.5 text-[.95rem] text-muted">
            Zo ziet de Podcastcontainer er vanbinnen uit: micro&apos;s, koptelefoons, camera&apos;s en studiolampen. Jij
            zit aan deze tafel!
          </figcaption>
        </figure>
        <CtaRow label="Ik wil aan tafel zitten →">
          Inschrijven duurt maar 3 minuutjes, samen met je mama of papa.
        </CtaRow>
      </div>
    </section>
  );
}
