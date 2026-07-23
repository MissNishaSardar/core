<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:form-patterns -->
# Form Patterns
- Schemas in `src/lib/zodSchema.ts` — export `<name>Schema` and `<name>Type = z.infer<...>`
- Components use `"use client"`, `react-hook-form` + `@hookform/resolvers/zod`, shadcn primitives
```typescript
const { handleSubmit, control, formState: { isSubmitting } } = useForm({
  resolver: zodResolver(mySchema), defaultValues: { ... }, mode: "all",
});
```
Each field through `Controller`:
```typescript
<Controller name="fieldName" control={control} render={({ field, fieldState }) => (
  <Field data-invalid={fieldState.invalid}>
    <FieldLabel htmlFor={field.name}>Label</FieldLabel>
    <Input {...field} id={field.name} aria-invalid={fieldState.invalid} autoComplete="..." />
    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
  </Field>
)}/>
```
Submit: `<form onSubmit={handleSubmit(handler)} noValidate>`. Button disabled while submitting with icon toggle.
<!-- END:form-patterns -->

## Conventions
- **Ask questions** when ambiguous or before destructive actions. Prefer one batched question.
- **Remember new learning** — add non-obvious gotchas back to this file; delete stale entries.
- **Use skills/MCPs** before writing code (`shadcn`, `prisma-*`, `next-*`, `better-auth-*`, `zod`).
- **Stack**: Next.js 16.2 + React 19.2 (App Router, Turbopack, React Compiler, typedRoutes). Prisma 7 + libsql (SQLite). Tailwind v4 (CSS-only, no tailwind.config.ts). shadcn/ui base-luma preset, `@base-ui/react` (not Radix). `next-themes` (dark default), `react-toastify`, `lucide-react`, `@t3-oss/env-nextjs` + Zod.
- **Verification**: `bun lint` (typegen + tsc + eslint), `bun run build` (prod build), `bun prod` (prisma generate + build + start).
- **Package manager**: Bun primary. `bun.lock` committed.

## Prisma (v7, custom output)
- Generator: `prisma-client`, output `../generated/prisma`. Import from `@generated/prisma/client`.
- No `datasource.url` in schema — comes from `prisma.config.ts` via `env("DATABASE_URL")` (dotenv).
- `src/lib/database/dbClient.ts` = globalThis singleton (HMR-safe). Import from here, don't instantiate elsewhere.
- `serverEnv.DATABASE_URL` must start with `file:./`.
- `bun migrate` (migrate dev + generate). No `prisma db push`. `bun studio` runs headless.
- `generated/**` is gitignored. build/prod scripts prepend `prisma generate`.

## Env (T3)
- `src/lib/env/serverEnv.ts` uses `experimental__runtimeEnv: process.env` — keep verbatim.
- `next.config.ts` imports both env files as side effects. New vars: add to `serverEnv` or `clientEnv` (`NEXT_PUBLIC_*`), mirror in `.env.example`.

## Styling
- Tailwind v4: config in `globals.css` via `@theme`/`@custom-variant`. PostCSS: `@tailwindcss/postcss`. No tailwind.config.ts.
- Prettier: `singleAttributePerLine: true`, `bracketSameLine: true`, `experimentalTernaries: true`, `prettier-plugin-tailwindcss`.

## shadcn / Base UI
- `components.json`: `ui` → `@/components/shadcnui`. Add components with `bunx shadcn add ...`.
- `Button` wraps `@base-ui/react/button`. No Radix/react-aria — they don't share Base Luma styling.
- **`render` prop** (not `asChild`): `<PopoverTrigger render={<Button>...</Button>} />`.

## Aliases
- `@/*` → `./src/*`, `@generated/*` → `./generated/*`

## Reserved dirs
- `src/server/` — server-only modules (`"use server"`). `src/hooks/` — custom React hooks.

## Misc
- ESLint ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`, `generated/**`.
- `.env` gitignored; `.env.example` committed. No secrets in commits.
- `CHECKPOINT_DISABLE=1` silences Prisma telemetry. No CI/pre-commit hooks.

## TypeScript 6.x (7.x deferred)
- TS 7 blocked — typescript-eslint needs stable API (expected ~Oct 2026). Keep `^6.0.3`.

## ESLint v10 — blocked
- eslint-plugin-react@7.37.5 crashes on eslint 10. Track [plugin#3977](https://github.com/jsx-eslint/eslint-plugin-react/issues/3977). Use `eslint@^9.39.5` until resolved.

## Git commits
Use PowerShell here-strings:
```powershell
git commit -m @"
commit message here
"@
```