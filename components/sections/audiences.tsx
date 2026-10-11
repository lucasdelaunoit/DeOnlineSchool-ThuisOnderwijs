import { CtaRow } from "@/components/cta-row";

const audiences = [
  {
    title: "Iedereen die nieuwsgierig is",
    text: "Voor wie nog nooit van thuisonderwijs hoorde, of er vooral vooroordelen over kent. We vertellen hoe het echt gaat.",
    border: "border-accent",
  },
  {
    title: "Gezinnen die twijfelen",
    text: "Voor ouders en kinderen die erover nadenken of net gestart zijn. Hier hoor je hoe anderen het aanpakken.",
    border: "border-accent",
  },
  {
    title: "Thuisleerders die zich soms alleen voelen",
    text: "Voor kinderen die al thuisonderwijs volgen. Luister en ontdek: er zijn er nog veel zoals jij.",
    border: "border-leaf",
  },
];

export function Audiences() {
  return (
    <section className="section band">
      <div className="wrap">
        <span className="eyebrow">Voor wie maken we dit?</span>
        <h2 className="section-title">Eén podcast, drie soorten luisteraars</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {audiences.map((a) => (
            <div key={a.title} className={`border-t-4 pt-4 ${a.border}`}>
              <h3 className="text-[1.25rem]">{a.title}</h3>
              <p className="mt-1.5 text-muted">{a.text}</p>
            </div>
          ))}
        </div>
        <CtaRow label="Schrijf je hier in →">Herken je jezelf? Dan willen we jou horen!</CtaRow>
      </div>
    </section>
  );
}
