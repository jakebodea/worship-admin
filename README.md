# Worship Team Scheduler

A Planning Center-integrated scheduling helper that helps you schedule worship team members by showing their availability, blockout dates, and scheduling frequency.

## Features

- **Team Member Directory** - View all active worship team members with their positions
- **Team Filtering** - Filter members by specific teams (Worship, Tech, etc.)
- **Availability Status** - See who has blockouts for specific dates
- **Scheduling Frequency** - Visual indicators showing how often each person has served
- **Smart Scheduling** - Easily identify who is available AND hasn't served recently

## Setup

### 1. Get Planning Center Credentials

1. Visit [Planning Center API](https://api.planningcenteronline.com/oauth/applications)
2. Create a new Personal Access Token
3. Copy your Application ID and Personal Access Token

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
PLANNING_CENTER_CLIENT=your_app_id_here
PLANNING_CENTER_PAT=your_personal_access_token_here
```

### 3. Install Dependencies

```bash
bun install
```

### 4. Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe code
- **TanStack Query** - Data fetching and caching
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first styling
- **Planning Center API** - Church management data

## How It Works

The app fetches data from Planning Center Services API:

1. **People** - All team members with their assigned positions
2. **Teams** - Available teams for filtering
3. **Blockouts** - Dates when people are unavailable
4. **Plan People** - Historical scheduling data to calculate frequency

Each person card shows:
- Name and photo
- Team positions (badges)
- Availability status for selected date
- Scheduling frequency (30/60/90 days)
- Last served date

## Color Coding

- 🟢 **Green** - Good to schedule (served 0-1 times in last 30 days)
- 🟡 **Yellow** - Served recently (2 times in last 30 days)
- 🔴 **Red** - Served frequently (3+ times in last 30 days)

## Project Structure

```
app/
  api/              # Next.js API routes
  page.tsx          # Main dashboard
  layout.tsx        # Root layout with providers
  globals.css       # Global styles (light theme only)

components/
  person-card.tsx           # Individual team member card
  availability-badge.tsx    # Available/Blocked status
  frequency-indicator.tsx   # Scheduling frequency display
  team-filter.tsx           # Team dropdown filter
  date-range-picker.tsx     # Date selection
  providers.tsx             # React Query provider
  ui/                       # shadcn components

hooks/
  use-people.ts             # Fetch all people
  use-teams.ts              # Fetch all teams
  use-blockouts.ts          # Fetch person blockouts
  use-schedule-history.ts   # Fetch scheduling history

lib/
  planning-center.ts        # API client with auth
  types.ts                  # TypeScript type definitions
  utils.ts                  # Utility functions
```

## API Routes

All API routes are server-side and handle Planning Center authentication:

- `GET /api/people` - All active team members with positions
- `GET /api/teams` - All active teams
- `GET /api/blockouts/[id]` - Blockouts for a specific person
- `GET /api/schedule-history/[id]` - Scheduling history for a person

## Best Practices Implemented

- ✅ React Query for efficient data fetching and caching
- ✅ Custom hooks to wrap API calls
- ✅ Fully typed with TypeScript
- ✅ Server-side API routes to secure credentials
- ✅ shadcn components for consistent UI
- ✅ Responsive design (mobile-friendly)
- ✅ All files under 300 LOC for maintainability

## License

MIT
