# Thuis Onderwijs.be

Next.js + Tailwind CSS v4. Thuis Onderwijs.be is its own project; it links to De Online
School (a separate platform) but is not it. All code, paths and file names are in English;
only the visible text is Dutch. The site has two looks, each with its own root layout
(a route group), its own Tailwind entry and its own tokens:

| Route | Look | Code |
| --- | --- | --- |
| `/`, `/questions`, `/questions/[slug]` | the site: Commissioner on warm paper | `app/(site)/`, `styles/site/`, `components/site/`, `components/question/` |
| `/podcast` | De Thuisschool Podcast: Bricolage + Nunito, dark studio | `app/(podcast)/`, `styles/podcast/`, `components/podcast/` |

Each Tailwind entry only scans its own folders (`@import "tailwindcss" source(none)` +
`@source`), so the two themes never leak into each other. Navigating between them is a
full page load. URLs that match nothing get `app/global-not-found.tsx` (site look).

```bash
npm run dev     # http://localhost:3000
npm run build
```

## Question pages (`/questions/[slug]`)

The questions are stored in the database (table `questions`). There is no admin page
yet: a question is written as a JSON file `<slug>.json` in the shape of `Question`
(`lib/questions.ts`) and imported with the CLI (`scripts/questions.ts`):

```bash
npm run questions -- list
npm run questions -- export [dir]           # database → <dir>/<slug>.json (default content/questions)
npm run questions -- import <file|dir>...   # adds, or replaces the question with the same slug
npm run questions -- delete <slug>
npm run landingspaginas -- <export.html> [dir] [--checked-on YYYY-MM-DD]   # review export → <dir>/<slug>.json
```

To edit: export, change the file, import it. An import checks every file first (required
fields, slug format, `[n]` pointing to a source) and saves nothing if one is wrong.
Afterwards the CLI calls `POST /api/revalidate` on `SITE_URL` with `REVALIDATE_SECRET`,
so the running site shows the change at once; without those, it shows after the next
build. Pages read the questions through `lib/server/questions.ts` (`use cache`, tag
`questions`) and are prerendered with them. Text fields support `*italic*` and `[1]`
(footnote to the first source).

`content/questions/` is the seed: `npm run db:seed` (run before `dev` and `build`) copies
it into the database only when the database has no questions yet. The build needs at
least one question. After that the database is the source; export to update the files.

Comments from the form (`lib/server/comments.ts`, a server action) are saved in the
database and show under "Reageren" at once (read per request). No mail is sent:
`npm run reactions` lists the latest reactions, each with its moderation link.
`/moderation/<id>?token=…` (HMAC of the id with `MODERATION_SECRET`) has the button to
delete it. Spam is held off by a honeypot field and 3 comments per 10 minutes per IP. The
file's `experiences` stay curated by hand.

## Database (`lib/server/db.ts`)

SQLite via Node's built-in `node:sqlite` (Node 22.13+; it logs an ExperimentalWarning at
start). No database server: one file, `data/site.db` or `DATABASE_PATH`, created on
first use. It must be on a disk that survives deploys (VPS, Docker volume), so this
does not work on serverless hosting. `data/` is gitignored: it holds visitors' names and
messages. Back it up with `sqlite3 data/site.db "VACUUM INTO 'backup.db'"` (safe while
the site runs).

| Table | What |
| --- | --- |
| `reactions` | comments; `approved` 0/1. Deleting a row removes it for good (GDPR requests). |
| `questions` | the question pages; nested parts (sections, sources, …) as JSON. Written only through `lib/server/question-store.ts`. |
| `question_search` | FTS5 index of `questions`, rebuilt by every import or delete. `GET /api/search?q=` (home page box) ranks with bm25: question > summary > full text. |

Schema changes: add a step to `MIGRATIONS` in `lib/server/db.ts`; never edit a shipped
one. Always pass values as `?` parameters.

### Site tokens (`styles/site/theme.css`)

Tailwind's default colours and text sizes are switched off; only these exist.

| Token | Use |
| --- | --- |
| `sheet`, `paper`, `sand`, `mint` | explanation and comment form, page, sources and asides, short answer |
| `ink`, `ink-soft`, `muted`, `ink-fg` | headings and footer background, running text, meta, text on ink |
| `line`, `line-strong` | hairlines, form field borders |
| `green`, `green-dark`, `green-pale` | links and accents, hover, text on green |
| `error` | form errors |
| `text-caption` / `meta` / `small` / `body` / `prose` / `lead` / `h3` / `h2-small` / `h2` / `h1` | type scale (12 → 38px) |
| `font-display`, `font-sans` | both Commissioner; `font-display` (and h1–h3) adds the flare axis |

Component classes (`styles/site/components.css`): `container-wide` (1040px),
`container-text` (760px), `section`, `eyebrow`, `section-title`, `section-intro`,
`prose`, `cite`, `btn` + `btn-primary` / `btn-light`, `field`, `input`.

# De Thuisschool Podcast (`/podcast`)

The sign-up page for De Thuisschool Podcast.
It is a port of the original static site (`index.html` + `css/style.css`). Checked in
Chromium at 7 widths (375–1280px), light/dark/forced themes, with and without the form
result panels: every element has the same position and size as on the original. The only
pixel differences are text anti-aliasing, because the fonts are now self-hosted with
`next/font` instead of loaded from Google Fonts.

## Styling

```
app/(podcast)/podcast.css      entry: Tailwind + the three files below
styles/podcast/theme.css       design tokens (@theme) and the dark theme
styles/podcast/base.css        element defaults on top of Tailwind's preflight
styles/podcast/components.css  reusable component classes
components/podcast/            one file per page section, utilities for one-off layout
```

### Tokens (`styles/podcast/theme.css`)

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

### Component classes (`styles/podcast/components.css`)

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
relies on the element ids in `components/podcast/sign-up.tsx` and `stamp.tsx`.
It posts to `app/api/podcast-signup/route.ts`, which mails the sign-up via Resend (shared
helpers in `lib/server/mail.ts`; settings in `.env.example`).
