# Requirements

Status at Repo Checkpoint 1 (fall week 5): scaffold stage. No requirement below is implemented yet. "Test in CI" entries are filled in as each requirement lands.

## Problem statement

Clinical supervision of therapists relies on a supervisor's recollection and a trainee's self-report, both selective in exactly the places where bias shows up. Bias in therapeutic interaction is expressed in language (who is interrupted, whose explanation goes unprobed, whose affect is named), and those patterns are visible in a transcript but invisible in memory.

Bias Lens analyzes written, de-identified counseling transcripts after a session and surfaces language patterns associated with a defined set of biases, so a supervisor or trainee can review specific moments instead of a general impression. The hard problem is not building a classifier; it is defining each bias precisely enough that two readers agree, then showing the system tracks that agreement well enough to deserve a supervisor's attention.

**Users:** clinical supervisors, clinicians in training, and mental health professionals. **Partner:** Human Theory Group (contact: Justin Jacques).

## Functional requirements

| ID | Requirement | Acceptance criterion | Test in CI |
|---|---|---|---|
| FR-1 | Ingest a de-identified plain-text transcript and split it into speaker turns. | A sample synthetic transcript yields the expected number of turns with correct speaker labels; malformed input is rejected with a clear error. | TBD |
| FR-2 | Speaker-turn metrics computed from the transcript alone: interruption rate, talk-time ratio, question-to-statement ratio. | On a synthetic transcript with known values, each metric matches the hand-computed value. | TBD |
| FR-3 | Rule-based baseline detector derived from the operational bias definitions. | On a synthetic labelled sample, every rule fires on its positive examples and not on its negative examples. | TBD |
| FR-4 | Model-based classifier behind a single provider-agnostic interface. | Swapping the provider implementation requires no change to application logic; no vendor or model name appears outside configuration and the adapter. | TBD |
| FR-5 | Review interface showing each flagged span, the pattern that fired, the rationale, and the confidence; the reviewer can accept, reject, or annotate. | A reviewer's action on a flag persists and is shown on reload. | TBD |
| FR-6 | Store reviewer judgments as evaluation data. | Each judgment links to its transcript, span, reviewer, and decision. | TBD |
| FR-7 | Evaluate both detectors against held-out human labels with per-category precision and recall. | On a synthetic labelled set with known answers, the reported precision and recall equal the hand-computed values. | TBD |
| FR-8 | Error analysis by category and a written statement of where the system is and is not usable. | Report exists in the repo and names every category, including those with poor performance. | n/a (document) |
| FR-9 | Authenticated access via Clerk. | An unauthenticated request to a protected endpoint is rejected. | TBD |
| FR-10 | Annotation guideline and inter-annotator agreement measurement. | Guideline has definitions, positive and negative examples, and edge cases per category; agreement is measured and reported. A category that cannot reach acceptable agreement is cut and the cut is documented. | n/a (document) |

**Stretch (not committed):** session-level summary with per-category reliability; reviewer judgments fed back as training data with a measured before/after; additional transcript formats including timed text.

## Non-functional requirements

- **Honest measurement:** every detector output carries a visible confidence, and per-category precision and recall are reported, including poor categories.
- **Privacy:** development, testing, and demos use synthetic or de-identified data only. No real client records, transcripts, or EHR notes enter the repository, tests, fixtures, logs, or AI tools.
- **Maintainability:** the partner maintains the product after delivery and runs several in parallel, so the standard stack and the OpenAPI contract are followed.
- **Provider independence:** any LLM call goes through one interface; the vendor and model are configuration.
- **Reproducibility:** the evaluation runs from a documented command on sample data.

## Constraints (limits the team did not choose)

1. **Stack, set by the partner:** React with Vite and TypeScript; Express 5 REST API; PostgreSQL with Drizzle ORM; Clerk for authentication; OpenAPI 3.1 contract from which the typed client is generated. The partner asked the team to confirm this in the first weeks (see Open questions).
2. **LLM access:** a single provider-agnostic interface, with no vendor or model name in application logic.
3. **Data:** synthetic or de-identified only. Pilots with real data are run by the partner after handoff, under a business associate agreement with the model vendor.
4. **Corpus terms:** corpus access is governed by the licence or consent terms the partner supplies in writing.
5. **NDA/IP:** the project requires an NDA or IP agreement; the repository is private.
6. **AI tools:** only tools the partner has approved in writing may receive partner materials; until then, external tools receive synthetic or expressly approved data only.
7. **Scope limits:** text only and post-session only; never an evaluation instrument for individual clinicians and not usable for employment or licensure decisions.
8. **Course timeline:** fall term ends with a working walking skeleton deployed (Repo Checkpoint 2, week 10); the full term runs through winter.

## Success metrics

- Annotation guideline exists with inter-annotator agreement measured and reported; threshold for "acceptable" agreed with the partner (TBD).
- Both detectors evaluated on held-out labels, with per-category precision and recall published.
- Reviewer can complete the flag, review, accept/reject loop end to end on a synthetic transcript.
- The partner can build and run the system from the documented quickstart.

## Non-goals

No audio, video, or multimodal analysis; no real-time use during a session; no evaluation of individual clinicians; no employment or licensure use; no real client data in this build.

## Open questions

1. Where will the walking skeleton run, and who owns that account? (See `docs/design.md`, Deployment, and `docs/risks.md`.)
2. Has the partner confirmed the standard stack and the OpenAPI client-generation setup?
3. Which AI tools has the partner approved in writing?
4. What is the bias category list, and what agreement threshold counts as acceptable?
5. Which corpus will be used, in what format, and under what licence terms?
6. Which model approach do we pursue (do nothing, fine-tune an open-weight model, or an existing LLM with structured instructions)? Decision pending the team RFC reviews.
