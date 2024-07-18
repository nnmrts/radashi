import { matrix, matrixGet, matrixSet } from 'radashi'

/**
 * Calculate the similarity between two strings using the Levenshtein
 * distance algorithm.
 *
 * One thing to note is that the argument order is unimportant. The
 * algorithm will always return the same result regardless of the
 * order of the arguments.
 *
 * Adapted from
 * [@fabiospampinato/tiny-levenshtein](https://github.com/fabiospampinato/tiny-levenshtein)
 * with ❤️.
 *
 * @see https://radashi-org.github.io/reference/string/similarity
 * @example
 * ```ts
 * similarity('abc', 'abc') // 0
 * similarity('a', 'b') // 1
 * similarity('ab', 'ac') // 1
 * similarity('ac', 'bc') // 1
 * similarity('abc', 'axc') // 1
 * similarity('kitten', 'sitting') // 3
 * ```
 */
export function similarity(str1: string, str2: string): number {
  // Early return if strings are identical
  if (str1 === str2) {
    return 0
  }

  // Find common prefix and suffix
  let start = 0
  let end1 = str1.length - 1
  let end2 = str2.length - 1

  while (start <= end1 && start <= end2 && str1[start] === str2[start]) {
    start++
  }

  while (end1 >= start && end2 >= start && str1[end1] === str2[end2]) {
    end1--
    end2--
  }

  // Calculate lengths of trimmed strings
  const length1 = end1 - start + 1
  const length2 = end2 - start + 1

  // Handle cases where one string is a substring of the other
  if (length1 === 0) {
    return length2
  }
  if (length2 === 0) {
    return length1
  }

  const table = matrix(length1 + 1, length2 + 1, (row, column) =>
    row === 0 ? column : column === 0 ? row : 0,
  )

  for (let i = 1; i <= length1; i++) {
    for (let j = 1; j <= length2; j++) {
      matrixSet(
        table,
        i,
        j,
        Math.min(
          // Cost of a deletion.
          matrixGet(table, i - 1, j) + 1,
          // Cost of an insertion.
          matrixGet(table, i, j - 1) + 1,
          // Cost of a substitution.
          matrixGet(table, i - 1, j - 1) +
            (str1[start + i - 1] === str2[start + j - 1] ? 0 : 1),
        ),
      )
    }
  }

  // Return the Levenshtein distance
  return matrixGet(table, length1, length2)
}
