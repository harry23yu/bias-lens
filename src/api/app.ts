// Express 5 app: upload a transcript, run detection, read the stored flags.
// Not yet authenticated (FR-9, Clerk). Do not expose this app outside a local machine.

import express from "express";
import type { CategoryDefinition, LlmAdapter } from "../llm/adapter";
import { splitTurns, TranscriptFormatError } from "../turns";
import { validateFlags, FlagValidationError } from "../flags/validate";
import { MemoryStore } from "./store";

export interface AppOptions {
  adapter: LlmAdapter;
  categories: CategoryDefinition[];
  store?: MemoryStore;
}

export function createApp({ adapter, categories, store = new MemoryStore() }: AppOptions) {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  // Upload: body { "text": "Speaker: text\n..." }. Returns the id and turn count.
  app.post("/transcripts", (req, res) => {
    const text: unknown = req.body?.text;
    if (typeof text !== "string" || text.trim() === "") {
      res.status(400).json({ error: 'Body must be JSON with a non-empty "text" string' });
      return;
    }
    try {
      const turns = splitTurns(text);
      const record = store.addTranscript(text, turns);
      res.status(201).json({ id: record.id, turnCount: turns.length });
    } catch (err) {
      if (err instanceof TranscriptFormatError) {
        res.status(400).json({ error: err.message, line: err.line });
        return;
      }
      throw err;
    }
  });

  // Detect: run the adapter on a stored transcript, validate its output, and store the flags.
  app.post("/transcripts/:id/detect", async (req, res) => {
    const record = store.getTranscript(req.params.id);
    if (!record) {
      res.status(404).json({ error: "Transcript not found" });
      return;
    }
    const raw = await adapter.detect({ turns: record.turns, categories });
    try {
      const flags = validateFlags(raw, record.turns, categories, adapter.detector);
      store.setFlags(record.id, flags);
      res.json({ flags });
    } catch (err) {
      if (err instanceof FlagValidationError) {
        res.status(502).json({ error: "Model output failed validation", problems: err.problems });
        return;
      }
      throw err;
    }
  });

  // Read: the flags stored by the last detect run.
  app.get("/transcripts/:id/flags", (req, res) => {
    const record = store.getTranscript(req.params.id);
    if (!record) {
      res.status(404).json({ error: "Transcript not found" });
      return;
    }
    res.json({ flags: record.flags });
  });

  // Last-resort handler: keep 4xx messages from Express, hide internal details from 5xx.
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = (err as { status?: number }).status;
    if (status && status >= 400 && status < 500) {
      res.status(status).json({ error: (err as Error).message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
