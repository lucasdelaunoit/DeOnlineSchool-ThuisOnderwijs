import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { PodcastBanner } from "@/components/site/podcast-banner";
import { Stamp } from "@/components/site/stamp";
import { siteFonts } from "@/lib/site-fonts";
import { SITE_NAME } from "@/lib/site";
import "./site.css";

// Root layout for the whole site except /podcast, which has its own look in
// app/(podcast)/. Moving between the two is a full page load.

export const metadata: Metadata = {
  title: { template: `%s | ${SITE_NAME}`, default: SITE_NAME },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f6f2",
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl-BE" className={siteFonts}>
      <body className="flex min-h-dvh flex-col">
        <PodcastBanner />
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <Stamp />
      </body>
    </html>
  );
}
