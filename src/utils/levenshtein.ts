/**
 * Computes the Levenshtein distance between two strings.
 * The Levenshtein distance is the minimum number of single-character edits
 * (insertions, deletions, or substitutions) required to change one string into the other.
 *
 * @param {string} str1 - The first string to compare.
 * @param {string} str2 - The second string to compare.
 * @returns {number} The minimum number of edit operations required.
 *
 * Example:
 *   levenshtein('kitten', 'sitting') // returns 3
 */
function levenshtein(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length

  // Cost matrix of size (len1+1) x (len2+1)
  const distance: number[][] = Array.from({ length: len1 + 1 }, () => new Array(len2 + 1).fill(0))

  // Initialize first row and column: transforming to/from empty string
  for (let i = 0; i <= len1; i++) {
    distance[i][0] = i
  }
  for (let j = 0; j <= len2; j++) {
    distance[0][j] = j
  }

  // Compute distances for all subproblems
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      // If characters are the same, no substitution cost; else, cost is 1
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1
      distance[i][j] = Math.min(
        distance[i - 1][j] + 1, // Deletion
        distance[i][j - 1] + 1, // Insertion
        distance[i - 1][j - 1] + substitutionCost // Substitution
      )
    }
  }

  return distance[len1][len2]
}

export { levenshtein }
