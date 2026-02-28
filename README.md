# worshipadmin.com

Planning Center scheduling tools for worship admins.

## Overview

This app helps teams schedule people into open positions for specific plans by combining:

- service type and plan selection
- needed team positions grouped by team
- people matching for the selected team/position
- availability and recent scheduling history context
- one-click scheduling into Planning Center

The root route (`/`) redirects to `/schedule`.

## Setup

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Create a local env file from the template:

```bash
cp .env.example .env.local
```

Required values are documented in `.env.example`:

- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`
- `DATABASE_URL`
- `PLANNING_CENTER_OAUTH_CLIENT_ID`
- `PLANNING_CENTER_OAUTH_CLIENT_SECRET`

Optional:

- `PLANNING_CENTER_EXCLUDED_SERVICE_IDS`

### 3. Configure Planning Center OAuth callback URL

In your Planning Center OAuth app settings, add:

- Local: `http://localhost:3000/api/auth/oauth2/callback/planning-center`
- Production: `https://worshipadmin.com/api/auth/oauth2/callback/planning-center`

### 4. Run auth migrations

```bash
bun run auth:migrate
```

### 5. Start the app

```bash
bun run dev
```

Open `http://localhost:3000`.

## API Routes

All routes are server-side and use authenticated Planning Center access where required.

- `GET /api/service-types`
- `GET /api/plans?service_type_id=...`
- `GET /api/team-positions?service_type_id=...&plan_id=...`
- `GET /api/people?service_type_id=...&position_id=...`
- `GET /api/blockouts/[id]`
- `GET /api/schedule-history/[id]?days=...`
- `POST /api/my-scheduled-plans`
- `POST /api/schedule`
- `GET/POST /api/planning-center/accounts`
- `GET /api/debug/planning-center-context` (debug endpoint)
- `ALL /api/auth/[...all]` (Better Auth handler)

## Project Structure

```text
app/
  api/                       # Next.js API routes
  auth/page.tsx              # Sign-in route
  schedule/page.tsx          # Main scheduling UI route

components/
  dashboard-page.tsx         # Main schedule workflow UI
  person-card.tsx            # Person row/card with schedule actions
  service-plan-table-selector.tsx
  account-menu.tsx
  ui/                        # UI primitives

hooks/
  use-service-types.ts
  use-plans.ts
  use-team-positions.ts
  use-people.ts
  use-schedule-history.ts
  use-blockouts.ts
  use-my-scheduled-plans.ts

lib/
  use-cases/planning-center/ # Business logic
  planning-center/services/  # Planning Center API wrappers
  http/                      # Shared route/client helpers
  auth.ts                    # Better Auth config
```

## Development Commands

- `bun run dev`
- `bun run build`
- `bun run start`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:watch`

## Testing

```bash
bun run typecheck
bun run test
```

Unit tests are colocated with use-cases under `lib/use-cases/planning-center/*.test.ts`.

## Planning Center API Docs

Local scraped API docs are in `docs/planning-center-api/`. See [docs/planning-center-api/README.md](docs/planning-center-api/README.md) for export details.
