# Bias Lens: CMO Classification Research and Implementation

**Version:** 0.2 — November 2026  
**Status:** Working draft; classification criteria and example labels await counselor review

## Overview

Bias Lens will initially use a pretrained language model with written classification criteria and examples, rather than fine-tuning a model. This lets us test and revise the criteria before collecting a substantial labeled dataset. The proposed detector will flag *potential cultural missed opportunities* for review, not determine whether a counselor is biased.

The main work still needed is to agree on the scope of a cultural missed opportunity (CMO), connect the instructions to the model interface, and evaluate predictions against independently reviewed examples. The accompanying instruction file and synthetic examples are starting materials, not validated labels.

## 1. Relevant research

### Cultural missed opportunities

The multicultural orientation (MCO) framework discusses cultural humility, cultural comfort, and cultural opportunities in therapy. Cultural missed opportunities are important to this project, but the published research includes measures of **clients' perceptions** of these experiences [R1, R2]. A classifier working from transcript text alone cannot establish what a client perceived, or why a counselor responded in a particular way.

For this reason, a flag should identify the relevant client statement, the counselor's response, and why the exchange may merit review. The output should not state that the counselor demonstrated bias as an established fact. Nor should a change of topic automatically count as a missed opportunity.

### Cultural humility and individual context

Research on cultural humility and identity salience suggests that the importance of a particular identity depends on the client and the situation [R3, R4]. We should prioritize what the client communicates as meaningful rather than assume that every reference to culture needs further discussion. Likewise, a counselor may respond appropriately through a broader, open-ended question rather than by repeating an identity term.

The supplied lecture slides, *Theories: South African, Chinese, Mexican, Filipino Approaches*, are useful background. They distinguish emic and etic approaches and discuss culturally situated views of personality and relationships, including *kapwa* and *pakikiramdam* [R9]. They reinforce a practical caution: our criteria should not impose one preferred communication style or make assumptions about clients based on cultural membership. The slides are not themselves a CMO measure or clinical annotation guideline.

### Using an LLM for text classification

Anthropic's prompting documentation recommends clear instructions, separated reference material, and a defined output format [R5]. Structured outputs can help enforce a response format, but cannot establish that the reasoning or classification is correct [R6]. Studies of LLM-based text classification also suggest that the substance of the coding instructions and the choice of examples matter; performance cannot be inferred from prompt length or wording alone [R7, R8].

For our project, this supports writing a clear annotation guideline, testing a simple prompt before adding examples, and evaluating each version on cases not included in the instructions. We should not assume that more examples will always improve results.

## 2. Proposed CMO criteria

The proposed unit of analysis is a **client cue**, the relevant **counselor response**, and enough surrounding conversation to interpret that response. Looking only at the counselor's sentence may miss a later follow-up or an agreed reason to change topics.

A strongly supported potential CMO would require all of the following:

1. **Client cue:** The client raises a cultural or identity-related experience as meaningful, distressing, or relevant to the conversation. Do not infer an identity from a name, accent, or other indirect signal.
2. **Opportunity for response:** The cue creates a plausible opening for acknowledgment or further discussion.
3. **Apparent omission:** The counselor does not meaningfully acknowledge, explore, or intentionally defer the issue within the available context.
4. **Transcript evidence:** The assessment can point to specific client and counselor turns and explain why the response may be a missed opportunity.

Evidence against flagging includes a relevant open-ended response, appropriate follow-up later in the conversation, the client's choice not to discuss the topic, a previously agreed agenda, or an urgent concern requiring redirection. If the necessary response or context is missing, the result should indicate insufficient evidence rather than assume a missed opportunity.

**Scope still needs clarification.** The partner has also mentioned personal characteristics such as physical or personality traits. We need to ask whether these fall under the intended CMO category, require a separate category, or are part of a broader definition of missed opportunities. The current criteria focus on cultural and identity-related cues until that decision is made.

## 3. Instructions and example files

The accompanying files are:

- `classification/cmo-system-prompt-v0.1.md` — proposed classification task, criteria, decision rules, and response requirements.
- `classification/examples.json` — 12 synthetic conversations with provisional expected labels, including clear, negative, ambiguous, and insufficient-context cases.
- `docs/cmo-annotation-guideline.md` — a fuller explanation of the criteria and cases that need counselor review.

The examples have not been independently validated and should not be treated as a gold-standard evaluation set. After review, a subset may be used as examples in the model request. Other independently labeled cases must be reserved for evaluation.

The draft distinguishes **what kind of issue is being considered** from **how strong the evidence is**. The category can remain `cultural-missed-opportunity`, while an evidence status indicates `supported_potential_cmo`, `possible_cmo`, `insufficient_evidence`, or `no_cmo`. These are proposed statuses, not finalized interface decisions.

The model request should contain the relevant task instructions, approved examples if used, and numbered speaker turns. Transcript content should be treated as data to analyze, not instructions to obey. Results should reference the evidence and allow an empty findings list when no concern is supported.

## 4. Integration with the existing code

The merged TypeScript interface in `src/llm/adapter.ts` currently accepts `DetectionRequest { turns, categories }` and returns `RawFlag` entries with a turn index, character offsets, category, confidence, and rationale. This is enough to test an adapter, but does not yet explicitly include the classification-instruction version, the initiating client cue, or a separate evidence status.

Before integrating the instruction files, we should agree on a few changes:

1. Load the prompt and examples from version-controlled files instead of embedding the CMO definition throughout the application.
2. Preserve the existing turn indices when sending transcript text to the model.
3. Decide whether a result should identify both the client cue and the responding counselor turn. This would better represent a missed *response* than a single highlighted sentence.
4. Separate classification category from evidence status, and define how `no_cmo` or insufficient-evidence results are represented.
5. Validate the model's output against the source transcript, including turn indices, categories, and quoted evidence. JSON validity alone is not sufficient.

The backend choice also needs to be settled: Harry's current TypeScript work includes Express dependencies, while `docs/design.md` proposes FastAPI. We should not create overlapping backend implementations without agreeing on their responsibilities.

Only synthetic or explicitly authorized transcripts should be sent to model services. The project is subject to confidentiality restrictions, and removing names alone does not establish that external API processing is permitted. Credentials and transcript content should not be committed to the repository or exposed in application logs.

## 5. Evaluation plan

**First, review the annotation guideline.** Two reviewers, ideally including counseling advisors, should label the same initial set of varied examples independently and explain disagreements. The goal is to discover unclear criteria before treating the labels as ground truth. The team can record agreement rates and decide whether a more formal agreement measure is useful once the sample is defined.

**Next, compare instruction variants.** Using the same model settings and development cases, test (A) the definition alone, (B) the definition with a balanced set of positive and negative examples, and (C) the same material with additional rules for ambiguity and delayed follow-up. Record the prompt version, model, outputs, classification errors, response validity, latency, and costs where available.

**Finally, evaluate on held-out cases.** These cases should not appear in the prompt or be used to select its wording. Report precision and recall, with the number of positive and negative cases used to calculate them. The team must agree in advance whether `possible_cmo` counts as a positive flag and how insufficient-evidence results are scored. Review errors involving appropriate acknowledgment, neutral identity mentions, delayed follow-up, and missing context.

We have not established acceptable numerical thresholds for precision, recall, annotation agreement, or dataset size. Those are decisions for the team and advisors before formal evaluation. Twelve synthetic examples are useful for developing instructions but cannot establish that the classifier is reliable for counseling use.

If the model performs poorly, the first step should be to inspect the errors and the annotation criteria. Fine-tuning is not a substitute for a definition that reviewers themselves cannot apply consistently.

## 6. Documents and review responsibilities

| File | Purpose | Review needed |
| --- | --- | --- |
| `docs/cmo-annotation-guideline.md` | Defines potential CMOs and exclusions | Counselors confirm the intended scope and criteria |
| `classification/cmo-system-prompt-v0.1.md` | Gives the model the classification task and output instructions | Engineering review for integration; counselor review of decision rules |
| `classification/examples.json` | Provides synthetic cases and provisional labels | Check labels, ambiguity, and JSON structure |
| `docs/cmo-research-and-implementation.md` | Records the research basis, interface questions, and test plan | Team review of sources and planned decisions |

The classification guidelines and integration code can be developed in parallel, but the request and response structure must be agreed upon together. Tests of the existing fake adapter confirm software behavior, not the accuracy of the CMO classifications.

## 7. Questions for the next review

**For counseling advisors:**

1. Are we detecting cultural missed opportunities specifically, or a broader class that includes other personal characteristics?
2. When is simple acknowledgment sufficient, and when should a counselor explicitly invite further discussion?
3. How should we interpret a concern that is addressed several turns later?
4. Should ambiguous cases be shown separately from more strongly supported potential misses?
5. Can advisors independently label an initial set of synthetic cases and help determine what evaluation standard is appropriate?

**For the development team:**

6. Are we implementing the first backend in TypeScript/Express or Python/FastAPI?
7. Should each finding reference both the client's cue and the counselor's response?
8. How will the instruction files be loaded and versioned, and who will maintain the output schema?
9. What transcript data is authorized for API-based testing?

## References

[R1] Owen, J., et al. (2016). *Client perceptions of therapists' multicultural orientation: Cultural (missed) opportunities and cultural humility.* *Professional Psychology: Research and Practice, 47*(1), 30–37. https://doi.org/10.1037/pro0000046

[R2] Davis, D. E., et al. (2018). *The multicultural orientation framework: A narrative review.* https://pubmed.ncbi.nlm.nih.gov/29565626/

[R3] Hook, J. N., et al. (2013). *Cultural humility: Measuring openness to culturally diverse clients.* https://pubmed.ncbi.nlm.nih.gov/23647387/

[R4] Anders, C., et al. (2020). *Attending to the intersectionality and saliency of clients' identities: A further investigation of therapists' multicultural orientation.* https://pubmed.ncbi.nlm.nih.gov/33090873/

[R5] Anthropic. *Prompting best practices.* https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices

[R6] Anthropic. *Structured outputs.* https://platform.claude.com/docs/en/build-with-claude/structured-outputs

[R7] *Much Ado about Prompting: LLM classification of text messages from experiments* (2026). https://pmc.ncbi.nlm.nih.gov/articles/PMC13436748/

[R8] *When Does Few-Shot Prompting Help? A Systematic Empirical Study of Shot-Count Effects Across Model Scale, Architecture, and Output Parsing Robustness* (2026). https://arxiv.org/abs/2607.22969

[R9] *Theories: South African, Chinese, Mexican, Filipino Approaches.* Course slides supplied for the project (2026). Background material, not a validated CMO instrument.
