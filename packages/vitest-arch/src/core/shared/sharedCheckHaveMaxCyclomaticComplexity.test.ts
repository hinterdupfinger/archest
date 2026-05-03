import { describe, expect, it } from 'vitest';
import { sharedCheckHaveMaxCyclomaticComplexity } from './sharedCheckHaveMaxCyclomaticComplexity';

describe('sharedCheckHaveMaxCyclomaticComplexity', () => {
  it('should pass if complexity is within limits', () => {
    const items = [{ name: 'A', complexity: 5 }];
    const result = sharedCheckHaveMaxCyclomaticComplexity(
      items,
      (i) => i.name,
      (i) => i.complexity,
      'Item',
      10,
      false,
    );
    expect(result.pass).toBe(true);
  });

  it('should fail if complexity exceeds limits', () => {
    const items = [{ name: 'A', complexity: 15 }];
    const result = sharedCheckHaveMaxCyclomaticComplexity(
      items,
      (i) => i.name,
      (i) => i.complexity,
      'Item',
      10,
      false,
    );
    expect(result.pass).toBe(false);
  });
});
