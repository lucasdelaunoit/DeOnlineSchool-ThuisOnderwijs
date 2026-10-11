import type { Viewport } from "next";
import { Bricolage_Grotesque, Nunito_Sans } from "next/font/google";
import "./globals.css";

// Self-hosted fonts. styles/theme.css refers to them by family name
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl-BE" className={`${bricolage.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
