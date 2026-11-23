import { describe, it, expect } from "vitest";
import { FakeAdapter } from "./fake-adapter";
import type { RawFlag } from "./adapter";
import { splitTurns } from "../turns";

describe("FakeAdapter", () => {
  it("returns its configured flags and records the request it received", async () => {
    const flag: RawFlag = {
      turnIndex: 1,
      start: 0,
      end: 5,
      category: "interruption",
      confidence: 0.8,
      rationale: "Client was cut off mid-sentence.",
    };
    const adapter = new FakeAdapter([flag]);
    const turns = splitTurns("Therapist: Go on.\nClient: I was saying that I");
    const categories = [{ id: "interruption", description: "Speaker is cut off." }];

    const result = await adapter.detect({ turns, categories });

    expect(adapter.detector).toBe("fake");
    expect(result).toEqual([flag]);
    expect(adapter.requests).toHaveLength(1);
    expect(adapter.requests[0].turns).toEqual(turns);
  });

  // Fake test
  it("accepts a flag on a made-up transcript", async () => {
    const transcript = [
      "Therapist: How was your week?",
      "Client: It was fine, I guess.",
      "Therapist: Let's talk about your job, not your accent.",
    ].join("\n");
    const turns = splitTurns(transcript);
    const flag: RawFlag = {
      turnIndex: 2,
      start: 27,
      end: 42,
      category: "cultural-bias",
      confidence: 0.7,
      rationale: "Therapist mentions the client's accent (made-up example).",
    };
    const adapter = new FakeAdapter([flag]);
    const result = await adapter.detect({
      turns,
      categories: [{ id: "cultural-bias", description: "Comments on a client's background." }],
    });

    expect(turns).toHaveLength(3);
    expect(turns[2].speaker).toBe("Therapist");
    expect(turns[2].text.slice(flag.start, flag.end)).toBe("not your accent");
    expect(result).toEqual([flag]);
  });

});
