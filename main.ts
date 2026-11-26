// The Dog Reviews the Mailman — main.ts
// Writes one funny one-line review, in a dog's voice, of the mailman
// to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REVIEW =
  "I barked at him for three years straight and yesterday he slipped me a biscuit. I have decided to allow him to live.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = join(outDir, "entry.txt");

// Gate: exactly one non-blank line, 1-200 characters.
// Count Unicode code points (not UTF-16 units) so the gate matches
// the sealed scorer's character count even for non-ASCII text.
const line = REVIEW.trim();
const charCount = [...line].length;
if (charCount < 1 || charCount > 200) {
  throw new Error(`review must be 1-200 characters, got ${charCount}`);
}
if (/\r|\n/.test(line)) {
  throw new Error("review must be a single line");
}

// Only ever write the file; never remove the output folder itself.
mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, line, "utf8");

// Round-trip check: the file on disk must be byte-identical to the line.
const written = readFileSync(outFile, "utf8");
if (written !== line) {
  throw new Error("entry.txt does not match the review line");
}
console.log(`wrote ${charCount} chars to ${outFile}`);
