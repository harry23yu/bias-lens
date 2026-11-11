export interface Turn { speaker: string; text: string }

export function splitTurns(transcript: string): Turn[] {
  return transcript
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf(":");
      if (i < 1) throw new Error(`Malformed line: ${line}`);
      return { speaker: line.slice(0, i).trim(), text: line.slice(i + 1).trim() };
    });
}
