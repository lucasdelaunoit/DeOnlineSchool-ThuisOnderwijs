import type { Viewport } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Nunito_Sans } from "next/font/google";
import "./podcast.css";

// Root layout for /podcast only: it has its own look (styles/podcast/), separate
// from the rest of the site in app/(site)/.

// Self-hosted fonts. styles/podcast/theme.css refers to them by family name
// ("Bricolage Grotesque", "Nunito Sans") rather than through the generated
// variables, so glyphs these fonts lack (→, ★, emoji) fall back to the system
// fonts listed there instead of next/font's metric-adjusted Arial. Turbopack
// ignores `adjustFontFallback: false`, which would otherwise do this.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
});

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function PodcastLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl-BE" className={`${bricolage.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
