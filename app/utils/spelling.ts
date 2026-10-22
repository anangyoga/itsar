/**
 * Normalise a typed answer before comparing it: ignore case, surrounding
 * spaces, repeated spaces, and curly quotes. Everything else must match.
 */
export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”]/g, '"')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

/**
 * Levenshtein distance with adjacent transpositions counted as one edit
 * (optimal string alignment). Used to spot harmless typos.
 */
export function editDistance(a: string, b: string): number {
  const rows = a.length + 1
  const cols = b.length + 1
  const grid: number[][] = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => (row === 0 ? col : col === 0 ? row : 0)),
  )

  for (let row = 1; row < rows; row++) {
    for (let col = 1; col < cols; col++) {
      const cost = a[row - 1] === b[col - 1] ? 0 : 1
      grid[row]![col] = Math.min(
        grid[row - 1]![col]! + 1,
        grid[row]![col - 1]! + 1,
        grid[row - 1]![col - 1]! + cost,
      )

      const swapped = row > 1 && col > 1 && a[row - 1] === b[col - 2] && a[row - 2] === b[col - 1]
      if (swapped) {
        grid[row]![col] = Math.min(grid[row]![col]!, grid[row - 2]![col - 2]! + 1)
      }
    }
  }

  return grid[rows - 1]![cols - 1]!
}

/** True when the answer is exactly one typo away from the expected spelling. */
export function isNearMiss(value: string, expected: string): boolean {
  if (Math.abs(value.length - expected.length) > 1) return false
  return editDistance(value, expected) === 1
}
