import { ONLINE_SCHOOL_SIGNUP_URL, ONLINE_SCHOOL_URL } from "@/lib/podcast-links";

const features = [
  { title: "33+ vakken", text: "Videolessen, oefeningen en quizzen voor het middelbaar" },
  { title: "Op je eigen tempo", text: "Met een duidelijke dagplanning, stap voor stap" },
  { title: "Ouderdashboard", text: "Ouders zien de vooruitgang zonder alles te moeten opvolgen" },
  { title: "Je bent niet alleen", text: "Een forum, vragenuurtjes en hulp van andere leerlingen" },
];

export function OnlineSchool() {
  return (
    <section className="section py-14" id="online-school">
      <div className="wrap">
        <div className="grid grid-cols-1 items-center gap-9 rounded-feature bg-os px-5.5 py-7 text-os-fg lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:p-10">
          <div>
            <span className="inline-block rounded-full bg-accent px-3 py-1.25 font-display text-[.78rem] font-extrabold tracking-[.12em] text-accent-ink uppercase">
              Van dezelfde makers
            </span>
            <h2 className="section-title mt-3.5 text-os-fg">De Online School</h2>
            <p className="mt-2 font-display text-[1.2rem] font-bold text-os-fg">
              De ontbrekende structuur voor een succesvol thuisonderwijs.
            </p>
            <p className="mt-3 max-w-[52ch] text-os-muted">
              Een complete, begeleide online middelbare school met videolessen, oefeningen en toetsen, afgestemd op de
              examencommissie.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a className="btn btn-main" href={ONLINE_SCHOOL_SIGNUP_URL} target="_blank" rel="noopener">
                Schrijf je gratis in
              </a>
              <a className="btn btn-ghost" href={ONLINE_SCHOOL_URL} target="_blank" rel="noopener">
                Ontdek De Online School
              </a>
            </div>
            <p className="mt-3 text-[.9rem] text-os-muted">Nu in beta: gratis, zonder betaalgegevens of verplichtingen.</p>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <li
                key={f.title}
                className="flex min-w-0 flex-col gap-1 rounded-card border border-white/14 bg-white/8 p-4"
              >
                <b className="font-display text-[1.1rem] text-os-fg">{f.title}</b>
                <span className="text-[.93rem] leading-[1.45] text-os-muted">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
