# De Thuisschool Podcast

The sign-up page for De Thuisschool Podcast, built with Next.js and Tailwind CSS v4.
It is a port of the original static site (`index.html` + `css/style.css`). Checked in
Chromium at 7 widths (375–1280px), light/dark/forced themes, with and without the form
result panels: every element has the same position and size as on the original. The only
pixel differences are text anti-aliasing, because the fonts are now self-hosted with
`next/font` instead of loaded from Google Fonts.

```bash
npm run dev     # http://localhost:3000/podcast
npm run build
```

## Styling

```
app/globals.css        entry: Tailwind + the three files below
styles/theme.css       design tokens (@theme) and the dark theme
styles/base.css        element defaults on top of Tailwind's preflight
styles/components.css  reusable component classes
components/sections/   one file per page section, utilities for one-off layout
```

### Tokens (`styles/theme.css`)

Every token is a Tailwind utility. Use these instead of raw values.

| Token | Utilities | Use |
| --- | --- | --- |
| `canvas`, `surface`, `ink`, `muted`, `line`, `field` | `bg-canvas`, `text-muted`, `border-line` … | page, cards, text, borders |
| `accent`, `accent-ink` | `bg-accent text-accent-ink` | marigold highlight and the text on it |
| `leaf`, `leaf-tint` | `text-leaf`, `bg-leaf-tint` | green: links, checkboxes, success |
| `onair` | `bg-onair` | red "ON AIR" light, errors |
| `studio`, `studio-fg`, `studio-muted` | `bg-studio text-studio-fg` | dark navy panels (hero, footer, video card) |
| `os`, `os-fg`, `os-muted` | `bg-os text-os-fg` | De Online School block and stamp |
| `map-*` | `fill-map-hill` … | the drawn map |
| `font-display`, `font-sans` | | Bricolage Grotesque (headings, buttons), Nunito Sans (body) |
| `text-display`, `text-title` | | fluid hero title, section titles |
| `rounded-field` / `card` / `panel` / `feature` | | 10 / 14 / 20 / 22px |
| `shadow-press`, `shadow-photo`, `shadow-float` | | |

Breakpoints are replaced by the three the design uses (mobile-first):
`sm` 481px, `md` 601px, `lg` 861px.

**Dark mode** needs no extra classes: the dark theme overrides the colour tokens, so
`bg-surface` is white in light mode and navy in dark mode. It follows the OS setting;
`<html data-theme="light">` or `data-theme="dark"` forces one. For a real one-off, a
`dark:` variant with the same rules is available.

### Component classes (`styles/components.css`)

| Class | What |
| --- | --- |
| `wrap` | centered 1040px column with gutters (`wrap max-w-180` for the 720px narrow column) |
| `section`, `band` | section vertical rhythm; white band with hairlines |
| `eyebrow`, `section-title`, `lead`, `note` | the section header pattern and small print |
| `btn` + `btn-main` / `btn-ghost` / `btn-wa` / `btn-mail` | buttons |
| `field`, `label`, `input`, `check` | form fields (`input` covers inputs, selects and textareas) |
| `disclosure`, `terms-body` | FAQ / terms `<details>`; scrollable legal text |

Utilities always win over component classes, so `btn btn-main mt-4` or
`lead mt-9` work as expected. A new section usually looks like:

```tsx
<section className="section band">
  <div className="wrap">
    <span className="eyebrow">Kicker</span>
    <h2 className="section-title">Title</h2>
    <p className="lead">Intro…</p>
    {/* layout with utilities */}
  </div>
</section>
```

### Keeping the original look

Things that differ between Tailwind and the plain CSS the site started from:

- Tailwind's named text sizes (`text-base`, `text-lg` …) also set a line height. The
  design inherits line height, so use arbitrary sizes like `text-[1.05rem]`.
- `leading-normal` is 1.5, not CSS `normal`; use `leading-[normal]`.
- Preflight removes link underlines; add `underline` to links in running text.
- In JSX, `text{" "}<a>` creates separate text nodes, which shifts text by a fraction of
  a pixel. Put the space inside one string: `{"text "}<a>`.

## Behaviour

`public/js/main.js` is the original script, loaded unchanged with `next/script`. It
handles form validation and sending, the result panels and the floating stamp, and
relies on the element ids in `components/sections/sign-up.tsx` and `stamp.tsx`.
It posts to `send.php`, which does not exist in this app yet, so a sign-up always ends
on the "send via e-mail / WhatsApp" fallback until that is ported to a route handler.
