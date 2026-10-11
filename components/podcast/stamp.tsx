import { ONLINE_SCHOOL_STAMP_URL } from "@/lib/podcast-links";

/**
 * Floating "De Online School" stamp, bottom left.
 * public/js/main.js adds `is-js` and drives `transform` so the stamp starts on
 * the bottom edge of the hero and slides into its corner while scrolling.
 */
export function Stamp() {
  return (
    <div
      className="fixed bottom-[calc(12px+env(safe-area-inset-bottom,0px))] left-[calc(12px+env(safe-area-inset-left,0px))] z-50 size-17 md:bottom-[calc(16px+env(safe-area-inset-bottom,0px))] md:left-[calc(16px+env(safe-area-inset-left,0px))] md:size-22 [&.is-js]:top-0 [&.is-js]:bottom-auto [&.is-js]:origin-left [&.is-js]:will-change-transform"
      id="stampWrap"
    >
      <a
        className="block size-full -rotate-12 rounded-full opacity-90 drop-shadow-stamp transition-[rotate,scale,opacity] duration-200 ease-[ease] hover:rotate-0 hover:scale-110 hover:opacity-100 focus-visible:rotate-0 focus-visible:scale-110 focus-visible:opacity-100 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-accent"
        href={ONLINE_SCHOOL_STAMP_URL}
        target="_blank"
        rel="noopener"
        aria-label="Naar De Online School (opent in een nieuw tabblad)"
        title="De Online School"
      >
        <svg className="block size-full overflow-visible" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <path id="ring" d="M60 60 m-43 0 a43 43 0 1 1 86 0 a43 43 0 1 1 -86 0" />
          </defs>
          <circle className="fill-os" cx="60" cy="60" r="57" />
          <circle
            className="fill-none stroke-os-fg stroke-[1.6] opacity-75"
            cx="60"
            cy="60"
            r="53"
            strokeDasharray="2.5 3"
          />
          <circle className="fill-none stroke-os-fg stroke-[1.6] opacity-75" cx="60" cy="60" r="33" />
          <g className="origin-[60px_60px] animate-stamp-spin">
            <text className="fill-os-fg font-display text-[10.5px] font-extrabold tracking-[1px]">
              <textPath href="#ring" startOffset="0" textLength="266" lengthAdjust="spacing">
                DE ONLINE SCHOOL ★ GRATIS IN BETA ★
              </textPath>
            </text>
          </g>
          <g className="fill-accent" transform="translate(60 62)">
            <path d="M-18 -4 L0 -13 L18 -4 L0 5 Z" />
            <path d="M-10 0 v8 c0 4 20 4 20 0 v-8 L0 5 Z" />
            <path className="fill-none stroke-accent stroke-[1.6]" d="M15 -2.5 v11" />
            <circle cx="15" cy="9.5" r="2" />
          </g>
        </svg>
      </a>
    </div>
  );
}
