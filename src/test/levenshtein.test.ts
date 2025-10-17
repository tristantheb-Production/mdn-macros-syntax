import { expect } from 'chai';
import { levenshtein } from '../utils/levenshtein';

describe('levenshtein', () => {
  it('returns 0 for two empty strings', () => {
    expect(levenshtein('', '')).to.equal(0);
  });

  it('handles empty vs non-empty', () => {
    expect(levenshtein('a', '')).to.equal(1);
    expect(levenshtein('', 'abc')).to.equal(3);
  });

  it('computes known distance for kitten/sitting', () => {
    expect(levenshtein('kitten', 'sitting')).to.equal(3);
  });

  it('returns 0 for identical strings', () => {
    expect(levenshtein('same', 'same')).to.equal(0);
  });
});
