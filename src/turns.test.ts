import { describe, it, expect } from "vitest";
import { splitTurns } from "./turns";

describe("splitTurns", () => {
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
