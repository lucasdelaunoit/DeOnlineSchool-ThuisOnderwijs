import { ONLINE_SCHOOL_URL } from "@/lib/podcast-links";

const WHATSAPP_URL =
  "https://wa.me/32484562387?text=Hallo%20Emile-Henri%2C%20ik%20heb%20een%20vraag%20over%20De%20Thuisschool%20Podcast%3A%20";

// Phone number / e-mail: easy to select in one tap.
const contact = "font-display font-bold text-studio-fg select-all";

export function Footer() {
  return (
    <footer className="bg-studio py-12 text-studio-fg">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-[1.3rem]">Nog een vraag?</h3>
            <p className="text-studio-muted">Stuur een WhatsApp-bericht naar Emile-Henri:</p>
            <p className={`${contact} text-[1.15rem]`}>+32 484 56 23 87</p>
            <a className="btn btn-main mt-3.5" href={WHATSAPP_URL} target="_blank" rel="noopener">
              Vraag het via WhatsApp
            </a>
          </div>
          <div>
            <h3 className="mb-2 text-[1.3rem]">Inschrijvingen</h3>
            <p className="text-studio-muted">Lukt het formulier niet? Stuur je inschrijving dan naar:</p>
            <p className={`${contact} text-[1.15rem]`}>paulhenri@pauldepierre.com</p>
            <p className="mt-1.5 text-studio-muted">
              of via WhatsApp naar <span className={`${contact} text-[1rem]`}>+32 472 60 92 00</span>
            </p>
          </div>
        </div>
        <p className="mt-9 text-[.85rem] text-studio-muted">
          <a className="underline" href="#terms" id="terms-link">
            Algemene voorwaarden en privacy
          </a>
          {" · De Thuisschool Podcast · een project van Emile-Henri en Juliette, in samenwerking met "}
          <a className="underline" href={ONLINE_SCHOOL_URL} target="_blank" rel="noopener">
            De Online School
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
