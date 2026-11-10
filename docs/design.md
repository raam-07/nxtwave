# GRIT Scheduler — design write-up

## Product approach

The scheduler is a small role-based workflow rather than a collection of unrelated dashboards. Students see only the work needed to prepare and book: their eligibility, one available interview at a time, a booking confirmation, and three short preparation messages. Interviewers get a daily queue and can make a pass/fail/retake decision in one action. Administrators see the operational question that matters—who is eligible but has not booked—and can revoke a badge when malpractice is verified.

The interface uses a calm green palette, high-contrast text, roomy cards, and plain labels. This makes the subject feel supportive without hiding policy decisions. The seeded data includes an eligible student, a repeat attempt, an ineligible student, and a badge-revoked student so all important states can be demonstrated without setup.

## Data model and integrity

`students`, `slots`, and `bookings` are modelled in Drizzle for a Turso/libSQL database. A booking links exactly one student to one slot, with status and final outcome retained as part of the record. Student eligibility and badge status are separate: an eligible student may still be prevented from booking when their badge is revoked.

Booking availability is never trusted from the client. The server booking mutation verifies eligibility, badge status, existing active booking, slot activity, and whether the slot was claimed immediately before it writes. In the production Turso adapter this is implemented with a transaction/conditional insert and a unique active-slot constraint; a race therefore yields a friendly conflict response rather than a duplicate booking. The same endpoint is the source of truth for every UI state.

For a self-contained assessment the app starts in a realistic in-memory seeded mode when Turso credentials are absent. The public API and Drizzle schema stay the same, while the `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` environment variables prepare it for libSQL. No database secret is committed.

## Outcomes and operations

An interviewer records pass, fail, or retake immediately after a session. A fail makes the student ineligible; retake leaves them eligible for a future booking; attempts are incremented. Badge revocation is deliberately an administrator-only action and takes effect before a booking request, so a student cannot pass merely by keeping a stale page open. The admin table is filtered to eligible students and explicitly names both booked and unbooked states, allowing outreach to the latter.

The Render blueprint packages the application as a regular Next.js web service. Environment variables are set in Render rather than the repository. On a free Render plan, the first visit after inactivity can be slower because the service may sleep; a production plan or an allowed monitoring policy avoids that demo concern.
