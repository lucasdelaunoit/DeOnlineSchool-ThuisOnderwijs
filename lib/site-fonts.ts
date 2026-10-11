import { Commissioner } from "next/font/google";

// Self-hosted font for the site, used by app/(site)/layout.tsx and
// app/global-not-found.tsx. One family, Commissioner: plain for running text, with
// its "flare" axis (FLAR, flared stroke ends) for headings, the logo and the short
// answer — see .font-display in styles/site/base.css. styles/site/theme.css refers
// to it by family name, like the podcast theme does, so glyphs it lacks fall back
// to the system fonts listed there.
const commissioner = Commissioner({
  variable: "--font-commissioner",
  subsets: ["latin"],
  axes: ["FLAR"],
});

/** Class names for <html>. */
export const siteFonts = commissioner.variable;
