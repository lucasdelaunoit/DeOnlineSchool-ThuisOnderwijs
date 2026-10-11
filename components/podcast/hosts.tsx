import { CtaRow } from "@/components/podcast/cta-row";

const hosts = [
  {
    name: "Emile-Henri",
    age: 14,
    img: "/images/emile-henri.jpg",
    alt: "Emile-Henri lacht met headset op aan de studiotafel",
    position: "object-[38%_32%]",
    text: "Stelt de vragen en zorgt dat het gesprek vlot loopt. Wil laten horen hoe thuisonderwijs echt is.",
  },
  {
    name: "Juliette",
    age: 10,
    img: "/images/juliette.jpg",
    alt: "Juliette in de studio",
    position: "object-[55%_40%]",
    text: "Is nieuwsgierig naar hoe andere kinderen thuis leren, spelen en vrienden maken.",
  },
];

export function Hosts() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <span className="eyebrow">Wie zijn wij?</span>
        <h2 className="section-title">Twee thuisschoolkinderen met een micro</h2>
        <p className="lead">
          We krijgen allebei thuisonderwijs en we merken dat veel mensen niet goed weten wat dat is. Daarom maken we een
          podcast, samen met andere kinderen en jongeren die thuis leren.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {hosts.map((host) => (
            <article
              key={host.name}
              className="flex flex-col items-start overflow-hidden rounded-card border border-line bg-surface"
            >
              <img className={`block aspect-[16/10] w-full object-cover ${host.position}`} src={host.img} alt={host.alt} />
              <div className="px-6 pt-5 pb-6">
                <h3 className="text-[1.35rem]">{host.name}</h3>
                <span className="text-[.95rem] font-semibold text-muted">{`${host.age} jaar · thuisonderwijs`}</span>
                <p className="mt-2">{host.text}</p>
              </div>
            </article>
          ))}
        </div>
        <CtaRow label="Schrijf je hier in →">Kom samen met Emile-Henri en Juliette aan de micro.</CtaRow>
      </div>
    </section>
  );
}
