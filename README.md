## Astrot (Next.js 14)

- Next.js app lives in `src/app` with App Router.
- Legacy static prototype moved to `legacy/static-app/`.

### Development

```bash
pnpm i
pnpm dev
```

### Build

```bash
pnpm build
pnpm start
```

### Environment

- Requires `DATABASE_URL` and optionally `DIRECT_URL` for Prisma
- `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`

### Deploy

- Host expects Next.js build. Ensure root points to this project. No static `index.html` in root anymore; static prototype lives at `legacy/static-app/`.

