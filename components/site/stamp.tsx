"use client";

import { usePathname } from "next/navigation";
import { onlineSchoolUrl } from "@/lib/site";

/**
 * Floating "De Online School" stamp on every page (app/(site)/layout.tsx): bottom
 * right on phones, top right from `md`. Links with the UTM tags of the current
 * page, or with `campaign` where the path says nothing (the 404). The podcast has
 * its own version in components/podcast/stamp.tsx.
 */
export function Stamp({ campaign }: { campaign?: string }) {
  const pathname = usePathname();
  const href = onlineSchoolUrl("/", { ...(campaign ? { campaign } : utm(pathname)), content: "stempel" });
  return (
    <div className="fixed right-3 bottom-[calc(12px+env(safe-area-inset-bottom,0px))] z-50 size-17 md:top-30 md:right-6 md:bottom-auto md:size-23">
      <a
        className="block size-full rotate-12 rounded-full opacity-95 drop-shadow-stamp transition-[rotate,scale,opacity] duration-200 hover:rotate-0 hover:scale-108 hover:opacity-100 focus-visible:rotate-0 focus-visible:scale-108 focus-visible:opacity-100"
        href={href}
        target="_blank"
        rel="noopener"
        aria-label="Naar De Online School (opent in een nieuw tabblad)"
        title="De Online School"
      >
        <svg className="block size-full overflow-visible" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <path id="stamp-ring" d="M60 60 m-43 0 a43 43 0 1 1 86 0 a43 43 0 1 1 -86 0" />
          </defs>
          <circle className="fill-stamp" cx="60" cy="60" r="57" />
          <circle className="fill-none stroke-white stroke-[1.6] opacity-75" cx="60" cy="60" r="53" strokeDasharray="2.5 3" />
          <circle className="fill-none stroke-white stroke-[1.6] opacity-75" cx="60" cy="60" r="33" />
          <g className="origin-[60px_60px] animate-stamp-spin">
            <text className="fill-white font-sans text-[10.5px] font-bold tracking-[1px]">
              <textPath href="#stamp-ring" startOffset="0" textLength="266" lengthAdjust="spacing">
                DE ONLINE SCHOOL ★ GRATIS IN BETA ★
              </textPath>
            </text>
          </g>
          <g className="fill-stamp-cap" transform="translate(60 62)">
            <path d="M-18 -4 L0 -13 L18 -4 L0 5 Z" />
            <path d="M-10 0 v8 c0 4 20 4 20 0 v-8 L0 5 Z" />
            <path className="fill-none stroke-stamp-cap stroke-[1.6]" d="M15 -2.5 v11" />
            <circle cx="15" cy="9.5" r="2" />
          </g>
        </svg>
      </a>
    </div>
  );
}

/** "/" → home, "/questions/inzage" → faq / inzage, as the question pages tagged it before. */
function utm(pathname: string) {
  const [section, slug] = pathname.split("/").filter(Boolean);
  if (!section) return { campaign: "home" };
  if (section === "questions" && slug) return { source: "faq", campaign: slug };
  return { campaign: section };
}
