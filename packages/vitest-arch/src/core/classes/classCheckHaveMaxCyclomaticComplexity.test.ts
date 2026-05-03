import { describe, expect, it } from 'vitest';
import { classCheckHaveMaxCyclomaticComplexity } from './classCheckHaveMaxCyclomaticComplexity';

describe('classCheckHaveMaxCyclomaticComplexity', () => {
  it('should exist and be callable', () => {
    expect(typeof classCheckHaveMaxCyclomaticComplexity).toBe('function');
  });
});
