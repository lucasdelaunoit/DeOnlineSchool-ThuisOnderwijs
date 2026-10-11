import { STUDIO_URL } from "@/lib/links";

const polaroid = "absolute m-0 rounded-md bg-white px-2 pt-2 pb-9 shadow-photo";
const polaroidImg = "block aspect-[4/3] w-full rounded-[3px] object-cover";
const polaroidCaption = "absolute inset-x-0 bottom-2 text-center font-display font-extrabold text-navy";

// The `hero` class has no styles: public/js/main.js uses `header.hero` to place the stamp.
export function Hero() {
  return (
    <header className="hero relative overflow-hidden bg-studio pt-14 pb-16 text-studio-fg">
      <div className="wrap grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.25fr_.9fr]">
        <div>
          <span className="inline-flex items-center gap-2.5 rounded-md border-2 border-onair px-3.5 py-1.5 font-display text-[.8rem] font-extrabold tracking-[.2em] text-onair">
            <i className="size-2.5 animate-blink rounded-full bg-onair shadow-[0_0_12px_var(--color-onair)]"></i>ON AIR
          </span>
          <h1 className="mt-5 text-display font-extrabold">
            De Thuisschool <span className="text-accent">Podcast</span>
          </h1>
          <p className="mt-4.5 max-w-[46ch] text-[1.2rem] text-studio-muted">
            Volg jij ook <b className="text-studio-fg">thuisonderwijs</b>? Kom dan aan onze micro je verhaal vertellen.
            Want wie thuis leert, <b className="text-studio-fg">is niet alleen.</b>
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a className="btn btn-main" href="#inschrijven">
              Ik doe mee! 🎙️
            </a>
            <a className="btn btn-ghost" href="#hoe">
              Hoe werkt het?
            </a>
          </div>
          <p className="mt-5.5 text-[.95rem] text-studio-muted">
            {"Opnames in onze professionele studio "}
            <a className="underline" href={STUDIO_URL} target="_blank" rel="noopener">
              Podcastcontainer
            </a>
            {" in Maarkedal (Vlaamse Ardennen), op 20 minuten rijden van Gent."}
          </p>
        </div>
        <div className="relative mx-auto aspect-[1/1.12] w-full max-w-110 lg:max-w-full">
          <figure className={`${polaroid} top-0 left-0 w-[76%] -rotate-4`}>
            <img
              className={polaroidImg}
              src="/images/emile-henri.jpg"
              alt="Emile-Henri met koptelefoon aan de micro in de podcaststudio"
            />
            <figcaption className={`${polaroidCaption} pl-3 text-left text-[.92rem]`}>Emile-Henri, 14</figcaption>
          </figure>
          <figure
            className={`${polaroid} right-0 bottom-0 w-[60%] rotate-3 before:absolute before:-top-3.5 before:right-4.5 before:z-1 before:rotate-4 before:rounded-[5px] before:bg-onair before:px-2.5 before:py-1.25 before:font-display before:text-[.75rem] before:font-extrabold before:tracking-[.18em] before:text-white before:content-['ON_AIR']`}
          >
            <img
              className={polaroidImg}
              src="/images/juliette.jpg"
              alt="Juliette lacht met koptelefoon op aan de micro in de podcaststudio"
            />
            <figcaption className={`${polaroidCaption} text-[1rem]`}>Juliette, 10</figcaption>
          </figure>
        </div>
      </div>
    </header>
  );
}
