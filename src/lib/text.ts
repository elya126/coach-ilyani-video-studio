/**
 * Highlight syntax used in all content files:
 *   "Drink **water** before meals"  →  "water" appears in gold.
 */
export type TextPart = { text: string; highlight: boolean };

export const parseHighlights = (input: string): TextPart[] => {
  const parts: TextPart[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    if (match.index > last) parts.push({ text: input.slice(last, match.index), highlight: false });
    parts.push({ text: match[1], highlight: true });
    last = match.index + match[0].length;
  }
  if (last < input.length) parts.push({ text: input.slice(last), highlight: false });
  return parts;
};

/**
 * Splits text into words while remembering which pieces are highlighted.
 * A word can mix styles, e.g. "**intention**." → gold "intention" + plain ".".
 */
export type Word = { parts: TextPart[]; highlight: boolean };

export const toWords = (input: string): Word[] => {
  const words: Word[] = [];
  let current: TextPart[] = [];
  const flush = () => {
    if (current.length) words.push({ parts: current, highlight: current.some((p) => p.highlight) });
    current = [];
  };
  for (const part of parseHighlights(input)) {
    for (const token of part.text.split(/(\s+)/)) {
      if (!token) continue;
      if (/^\s+$/.test(token)) flush();
      else current.push({ text: token, highlight: part.highlight });
    }
  }
  flush();
  return words;
};

/** Removes the ** markers (useful for plain-text output). */
export const stripHighlights = (input: string): string => input.replace(/\*\*/g, "");
