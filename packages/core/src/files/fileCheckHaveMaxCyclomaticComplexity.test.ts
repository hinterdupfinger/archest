import { describe, expect, it } from 'vitest';
import { fileCheckHaveMaxCyclomaticComplexity } from './fileCheckHaveMaxCyclomaticComplexity';

describe('fileCheckHaveMaxCyclomaticComplexity', () => {
  it('should exist and be callable', () => {
    expect(typeof fileCheckHaveMaxCyclomaticComplexity).toBe('function');
  });
});
