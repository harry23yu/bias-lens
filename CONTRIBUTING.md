# Contributing Guide

How to set up, code, test, review, and release so contributions meet our Definition of Done.

Bias Lens is an NDA project. Never commit real transcripts, credentials, or
identifiable client data. See AGENTS.md for the AI and confidentiality rules.

## Code of Conduct
We work respectfully and give feedback on work and process, not on people.
Concerns follow our conflict path: talk directly within two working days, then
raise it with the full team, then escalate to the course instruction staff.
Any member can request an accommodation by telling any teammate or the Project
Manager. The full norms are in our Team Charter (Sections 4 and 5).

## Getting Started
Stack: React + Vite + TypeScript (frontend), Express 5 (backend), PostgreSQL
with Drizzle (database), Clerk (auth).
1. Clone the repo and run `npm install`.
2. Copy `.env.example` to `.env` and fill in values. Ask the Project Manager
   for shared dev values. Never commit `.env` (it is listed in `.gitignore`).
3. Start the database, then run `npm run dev`.

These steps will be updated as the codebase lands. Owner: John

## Branching & Workflow
- Trunk-based: `main` is the default branch and is protected.
- Branch from `main` as `feature/short-description` or `fix/short-description`.
- Keep branches short-lived. Rebase on `main` before opening a PR; merge via
  the PR (no direct pushes to `main`).

## Issues & Planning
- Work is tracked as GitHub Issues on the project board, which the Project
  Manager maintains.
- Each issue has a short description, an owner, and a size label
  (S, M, L). Anything larger than L is split so it can finish within a sprint.
- Anyone can file an issue. The PM triages new issues at the weekly meeting.

## Commit Messages
Short, imperative, and tied to an issue, for example:
`Add rule-based detector skeleton (#12)`
Use `fix:` or `feat:` prefixes if helpful, but always reference the issue number.

## Code Style, Linting & Formatting
- Linter: ESLint. Formatter: Prettier. Config files live at the repo root.
- Check: `npm run lint`. Type check: `npm run typecheck`.
- Fix formatting locally with `npx prettier --write .` before pushing.

Scripts and config are added in Sprint 1. Owner: Da'meka

## Testing
- Run all tests with `npm test`.
- Any change to behavior needs a new or updated test in the same PR.
- Detector and evaluation code (precision/recall scoring) must have tests
  using synthetic data only.
- Coverage thresholds will be set once there is code to measure. Owner: Da'meka

## Definition of Done
A change merges only when every check below passes:

| Check | Enforced by | Status / owner |
|---|---|---|
| One teammate approved | GitHub branch protection on `main` | On at repo creation, Da'meka |
| No secrets or partner data | Pre-commit secret scan; `.env` in `.gitignore` | Added Sprint 1, Harry |
| Docs updated if behavior changed | PR template checklist | Added Sprint 1, Da'meka |
| Lint and types pass | CI job `lint` (runs lint and typecheck) | Added Sprint 1, Da'meka |
| Tests pass | CI job `test` | Added Sprint 2, Da'meka |

## Contribution Norm
Every member lands at least one accepted piece of work per sprint.
- **Where work lives:** code in the GitHub repository (issues and PRs);
  meeting notes, decisions, and sprint records in the shared Google Drive
  folder; partner-facing material through the Project Manager.
- **What "accepted" means:** for code, a merged PR that meets the Definition
  of Done; for documentation or analysis, a deliverable approved by a teammate
  and stored in the repo or the shared folder.
- **Making it workable:** tasks sized to finish within a sprint, pairing when
  stuck, and review turnaround under two working days.

## Pull Requests & Reviews
- Use the PR template (description, linked issue, checklist). Added Sprint 1.
- Keep PRs small enough to review in one sitting.
- At least one teammate other than the author approves before merge.
- Review within two working days. Reviewers check: it works, tests exist,
  no secrets or partner data, docs updated, and it matches conventions.
- Required status checks: the CI jobs in the Definition of Done.

## CI/CD
- Pipelines run on GitHub Actions, defined in `.github/workflows/`.
- Mandatory jobs: `lint` (Sprint 1) and `test` (Sprint 2). Owner: Da'meka
- View logs from the PR's Checks tab and re-run failed jobs from there.
- Nothing merges to `main` with a failing required job.

## Security & Secrets
- Never hard-code secrets, API keys, or real transcripts. Use `.env`
  (ignored by git) and synthetic data for tests and demos.
- A pre-commit secret scan runs before every commit once added in Sprint 1.
  Owner: Harry
- Report a leak or suspected leak to the team and the AI Coordinator
  immediately; the AI Coordinator informs the partner.
- Dependencies are reviewed when added and checked for known vulnerabilities
  at the start of each sprint. Owner: Da'meka

## Documentation Expectations
- Update this file, the README, and AGENTS.md when setup, commands, or
  conventions change.
- Comment non-obvious logic, especially detector rules and label definitions.
- Record significant technical decisions as short ADRs.

## Release Process
- Releases are sprint-end demo builds, tagged `sprint-N` on `main`.
- A short changelog is written in the sprint notes. Owner: Da'meka
- Rollback: revert the offending PR and redeploy the previous tag.

## Support & Contact
- Team questions: Discord (acknowledge within 24 hours on weekdays).
- Partner questions: through the Project Manager, by email.
- "Can I paste this into an AI tool?": ask the AI Coordinator first.