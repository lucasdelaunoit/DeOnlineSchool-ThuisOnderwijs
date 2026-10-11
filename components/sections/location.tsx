import { STUDIO_URL } from "@/lib/links";

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Maarkedal%2C+Belgi%C3%AB";
const VIDEO_URL = "https://www.youtube.com/watch?v=be6exnHWnYI";

const facts = [
  { value: "± 20 min", label: "vanaf Gent" },
  { value: "± 10 min", label: "vanaf Oudenaarde" },
];

export function Location() {
  return (
    <section className="section band" id="waar">
      {/* Mobile: text, map, video. Desktop: text | map, video full width below. */}
      <div className="wrap grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div className="order-1 min-w-0">
          <span className="eyebrow">Waar nemen we op?</span>
          <h2 className="section-title">In de Vlaamse Ardennen</h2>
          <p className="lead">
            We nemen op in Podcastcontainer, onze professionele podcaststudio in Maarkedal, tussen de heuvels van de
            Vlaamse Ardennen. Vanuit Gent rij je er in ongeveer 20 minuten naartoe, vanuit Oudenaarde en Ronse nog sneller.
          </p>
          <ul className="mt-6 mb-6.5 flex flex-wrap gap-3">
            {facts.map((f) => (
              <li key={f.label} className="flex flex-col rounded-xl border border-line bg-canvas px-4 py-2.5">
                <b className="font-display text-[1.25rem]">{f.value}</b>
                <span className="text-[.9rem] text-muted">{f.label}</span>
              </li>
            ))}
          </ul>
          <a className="btn btn-main" href={MAPS_URL} target="_blank" rel="noopener">
            Bekijk op Google Maps
          </a>{" "}
          <a className="btn btn-ghost ml-1.5" href={STUDIO_URL} target="_blank" rel="noopener">
            Bekijk de studio
          </a>
          <p className="note mt-3">Het juiste adres krijg je wanneer we samen een datum afspreken.</p>
        </div>
        <VideoCard />
        <Map />
      </div>
    </section>
  );
}

function VideoCard() {
  return (
    <a
      className="group order-3 col-span-full mt-2 grid grid-cols-1 overflow-hidden rounded-card bg-studio text-studio-fg focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
      href={VIDEO_URL}
      target="_blank"
      rel="noopener"
    >
      <span className="relative grid min-h-50 grid-cols-2" aria-hidden="true">
        <img className="block size-full object-cover" src="/images/emile-henri-2025.jpg" alt="" />
        <img className="block size-full object-cover" src="/images/juliette.jpg" alt="" />
        <span className="absolute inset-0 m-auto grid size-18 place-items-center rounded-full bg-onair text-white shadow-float transition-transform duration-150 ease-[ease] group-hover:scale-108">
          <svg viewBox="0 0 24 24" width="34" height="34">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        </span>
      </span>
      <span className="flex flex-col justify-center gap-2 p-6.5">
        <span className="eyebrow text-accent">Al eens gedaan</span>
        <strong className="font-display text-[1.5rem] leading-[1.15]">Bekijk onze eerste podcast samen</strong>
        <span className="text-studio-muted">
          Vorig jaar namen Emile-Henri en Juliette al een aflevering op in onze studio. Zo zie je meteen hoe het eraan
          toegaat.
        </span>
        <span className="font-display font-bold text-accent">Bekijk op YouTube →</span>
      </span>
    </a>
  );
}

const label = "font-sans text-[14px] font-bold fill-ink";
const labelBig = "font-display text-[19px] font-extrabold fill-ink";
const labelSmall = "font-sans text-[12px] font-semibold fill-muted";

function Map() {
  return (
    <figure
      className="order-2 m-0 max-w-full"
      aria-label="Kaartje: Maarkedal ligt ten zuiden van Gent, vlak bij Oudenaarde en Ronse"
    >
      <svg className="block h-auto w-full" viewBox="0 0 400 360" role="img">
        <rect className="fill-map-bg" x="0" y="0" width="400" height="360" rx="18" />
        <g className="fill-map-hill">
          <path d="M175 330 Q205 285 235 330 Z" />
          <path d="M215 330 Q250 278 285 330 Z" />
          <path d="M255 335 Q290 290 325 335 Z" />
          <path d="M195 300 Q222 262 250 300 Z" />
          <path d="M268 300 Q300 258 332 300 Z" />
        </g>
        <path
          className="stroke-map-river"
          d="M140 360 C185 305 212 265 229 228 S272 120 300 40 L310 0"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <text className="font-sans text-[13px] font-bold italic fill-map-river" x="196" y="150">
          Schelde
        </text>
        <path
          className="stroke-accent"
          d="M297 52 C300 120 280 200 258 262"
          fill="none"
          strokeWidth="4"
          strokeDasharray="8 7"
          strokeLinecap="round"
        />
        <g transform="translate(290 155)">
          <rect className="fill-accent" x="-6" y="-16" width="86" height="28" rx="14" />
          <text className="font-display text-[14px] font-extrabold fill-accent-ink" x="37" y="3" textAnchor="middle">
            ± 20 min
          </text>
        </g>
        <circle className="fill-map-dot" cx="297" cy="48" r="9" />
        <text className={labelBig} x="312" y="54">
          Gent
        </text>
        <circle className="fill-map-dot" cx="229" cy="225" r="6" />
        <text className={label} x="140" y="230">
          Oudenaarde
        </text>
        <circle className="fill-map-dot" cx="229" cy="318" r="6" />
        <text className={label} x="180" y="345">
          Ronse
        </text>
        <circle className="fill-map-dot" cx="40" cy="243" r="6" />
        <text className={label} x="22" y="268">
          Kortrijk
        </text>
        <g transform="translate(258 270)">
          <path className="fill-onair" d="M0 0 C-16 -18 -18 -26 -18 -34 A18 18 0 1 1 18 -34 C18 -26 16 -18 0 0 Z" />
          <circle className="fill-map-bg" cx="0" cy="-34" r="8" />
        </g>
        <text className={labelBig} x="284" y="252">
          Maarkedal
        </text>
        <text className={labelSmall} x="284" y="272">
          onze studio
        </text>
        <text className={labelSmall} x="300" y="350">
          Vlaamse Ardennen
        </text>
      </svg>
    </figure>
  );
}
