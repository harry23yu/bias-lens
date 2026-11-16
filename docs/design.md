
# Design

**Status:** Initial prototype planning

This document describes the current intended architecture for Bias Lens. Components are considered planned until implemented and verified in the repository. The document will be updated as technical decisions are finalized and development progresses.

## Context

Bias Lens is intended to help counselors and clinical supervisors identify potential bias in counseling transcripts.

The initial focus is **missed opportunity bias**, where a therapist may have overlooked an opportunity to explore, acknowledge, or respond to something relevant in the client's statements.

The system is intended to support professional reflection rather than make definitive judgments about a therapist's behavior or intentions.

The initial prototype will accept speaker-labeled transcript text, analyze it using an existing language model, and display possible missed opportunities with supporting evidence and explanations.

The goal is to identify statements or exchanges worth reviewing, not to establish that a counselor has necessarily acted incorrectly.

## System Architecture (Planned)

The application will have three main components:

1. **Frontend:** React, Vite, and TypeScript for entering transcripts and displaying results.
2. **Backend:** Likely FastAPI (Python) for processing requests, managing classification instructions, and communicating with language models.
3. **LLM integration:** A common interface supporting Anthropic's API and a locally hosted model through LM Studio.

### Proposed Workflow

    User (Browser)
          |
          v
    React + Vite + TypeScript
          |
          v
    FastAPI Backend (Proposed)
          |
          v
    Classification Instructions
    + Approved Definitions
    + Examples and Research References
          |
          v
    Model Interface
          |
          +---------------------------+
          |                           |
          v                           v
    Anthropic Claude API         Local LLM
    (Likely hosted option)       (LM Studio)
          |                           |
          +-------------+-------------+
                        |
                        v
             Classification Results
                        |
                        v
                 React Frontend

The backend will provide the model with the relevant transcript context and the approved materials used to define missed opportunity bias.

Both model approaches should follow comparable classification instructions and return results in a consistent format.

## Components

| Component | Responsibility | Status |
|---|---|---|
| React frontend | Accept transcript text and display analysis | Planned |
| FastAPI backend | Process requests and communicate with models | Proposed |
| Bias definitions and reference materials | Provide criteria, examples, and research supporting classification | Initial category identified; materials to be integrated |
| Classification instructions | Guide models in evaluating potential missed opportunities | Planned |
| LLM interface | Support local and hosted models | Planned |
| Anthropic API | Provide access to a hosted Claude model | Likely hosted option |
| LM Studio | Run an available open-weight model locally | Planned comparison |
| Results display | Show possible missed opportunities and supporting reasoning | Planned |
| Evaluation | Compare classifications against advisor-reviewed examples | Planned |

## Transcript Input

The initial application will accept pasted counseling transcripts containing speaker labels.

Example:

    Client: I have been feeling disconnected from
    my family recently.

    Therapist: Has your work schedule been stressful?

    Client: Yes, but I think there is more to it.

The model will use the surrounding conversation to evaluate whether the therapist may have missed an opportunity to explore something relevant.

The system should not evaluate therapist statements solely in isolation when the surrounding dialogue is necessary for interpreting them.

The initial version will not require file uploads or additional transcript formats.

## Bias Classification

### Initial Category: Missed Opportunity Bias

The initial version of Bias Lens will focus on missed opportunity bias.

The team intends to provide a definition, examples, applicable criteria, and relevant research materials to guide classification.

These materials will be developed or reviewed with the project advisors.

The model should use this supplied context to determine whether a particular therapist response may represent a missed opportunity.

The exact operational definition and classification criteria will be maintained separately from the application logic.

### Reference Materials

The team plans to provide both models with a common set of reference materials, potentially including:

- An approved definition of missed opportunity bias.
- Specific criteria used to identify potential missed opportunities.
- Examples of statements or exchanges that meet the criteria.
- Examples that do not meet the criteria.
- Ambiguous examples requiring contextual interpretation.
- Relevant research findings supporting the classification framework.

Research references should include enough information to identify the source, and the team should keep track of updates to the reference materials.

The initial approach will be to supply relevant reference content directly in the classification instructions or request context.

More advanced retrieval methods may be considered later if the reference collection becomes too large to include directly.

The models should base their classifications on the supplied criteria and references rather than introducing unsupported definitions.

### Classification Behavior

The application should distinguish between identifying a possible missed opportunity and making a confident determination that one occurred.

The models will be instructed to:

- Evaluate therapist responses using the supplied definition and criteria.
- Consider relevant client statements and surrounding conversation.
- Identify possible missed opportunities with supporting transcript evidence.
- Explain which provided criteria are relevant to the classification.
- Reference the supplied examples or research where applicable.
- Avoid assuming therapist intentions or beliefs.
- Avoid definitive conclusions when the available context is insufficient.
- Acknowledge ambiguity and alternative interpretations.
- Avoid inventing supporting evidence or research references.

The system may flag an ambiguous exchange as a **possible missed opportunity** when there is a reasonable basis for review.

However, these cases should be presented with appropriate uncertainty rather than being described as confirmed bias.

When there is no reasonable supporting evidence, the system should not generate a positive classification simply to produce a result.

### Proposed Classification Outcomes

The initial classification system may distinguish among:

1. **Supported potential missed opportunity:** The transcript provides substantial evidence that the exchange meets the supplied criteria.
2. **Possible missed opportunity:** The exchange raises a plausible concern, but the evidence is ambiguous or incomplete.
3. **Insufficient evidence:** The available transcript context does not support a meaningful determination.
4. **No identified missed opportunity:** The exchange does not appear to meet the supplied criteria.

These categories are proposed output states and do not replace the advisor-approved definition of bias.

The exact output labels and thresholds will be finalized during implementation and evaluation.

## Model Integration

The initial implementation will use existing pretrained models rather than fine-tuning a model.

### Hosted Model: Anthropic API

The team will likely use Anthropic's Claude API for the hosted model implementation.

The FastAPI backend will submit transcript text, classification instructions, and the relevant reference materials to the selected Claude model.

The model will return an analysis of potential missed opportunities.

The specific Claude model and API configuration have not yet been selected.

### Local Model: LM Studio

The team also plans to test a freely available open-weight model running through LM Studio.

LM Studio will expose the locally running model through an API that the FastAPI backend can call.

This provides a way to compare local inference against the hosted Claude model using similar input data and classification instructions.

The specific local model will be chosen based on compatibility, available hardware, and preliminary performance.

There is no requirement to fine-tune the local model for the initial prototype.

### Common Model Interface

The backend should use a common classification interface for both model approaches.

This will allow the team to switch between models without changing the frontend.

The team will aim to provide both models with:

- The same transcript text.
- The same operational definitions.
- The same examples and research references.
- Equivalent classification instructions.
- The same expected output structure.

Some implementation details may vary according to the capabilities of each model provider.

## Classification Output

The initial results should provide enough information for a counselor or supervisor to understand why an exchange was flagged.

The proposed response will include:

- Relevant transcript excerpt or exchange.
- Classification outcome.
- Explanation of the possible missed opportunity.
- Supporting evidence from the transcript.
- Relevant criteria from the supplied definitions.
- References to supporting materials when applicable.
- Explanation of uncertainty or alternative interpretations.

The team plans to use structured JSON responses to simplify communication between the backend and frontend.

The exact JSON schema will be finalized during development.

Any research references returned by the model should be checked against the supplied reference collection before being displayed.

## Evaluation

The team plans to evaluate how effectively local and hosted language models identify potential missed opportunities.

Both models should receive comparable instructions, transcript examples, and reference materials.

Evaluation examples should be reviewed or labeled according to the established criteria, preferably with input from the project advisors.

The evaluation will consider:

- Precision and recall for identifying potential missed opportunities.
- False-positive and false-negative classifications.
- Performance on ambiguous examples.
- Whether explanations reference relevant transcript evidence.
- Whether classifications follow the supplied criteria.
- How appropriately the models communicate uncertainty.
- Consistency across repeated evaluations.

Because the tool is intended to encourage professional review, the team may prioritize identifying plausible missed opportunities while distinguishing less certain cases from strongly supported ones.

The team will need to evaluate whether this approach produces an acceptable number of false positives.

The final comparison method and dataset size have not yet been established.

## Data Storage and Authentication

The first prototype will not require authentication or persistent database storage.

Transcript text will be submitted for analysis and the results displayed in the application.

Persistent transcript records, reviewer feedback, and stored evaluation results may be added in later iterations.

The team will need to confirm privacy requirements before processing real counseling transcripts through external APIs.

## Deployment

The production deployment environment has not yet been selected.

For local development, the frontend and FastAPI backend may run on a development computer.

The application may communicate with either:

- A locally running model through LM Studio.
- Anthropic's hosted API through an authenticated request.

The project partner has demonstrated a prototype developed through Replit, but its implementation has not yet been reviewed by the team.

The team will coordinate with the partner before selecting a deployment environment.

## Decisions Deferred

- Final confirmation of FastAPI as the backend framework.
- Selection of the specific Claude model.
- Selection of the local model for LM Studio.
- Final classification instructions and reference collection.
- Exact classification output schema.
- Evaluation dataset and testing procedure.
- Production hosting environment.
- Persistent storage and authentication for later versions.
- Whether fine-tuning or additional detection methods will be necessary.

## Open Technical Questions

1. Which Claude model should be used for the initial hosted implementation?
2. Which available local model will perform adequately on the team's hardware?
3. How should the approved definitions, examples, and research be organized and supplied to each model?
4. How should the model distinguish ambiguous potential missed opportunities from strongly supported ones?
5. How should the application verify that model explanations accurately reference the supplied materials?
6. How much transcript context is necessary for reliable classification?
7. How should the team evaluate false positives and false negatives?
8. What privacy requirements must be addressed before using external model APIs?
9. Where will the application eventually be deployed?

## Initial Implementation Priorities

The first implementation will focus on establishing a functional transcript analysis workflow.

1. Set up the React frontend and FastAPI backend.
2. Create a text input for speaker-labeled transcripts.
3. Organize the approved missed opportunity bias definitions and reference materials.
4. Implement a backend endpoint that submits transcript text for analysis.
5. Connect the backend to the Anthropic API.
6. Connect the backend to a local model through LM Studio.
7. Define a common structured classification response.
8. Display classifications, evidence, explanations, and uncertainty in the frontend.
9. Test the system with sample transcript exchanges.
10. Compare the local and hosted model outputs against the established criteria.

This initial implementation will establish the main transcript analysis workflow before adding features such as persistent storage, reviewer feedback, or model fine-tuning.
