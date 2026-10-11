import type { Metadata } from "next";
import Script from "next/script";
import { Audiences } from "@/components/podcast/audiences";
import { Faq } from "@/components/podcast/faq";
import { Footer } from "@/components/podcast/footer";
import { Hero } from "@/components/podcast/hero";
import { Hosts } from "@/components/podcast/hosts";
import { HowItWorks } from "@/components/podcast/how-it-works";
import { Location } from "@/components/podcast/location";
import { OnlineSchool } from "@/components/podcast/online-school";
import { SignUp } from "@/components/podcast/sign-up";
import { Stamp } from "@/components/podcast/stamp";
import { Topics } from "@/components/podcast/topics";

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
