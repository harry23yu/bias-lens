// Anthropic implementation of LlmAdapter. This is the only application file that
// names the vendor. The API key and model name come from the environment, never from code.
//
// Confidentiality: calling this adapter sends transcript text to a third-party hosted
// model. Use only synthetic transcripts until the partner approves that in writing
// (see AGENTS.md and docs/risks.md R-3, R-8).

import Anthropic from "@anthropic-ai/sdk";
import type { DetectionRequest, LlmAdapter, RawFlag } from "./adapter";

/** The slice of the SDK client this adapter uses. Tests pass a mock with the same shape. */
export interface MessagesClient {
  messages: {
    create(params: {
      model: string;
      max_tokens: number;
      messages: { role: "user"; content: string }[];
    }): Promise<{ content: { type: string; text?: string }[] }>;
  };
}

export const DEFAULT_MODEL = "claude-sonnet-5-5";

/** Builds the instruction prompt: categories, numbered turns, and the required output format. */
export function buildPrompt(request: DetectionRequest): string {
  const categories = request.categories
    .map((c) => `- ${c.id}: ${c.description}`)
    .join("\n");
  const turns = request.turns
    .map((t) => `[${t.index}] ${t.speaker}: ${t.text}`)
    .join("\n");

  return [
    "You are labeling language patterns in a counseling transcript.",
    "Find spans of text that match one of the categories below. Describe language only; do not judge the clinician as a person.",
    "",
    "Categories:",
    categories,
    "",
    "Transcript turns (index and text):",
    turns,
    "",
    "Reply with only a JSON array. Each element must be an object with these keys:",
    '{"turnIndex": number, "start": number, "end": number, "category": string, "confidence": number, "rationale": string}',
    "- start and end are character offsets within that turn's text (end exclusive).",
    "- category must be one of the category ids above.",
    "- confidence is a number from 0 to 1.",
    "- rationale is one or two sentences.",
    "If nothing matches, reply with [].",
  ].join("\n");
}

/**
 * Pulls the JSON array out of the model's reply. The reply should be bare JSON, but
 * models sometimes wrap it in a code fence, so this accepts that too. The array is not
 * checked here; validateFlags does that.
 */
export function parseRawFlags(reply: string): RawFlag[] {
  const fenced = reply.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = (fenced ? fenced[1] : reply).trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    throw new Error("Model reply is not valid JSON");
  }
  if (!Array.isArray(parsed)) throw new Error("Model reply is not a JSON array");
  return parsed as RawFlag[];
}

export class AnthropicAdapter implements LlmAdapter {
  readonly detector = "llm";

  constructor(
    private readonly client: MessagesClient,
    private readonly model: string = DEFAULT_MODEL,
  ) {}

  async detect(request: DetectionRequest): Promise<RawFlag[]> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      messages: [{ role: "user", content: buildPrompt(request) }],
    });
    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text ?? "")
      .join("");
    return parseRawFlags(text);
  }
}

/**
 * Builds an adapter from the environment. Reads ANTHROPIC_API_KEY (required) and
 * ANTHROPIC_MODEL (optional). Throws if the key is missing, so a run never starts
 * half-configured.
 */
export function createAnthropicAdapter(env: NodeJS.ProcessEnv = process.env): AnthropicAdapter {
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  const client = new Anthropic({ apiKey });
  return new AnthropicAdapter(client as unknown as MessagesClient, env.ANTHROPIC_MODEL || DEFAULT_MODEL);
}
