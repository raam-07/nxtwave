# GRIT Interview Scheduler

A complete, role-based scheduling demonstration for GRIT interviews. It is intentionally designed to be easy to assess: select **Student**, **Interviewer**, or **Admin** in the top navigation and use the seeded examples.

## Features

- Student eligibility and badge checks before a booking can be made
- Time-slot booking, confirmation, and an interview-preparation home screen
- Interviewer daily schedule plus pass, fail, and retake decisions
- Admin view of eligible booked/unbooked students and immediate badge revocation
- An atomic server-side booking guard: active student booking and slot occupancy are both checked at the mutation boundary
- Next.js, TypeScript, Tailwind, Drizzle schema, and Turso-ready configuration
- Render Blueprint in `render.yaml`

## Run locally

```bash
npm install
npm run dev
```

The app runs in seeded demo mode without credentials. Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` from `.env.example`, run `npm run db:push`, and wire the repository layer to a production database before a multi-instance production deployment.

## Deploy to Render

Create a Render **Web Service** from this GitHub repository. Render detects `render.yaml`; supply the two Turso environment variables in its dashboard. Build: `npm ci && npm run build`; start: `npm start`.

## Demo script

1. Student / Aarav Mehta: book an open time and see the confirmed state.
2. Interviewer: select pass, fail, or retake to record a result.
3. Admin: see eligible booked/unbooked students, then revoke a badge (Zoya starts as an example of a revoked badge).

See [the design write-up](docs/design.md).
