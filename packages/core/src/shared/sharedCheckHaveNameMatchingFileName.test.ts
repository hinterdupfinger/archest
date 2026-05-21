import { describe, expect, it } from 'vitest';
import { sharedCheckHaveNameMatchingFileName } from './sharedCheckHaveNameMatchingFileName';

describe('sharedCheckHaveNameMatchingFileName', () => {
  it('should skip nodes without source files', () => {
    // getFunctions actually provides a getSourceFile natively
    // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
    const items = [{ parent: undefined } as any];
    const result = sharedCheckHaveNameMatchingFileName(
      items,
      () => 'name',
      'Item',
      false,
    );
    expect(result.pass).toBe(true);
  });
});
