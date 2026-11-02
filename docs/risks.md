# Risks

This is the one risk register for the project (business, technical, and team). Each risk is written as a fact about the project, without blame. Rank 1 is the most urgent. Review at every sprint start and before each checkpoint.

Last updated: 2026-11-01 (Repo Checkpoint 1). Owners below are proposed and must be confirmed by the team.

## Ranked risks

| Rank | ID | Risk | Likelihood / impact | Owner | Mitigation / next step | Status |
|---|---|---|---|---|---|---|
| 1 | R-1 | The production target for the walking skeleton is not agreed with the partner, and accounts or approvals can take weeks. | High / High | John | Ask Justin for hosting target, account owner, and approval path; record the answer in `docs/design.md`. | Open |
| 2 | R-2 | No CI or tests exist yet, so no check would catch a broken change. | High / High | Da'meka | Add a scaffold, one failing-when-broken test, and a GitHub Actions workflow on every PR; break something once on a branch to confirm CI goes red. | Open |
| 3 | R-3 | Approved AI tools are not confirmed in writing, so the team can only use external AI tools on synthetic data. | High / Medium | Harry | Get written confirmation from Justin; list approved tools in AGENTS.md. | Open (confirmation was due 10/15) |
| 4 | R-4 | The partner's standard stack and OpenAPI client generation have not been confirmed as correctly understood. | Medium / High | John | Confirm the stack and contract setup with Justin; record any change under Constraints in `docs/requirements.md`. | Open |
| 5 | R-5 | The bias category list and corpus (with licence terms) are not yet in hand, which blocks the annotation guideline and evaluation. | Medium / High | Whole team with partner (coordinator: Harry) | Request category list and corpus licence in writing; use synthetic data meanwhile. | Open |
| 6 | R-6 | Real or identifiable transcripts could be pasted into an AI tool or committed. | Low / Very high | Harry | Pre-commit secret scan, `.env` ignored, confirm-before-paste rule in AGENTS.md; report any incident to the team and the partner immediately. | Mitigation in progress |
| 7 | R-7 | One or more bias categories may not reach acceptable inter-annotator agreement. | Medium / Medium | Whole team | Revise guideline; cut categories that cannot agree and report the cut as a result. | Open |
| 8 | R-8 | The model-based classifier needs a model provider, a business associate agreement for real data, and budget, none of which are decided. | Medium / Medium | Harry | Keep the provider-agnostic interface; run on synthetic data only; partner owns the real-data agreement after handoff. | Open |
| 9 | R-9 | Branch protection on `main` has not been verified (an early README commit reached `main` directly), so history rules depend on settings. | Medium / Medium | Da'meka | Confirm branch protection and required reviews are enabled; all later work reaches `main` through reviewed PRs. | Open |

## External prerequisites

| Prerequisite | Needed for | Who asked | When asked | Status |
|---|---|---|---|---|
| Production target and account owner | Walking skeleton deployment (checkpoint 2) | John | TBD: record date | Not yet agreed |
| Written approval of AI tools | Using AI tools with partner materials | Harry | TBD: record date (due 10/15) | Pending |
| Confirmation of build requirements (stack, OpenAPI) | Scaffold | John | TBD: record date | Pending |
| Corpus and licence or consent terms | Annotation and evaluation | TBD | TBD | Pending |
| Bias category list | Annotation guideline | Whole team | TBD | Pending |
| Business associate agreement with model vendor | Real-data pilots (partner's, after handoff) | Partner | n/a | Partner-owned |
| Clerk and database accounts for deployed environment | Auth and persistence in production | TBD | TBD | Not started |

## Staging and rollback plan

Dates are targets the team commits to; update this table when each lands.

| Item | Plan | Owner | Lands |
|---|---|---|---|
| Review gate on expensive-to-undo changes (schema, auth, deployment, migrations) | Branch protection with one approving teammate other than the author; migrations and auth changes need an explicit reviewer note in the PR. | Da'meka | TBD: fill in date |
| Place to exercise changes before users | CI on every PR plus a preview or staging deployment on the agreed target; until then, local run on sample data and the `sprint-N` demo build. | John | TBD: fill in date |
| Rollback | Revert the offending PR and redeploy the previous `sprint-N` tag. | John | In CONTRIBUTING.md now |
