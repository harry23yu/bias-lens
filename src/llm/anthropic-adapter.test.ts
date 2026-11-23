import { describe, it, expect } from "vitest";
import {
  AnthropicAdapter,
  buildPrompt,
  createAnthropicAdapter,
  DEFAULT_MODEL,
  parseRawFlags,
  type MessagesClient,
} from "./anthropic-adapter";
import { splitTurns } from "../turns";

const turns = splitTurns(
  ["Therapist: How was your week?", "Client: It was fine, I guess."].join("\n"),
);
const categories = [{ id: "cultural-bias", description: "Comments on a client's background." }];

/** Mock client: records each call and replies with the given text. No network. */
function mockClient(reply: string) {
  const calls: { model: string; max_tokens: number; messages: { role: "user"; content: string }[] }[] = [];
  const client: MessagesClient = {
    messages: {
      async create(params) {
        calls.push(params);
        return { content: [{ type: "text", text: reply }] };
      },
    },
  };
  return { client, calls };
}

describe("buildPrompt", () => {
  it("lists category ids and numbered turns", () => {
    const prompt = buildPrompt({ turns, categories });
    expect(prompt).toContain("- cultural-bias: Comments on a client's background.");
    expect(prompt).toContain("[0] Therapist: How was your week?");
    expect(prompt).toContain("[1] Client: It was fine, I guess.");
  });
});

describe("parseRawFlags", () => {
  it("parses a bare JSON array", () => {
    const flags = parseRawFlags('[{"turnIndex":0,"start":0,"end":3,"category":"x","confidence":0.5,"rationale":"r"}]');
    expect(flags).toHaveLength(1);
    expect(flags[0].turnIndex).toBe(0);
  });

  it("parses a JSON array wrapped in a code fence", () => {
    const flags = parseRawFlags("```json\n[]\n```");
    expect(flags).toEqual([]);
  });

  it("rejects a reply that is not JSON", () => {
    expect(() => parseRawFlags("Sorry, I cannot help with that.")).toThrow("not valid JSON");
  });

  it("rejects JSON that is not an array", () => {
    expect(() => parseRawFlags('{"flags": []}')).toThrow("not a JSON array");
  });
});

describe("AnthropicAdapter.detect", () => {
  it("sends one user message with the prompt and returns the parsed flags", async () => {
    const reply = '[{"turnIndex":1,"start":0,"end":6,"category":"cultural-bias","confidence":0.7,"rationale":"made-up"}]';
    const { client, calls } = mockClient(reply);
    const adapter = new AnthropicAdapter(client, "test-model");

    const flags = await adapter.detect({ turns, categories });

    expect(adapter.detector).toBe("llm");
    expect(flags).toHaveLength(1);
    expect(flags[0].category).toBe("cultural-bias");
    expect(calls).toHaveLength(1);
    expect(calls[0].model).toBe("test-model");
    expect(calls[0].messages[0].role).toBe("user");
    expect(calls[0].messages[0].content).toContain("[1] Client: It was fine, I guess.");
  });

  it("uses the default model when none is given", async () => {
    const { client, calls } = mockClient("[]");
    await new AnthropicAdapter(client).detect({ turns, categories });
    expect(calls[0].model).toBe(DEFAULT_MODEL);
  });
});

describe("createAnthropicAdapter", () => {
  it("throws when ANTHROPIC_API_KEY is not set", () => {
    expect(() => createAnthropicAdapter({})).toThrow("ANTHROPIC_API_KEY is not set");
  });

  it("builds an adapter when the key is set, without calling the network", () => {
    const adapter = createAnthropicAdapter({ ANTHROPIC_API_KEY: "test-key-not-real" });
    expect(adapter.detector).toBe("llm");
  });
});
