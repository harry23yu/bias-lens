# AGENTS.md

Context and rules for AI tools (and people using them) working in this repository.
Per-tool files (for example CLAUDE.md) should point here rather than duplicate it.
Owner: Harry (AI Coordinator)

## Project
Bias Lens is an Oregon State capstone project for Human Theory Group. It detects
bias markers in counseling transcripts. It has two parts:
1. An NLP evaluation pipeline: a rule-based baseline detector and a model-based
   classifier, both scored against human-annotated labels (per-category
   precision and recall).
2. A clinician review interface where reviewers inspect flagged spans,
   confidence scores, and rationale.

Text only and post-session only. It must never be used to evaluate individual
clinicians or to inform employment or licensure decisions.

## Documents
Read these before changing code. They are the source of truth; this file points
to them and does not copy them. If one disagrees with the code, fix the doc in
the same pull request.
- `docs/requirements.md`: problem statement, requirements and acceptance
  criteria, constraints, non-goals, open questions
- `docs/design.md`: system design, interfaces and contracts, data model,
  deployment, deferred decisions
- `docs/risks.md`: the single risk register, external prerequisites, staging
  and rollback plan
- `CONTRIBUTING.md`: setup, branching, review, Definition of Done
- `README.md`: quickstart from a clean clone

## Stack
- Frontend: React, Vite, TypeScript
- Backend: Express 5
- Database: PostgreSQL with Drizzle
- Auth: Clerk

## Conventions
- Follow CONTRIBUTING.md for setup, branch and PR workflow, review, and the
  Definition of Done.
- Branch from `main`; no direct pushes to `main`.
- AI-generated code gets the same tests and review as any other code.
- Do not add dependencies without mentioning them in the PR description.
- Never write secrets, API keys, or real data into code, tests, fixtures, or logs.

## Confidentiality boundary (NDA project)
- **Open (any AI tool):** general programming questions, public documentation,
  and our own code that contains no partner data or credentials.
- **Approved tools only:** partner-provided project materials and meeting content.
- **Never leaves the repository or partner systems:** real or identifiable
  counseling transcripts, credentials, API keys, and identifiable client
  information. Never paste these into any AI tool.
- **Test and demo data:** synthetic or expressly approved de-identified
  transcripts only.
- **When unsure, don't paste.** Ask the AI Coordinator first. Pasting restricted
  data because we weren't sure is a confidentiality incident: report it to the
  team and the AI Coordinator right away.

## Approved AI tools
Not yet confirmed with the partner. Replete.ai has been discussed by the
partner's team but is not approved for our use until confirmed in writing.
Until then, external AI tools receive only synthetic or expressly approved data.
- Confirmation from Justin due: Thursday, 10/15. Owner: Harry
- Approved tools and permitted data types will be listed here once confirmed.

## To be added once code exists
| Item | Owner | Target |
|---|---|---|
| Lint command (`npm test` and `npm run typecheck` now exist in the scaffold) | Da'meka | Sprint 1 |
| Directory layout and where the detectors and review UI live | John | Sprint 1 |
| Database and Drizzle schema conventions | John | Sprint 2 |
| Annotation labels and bias-category definitions | Whole team, with the partner | Sprint 2 |
| Rules for AI tools on the evaluation code (what must never be auto-edited) | Harry | Sprint 2 |