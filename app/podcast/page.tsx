import type { Metadata } from "next";
import Script from "next/script";
import { Audiences } from "@/components/sections/audiences";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Hosts } from "@/components/sections/hosts";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Location } from "@/components/sections/location";
import { OnlineSchool } from "@/components/sections/online-school";
import { SignUp } from "@/components/sections/sign-up";
import { Stamp } from "@/components/sections/stamp";
import { Topics } from "@/components/sections/topics";

const description =
  "Volg jij thuisonderwijs? Kom aan de micro bij Emile-Henri (14) en Juliette (10) in De Thuisschool Podcast en vertel je verhaal. Inschrijven is gratis.";

export const metadata: Metadata = {
  title: "De Thuisschool Podcast",
  description,
  openGraph: {
    type: "website",
    title: "De Thuisschool Podcast – Kom aan onze micro!",
    description,
    images: ["/images/emile-henri.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function PodcastPage() {
  return (
    <>
      <Hero />
      <main>
        <Hosts />
        <Audiences />
        <HowItWorks />
        <Topics />
        <SignUp />
        <Location />
        <OnlineSchool />
        <Faq />
      </main>
      <Stamp />
      <Footer />
      {/* Form handling and stamp animation, carried over unchanged from the static site. */}
      <Script src="/js/main.js" strategy="afterInteractive" />
    </>
  );
}
