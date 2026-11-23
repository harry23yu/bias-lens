// In-memory store for transcripts and their flags. Lost on restart.
// Replace with a Drizzle/PostgreSQL implementation once the schema conventions land (Sprint 2).

import { randomUUID } from "node:crypto";
import type { Turn } from "../turns";
import type { Flag } from "../flags/validate";

export interface TranscriptRecord {
  id: string;
  text: string;
  turns: Turn[];
  flags: Flag[];
}

export class MemoryStore {
  private readonly transcripts = new Map<string, TranscriptRecord>();

  addTranscript(text: string, turns: Turn[]): TranscriptRecord {
    const record: TranscriptRecord = { id: randomUUID(), text, turns, flags: [] };
    this.transcripts.set(record.id, record);
    return record;
  }

  getTranscript(id: string): TranscriptRecord | undefined {
    return this.transcripts.get(id);
  }

  setFlags(id: string, flags: Flag[]): void {
    const record = this.transcripts.get(id);
    if (!record) throw new Error(`No transcript with id ${id}`);
    record.flags = flags;
  }
}
