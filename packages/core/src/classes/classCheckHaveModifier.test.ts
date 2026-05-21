import { describe, expect, it } from 'vitest';
import { createSourceFile, getClasses } from '../testUtils';
import { classCheckHaveModifier } from './classCheckHaveModifier';
import type { ClassLocatorData } from './types';

describe('classCheckHaveModifier', () => {
  it('should pass if class has modifier', () => {
    const sourceFile = createSourceFile(`export class Test {}`);
    const data: ClassLocatorData = {
      type: 'ClassLocator',
      classes: getClasses(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = classCheckHaveModifier(data, 'export', false);
    expect(result.pass).toBe(true);
  });

  it('should fail if class does not have modifier', () => {
    const sourceFile = createSourceFile(`class Test {}`);
    const data: ClassLocatorData = {
      type: 'ClassLocator',
      classes: getClasses(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = classCheckHaveModifier(data, 'export', false);
    expect(result.pass).toBe(false);
  });
});
