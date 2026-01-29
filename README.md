# Chelsea FC Hub

A comprehensive Chelsea FC information hub built with Next.js. Stay up to date with fixtures, results, squad info, news, standings, and club history.

## Features

- **Fixtures & Results** — View upcoming matches and past results with competition filtering
- **Live Match Updates** — Real-time scores and match details during games
- **Squad** — Full first-team roster with player details and loan tracker
- **Standings** — Premier League table with Champions League/Europa League/relegation zones
- **News** — Aggregated news from BBC Sport, The Guardian, and curated tweets
- **Club History** — Trophy cabinet, club legends, records, and historic milestones
- **Head-to-Head** — Historical stats and recent encounters for upcoming fixtures
- **Season Stats** — Top scorers and assists filtered by competition (PL/UCL)
- **Dark Mode** — Light, dark, and system theme support
- **PWA Ready** — Install as an app on mobile devices

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Data**: [football-data.org API](https://www.football-data.org/)
- **News**: RSS feeds + [react-tweet](https://react-tweet.vercel.app/)
- **Runtime**: [Bun](https://bun.sh/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js 18+)
- [football-data.org API key](https://www.football-data.org/client/register) (free tier)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PhunsokNorboo/Chelsea-Project.git
   cd Chelsea-Project
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create `.env.local` and add your API key:
   ```
   FOOTBALL_DATA_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home dashboard
│   ├── match/[id]/        # Match detail page
│   ├── squad/             # Squad roster
│   ├── news/              # News feed
│   ├── standings/         # League table
│   └── history/           # Club history
├── components/            # React components
├── data/                  # Static JSON data
├── lib/                   # API helpers & utilities
└── public/images/         # Local trophy & legend images
```

## Data Sources

- **[football-data.org](https://www.football-data.org/)** — Fixtures, results, standings, squad data
- **RSS Feeds** — BBC Sport Chelsea, The Guardian Chelsea, Football365
- **Static JSON** — Loan players, curated tweets, club history

## License

This project is for personal/educational use. Chelsea FC branding and imagery are property of Chelsea Football Club.

---

**Keep The Blue Flag Flying High!**
