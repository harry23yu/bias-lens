# Bias Lens

Bias Lens is a computational linguistics platform for identifying and analyzing bias in therapeutic interactions, for mental health professionals, trainees, and supervisors. It analyzes written, de-identified counseling transcripts after the session and surfaces language patterns associated with a defined set of biases, so a reviewer can look at specific moments rather than a general impression.

The application ingests a de-identified transcript, runs a detection pipeline over it, and presents the result as annotated spans: the utterance, which pattern fired, why, and a confidence the reviewer can see and disagree with. The reviewer accepts, rejects, or annotates each flag, and those judgments become evaluation data.

Detection is text-only and post-session. A rule-based baseline and a model-based classifier are built and compared, and both are measured against held-out human labels with per-category precision and recall.

Bias Lens is an NDA project. Never commit real transcripts, credentials, or identifiable client data.

## Quickstart

This quickstart starts only the scaffold for now (a small transcript-parsing module and its tests). The full application will be added to these steps as it lands.

Prerequisite: Node.js 20 (Node 18 or newer works locally).

```bash
git clone https://github.com/harry23yu/bias-lens.git
cd bias-lens
npm install
npm test
```

`npm test` should report all tests passing. To also check types, run `npm run typecheck`.

No `.env` file or database is needed yet.

## Documents

- [docs/requirements.md](docs/requirements.md): problem statement, requirements, constraints, non-goals, open questions
- [docs/design.md](docs/design.md): system design, interfaces, data model, deployment
- [docs/risks.md](docs/risks.md): the project's single risk register and staging and rollback plan
- [CONTRIBUTING.md](CONTRIBUTING.md): setup, branching, review, Definition of Done
- [AGENTS.md](AGENTS.md): rules and context for AI tools working in this repository

## Branching

`main` is the default branch and nothing reaches it except through a reviewed pull request. Work on your own branch and open a pull request when it is ready. Branch naming, review rules, and the Definition of Done are in [CONTRIBUTING.md](CONTRIBUTING.md).

## Licensing / IP / NDA

This project requires an NDA or IP agreement. Corpus access is governed by the licence or consent terms attached to the transcripts, which the partner supplies in writing.

Partner: Human Theory Group (<https://www.humantheorygroup.com/>).