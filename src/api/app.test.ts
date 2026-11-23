import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { createApp } from "./app";
import { FakeAdapter } from "../llm/fake-adapter";
import type { RawFlag } from "../llm/adapter";

// Made-up transcript. Turn 2 text is "Let's talk about your job, not your accent."
const transcript = [
  "Therapist: How was your week?",
  "Client: It was fine, I guess.",
  "Therapist: Let's talk about your job, not your accent.",
].join("\n");

const categories = [{ id: "cultural-bias", description: "Comments on a client's background." }];

const goodFlag: RawFlag = {
  turnIndex: 2,
  start: 27,
  end: 42,
  category: "cultural-bias",
  confidence: 0.9,
  rationale: "Therapist mentions the client's accent (made-up example).",
};

let server: Server;
let base: string;
let adapter: FakeAdapter;

// Starts a fresh app (with its own empty store) and closes any server started before it.
async function startServer(flags: RawFlag[]) {
  if (server) await new Promise<void>((resolve) => server.close(() => resolve()));
  adapter = new FakeAdapter(flags);
  const app = createApp({ adapter, categories });
  await new Promise<void>((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      const { port } = server.address() as AddressInfo;
      base = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
}

async function post(path: string, body: unknown) {
  const res = await fetch(base + path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

async function get(path: string) {
  const res = await fetch(base + path);
  return { status: res.status, body: await res.json() };
}

async function upload(text: string) {
  const res = await post("/transcripts", { text });
  return res.body.id as string;
}

afterAll(() => new Promise<void>((resolve) => server?.close(() => resolve())));

describe("POST /transcripts", () => {
  beforeAll(() => startServer([goodFlag]));


  it("stores a transcript and returns its id and turn count", async () => {
    const res = await post("/transcripts", { text: transcript });
    expect(res.status).toBe(201);
    expect(res.body.turnCount).toBe(3);
    expect(typeof res.body.id).toBe("string");
  });

  it("rejects a body without text", async () => {
    const res = await post("/transcripts", { notText: "x" });
    expect(res.status).toBe(400);
  });

  it("rejects a malformed transcript line and reports its line number", async () => {
    const res = await post("/transcripts", { text: "Therapist: Hi.\nno speaker here" });
    expect(res.status).toBe(400);
    expect(res.body.line).toBe(2);
  });
});

describe("POST /transcripts/:id/detect and GET /transcripts/:id/flags", () => {
  beforeAll(() => startServer([goodFlag]));

  it("runs detection, returns validated flags, and stores them for later reads", async () => {
    const id = await upload(transcript);

    const detect = await post(`/transcripts/${id}/detect`, {});
    expect(detect.status).toBe(200);
    expect(detect.body.flags).toHaveLength(1);
    expect(detect.body.flags[0].text).toBe("not your accent");
    expect(detect.body.flags[0].detector).toBe("fake");

    const read = await get(`/transcripts/${id}/flags`);
    expect(read.status).toBe(200);
    expect(read.body.flags).toEqual(detect.body.flags);
  });

  it("returns 404 for an unknown transcript", async () => {
    expect((await post("/transcripts/no-such-id/detect", {})).status).toBe(404);
    expect((await get("/transcripts/no-such-id/flags")).status).toBe(404);
  });

  it("returns 502 and the problems when the adapter output is invalid", async () => {
    await startServer([{ ...goodFlag, category: "made-up" }]);
    const id = await upload(transcript);

    const res = await post(`/transcripts/${id}/detect`, {});
    expect(res.status).toBe(502);
    expect(res.body.problems[0]).toContain("not in the category list");
  });

  it("sends the transcript turns and category list to the adapter", async () => {
    await startServer([]);
    const id = await upload(transcript);
    await post(`/transcripts/${id}/detect`, {});
    expect(adapter.requests).toHaveLength(1);
    expect(adapter.requests[0].turns).toHaveLength(3);
    expect(adapter.requests[0].categories).toEqual(categories);
  });
});
