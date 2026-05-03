import { describe, expect, it } from 'vitest';
import { createSourceFile, getFunctions } from '../testUtils';
import { functionCheckHaveNameMatchingFileName } from './functionCheckHaveNameMatchingFileName';
import type { FunctionLocatorData } from './types';

describe('functionCheckHaveNameMatchingFileName', () => {
  it('should pass if function matches filename', () => {
    const sourceFile = createSourceFile(`function test() {}`, 'test.ts');
    const data: FunctionLocatorData = {
      type: 'FunctionLocator',
      functions: getFunctions(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = functionCheckHaveNameMatchingFileName(data, false);
    expect(result.pass).toBe(true);
  });

  it('should fail if function does not match filename', () => {
    const sourceFile = createSourceFile(`function test() {}`, 'other.ts');
    const data: FunctionLocatorData = {
      type: 'FunctionLocator',
      functions: getFunctions(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = functionCheckHaveNameMatchingFileName(data, false);
    expect(result.pass).toBe(false);
  });
});
