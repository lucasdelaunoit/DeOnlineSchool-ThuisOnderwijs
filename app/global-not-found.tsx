import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { NotFoundContent } from "@/components/site/not-found-content";
import { PodcastBanner } from "@/components/site/podcast-banner";
import { Stamp } from "@/components/site/stamp";
import { SITE_NAME } from "@/lib/site";
import { siteFonts } from "@/lib/site-fonts";
import "./(site)/site.css";

// URLs that match no route at all. With two root layouts there is no single
// layout to wrap a 404 in, so this page brings its own <html> (site look).
export const metadata: Metadata = {
  title: `Pagina niet gevonden | ${SITE_NAME}`,
};

export default function GlobalNotFound() {
  return (
    <html lang="nl-BE" className={siteFonts}>
      <body className="flex min-h-dvh flex-col">
        <PodcastBanner />
        <SiteHeader />
        <div className="flex-1">
          <NotFoundContent />
        </div>
        <SiteFooter />
        <Stamp campaign="404" />
      </body>
    </html>
  );
}
