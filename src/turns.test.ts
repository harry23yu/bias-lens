import { describe, it, expect } from "vitest";
import { splitTurns } from "./turns";

describe("splitTurns", () => {
  it("returns no turns for an empty transcript", () => {
    expect(splitTurns("")).toEqual([]);
  });

  it("rejects a line whose speaker is empty", () => {
    expect(() => splitTurns(": orphan text")).toThrow("line 1");
  });

  it("reports the line number of a malformed line", () => {
    expect(() => splitTurns("Therapist: Hi.\nno speaker here")).toThrow("line 2");
  });

  it("splits speaker-prefixed lines into turns", () => {
    expect(splitTurns("Therapist: Hello.\nClient: Hi.")).toEqual([
      { index: 0, speaker: "Therapist", text: "Hello." },
      { index: 1, speaker: "Client", text: "Hi." },
    ]);
  });
  it("rejects malformed lines", () => {
    expect(() => splitTurns("no speaker here")).toThrow();
  });
});
