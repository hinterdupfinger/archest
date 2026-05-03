import { describe, expect, it } from 'vitest';
import { createSourceFile, getFunctions } from '../testUtils';
import { functionCheckMatchNamePattern } from './functionCheckMatchNamePattern';
import type { FunctionLocatorData } from './types';

describe('functionCheckMatchNamePattern', () => {
  it('should pass if function matches pattern', () => {
    const sourceFile = createSourceFile(`function testFunc() {}`);
    const data: FunctionLocatorData = {
      type: 'FunctionLocator',
      functions: getFunctions(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = functionCheckMatchNamePattern(data, /^test/, false);
    expect(result.pass).toBe(true);
  });

  it('should fail if function does not match pattern', () => {
    const sourceFile = createSourceFile(`function myFunc() {}`);
    const data: FunctionLocatorData = {
      type: 'FunctionLocator',
      functions: getFunctions(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = functionCheckMatchNamePattern(data, /^test/, false);
    expect(result.pass).toBe(false);
  });
});
