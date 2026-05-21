import { describe, expect, it } from 'vitest';
import { createSourceFile, getFunctions } from '../testUtils';
import { functionCheckHaveExplicitReturnType } from './functionCheckHaveExplicitReturnType';
import type { FunctionLocatorData } from './types';

describe('functionCheckHaveExplicitReturnType', () => {
  it('should pass if function has explicit return type', () => {
    const sourceFile = createSourceFile(`function myFunc(): void {}`);
    const data: FunctionLocatorData = {
      type: 'FunctionLocator',
      functions: getFunctions(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = functionCheckHaveExplicitReturnType(data, false);
    expect(result.pass).toBe(true);
  });

  it('should fail if function lacks explicit return type', () => {
    const sourceFile = createSourceFile(`function myFunc() {}`);
    const data: FunctionLocatorData = {
      type: 'FunctionLocator',
      functions: getFunctions(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = functionCheckHaveExplicitReturnType(data, false);
    expect(result.pass).toBe(false);
  });
});
