/**
 * extracts the first number from a string, including numbers with decimals, while ignoring $ and other non-numeric characters
 *
 * Regex Pattern (-?\d*\.?\d+):
 *
 * -?: Matches an optional negative sign.
 * \d*: Matches any number of digits before a decimal point.
 * \.?: Matches an optional decimal point.
 * \d+: Matches one or more digits after the decimal point.
 */
export function getNumberWithinString(text: string | null | undefined): number | undefined {
  const match = text?.match(/-?\d*\.?\d+/u);
  return match ? Number(match[0]) : undefined;
}
