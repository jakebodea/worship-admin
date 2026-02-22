# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages and API routes (`app/api/*`). Keep routes thin and delegate business logic.
- `components/`: UI components (including `components/ui/*` primitives).
- `hooks/`: React Query hooks for client data fetching (`use-*.ts`).
- `lib/use-cases/planning-center/`: business logic and data transforms (preferred home for app behavior).
- `lib/planning-center/services/`: Planning Center API service wrappers (raw API access only).
- `lib/http/`: shared route/error handling and client fetch helpers.
- `lib/use-cases/planning-center/*.test.ts`: Vitest unit tests for use-cases.
- `public/`: static assets. `docs/`: local Planning Center API docs reference.

## Build, Test, and Development Commands
- `bun run dev`: start local Next.js dev server.
- `bun run build`: production build.
- `bun run start`: run built app.
- `bun run lint`: run ESLint.
- `bun run typecheck`: run TypeScript checks (`tsc --noEmit`).
- `bun run test`: run Vitest test suite once.
- `bun run test:watch`: run Vitest in watch mode.

## Coding Style & Naming Conventions
- TypeScript throughout; prefer explicit types at module boundaries.
- Use `camelCase` for variables/functions, `PascalCase` for components/types.
- Keep API routes as transport layers: validate with `zod`, return via `handleRoute(...)`.
- Put business rules in use-cases, external API calls in services.
- Follow existing formatting; use ESLint (`eslint.config.mjs`) as source of truth.

## Testing Guidelines
- Framework: Vitest (`*.test.ts` colocated in `lib/use-cases/planning-center/`).
- Prioritize tests for transforms/matching/sorting logic and Planning Center edge cases.
- Mock service modules (`lib/planning-center/services/*`) in use-case tests.
- Run `bun run typecheck && bun run test` before opening a PR.

## Commit & Pull Request Guidelines
- Commit messages: short, imperative, scoped to a change (e.g., `Refactor data flow and harden scheduling foundations`).
- Prefer small commits for follow-up cleanup instead of amend-heavy history.
- PRs should include: summary, behavior changes, test coverage notes, and screenshots for UI changes.

## Architecture Notes
- Preferred flow: `app/api` route -> `lib/use-cases/*` -> `lib/planning-center/services/*`.
- React Query keys are centralized in `lib/query-keys.ts`; use them for hooks/invalidation.
- Use `lib/http/client.ts` (`getJson`, `postJson`) for client-side API calls instead of ad hoc `fetch` code.
- Backward compatibility is not a priority during the current dev phase; prefer cleaner APIs/URLs/UX over temporary compatibility shims unless explicitly requested.
