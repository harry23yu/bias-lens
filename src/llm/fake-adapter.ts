// Synthetic adapter for tests and demos. It returns a fixed list of flags and
// never calls a model, so it is safe to use with any data.

import type { DetectionRequest, LlmAdapter, RawFlag } from "./adapter";

export class FakeAdapter implements LlmAdapter {
  readonly detector = "fake";
  requests: DetectionRequest[] = [];

  constructor(private readonly flags: RawFlag[]) {}

  async detect(request: DetectionRequest): Promise<RawFlag[]> {
    this.requests.push(request);
    return this.flags.map((f) => ({ ...f }));
  }
}
