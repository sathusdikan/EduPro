# Copilot instructions for this repository

This file gives concise, actionable guidance for AI coding agents working on this Next.js + Supabase codebase.

Overview
- **Framework:** Next.js (app/ directory, version in package.json: 16.x). Uses Turbopack for builds.
- **Auth / DB:** Supabase integration. Server and browser clients live in `lib/supabase`.
- **Deployment:** Project is deployed on Vercel (CI logs indicate `vercel build`).

Key commands
- Start dev server: `npm run dev` (runs `next dev`) — see [package.json](package.json).
- Build for production: `npm run build` (runs `next build`).
- Start production: `npm run start`.
- Lint: `npm run lint`.

Important files & patterns (examples)
- Entry / app layout: `app/layout.tsx` and route pages under `app/`.
- Admin area: `app/admin/*` (contains server actions, client components, and admin API routes).
- API routes (app-router): examples in `app/api/admin/packages/route.ts` and `app/api/quiz/grade/route.ts`.
- Supabase clients:
  - Server-side client: [lib/supabase/server.ts](lib/supabase/server.ts) — used inside Server Components and API routes; uses `cookies()`.
  - Browser client: [lib/supabase/client.ts](lib/supabase/client.ts) — used in client components.
  - Middleware session refresh: [lib/supabase/middleware.ts](lib/supabase/middleware.ts) and app-level `middleware.ts` which updates sessions.

Environment & secrets
- Required env vars: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (checked in `lib/supabase/server.ts`).
- Use `.env.local` for local development.

Conventions & patterns to follow
- App directory + Server Components: many pages are Server Components. Use `lib/supabase/server.ts` inside Server Components and API routes to access Supabase with server cookies.
- Client components and interactions: import `createClient()` from `lib/supabase/client.ts` in client components.
- Middleware: `middleware.ts` performs session refresh using Supabase and manipulates cookies. Note Next.js warns that the `middleware` file convention is deprecated; CI logs mention this — changes should be done carefully.
- Actions & optimistic state: several admin pages use action patterns and local action state (see `app/admin/*/actions.ts`). Match existing `useActionState` usage patterns found in `app/admin/*` when modifying forms.
- UI primitives: shared components live under `components/` and `components/ui/` (Radix and Tailwind patterns are used).

Integration points and cross-component flows
- Auth flow: middleware -> cookie refresh (lib/supabase/middleware.ts) -> server components read session via `createServerClient`.
- Data flow: pages call API routes under `app/api/*` or use Supabase directly from server/client clients depending on rendering context.
- Seeds & migrations: SQL migrations and `seed.js`/`seed-packages.js` exist for initial data.

TypeScript & build notes
- Type hints are strict. Follow existing types in `types/` (e.g., `types/supabase.ts`).
- CI build logs show a TypeScript error in `app/admin/subjects/create-subject-form.tsx` related to `useActionState` overloads — match the expected action signature when writing new action hooks.

Where to look for examples
- Form + action example: `app/admin/subjects/create-subject-form.tsx` and `app/admin/subjects/actions.ts`.
- Server/client Supabase usage: `lib/supabase/server.ts` and `lib/supabase/client.ts`.
- API route example: `app/api/admin/packages/route.ts` and its id route `app/api/admin/packages/[id]/route.ts`.

When making changes
- Preserve Server vs Client boundary: prefer server client in server components and browser client in client components.
- Update `README.md` or add small migration notes when touching middleware or auth (these are critical for deployment).
- Run `npm run build` locally when changing TypeScript signatures or Next.js routing behavior to catch CI errors early.

If unclear or missing
- Ask for exact runtime env (Vercel settings) and whether `middleware` should be migrated to `proxy` now.
- If you modify auth/session handling, include tests or manual run steps and note side effects for cookies.

Feedback
- Please review and tell me which areas need more detail (example files, common fixes, or CI-specific notes) and I'll iterate.
