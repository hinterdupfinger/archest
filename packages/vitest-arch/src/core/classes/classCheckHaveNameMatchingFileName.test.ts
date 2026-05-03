import { describe, expect, it } from 'vitest';
import { createSourceFile, getClasses } from '../testUtils';
import { classCheckHaveNameMatchingFileName } from './classCheckHaveNameMatchingFileName';
import type { ClassLocatorData } from './types';

describe('classCheckHaveNameMatchingFileName', () => {
  it('should pass if class matches filename', () => {
    const sourceFile = createSourceFile(`class Test {}`, 'Test.ts');
    const data: ClassLocatorData = {
      type: 'ClassLocator',
      classes: getClasses(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = classCheckHaveNameMatchingFileName(data, false);
    expect(result.pass).toBe(true);
  });

  it('should fail if class does not match filename', () => {
    const sourceFile = createSourceFile(`class Test {}`, 'Other.ts');
    const data: ClassLocatorData = {
      type: 'ClassLocator',
      classes: getClasses(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = classCheckHaveNameMatchingFileName(data, false);
    expect(result.pass).toBe(false);
  });
});
