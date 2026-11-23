// Validates raw adapter output before it is stored or shown (FR-5, FR-6).
// Every flag must point at real text in the transcript and use a known category.

import type { CategoryDefinition, RawFlag } from "../llm/adapter";
import type { Turn } from "../turns";

/** A flag that has passed validation. `text` is copied from the transcript, not from the model. */
export interface Flag {
  turnIndex: number;
  start: number;
  end: number;
  text: string;
  category: string;
  confidence: number;
  rationale: string;
  detector: string;
}

export class FlagValidationError extends Error {
  constructor(readonly problems: string[]) {
    super(`Invalid flags: ${problems.join("; ")}`);
    this.name = "FlagValidationError";
  }
}

/**
 * Checks every raw flag. Returns validated flags, or throws FlagValidationError
 * listing every problem found (not just the first), so a bad model response can be diagnosed.
 */
export function validateFlags(
  raw: unknown,
  turns: Turn[],
  categories: CategoryDefinition[],
  detector: string,
): Flag[] {
  if (!Array.isArray(raw)) {
    throw new FlagValidationError(["flags must be an array"]);
  }

  const categoryIds = new Set(categories.map((c) => c.id));
  const problems: string[] = [];
  const flags: Flag[] = [];

  raw.forEach((item, n) => {
    const where = `flag ${n}`;
    if (typeof item !== "object" || item === null) {
      problems.push(`${where}: not an object`);
      return;
    }
    const f = item as Partial<RawFlag>;
    const before = problems.length;

    const turn = Number.isInteger(f.turnIndex) ? turns[f.turnIndex as number] : undefined;
    if (!turn) {
      problems.push(`${where}: turnIndex ${String(f.turnIndex)} is not a turn in the transcript`);
    } else {
      if (!Number.isInteger(f.start) || !Number.isInteger(f.end)) {
        problems.push(`${where}: start and end must be integers`);
      } else if (f.start! < 0 || f.end! > turn.text.length || f.start! >= f.end!) {
        problems.push(
          `${where}: span ${f.start}-${f.end} is outside turn ${f.turnIndex} (length ${turn.text.length}) or empty`,
        );
      }
    }

    if (typeof f.category !== "string" || !categoryIds.has(f.category)) {
      problems.push(`${where}: category ${JSON.stringify(f.category)} is not in the category list`);
    }
    if (typeof f.confidence !== "number" || !Number.isFinite(f.confidence) || f.confidence < 0 || f.confidence > 1) {
      problems.push(`${where}: confidence must be a number from 0 to 1`);
    }
    if (typeof f.rationale !== "string" || f.rationale.trim() === "") {
      problems.push(`${where}: rationale is empty`);
    }

    if (problems.length === before && turn) {
      flags.push({
        turnIndex: f.turnIndex as number,
        start: f.start as number,
        end: f.end as number,
        // Text comes from the transcript itself, so the stored quote cannot differ from the source.
        text: turn.text.slice(f.start as number, f.end as number),
        category: f.category as string,
        confidence: f.confidence as number,
        rationale: f.rationale as string,
        detector,
      });
    }
  });

  if (problems.length > 0) throw new FlagValidationError(problems);
  return flags;
}
