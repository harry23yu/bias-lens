# Bias Lens — Cultural Missed Opportunity classification materials

These files are intended to live in the existing `harry23yu/bias-lens` repository. The structure below matches the repository root. The materials are **working drafts**, not counselor-approved clinical criteria.

## Files

- `classification/cmo-system-prompt-v0.1.md` — versioned instructions to supply to the LLM; do not assume the current adapter loads this automatically.
- `classification/examples.json` — 12 synthetic, **unreviewed** development candidates; do not treat their labels as gold-standard evidence.
- `docs/cmo-annotation-guideline.md` — draft operational definition, exclusions, scope and reviewer questions.
- `docs/cmo-research-and-implementation.md` — research rationale, model interface handoff, evaluation protocol, references, and project considerations.

## Add to GitHub

Open `jack-main` on GitHub. Upload the two files under `classification/` and the two documents under `docs/`; preserve names and directory placement. `README.md` is a local guide to these materials, **not** a replacement for the existing repository README. Open a pull request for team review. No actual transcripts or API credentials should be uploaded.

## Integration caveat

Harry's current `src/llm/adapter.ts` contract has `turns`, `categories`, and span-based `RawFlag` outputs. It does not yet represent all of the proposed evidence statuses, client-cue references, or prompt versions. Agree on the output contract and prompt-loading location before treating these artifacts as executable integration.

## Source limitations

The cross-cultural personality teaching slides motivate cultural sensitivity but are not a diagnostic instrument. Counseling-advisor approval and independent evaluation are required before claims about classifier performance.
