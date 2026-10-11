import { Fraunces, Inter } from "next/font/google";

// Self-hosted fonts for the site, used by app/(site)/layout.tsx and
// app/global-not-found.tsx. styles/site/theme.css refers to them by family name,
// like the podcast theme does, so glyphs they lack fall back to the system fonts
// listed there.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

/** Class names for <html>. */
export const siteFonts = `${fraunces.variable} ${inter.variable}`;
