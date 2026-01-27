# Chelsea FC Fixtures

A Next.js app that displays Chelsea FC fixtures, results, standings, and match details using the football-data.org API.

## Quick Start

```bash
bun install
bun dev        # http://localhost:3000
bun run build  # production build
bun run lint   # eslint
bunx tsc --noEmit  # type check
```

## Tech Stack

- **Runtime**: Bun
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Theming**: next-themes (light/dark/system)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, ThemeProvider, Header, Footer
│   ├── page.tsx            # Home — server component, fetches all data
│   ├── globals.css         # Tailwind config + Chelsea theme CSS variables
│   └── match/[id]/page.tsx # Match detail — dynamic route
├── components/
│   ├── ui/                 # shadcn primitives (card, badge, tabs, separator, skeleton, button, dropdown-menu)
│   ├── countdown.tsx       # Client component — live countdown to next kickoff
│   ├── fixture-card.tsx    # Single match row with W/D/L colored left border
│   ├── fixtures-list.tsx   # Client component — filterable match list with tabs
│   ├── form-guide.tsx      # Last 5 results as W/D/L colored circles
│   ├── standings-table.tsx # Mini PL table (top 6 + Chelsea)
│   ├── header.tsx          # Sticky nav bar
│   ├── footer.tsx          # Attribution
│   ├── theme-provider.tsx  # next-themes wrapper
│   └── theme-toggle.tsx    # Light/Dark/System dropdown
└── lib/
    ├── api.ts              # football-data.org fetch helpers
    ├── types.ts            # TypeScript types for API responses
    └── utils.ts            # cn(), date formatting, countdown math
```

## Data Source

**API**: [football-data.org](https://www.football-data.org/) v4
**Team ID**: 61 (Chelsea FC)
**Rate limit**: 10 requests/minute on the free tier

The API key is stored in `.env.local` as `FOOTBALL_DATA_API_KEY`. Register at football-data.org for a free key.

### Caching Strategy

- Home page data revalidates every **60 seconds** (`export const revalidate = 60` in `page.tsx`)
- Match detail revalidates every **30 seconds** (passed to `fetchApi` in `api.ts`)
- All API calls go through `fetchApi()` in `src/lib/api.ts` which uses Next.js `fetch` with `next: { revalidate }` for ISR
- This keeps API usage well under the 10 req/min limit since Next.js deduplicates and caches server-side fetches

### API Functions (src/lib/api.ts)

| Function | Endpoint | Returns |
|---|---|---|
| `getMatches()` | `/teams/61/matches?status=...&limit=40` | All recent + upcoming matches |
| `getUpcomingMatches()` | `/teams/61/matches?status=SCHEDULED,TIMED` | Future matches only |
| `getResults()` | `/teams/61/matches?status=FINISHED&limit=15` | Past results |
| `getMatch(id)` | `/matches/{id}` | Single match with goals, referees |
| `getStandings()` | `/competitions/PL/standings` | Full Premier League table |

All functions return `null` (or `[]`) on failure — the UI handles missing data gracefully.

## Theming

The Chelsea color palette is defined as CSS custom variables in `globals.css`:

- `--chelsea-blue` — primary brand blue (used in header, primary buttons, card accents)
- `--chelsea-gold` — accent gold (used for competition badges, accent elements)
- `--win` / `--draw` / `--loss` — green/amber/red for form guide and fixture borders

Both `:root` (light) and `.dark` variants are defined. All shadcn semantic tokens (`--primary`, `--background`, etc.) are tuned to the Chelsea palette with a blue hue shift.

Use the Tailwind classes `bg-chelsea-blue`, `text-chelsea-gold`, `bg-win`, `bg-draw`, `bg-loss` etc. in components.

## Architecture Decisions

- **Server components by default**: The home page and match detail page are async server components. Only `countdown.tsx`, `fixtures-list.tsx`, and `theme-toggle.tsx` are client components (they need interactivity).
- **No client-side data fetching library**: Data comes from server components via `fetch` + ISR. No SWR/React Query needed at this scale.
- **Team crests use `<img>` tags**: The football-data.org crest URLs are external SVGs. Using plain `<img>` avoids Next.js Image optimization overhead for small SVG icons. `next.config.ts` has `remotePatterns` configured for `crests.football-data.org` if you switch to `next/image`.
- **No fallback/mock data**: If the API key is missing or invalid, the UI shows a helpful "No Data Available" message with setup instructions.

## Adding shadcn Components

```bash
bunx --bun shadcn@latest add <component-name>
```

Components land in `src/components/ui/`. The config is in `components.json`.

## Common Tasks

**Add a new API endpoint**: Add a typed function in `src/lib/api.ts` following the existing pattern. Define response types in `src/lib/types.ts`.

**Add a new page**: Create a directory under `src/app/` with a `page.tsx`. Use async server components and call API functions directly.

**Add a new filter to fixtures**: The `FixturesList` component in `src/components/fixtures-list.tsx` manages filter state. Add new `Tabs` entries and update the filter logic.

**Adjust revalidation timing**: Change the `revalidate` export in page files or the second argument to `fetchApi()` in `api.ts`. Keep total requests under 10/min.
