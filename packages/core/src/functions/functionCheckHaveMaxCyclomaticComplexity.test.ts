import { describe, expect, it } from 'vitest';
import { functionCheckHaveMaxCyclomaticComplexity } from './functionCheckHaveMaxCyclomaticComplexity';

describe('functionCheckHaveMaxCyclomaticComplexity', () => {
  it('should exist and be callable', () => {
    expect(typeof functionCheckHaveMaxCyclomaticComplexity).toBe('function');
  });
});
