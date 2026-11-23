// Live check against the real Anthropic API. Skipped unless RUN_LIVE_LLM=1 is set,
// so `npm test` never makes a network call or spends credits.
//
// Run with the key exported in your terminal (never in a file):
//   export ANTHROPIC_API_KEY=...
//   RUN_LIVE_LLM=1 npx vitest run src/llm/anthropic-adapter.live.test.ts
//
// Use only made-up transcripts here. Sending partner or real transcripts to the API
// needs the partner's written approval (AGENTS.md).

import { describe, it, expect } from "vitest";
import { createAnthropicAdapter } from "./anthropic-adapter";
import { splitTurns } from "../turns";
import { validateFlags } from "../flags/validate";

const transcript = [
  "Therapist: How was your week?",
  "Client: It was fine, I guess.",
  "Therapist: Let's talk about your job, not your accent.",
].join("\n");

const categories = [
  {
    id: "cultural-bias",
    description: "Comments on a client's background, identity, or accent instead of the presenting concern.",
  },
];

describe.skipIf(process.env.RUN_LIVE_LLM !== "1")("live Anthropic adapter", () => {
  it("returns flags that pass validation on a made-up transcript", async () => {
    const turns = splitTurns(transcript);
    const adapter = createAnthropicAdapter(process.env);

    const raw = await adapter.detect({ turns, categories });
    const flags = validateFlags(raw, turns, categories, adapter.detector);

    console.log("Validated flags:", JSON.stringify(flags, null, 2));
    expect(Array.isArray(flags)).toBe(true);
  }, 60_000);
});
