# Tabata PWA — Project Rules

## Stack
- Frontend: React + Vite + TypeScript (client/)
- Backend: Node.js + Express 5 (server/)
- Database: PostgreSQL via Prisma ORM (prisma/)
- Auth: JWT + bcryptjs
- Payments: Stripe (international) + ЮКасса (RU/СБП)

## Commands
- `cd client && npm run dev` — start frontend dev server (http://localhost:5173)
- `cd client && npm run build` — TypeScript check + production build
- `cd client && npm run lint` — ESLint check
- `npx prisma dev` — start local PostgreSQL (ports change on every restart — update .env after)
- `npx prisma migrate dev` — apply schema changes to DB
- `npx prisma studio` — visual DB browser

## Project Structure
```
webapp/
├── client/              — React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/  — UI components
│   │   ├── hooks/       — custom React hooks (useTimer, useAudio)
│   │   ├── pages/       — page-level components
│   │   ├── services/    — API calls to backend
│   │   └── types/       — shared TypeScript types
│   └── public/          — static assets, PWA manifest, icons
├── server/              — Express backend
│   ├── src/
│   │   ├── routes/      — API route handlers
│   │   ├── middleware/  — auth, validation, error handling
│   │   └── services/    — business logic (payments, auth)
├── prisma/
│   ├── schema.prisma    — database schema
│   └── migrations/      — migration history
├── .env                 — secrets (never commit)
└── .env.example         — env template (commit this)
```

## Architecture Decisions
- Frontend and backend are separate — client talks to server via REST API
- JWT stored in httpOnly cookies — never in localStorage
- All payment webhooks verified with Stripe/ЮКасса signatures before processing
- Timer logic lives in client only — no server involvement during workout
- Web Audio API keeps page alive in background — AudioContext requires user gesture to start

## User Tiers
- Guest: basic timer (Work/Rest/Rounds), 3 presets, 2 sounds
- Free (registered): save presets, workout history, more sounds
- Pro (paid): unlimited presets, background mode, custom sounds, statistics

## Known Gotchas
- Local Prisma DB ports change on every `npx prisma dev` restart — always update DATABASE_URL in .env
- Web Audio API on iOS Safari requires user tap before AudioContext can be created — never auto-start
- Stripe test mode keys start with sk_test_ — never use live keys in development
- .env uses UTF-8 without BOM — use [System.IO.File]::WriteAllText() to write on Windows PowerShell 5.x

## Environment Variables (see .env.example)
- DATABASE_URL — Prisma PostgreSQL connection string
- SHADOW_DATABASE_URL — Prisma shadow database for migrations
- JWT_SECRET — secret for signing JWT tokens
- STRIPE_SECRET_KEY — Stripe API key
- STRIPE_WEBHOOK_SECRET — for verifying Stripe webhook signatures
