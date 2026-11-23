import { describe, it, expect } from "vitest";
import { validateFlags, FlagValidationError } from "./validate";
import { splitTurns } from "../turns";

// Made-up transcript. Turn 2 text is "Let's talk about your job, not your accent."
// Characters 27 to 42 are "not your accent".
const turns = splitTurns(
  [
    "Therapist: How was your week?",
    "Client: It was fine, I guess.",
    "Therapist: Let's talk about your job, not your accent.",
  ].join("\n"),
);
const categories = [{ id: "cultural-bias", description: "Comments on a client's background." }];

const good = {
  turnIndex: 2,
  start: 27,
  end: 42,
  category: "cultural-bias",
  confidence: 0.9,
  rationale: "Therapist mentions the client's accent (made-up example).",
};

function problemsFor(raw: unknown): string[] {
  try {
    validateFlags(raw, turns, categories, "llm");
  } catch (e) {
    if (e instanceof FlagValidationError) return e.problems;
    throw e;
  }
  throw new Error("expected validation to fail");
}

describe("validateFlags", () => {
  it("accepts a valid flag and copies its text from the transcript", () => {
    const [flag] = validateFlags([good], turns, categories, "llm");
    expect(flag).toEqual({
      turnIndex: 2,
      start: 27,
      end: 42,
      text: "not your accent",
      category: "cultural-bias",
      confidence: 0.9,
      rationale: "Therapist mentions the client's accent (made-up example).",
      detector: "llm",
    });
  });

  it("accepts an empty list of flags", () => {
    expect(validateFlags([], turns, categories, "llm")).toEqual([]);
  });

  it("rejects input that is not an array", () => {
    expect(problemsFor({ flags: [] })).toEqual(["flags must be an array"]);
  });

  it("rejects an item that is not an object", () => {
    expect(problemsFor(["not a flag"])).toEqual(["flag 0: not an object"]);
  });

  it("rejects a turnIndex that is not in the transcript", () => {
    expect(problemsFor([{ ...good, turnIndex: 9 }])[0]).toContain("turnIndex 9 is not a turn");
  });

  it("rejects a span that runs past the end of the turn", () => {
    expect(problemsFor([{ ...good, end: 999 }])[0]).toContain("outside turn 2");
  });

  it("rejects an empty span", () => {
    expect(problemsFor([{ ...good, start: 10, end: 10 }])[0]).toContain("or empty");
  });

  it("rejects non-integer offsets", () => {
    expect(problemsFor([{ ...good, start: 1.5 }])[0]).toContain("must be integers");
  });

  it("rejects a category that is not in the list", () => {
    expect(problemsFor([{ ...good, category: "made-up" }])[0]).toContain("not in the category list");
  });

  it("rejects confidence outside 0 to 1", () => {
    expect(problemsFor([{ ...good, confidence: 1.2 }])[0]).toContain("confidence must be");
    expect(problemsFor([{ ...good, confidence: Number.NaN }])[0]).toContain("confidence must be");
  });

  it("rejects an empty rationale", () => {
    expect(problemsFor([{ ...good, rationale: "   " }])[0]).toContain("rationale is empty");
  });

  it("reports every problem, not just the first", () => {
    const problems = problemsFor([good, { ...good, category: "made-up", confidence: 2 }]);
    expect(problems).toHaveLength(2);
    expect(problems[0]).toContain("flag 1");
    expect(problems[1]).toContain("flag 1");
  });
});
