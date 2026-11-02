# Design

Status at Repo Checkpoint 1 (fall week 5): scaffold stage. Everything below is marked **Planned** or **Decided**; nothing is marked built until it is in the code. Update this file in the same PR that changes the system.

## Context

Bias Lens is used by clinical supervisors and trainees to review de-identified counseling transcripts. A reviewer uploads a transcript, the system flags spans with a rationale and confidence, and the reviewer accepts, rejects, or annotates each flag. Reviewer judgments become evaluation data.

```
 Reviewer (browser)
        |
        v
 React + Vite + TypeScript  -- typed client generated from OpenAPI 3.1 -->  Express 5 REST API
        |                                                                   |        |
   Clerk (auth)  <----------------------------------------------------------+        |
                                                                                     v
                                                          PostgreSQL (Drizzle)   Detection pipeline
                                                                                  |-- rule-based baseline
                                                                                  |-- model-based classifier
                                                                                        |
                                                                           provider-agnostic LLM interface
                                                                                        |
                                                                           external model provider (TBD)
```

## Components (Planned)

| Component | Responsibility | Status |
|---|---|---|
| Frontend (React, Vite, TypeScript) | Upload, annotated-span review UI, accept/reject/annotate | Planned |
| API (Express 5) | Auth check, ingestion, run detection, store and serve flags and reviews | Planned |
| Detection pipeline | Speaker-turn metrics, rule-based baseline, model-based classifier | Planned |
| LLM interface | One interface; vendor and model chosen by configuration only | Planned |
| Evaluation | Per-category precision and recall against held-out labels | Planned |
| Database (PostgreSQL, Drizzle) | Transcripts, turns, flags, reviews, labels, evaluation runs | Planned |

Directory layout and where each component lives: owner John, Sprint 1; this section is updated when the scaffold lands.

## Interfaces and contracts

- **REST API:** described by one OpenAPI 3.1 file; the frontend's typed client is generated from it, never hand-written. Location of the file: TBD with the scaffold.
- **LLM interface:** a single provider-agnostic interface (for example, "classify these spans given these definitions, return labels, rationale, confidence"). Application logic never names a vendor or model.
- **Auth:** Clerk issues sessions; the API verifies them on protected routes.

## Data model (Planned, draft)

Entities: `transcript`, `turn` (speaker, text, order), `flag` (turn span, bias category, rationale, confidence, detector), `review` (flag, reviewer, accept/reject/annotation), `label` (human gold label for evaluation), `evaluation_run` (detector, category, precision, recall). Users and sessions live in Clerk. The schema is a draft until John's Sprint 2 schema conventions land; schema changes require review (see risks.md).

## Deployment

**Production target: not yet agreed.** The walking skeleton must serve requests in the production target by Repo Checkpoint 2 (week 10).

- **Where it will run:** TBD with the partner. The partner runs several products in parallel and has prototyped on Replit; whether the team deploys to partner-controlled infrastructure or a team-managed host is undecided.
- **Who owns the account or infrastructure:** TBD (to be named by the partner).
- **Who agreed it:** not yet agreed. Justin Jacques (Human Theory Group) is the decision-maker; the Project Manager (John) is raising it. Owner and date to close: see `docs/risks.md`, R-1.
- **Preview/staging and rollback:** CI builds and tests every PR; until a target exists, changes are exercised locally and on a sprint-end demo build tagged `sprint-N`. Rollback is to revert the offending PR and redeploy the previous tag (see CONTRIBUTING.md). Dates these land: `docs/risks.md`, Staging and rollback plan.

## Decisions deferred on purpose

- **Model approach** (do nothing, fine-tune an open-weight model, or an existing LLM with structured instructions): deferred until the team's RFC reviews and the annotation guideline give us labels to compare against.
- **Hosting target:** deferred until the partner confirms accounts and policy.
- **Bias category list and schema for labels:** deferred until the annotation guideline is written with the partner.
- **AI tools:** none approved yet; see AGENTS.md.

## Open technical questions

1. Transcript input format for the first build (plain text with speaker prefixes, or something else)?
2. How are model-provider credentials and the business associate agreement handled in a deployed environment?
3. Does the partner require a particular hosting or CI setup so the product matches their other projects?
4. How will held-out labels be stored and kept out of training data?
