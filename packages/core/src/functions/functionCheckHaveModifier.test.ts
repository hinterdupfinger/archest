import { describe, expect, it } from 'vitest';
import { createSourceFile, getFunctions } from '../testUtils';
import { functionCheckHaveModifier } from './functionCheckHaveModifier';
import type { FunctionLocatorData } from './types';

describe('functionCheckHaveModifier', () => {
  it('should pass if function has modifier', () => {
    const sourceFile = createSourceFile(`export function myFunc() {}`);
    const data: FunctionLocatorData = {
      type: 'FunctionLocator',
      functions: getFunctions(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = functionCheckHaveModifier(data, 'export', false);
    expect(result.pass).toBe(true);
  });

  it('should fail if function lacks modifier', () => {
    const sourceFile = createSourceFile(`function myFunc() {}`);
    const data: FunctionLocatorData = {
      type: 'FunctionLocator',
      functions: getFunctions(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = functionCheckHaveModifier(data, 'export', false);
    expect(result.pass).toBe(false);
  });
});
