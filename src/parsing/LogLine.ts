/**
 * A just-in-time parsed line from the Fellowship combat log.
 *
 * The object is constructed from the original combat log line and will
 * parse log line arguments incrementally as they are requested.
 *
 * Fellowship format: ISO timestamp | pipe-delimited fields
 * Example: 2025-10-10T10:28:56.455-07:00|ZONE_CHANGE|"The Stronghold"|17|1|
 */
export default class LogLine {
  // Current parsing position in the original line
  private _linePosition = 0;

  // Length of the original line to avoid reevaluating it many times
  private _lineLength = 0;

  // Array of parsed arguments
  private _args: unknown[] = [];

  // Length of this._args to avoid evaluating this._args.length many times
  private _argsListLen = 0;

  // Timestamp in ISO 8601 format from the log
  // Example: '2025-10-10T10:28:56.455-07:00'
  public timestamp: string = "";

  constructor(public original: string) {
    this._lineLength = this.original.length;

    // Fellowship log format: <ISO timestamp>|<event>|...
    const firstPipeIndex = this.original.indexOf("|");
    if (firstPipeIndex === -1) {
      throw new Error(
        `Invalid Fellowship log line format. Missing pipe delimiter. Error at line: ${this.original}`,
      );
    }

    this.timestamp = this.original.substring(0, firstPipeIndex);
    this._linePosition = firstPipeIndex + 1;

    // Parse the first argument (event type) which is always needed
    this.parseLogArg(1);
  }

  arg(index: number): unknown {
    if (index >= this._argsListLen) {
      const maxsplit = index + 1;
      this.parseLogArg(maxsplit);
    }

    return this._args[index];
  }

  /**
   * Parse the timestamp from a log line and create a Date object from it.
   * Fellowship uses ISO 8601 format which Date constructor handles natively.
   */
  date(): Date {
    return new Date(this.timestamp);
  }

  /**
   * Returns the combat log event type of the log line
   * E.g. `ZONE_CHANGE`, `ABILITY_DAMAGE`.
   */
  type(): string {
    return this.arg(0) as string;
  }

  /**
   * Parses Fellowship combat log arguments based on pipe delimiter,
   * handling quoted strings and nested structures like [(1,2),(3,4)].
   *
   * @param maxSplits Maximum number of elements to parse
   */
  private parseLogArg(maxSplits?: number): void {
    let value = "";
    let inQuotedString = false;
    let bracketDepth = 0;
    let parenDepth = 0;

    for (
      this._linePosition;
      this._linePosition < this._lineLength;
      this._linePosition++
    ) {
      const char = this.original.charAt(this._linePosition);

      if (char === "\n") {
        break;
      }

      if (maxSplits && this._argsListLen >= maxSplits) {
        break;
      }

      if (char === '"') {
        inQuotedString = !inQuotedString;
        value += char;
        continue;
      }

      if (!inQuotedString) {
        if (char === "|" && bracketDepth === 0 && parenDepth === 0) {
          this.addArg(this.parseValue(value));
          value = "";
          continue;
        }

        if (char === "[") bracketDepth++;
        else if (char === "]") bracketDepth--;
        else if (char === "(") parenDepth++;
        else if (char === ")") parenDepth--;
      }

      value += char;
    }

    if (value.length > 0) {
      this.addArg(this.parseValue(value));
    }
    if (bracketDepth !== 0 || parenDepth !== 0) {
      throw new Error(
        `Mismatched brackets/parentheses in log line. ` +
          `Bracket depth: ${bracketDepth}, Paren depth: ${parenDepth}`,
      );
    }
  }

  /**
   * Parse a single value, handling different Fellowship data types:
   * - Quoted strings: "Noot" -> Noot
   * - Numbers: 123.45 -> 123.45
   * - Arrays: [1,2,3] -> [1, 2, 3]
   * - Nested tuples: [(1,2),(3,4)] -> [[1, 2], [3, 4]]
   * - Empty arrays: [] -> []
   */
  private parseValue(value: string): unknown {
    value = value.trim();

    if (value.length === 0) {
      return "";
    }
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.substring(1, value.length - 1);
    }

    if (value.startsWith("[") && value.endsWith("]")) {
      const content = value.substring(1, value.length - 1).trim();

      if (content.length === 0) {
        return [];
      }

      if (content.includes("(") && content.includes(")")) {
        return this.parseNestedTuples(content);
      }
      return this.parseSimpleArray(content);
    }

    const num = Number(value);
    if (!isNaN(num) && value !== "") {
      return num;
    }
    return value;
  }

  /**
   * Parse nested tuples like: (1,2.0,3),(4,5.0,6)
   * Returns: [[1, 2.0, 3], [4, 5.0, 6]]
   */
  private parseNestedTuples(content: string): unknown[][] {
    const tuples: unknown[][] = [];
    let currentTuple = "";
    let depth = 0;

    for (let i = 0; i < content.length; i++) {
      const char = content.charAt(i);

      if (char === "(") {
        depth++;
        if (depth === 1) continue;
      } else if (char === ")") {
        depth--;
        if (depth === 0) {
          tuples.push(this.parseTupleValues(currentTuple));
          currentTuple = "";
          continue;
        }
      } else if (char === "," && depth === 0) {
        continue;
      }

      if (depth > 0) {
        currentTuple += char;
      }
    }

    return tuples;
  }

  /**
   * Parse comma-separated values within a tuple or simple array
   * Examples: "1,2,3" -> [1, 2, 3]
   */
  private parseTupleValues(tupleStr: string): unknown[] {
    return tupleStr.split(",").map((s) => {
      const trimmed = s.trim();

      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.substring(1, trimmed.length - 1);
      }
      const num = Number(trimmed);
      return isNaN(num) ? trimmed : num;
    });
  }

  /**
   * Parse a simple comma-separated array
   * Example: "1,2,3" or "a,b,c"
   */
  private parseSimpleArray(content: string): unknown[] {
    return content.split(",").map((s) => {
      const trimmed = s.trim();

      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.substring(1, trimmed.length - 1);
      }
      const num = Number(trimmed);
      return isNaN(num) ? trimmed : num;
    });
  }

  /**
   * Add an argument to the list
   */
  private addArg(value: unknown): void {
    this._args.push(value);
    this._argsListLen = this._args.length;
  }

  toString(): string {
    return this.original;
  }
}
