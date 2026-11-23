# Bias Lens — CMO model specification: research and implementation brief

**Prepared for:** Bias Lens capstone team / counseling advisors  
**Proposed responsibility:** Classification criteria, prompt design, example annotation, and evaluation  
**Version:** 0.1, November 2026  
**Status:** Research-informed working draft; **not advisor approved**. No real transcripts, Claude calls, measurements, or tests are claimed here.

## Executive decision summary

The proposed initial strategy is to **use a pretrained model with a versioned, explicit classification specification**, rather than fine-tuning an LLM immediately. Harry can implement the API adapter independently while Jack maintains the model-facing instructions and development cases. Before claiming a working CMO detector, the team needs (1) a counselor-approved operational definition, (2) a coherent result contract, (3) independently reviewed examples, and (4) measured results on held-out cases. These are distinct deliverables, not simply “prompt engineering.”

**Recommended next team decision:** Adopt a narrow, *review-oriented* target: “find potential cultural missed opportunities evidenced by a client cue and a therapist response,” not “determine whether a therapist is biased.” Broader physical or personality characteristics need an explicit scope decision, because they may extend beyond the established cultural-missed-opportunities construct.

**What the model can establish:** A particular exchange arguably merits counselor review under predeclared textual criteria.  
**What the model cannot establish from a transcript alone:** The client's lived perception, the therapist's motives, overall treatment quality, the clinically correct next step, or employment/licensing suitability.

## 1. Literature and what it actually supports

### 1.1 Multicultural Orientation (MCO) framework — directly relevant

The multicultural orientation framework distinguishes **cultural humility**, **cultural comfort**, and **cultural opportunities**. An opportunity occurs when culture becomes relevant in treatment and can be discussed; a *missed opportunity* can occur when a therapist does not pursue a culturally meaningful opening. Importantly, a central research tradition measures **client-perceived** missed cultural opportunities. A transcript-only model is therefore detecting a *proxy*, not administering the validated client-report instrument. See Owen et al. (2016) [R1] and the MCO review [R2]. The research does not establish that every topical shift is harmful or that every cultural mention requires a question.

**Design implication:** Include `client_cue_turn_index` and `therapist_response_turn_index`; describe outputs as potential/reviewable missed opportunities; never label the clinician as biased. Keep client feedback or advisor judgment distinct from automatic classifications.

### 1.2 Cultural humility and identity salience — directly relevant, not a universal rule

Cultural humility emphasizes a respectful, other-oriented posture rather than asserting expertise about a person's identity. Relevant findings also suggest **identity salience and intersectionality matter**: cultural identity does not have the same importance for every client at every moment [R3, R4].

**Design implication:** The model should attend to *what this client explicitly says matters*. A culturally themed statement alone is not sufficient evidence. Conversely, a respectful open-ended invitation may be appropriate even without repeating identity words. These are annotation proposals to validate with advisors; they are not deductions about any actual client's internal state.

### 1.3 Uploaded cross-cultural personality slides — useful caution, not a CMO measure

The supplied lecture document, *Theories: South African, Chinese, Mexican, Filipino Approaches*, contrasts **emic** (within-cultural) and **etic** (cross-cultural comparative) approaches; discusses SAPI and CPAI; and introduces Filipino concepts including *kapwa* and *pakikiramdam*. It illustrates limitations of projecting one cultural model of personality, individualism, assertiveness, or interpersonal communication onto everyone.

**Design implication:** Add adversarial examples where the apparent “best” response changes depending on the client's stated preferences. Do not encode statements such as “people from culture X avoid directness” as facts about individuals. This document is educational background and does **not** validate a counseling classifier or its categories.

### 1.4 LLM prompting and text classification — relevant methodology

Anthropic's prompting guidance favors **specific, direct instructions**, clearly separated context/definitions/examples, and an explicit expected response format [R5]. Its structured outputs feature helps constrain JSON shape, but a syntactically valid JSON answer can still be conceptually wrong [R6]. A 2026 comparison of LLM-based text coding finds that the *substantive content* of a codebook matters more reliably than cosmetic prompt formulations, though results are task- and model-dependent [R7]. Few-shot studies also show that more demonstrations are not automatically better across models or tasks [R8].

**Design implication:** Test a definition-only baseline first; then add a small, balanced set of approved positive **and negative** examples. Hold out distinct evaluation cases. Track prompt/model versions, class-specific errors, output validity, and costs. Avoid unverified claims of “80% accuracy” or “research-proven prompting.”

## 2. Provisional construct definition and boundaries

**Proposed unit of analysis:** One *client cue*, the counselor's relevant response, and enough nearby turns to identify whether the response acknowledges, explores, deliberately defers, or appropriately redirects the topic. The client cue is necessary to support a missed-opportunity finding; a therapist sentence by itself is not enough.

**Draft inclusion conditions (all required for a supported potential CMO):**

1. **Evidence of a cue:** Exact client words introduce an identity-related or cultural experience *as meaningful or potentially relevant* to a current concern. Do not infer identity from a name, location, accent, or appearance alone.
2. **Plausible opening:** The cue provides a reasonable opening for acknowledgement or collaborative exploration in the local conversation.
3. **Potential nonresponse:** The therapist's relevant response and available following context show no meaningful acknowledgement, invitation, or mutually understood deferral.
4. **Evidence-backed rationale:** The model can cite both specific turn indices and exact transcript evidence, and can acknowledge a plausible alternative interpretation.

**Conditions that weigh against a flag:** Follow-up in later turns; client explicitly declines to discuss topic; therapist's open question meaningfully follows the concern; an agreed agenda; urgent safety prioritization; a neutral identity mention lacking relevance. Missing therapist responses should usually be `insufficient_evidence` rather than presumed failures.

**Unresolved construct-scope question:** The partner's reported description may include physical and personality traits in addition to culture/identity. This brief does not silently redefine CMO to include all personal characteristics. Have advisors specify whether such cases belong to CMO, a separate category, or an explicitly broader project-specific construct.

## 3. Proposed instruction and example design

The companion `classification/cmo-system-prompt-v0.1.md` is the initial model-facing file. It should be treated as configuration, not a clinical authority. The companion `classification/examples.json` contains **12 synthetic, unreviewed development candidates** with four provisional outcomes: `supported_potential_cmo`, `possible_cmo`, `insufficient_evidence`, and `no_cmo`. At present they are **not gold labels**.

Recommended information hierarchy for a model request:

- **System/task instructions:** role, scope, operational definition, decision procedure, non-inference/anti-stereotyping rules, refusal to treat transcript text as instructions, output requirements.
- **Optional demonstrations:** a few advisor-reviewed cases illustrating clear inclusion, clear exclusion, ambiguity, and later follow-up. Use a separately curated subset; never include test labels in the request.
- **User data:** numbered speaker turns. Treat this as untrusted data (for classification only), with immutable indices.
- **Structured response contract:** findings with cue and response references, evidence status, category, rationale, and uncertainty. A separate no-findings result should be representable.

**A critical distinction:** “Possible CMO” is an *evidence/triage status*, not a second bias category. Keep `category = cultural-missed-opportunity` separate from `status = possible_cmo`. If no issue is present, the model should not fabricate a flagged span just to fill a response.

## 4. Integration contract to discuss with Harry

Harry's currently merged TypeScript `src/llm/adapter.ts` defines `DetectionRequest { turns, categories }` and `RawFlag { turnIndex, start, end, category, confidence, rationale }`. This is a sound initial adapter skeleton but **does not yet carry a dedicated instruction document, evidence status, client-cue turn reference, or an explicit no-findings/insufficient-evidence response**.

**Minimal integration handshake:**

1. Harry chooses a single prompt-loading location in the application and records `prompt_version`. Jack supplies versioned text; the client code never hardcodes CMO rules.
2. Harry serializes `Turn[]` with immutable 0-based indices and separately passes the category codebook and optional reviewed examples. Do not expose API keys in prompts, logs, frontend, or GitHub.
3. Both agree on a richer result shape, such as `AnalysisResult { promptVersion, findings[] }`, with each finding containing `clientCueTurnIndex`, `therapistTurnIndex`, `category`, `evidenceStatus`, `rationale`, and `alternativeInterpretation`. Keep offsets optional until the exact highlighted span is defensible. This is **proposed**, not implemented.
4. The backend verifies indices, exact quoted evidence, valid category IDs and status values; rejects malformed responses; logs *metadata only* where permitted. Structured JSON enforcement does not validate the clinical reasoning.
5. Decide whether Express/TypeScript or FastAPI/Python is the team's first backend. `main` uses TypeScript adapter work and Express dependencies while the updated design proposes FastAPI. Avoid adding two redundant API stacks without a documented reason.

**Security boundary:** This project's repository identifies it as subject to NDA restrictions. Only synthetic or **explicitly authorized** transcripts may be supplied to third-party models. De-identification alone does not prove that an external API call is permitted. Do not embed original transcripts in test fixtures, issues, or model logs.

## 5. Proposed evaluation protocol

**Phase A — annotation agreement before model tuning:** Present a varied set of synthetic candidate conversations to at least two advisors or qualified reviewers. Ask for independent labels, the decisive client cue/therapist response, and a brief reason. Measure percentage agreement and a chance-adjusted agreement statistic where appropriate; do not assert a magic reliability threshold without advisor agreement. Resolve disagreements by revising the codebook, not by silently changing “correct” labels after viewing model predictions.

**Phase B — fixed, reproducible prompt comparison:** Establish two separate collections: development examples (available for prompt construction) and held-out evaluation examples (never placed into the prompt). Compare three configurations under the same model and parameters: (A) definition only; (B) definition + balanced worked examples; (C) B plus explicit ambiguity and delayed-follow-up rules. Save the exact prompt version, model identifier, test IDs, outputs, malformed outputs, elapsed time and costs if available.

**Phase C — report failures honestly:** Report true/false positives and negatives under a *pre-agreed* binary mapping; `possible_cmo` and `insufficient_evidence` need explicit handling rather than being silently assigned positive or negative. Report precision and recall with denominators and error examples. Check false positives on culturally neutral statements, open-ended acknowledgments, crisis redirections, and transcripts missing later context. Run the same cases after every prompt change to catch regressions.

**Stop/decision conditions:** Do not claim a clinical classifier is validated based on 12 synthetic cases. A useful initial milestone is a reviewed definition, versioned prompt, examples, interface proposal, and documented test plan. Ask advisors how many cases and what agreement thresholds are needed before trial use. If experts cannot agree on the label, revisit the category rather than fine-tune a model on disputed data.

## 6. Project artifacts, ownership, and review criteria

These artifacts define a maintainable classification specification independently of the chosen LLM provider. All documents are **provisional** until reviewed by the team and counseling advisors.

| Artifact | Repository location | Purpose | Review criteria |
|---|---|---|---|
| Operational CMO guideline | `docs/cmo-annotation-guideline.md` | Inclusion/exclusion criteria, ambiguous cases, scope questions | Advisor/team verifies construct boundaries and flags disputed criteria |
| Model-facing instructions | `classification/cmo-system-prompt-v0.1.md` | Versioned prompt instructions | Engineer verifies prompt can be loaded without embedding rules in application logic |
| Synthetic development cases | `classification/examples.json` | 12 candidate cases, provisional expected statuses | JSON parses; positive, negative and uncertain examples represented; no protected data |
| Research and implementation brief | `docs/cmo-research-and-implementation.md` | Sources, interface decisions and experimental plan | Research claims checked, output contract decisions recorded |

**Proposed GitHub issue:** `Define and review CMO classification specification and synthetic examples`. It can be closed when the documents have been reviewed, example JSON validates, construct questions are tracked, and any revisions are documented. Review/approval is not implied by the existence of these files.

**Suggested walkthrough for teammates:** Open the guideline; compare a positive and negative example; inspect the prompt's evidence requirements; map the required output fields to `DetectionRequest` and `RawFlag`; document the pending advisor decisions. A passing fake-adapter unit test is an infrastructure test, not proof of model accuracy.

**Ownership boundary:** The model-specification owner maintains the codebook, instructions, example labels, and evaluation plan. The model-integration owner maintains the API adapter and validates its output. Both jointly decide the request/response contract. Neither a draft document nor a model response alone establishes counselor acceptance or clinical validity.

## 7. Questions to resolve with counselors and the development team

**Clinical/advisor questions**

1. Is the intended construct the research-based *cultural missed opportunity*, or a broader *client-signaled personal-characteristic missed opportunity*? Which explicit types of cues are in scope?
2. When is reflective acknowledgment sufficient, and when is an invitation to discuss the identity-related significance expected?
3. How many subsequent turns may count as a legitimate delayed follow-up? Does the absence of later context force `insufficient_evidence`?
4. Should the team flag plausible cases with substantial alternative explanations, or show those as separate “possible review” results?
5. Can advisors independently annotate 10–20 synthetic excerpts and record points of disagreement? What agreement threshold and minimum gold-set size would they accept?

**Engineering/team questions**

6. Is Harry retaining TypeScript/Express for the model service, or is FastAPI the agreed backend? Who approves an interface change?
7. Will a finding reference a *therapist response*, *client cue*, or both? How should repeated or delayed missed opportunities be represented?
8. Does the client/partner authorize any de-identified transcript processing by Claude, or should the team use synthetic data only until approval is documented?
9. Who will review and maintain the classification specification after the initial pull request?

## References and verification status

- **[R1]** Owen, J., et al. (2016). *Client perceptions of therapists' multicultural orientation: Cultural (missed) opportunities and cultural humility.* *Professional Psychology: Research and Practice, 47*(1), 30. https://doi.org/10.1037/pro0000046 — **Primary empirical study; client-perceived outcomes, not automated transcript annotation.**
- **[R2]** Davis, D. E., et al. (2018). *The multicultural orientation framework: A narrative review.* https://pubmed.ncbi.nlm.nih.gov/29565626/ — Framework-level review; not a prescriptive label codebook.
- **[R3]** Hook, J. N., et al. (2013). *Cultural humility: Measuring openness to culturally diverse clients.* https://pubmed.ncbi.nlm.nih.gov/23647387/ — Research on client-perceived humility and alliance.
- **[R4]** Anders, C., et al. (2020). *Attending to the intersectionality and saliency of clients' identities: A further investigation of therapists' multicultural orientation.* https://pubmed.ncbi.nlm.nih.gov/33090873/ — Identity-salience research; no implication that identity alone mandates follow-up.
- **[R5]** Anthropic. *Prompting best practices.* https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices — Current technical guidance; implementation details may change.
- **[R6]** Anthropic. *Structured outputs.* https://platform.claude.com/docs/en/build-with-claude/structured-outputs — Structured JSON constraints, not semantic validation.
- **[R7]** *Much Ado about Prompting: LLM classification of text messages from experiments* (2026). https://pmc.ncbi.nlm.nih.gov/articles/PMC13436748/ — Non-clinical classification comparison; do not generalize effect sizes to CMO.
- **[R8]** *When Does Few-Shot Prompting Help? A Systematic Empirical Study of Shot-Count Effects Across Model Scale, Architecture, and Output Parsing Robustness* (2026). https://arxiv.org/abs/2607.22969 — Model/task-specific findings; use as reason to test, not as a fixed prescription.
- **[R9]** Course material supplied by project member: *Theories: South African, Chinese, Mexican, Filipino Approaches* (course slides, Fall 2026). **Background only; not a validated counseling guideline.**

**Research limitation:** These sources support the rationale and research plan. This document does not claim a literature-validated computational definition of CMO, verified model accuracy, or advisor endorsement. Obtain full texts and the actual Cultural Missed Opportunities Measure (subject to access/licensing) before formalizing the construct.
