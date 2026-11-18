// Splits a plain-text transcript into speaker turns (FR-1).
// Format: one turn per line, "Speaker: text". Blank lines are ignored.
// Only the first colon separates the speaker from the text, so the text may contain colons.

export interface Turn {
  /** 0-based position of the turn among the non-blank lines. Flag spans refer to this. */
  index: number;
  speaker: string;
  text: string;
}

export class TranscriptFormatError extends Error {
  constructor(
    readonly line: number,
    readonly content: string,
  ) {
    super(
      `Malformed transcript line ${line}: expected "Speaker: text", got ${JSON.stringify(content)}`,
    );
    this.name = "TranscriptFormatError";
  }
}

export function splitTurns(transcript: string): Turn[] {
  const turns: Turn[] = [];
  const lines = transcript.split(/\r?\n/);

  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;

    const colon = line.indexOf(":");
    const speaker = colon < 0 ? "" : line.slice(0, colon).trim();
    if (!speaker) throw new TranscriptFormatError(i + 1, line);

    turns.push({
      index: turns.length,
      speaker,
      text: line.slice(colon + 1).trim(),
    });
  });

  return turns;
}
