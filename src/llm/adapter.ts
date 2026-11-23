// Provider-agnostic LLM interface (FR-4).
// Application code depends only on these types. A vendor or model name appears
// only in configuration and in the adapter implementation, never here.

import type { Turn } from "../turns";

export interface CategoryDefinition {
  /** Stable identifier stored with each flag, e.g. "interruption". The category list is still open (see docs/requirements.md). */
  id: string;
  /** Operational definition given to the model. */
  description: string;
}

export interface DetectionRequest {
  turns: Turn[];
  categories: CategoryDefinition[];
}

/**
 * Output of an adapter before validation. Nothing here is trusted yet:
 * the flag validator checks every field against the transcript and the category list.
 */
export interface RawFlag {
  turnIndex: number;
  /** Character offsets within the turn's text, end exclusive. */
  start: number;
  end: number;
  category: string;
  /** Expected to be in [0, 1]. */
  confidence: number;
  rationale: string;
}

export interface LlmAdapter {
  /** Label recorded with each flag, for example "llm". Never a vendor or model name. */
  readonly detector: string;
  detect(request: DetectionRequest): Promise<RawFlag[]>;
}
