import { CtaRow } from "@/components/cta-row";

const topics = [
  "Hoe ziet een dag bij jou eruit?",
  "Waarom koos jouw gezin voor thuisonderwijs?",
  "Wat vind je er het leukst aan?",
  "Wat is soms moeilijk?",
  "Hoe maak jij vrienden?",
  "Hoe gaat het met de examencommissie?",
  "Welke rare vragen krijg je altijd?",
  "Wat zou je zeggen tegen iemand die twijfelt?",
];

export function Topics() {
  return (
    <section className="section band">
      <div className="wrap">
        <span className="eyebrow">Waarover praten we?</span>
        <h2 className="section-title">Je hoeft geen expert te zijn</h2>
        <p className="lead">Vertel gewoon jouw verhaal. Een paar vragen die we graag stellen:</p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {topics.map((t) => (
            <span key={t} className="rounded-field border border-dashed border-muted bg-surface px-3.5 py-2 text-[.98rem]">
              {t}
            </span>
          ))}
        </div>
        <CtaRow label="Schrijf je hier in →">Je hoeft niets voor te bereiden. Jouw verhaal is genoeg.</CtaRow>
      </div>
    </section>
  );
}
