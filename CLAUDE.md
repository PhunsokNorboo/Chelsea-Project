# Chelsea FC Hub

A comprehensive Chelsea FC information hub built with Next.js — fixtures, squad, news, standings, history, and more.

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
- **News**: rss-parser (server-side RSS aggregation)
- **Tweets**: react-tweet (no API keys needed)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, ThemeProvider, Header, Footer
│   ├── page.tsx                # Home dashboard — fixtures, form, standings, club info, stats
│   ├── globals.css             # Tailwind config + Chelsea theme CSS variables
│   ├── match/[id]/page.tsx     # Match detail — scorers, venue, referee, head-to-head
│   ├── squad/page.tsx          # Full squad roster + loans tab
│   ├── player/[id]/page.tsx    # Individual player detail
│   ├── news/page.tsx           # News feed (RSS) + curated tweet wall
│   ├── standings/page.tsx      # Full 20-team PL table
│   ├── history/page.tsx        # Club history — trophies, legends, records, milestones
│   └── offline/page.tsx        # PWA offline fallback page
├── components/
│   ├── ui/                     # shadcn primitives (card, badge, tabs, separator, skeleton, button, dropdown-menu, avatar, sheet)
│   ├── header.tsx              # Sticky nav bar with desktop nav + mobile hamburger
│   ├── footer.tsx              # Footer with nav links + attribution
│   ├── nav-links.tsx           # Shared navigation links (client component)
│   ├── mobile-nav.tsx          # Mobile Sheet-based hamburger menu (client component)
│   ├── countdown.tsx           # Live countdown to next kickoff (client component)
│   ├── fixture-card.tsx        # Single match row with W/D/L colored left border
│   ├── fixtures-list.tsx       # Filterable match list with tabs (client component)
│   ├── form-guide.tsx          # Last 5 results as W/D/L colored circles
│   ├── standings-table.tsx     # Mini PL table (top 6 + Chelsea) for home sidebar
│   ├── full-standings-table.tsx # Full 20-team PL table with zone colors
│   ├── player-card.tsx         # Player card for squad grid
│   ├── loan-player-card.tsx    # Loan player card with dashed border
│   ├── squad-roster.tsx        # Tabbed squad roster (client component)
│   ├── club-info.tsx           # Club info card (stadium, coach, founded)
│   ├── season-stats.tsx        # Chelsea scorers/assists with competition filter (PL/UCL)
│   ├── head-to-head.tsx        # H2H stats and recent encounters for match detail
│   ├── trophy-card.tsx         # Trophy display card with local image
│   ├── legend-card.tsx         # Club legend card with photo/initials avatar
│   ├── news-feed.tsx           # RSS article list
│   ├── news-article-card.tsx   # Single news article card
│   ├── tweet-wall.tsx          # Curated tweets via react-tweet
│   ├── theme-provider.tsx      # next-themes wrapper
│   └── theme-toggle.tsx        # Light/Dark/System dropdown
├── data/
│   ├── loans.json              # Static loan player data (manual updates)
│   ├── curated-tweets.json     # Curated tweet IDs for the news page
│   └── history.json            # Club history — trophies, legends, records, milestones
├── lib/
│   ├── api.ts                  # football-data.org fetch helpers
│   ├── rss.ts                  # RSS feed parser (BBC Sport, Guardian, etc.)
│   ├── types.ts                # TypeScript types for all API responses
│   └── utils.ts                # cn(), date formatting, age calc, initials
└── public/
    └── images/
        ├── trophies/           # Local trophy images (9 trophies)
        └── legends/            # Local legend photos (10 players)
```

## Data Sources

### football-data.org API v4
- **Team ID**: 61 (Chelsea FC)
- **Rate limit**: 10 requests/minute (free tier)
- **Key**: Stored in `.env.local` as `FOOTBALL_DATA_API_KEY`

### API Functions (src/lib/api.ts)

| Function | Endpoint | Revalidation | Returns |
|---|---|---|---|
| `getMatches()` | `/teams/61/matches?status=...&limit=40` | 60s | All recent + upcoming matches |
| `getUpcomingMatches()` | `/teams/61/matches?status=SCHEDULED,TIMED` | 60s | Future matches only |
| `getResults()` | `/teams/61/matches?status=FINISHED&limit=15` | 60s | Past results |
| `getMatch(id)` | `/matches/{id}` | 30s | Single match with goals, referees |
| `getHead2Head(id)` | `/matches/{id}/head2head?limit=10` | 120s | H2H stats and recent encounters |
| `getStandings()` | `/competitions/PL/standings` | 60s | Full Premier League table |
| `getTeam()` | `/teams/61` | 120s | Squad, coach, venue, founded |
| `getPerson(id)` | `/persons/{id}` | 120s | Individual player detail |
| `getScorers()` | `/competitions/PL/scorers?limit=50` | 120s | PL top scorers (filtered for Chelsea) |
| `getClScorers()` | `/competitions/CL/scorers?limit=50` | 120s | UCL top scorers (filtered for Chelsea) |

All functions return `null` (or `[]`) on failure — the UI handles missing data gracefully.

### RSS Feeds (src/lib/rss.ts)

Aggregates news from BBC Sport Chelsea, The Guardian Chelsea, and Football365. Uses `Promise.allSettled` so one failing feed never breaks the page. Revalidates every 5 minutes.

### Static Data Files (src/data/)

- **`loans.json`** — Chelsea players currently on loan. Needs manual updates during transfer windows (January and summer). Has a `lastUpdated` field to track staleness.
- **`curated-tweets.json`** — Tweet IDs to display on the news page. Add IDs from accounts like @FabrizioRomano, @ChelseaFC. react-tweet renders them as server components with no API keys needed.
- **`history.json`** — Club history data including trophies, legends, records, and milestones. Images reference local files in `public/images/`.

### Local Images (public/images/)

Trophy and legend images are stored locally because Wikipedia blocks hotlinking and proxy services.

**Trophies** (`public/images/trophies/`):
- premier-league.jpg, champions-league.jpg, europa-league.jpg, fa-cup.jpg, league-cup.jpg, cup-winners-cup.jpg, super-cup.png, club-world-cup.png, community-shield.jpg

**Legends** (`public/images/legends/`):
- frank-lampard.jpg, john-terry.jpg, didier-drogba.jpg, eden-hazard.jpg, gianfranco-zola.jpg, petr-cech.jpg, ashley-cole.jpg, marcel-desailly.jpg, ngolo-kante.jpg, dennis-wise.jpg
- 5 legends (Harris, Osgood, Dixon, Greaves, Tambling) use initials fallback (no free images available)

## Caching Strategy

| Data Source | Revalidation | Notes |
|---|---|---|
| Matches / Standings | 60s | Updates during matchdays |
| Match detail | 30s | Needs freshness during live matches |
| Head-to-Head | 120s | Historical data, changes rarely |
| Team / Person / Scorers | 120s | Changes rarely |
| RSS news feeds | 300s (5 min) | RSS sources update every 5-15 min |
| Loans / Tweets / History JSON | Build time | Changes only via git commits |

Rate limit budget: worst case ~10 unique API calls per 2-minute window, well under the 20 allowed.

## Theming

Chelsea color palette defined as CSS custom variables in `globals.css`:

- `--chelsea-blue` / `--chelsea-gold` — primary brand colors
- `--win` / `--draw` / `--loss` — green/amber/red for results
- Both `:root` (light) and `.dark` variants defined

Tailwind classes: `bg-chelsea-blue`, `text-chelsea-gold`, `bg-win`, `bg-draw`, `bg-loss`

## Architecture Decisions

- **Server components by default.** Client components only when interactivity is needed: `countdown.tsx`, `fixtures-list.tsx`, `squad-roster.tsx`, `mobile-nav.tsx`, `nav-links.tsx`, `theme-toggle.tsx`, `season-stats.tsx`.
- **No client-side data fetching.** Data comes from server components via `fetch` + ISR.
- **External images use `<img>` tags.** Avoids Next.js Image optimization overhead for small SVG crests.
- **Local images for history page.** Wikipedia blocks hotlinking; images stored in `public/images/`.
- **Loans are static JSON** because the football-data.org API has no transfers endpoint.
- **Tweets are curated** because Twitter API access requires paid keys. react-tweet uses the free syndication API.

## Common Tasks

**Add a new page**: Create a directory under `src/app/` with a `page.tsx`. Use async server components.

**Add a new API endpoint**: Add a typed function in `src/lib/api.ts`. Define response types in `src/lib/types.ts`.

**Update loan players**: Edit `src/data/loans.json`. Update the `lastUpdated` field. Do this at the start/end of each transfer window.

**Add curated tweets**: Find the tweet ID from the URL (the number after `/status/`), add it to `src/data/curated-tweets.json`.

**Add a new RSS feed**: Add an entry to the `FEEDS` array in `src/lib/rss.ts`. Set `filterChelsea: true` if it's a general football feed.

**Add shadcn components**: `bunx --bun shadcn@latest add <component-name>`. Config is in `components.json`.

**Add/update history data**: Edit `src/data/history.json`. For new images, download to `public/images/trophies/` or `public/images/legends/` and update the `image` field path.

## API Limitations (Free Tier)

- **No goal details in match lists** — Goals/scorers only available via individual match detail API calls
- **No FA Cup data** — FA Cup is not included in the free tier
- **Rate limited** — 10 requests/minute max

---

## Session Notes

Session notes are stored in `.notes/` directory. When resuming work, read the latest session notes to understand where we left off.

```bash
ls -la .notes/
cat .notes/2026-01-28-session.md  # Latest session
```

---

## Rules for Claude (Learnings)

### External Images
- **Wikipedia blocks hotlinking** — Even proxy services (wsrv.nl, Cloudinary fetch) fail
- **Always download images locally** — Store in `public/images/` for reliability
- **Wikipedia URLs go stale** — Use Wikipedia API to find current URLs:
  ```bash
  curl "https://commons.wikimedia.org/w/api.php?action=query&titles=File:NAME.jpg&prop=imageinfo&iiprop=url&format=json"
  ```

### Shell Commands
- **Use full paths for curl** — Shell aliases can interfere; use `/usr/bin/curl` if needed
- **Quote paths with brackets** — Git commands need quoted paths: `"src/app/match/[id]/page.tsx"`

### Fixtures Sort Order
- **Results**: Newest first (descending by date)
- **Upcoming**: Soonest first (ascending by date)
- **All**: Chronological (ascending by date)

### Date Formatting
- **Don't use `.split(",")[0]`** — This breaks dates like "Sun, 25 Jan" → "Sun"
- **Use proper date formatting**:
  ```ts
  new Date(utcDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  ```

### API Data
- **Don't trust aggregates** — Calculate stats from actual match data when possible
- **Check free tier limits first** — Before promising features, verify the API supports it
