# Core

Task management app built with Next.js 16 + Better Auth + Prisma (SQLite).

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React Compiler)
- **Auth:** Better Auth (email/password, next-cookies)
- **Database:** SQLite via Prisma 7
- **UI:** shadcn/ui (base-luma preset), Tailwind v4, Base UI
- **Forms:** react-hook-form + zod
- **State:** Jotai

## Getting Started

```sh
cp .env.example .env     # edit secrets
bun install
bun migrate              # prisma migrate dev + generate
bun dev                  # localhost:3000
```

## Commands

| Command | What |
|---------|------|
| `bun dev` | Start dev server (Turbopack) |
| `bun prod` | Prisma generate + build + start |
| `bun build` | Production build |
| `bun lint` | Typegen + tsc + eslint |
| `bun migrate` | Prisma migrate dev |
| `bun studio` | Prisma Studio (headless) |

## Auth

- `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password` — public
- Edge guard (`proxy.ts`) + server session check (`dashboard/layout.tsx`) protect `/dashboard/*`
- Password reset emails logged to console — swap `sendResetPassword` in `src/lib/auth.ts` to a real email provider

## Dashboard Routes

```
/dashboard/home               Home
/dashboard/inbox              Global inbox
/dashboard/my-tasks           Tasks across all workspaces
/dashboard/today              Tasks due today
/dashboard/upcoming           Tasks due this week
/dashboard/personal/...       Personal workspace pages
/dashboard/[slug]                 Project list (workspace home)
/dashboard/[slug]/projects/new    Create project
/dashboard/[slug]/projects/[id]   Kanban board (ReUI, drag-and-drop)
/dashboard/[slug]/members         Manage members & invitations
/dashboard/[slug]/settings        Rename / delete workspace
/dashboard/workspaces/new         Create workspace (team)
/dashboard/settings               Settings
```

## Plugins

- Better Auth Organizations plugin wired — team CRUD, member roles, and invitations backed by the plugin.
- `sendInvitationEmail` in `src/lib/auth.ts` logs to console — swap to a real email provider for production.
- `/accept-invitation/[id]` — auto-accepts invitation on mount, redirects to dashboard.

## Conventions

- Forms: react-hook-form + Controller + shadcn `Field` primitives. Schemas in `src/lib/zodSchema.ts` as `<name>Schema` / `<name>Type`.
- Components: arrow functions, PascalCase files. Exception: `src/components/shadcnui/` uses normal functions + kebab-case files.
- Styling: Tailwind v4 via `@theme` in `globals.css`. No `tailwind.config.ts`.
- Server-only code in `src/server/`, hooks in `src/hooks/`.
