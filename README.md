# Bias Lens

# IMPORTANT: To avoid merge conflicts, each of us should work in our own branch.

## How to create a new branch and push to the new branch:

1. Make sure you're on the latest `main`:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Create and switch to your own branch (use your name or a short feature name):
   ```bash
   git checkout -b your-branch-name
   ```
3. Make your changes, then stage and commit them:
   ```bash
   git add .
   git commit -m "Describe what you changed"
   ```
4. Push your branch to GitHub (`-u` is only needed the first time):
   ```bash
   git push -u origin your-branch-name
   ```
5. After the first push, you can just use `git push` while on your branch.
6. When your work is ready, open a Pull Request on GitHub to merge your branch into `main`.

---

## Description

Bias Lens is a computational linguistics platform for identifying and analyzing bias in therapeutic interactions, for mental health professionals, trainees, and supervisors. It analyzes written counseling transcripts after the session and surfaces language patterns associated with a defined set of biases, so a supervisor or a clinician in training can review specific moments rather than a general impression.

The application ingests a de-identified transcript, runs a detection pipeline over it, and presents the result as annotated spans: the utterance, which pattern fired, why, and a confidence the reviewer can see and disagree with. The reviewer accepts, rejects, or annotates each flag, and those judgments become evaluation data.

Detection is text-only and post-hoc. Two approaches are built and compared: a transparent lexical and rule-based baseline derived from the operational definitions, and a model-based classifier. Both are measured against held-out human labels and reported with precision and recall per bias category, including the categories where performance is poor. A tool of this kind that cannot say how often it is wrong is not usable in supervision, so the measurement is part of the deliverable.

> *“Build requirements, common to all our projects: React with Vite and TypeScript, an Express 5 REST API, PostgreSQL with Drizzle ORM, Clerk for authentication, and an OpenAPI 3.1 contract from which the typed client is generated. Any LLM call goes through a single provider-agnostic interface with no vendor or model name in application logic. We maintain these products after delivery and run several in parallel, so the team confirms this with us in the first weeks. Development and testing use synthetic or de-identified data only, never real client records, transcripts, or EHR notes. Pilots with real data are ours to run after handoff, with a business associate agreement in place with the model vendor.”*

## Problem statement

Increasing the effectiveness of therapists around bias is a significant issue for the helping professions, and it bears directly on the outcomes of the people they treat. Clinical supervision currently relies on a supervisor's recollection and a trainee's self-report, both selective in exactly the places that matter.

Bias in therapeutic interaction is expressed in language: in who gets interrupted, whose explanation is accepted without probing, which client's affect is named and which is passed over. Those patterns are visible in a transcript and invisible in memory. The hard problem is not building a classifier. It is defining what is being detected precisely enough that two people reading the same transcript agree, and then showing that a system tracks that agreement well enough to be worth a supervisor's attention.

## Objectives

A working prototype we can study in use at pilot sites, with an honest account of how well it performs.

- An annotation guideline built from our list of biases: operational definitions, positive and negative examples, edge cases.
- An annotated sample with inter-annotator agreement measured, and the guideline revised until agreement is acceptable. A category that cannot reach agreement is cut, and reporting that is a legitimate result.
- Transcript ingestion, and a review interface showing spans, rationale, and confidence with accept and reject actions.
- Speaker-turn metrics computed directly from the transcript: interruption rate, talk-time ratio, question-to-statement ratio. These need no labels.
- A rule-based baseline built from the operational definitions, and a model-based classifier.
- Evaluation of both against held-out labels, with per-category precision and recall.
- Error analysis by category, and a written statement of where the system is and is not usable.
- Deployment, and documentation of the corpus handling and the pipeline.

**Stretch goals.**

- A session-level summary rolling up flags, with per-category reliability shown next to it.
- Reviewer judgments fed back as training data, with a measured before and after.
- Ingestion from additional transcript formats, including timed text.

**Non-goals.** Text only for this build: no audio, video, or multimodal analysis, and no real-time operation during a session. Not an evaluation instrument for individual clinicians, and not usable for employment or licensure decisions. The corpus is de-identified or public.

## Minimum qualifications

- Python, and Git in a team.
- One course in machine learning or NLP, or equivalent project experience. You should know what precision and recall mean and why a single accuracy number is usually a lie.
- React and TypeScript for the review interface, from at least part of the team.
- Willingness to do annotation work. A meaningful share of the early work is reading transcripts and arguing about labels.

## Preferred qualifications

- Fine-tuning or evaluating text classifiers, including handling class imbalance.
- Corpus linguistics or discourse analysis.
- Prior work on an annotation pipeline or inter-annotator agreement.
- Experience with AI development platforms; our prototype work has been on Replit.
- An interest in fairness and the evaluation of NLP systems, including the failure modes of using a model to judge people.

## Contact

Justin Jacques: [justinjacques@humantheorygroup.com](mailto:justinjacques@humantheorygroup.com)

## Licensing / IP / NDA

This project requires an NDA or IP agreement.

Corpus access is governed by the licence or consent terms attached to the transcripts, which we supply in writing before work starts.

## URL

<https://www.humantheorygroup.com/>