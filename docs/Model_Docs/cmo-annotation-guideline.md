# Bias Lens — Cultural Missed Opportunity annotation guideline

**Status:** DRAFT v0.1 — synthetic examples only; not approved by counselor advisors.  
**Scope:** text-only, post-session review. This guideline does **not** diagnose bias or evaluate clinician competence.

## 1. Construct and boundary

**Provisional operational definition:** A *potential cultural missed opportunity* (CMO) is a reviewable exchange in which (a) the client introduces or clearly connects a personal, cultural, identity-related, physical, or personality characteristic or related social experience to a concern; (b) there is a plausible conversational opportunity to acknowledge or invite exploration of its significance for this particular client; and (c) the therapist's response or subsequent relevant turns do not meaningfully acknowledge or explore it.

**Important scope question for advisors:** The partner has suggested including general physical/personality characteristics as well as identity. This is broader than a strictly cultural construct. Determine whether to treat those as CMO, a separate 'personal characteristic missed opportunity' category, or out of scope. Until resolved, examples involving physical/personality traits are marked `scope_review_required` and must not be treated as accepted gold labels.

The unit of annotation is a **client cue plus the therapist response, with surrounding turns as needed**. The flagged span should normally be the *therapist response* that warrants review; a separate reference to the client cue is required. A missed opportunity is not established by a client cue alone.

## 2. Decision procedure

1. **Find a specific client cue.** Quote the exact client wording; do not infer identity, cultural norms, or a clinical need solely from a demographic descriptor.
2. **Test relevance.** Explain why the cue plausibly matters to the client's expressed concerns, rather than assuming every identity mention requires exploration.
3. **Inspect response in context.** Look at the therapist's next turn and, when available, subsequent nearby turns: reflective acknowledgment, open invitations, client refusal, agreed agenda, crisis prioritization, or deferred follow-up may change the assessment.
4. **Choose a finding status.** Use `supported_potential_cmo` when the cue and missed follow-up are clearly evidenced; `possible_cmo` when plausible but contestable; `insufficient_evidence` when the record cannot support a judgment; or `no_cmo` when no reviewable missed opportunity is evident.
5. **Record evidence and alternative interpretation.** Cite turn numbers and exact text; identify the reason the therapist's response was or was not sufficient. Do not infer motives or intentions.
6. **Escalate ambiguity.** When annotators disagree, retain both judgments and seek adjudication rather than silently assigning a gold label.

## 3. Inclusion indicators (not automatic triggers)

- A client explicitly relates exclusion, stigma, discrimination, migration, language, family roles, faith, cultural practices, identity, appearance, disability, or other personal characteristics to distress or a therapeutic goal.
- A response changes topics without acknowledgment *and* the surrounding conversation fails to revisit the expressed concern.
- A therapist offers a generic response while bypassing an explicit request to discuss the cue.

## 4. Exclusions and difficult cases

- A neutral identity reference with no evident relevance is **not**, by itself, a CMO.
- A therapist need not repeat identity terminology to respond meaningfully: reflective listening or open-ended invitation can suffice.
- A client declining to explore an issue, or a previously agreed plan to revisit it, weighs against a CMO.
- An urgent safety concern or agreed priority can justify temporary redirection; do not infer inappropriate behavior without context.
- Silence or missing transcript context should often be `insufficient_evidence`, not a positive finding.
- A general missed emotional cue may be important, but should not be mislabeled CMO merely because it is clinically significant.
- Do not presume that individual autonomy, direct self-disclosure, assertiveness, deference, or family reliance has the same meaning across cultures.

## 5. Cultural-sensitivity notes drawn from the provided course reading

The user-supplied *Theories: South African, Chinese, Mexican, Filipino Approaches* slides contrast **emic** (context-specific) and **etic** (cross-cultural comparative) approaches. They discuss the SAPI and CPAI as examples of constructs shaped by cultural contexts, and Filipino concepts including *kapwa* and *pakikiramdam*. These are **background cautions for annotation design**; the slides neither define CMO nor establish clinical assessment validity.

Practical implications to examine with advisors:
- Base classifications on the client's explicit meaning and the actual exchange; avoid equating non-Western communication preferences with dysfunction.
- Preserve cases where a counselor respectfully asks whether a topic matters rather than imposing a cultural interpretation.
- Develop counterexamples that test stereotypes (e.g., assuming someone must want to discuss family hierarchy or race).

## 6. Provisional status mapping

| Status | Evidence requirement | Human review |
|---|---|---|
| `supported_potential_cmo` | Explicit cue and missed follow-up with sufficient neighboring context | Always |
| `possible_cmo` | Reasonable concern but substantial alternative explanation | Always |
| `insufficient_evidence` | Cannot evaluate response or follow-up reliably | Seek more context |
| `no_cmo` | No qualifying concern on available record | Generally no flag |

**Important integration gap:** Harry's current TypeScript `RawFlag` contains `turnIndex`, `start`, `end`, `category`, `confidence`, `rationale`. It does not contain these statuses or the client-cue reference. Before implementation, agree on an extension or a higher-level result object. Do not overload `category` with evidence status.

## 7. Annotation workflow and evaluation

- Version the guideline and its category identifier (`cultural-missed-opportunity`).
- Have at least two appropriately qualified humans independently label a subset; measure and report agreement, including unresolved cases and category prevalence. Agree on acceptable reliability with advisors.
- Separate few-shot prompt examples from held-out evaluation cases. Label synthetic examples as **provisional**, not validated data.
- Score precision/recall on an explicitly documented *binary mapping* (e.g. `supported_potential_cmo` positive, `no_cmo` negative) and separately report possible/insufficient cases; agree on thresholds before final metrics.
- Record exact prompt version, model version, input case IDs, predicted status and discrepancies for each experiment.
- Never commit real or identifiable counseling transcripts or send them to unapproved external services.

## 8. Questions for the advisors

1. Does CMO extend to physical and personality characteristics, or should these form a separate category?
2. What minimum response qualifies as appropriate acknowledgment or exploration?
3. How far ahead in a transcript should delayed follow-up count?
4. How should competing clinical priorities, client refusal and intentional deferral affect labels?
5. Should `possible_cmo` be counted as a positive alert, a separate triage category, or excluded from binary evaluation?
6. What reviewer-agreement threshold and minimum evaluation sample size are acceptable?

## Sources and status

- **Provided background:** *Theories: South African, Chinese, Mexican, Filipino Approaches* (user-provided teaching slides; cultural sensitivity background, not a CMO instrument).
- **Partner-referenced measure (verify full instrument before adopting):** APA PsycTests, *Cultural Missed Opportunities Measure*, DOI: 10.1037/t48958-000.
- **Prompt and evaluation methodology:** https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices ; https://developers.openai.com/api/docs/guides/evaluation-best-practices

**No claim is made that these draft criteria reproduce the APA measure.**
